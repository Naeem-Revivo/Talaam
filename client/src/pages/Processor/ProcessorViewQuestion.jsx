import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import questionsAPI from "../../api/questions";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig.jsx";
import Loader from "../../components/common/Loader";
import Attachments from "../../components/Processor/Attachments";
import QuestionHistory from "../../components/Processor/QuestionHistory";
import ProcessorHeader from "../../components/Processor/ProcessorHeader";
import ParentQuestionReference from "../../components/Processor/ParentQuestionReference";
import QuestionInfoCard from "../../components/Processor/QuestionInfoCard";
import QuestionOptionsCard from "../../components/Processor/QuestionOptionsCard";
import FlagReasonSection from "../../components/Processor/FlagReasonSection";
import GathererFlagRejectionSection from "../../components/Processor/GathererFlagRejectionSection";
import ExplanationSection from "../../components/Processor/ExplanationSection";
import ClassificationCard from "../../components/Processor/ClassificationCard";
import CreatorGathererNotesCard from "../../components/Processor/CreatorGathererNotesCard";
import RejectModal from "../../components/Processor/modals/RejectModal";
import RejectFlagModal from "../../components/Processor/modals/RejectFlagModal";
import SelectCreatorModal from "../../components/Processor/modals/SelectCreatorModal";
import SelectExplainerModal from "../../components/Processor/modals/SelectExplainerModal";

const ProcessorViewQuestion = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId");
  const source = searchParams.get("source"); // Check if coming from creator submission or explainer submission

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [flagRejectionReason, setFlagRejectionReason] = useState("");
  const [showRejectFlagModal, setShowRejectFlagModal] = useState(false);

  // Modals for selecting creator/explainer
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showExplainerModal, setShowExplainerModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState("");
  const [selectedExplainer, setSelectedExplainer] = useState("");
  const [creators, setCreators] = useState([]);
  const [explainers, setExplainers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Parent question state for variants
  const [parentQuestion, setParentQuestion] = useState(null);
  const [loadingParent, setLoadingParent] = useState(false);

  // Check if question was updated after a flag (gatherer updated flagged question)
  // This can happen in two scenarios:
  // 1. Flag is still active (isFlagged === true && flagStatus === 'approved')
  // 2. Flag was cleared by gatherer update but flagType still exists (isFlagged === false but flagType exists)
  const hasGathererUpdate =
    question &&
    question.history &&
    Array.isArray(question.history) &&
    question.history.some(
      (h) =>
        (h.role === "gatherer" || h.role === "admin") &&
        (h.action === "updated" || h.action === "update")
    );

  const wasUpdatedAfterFlag =
    question &&
    hasGathererUpdate &&
    question.flagType &&
    ((question.isFlagged === true && question.flagStatus === "approved") ||
      (question.isFlagged === false &&
        (question.flagType === "creator" ||
          question.flagType === "student" ||
          question.flagType === "explainer")));

  // Determine if this is from creator submission
  // ONLY use source parameter - don't infer from question properties
  // This ensures correct behavior when opened from different pages
  const isFromCreatorSubmission = source === "creator-submission";

  // Determine if this is from explainer submission
  // ONLY use source parameter - don't infer from question properties
  const isFromExplainerSubmission = source === "explainer-submission";

  // Determine if this is from admin submission
  const isFromAdminSubmission = source === "admin-submission";

  // Determine if this is from all processed questions
  const isFromAllProcessedQuestions = source === "all-processed-questions";

  // Determine if this is from gatherer submission (default if no source specified)
  const isFromGathererSubmission = !source || source === "gatherer-submission";

  // Determine if question is flagged (pending review) - for any flag type
  // For admin submission, show all student-flagged questions regardless of flagStatus
  const isFlagged =
    question &&
    question.isFlagged === true &&
    (isFromAdminSubmission && question.flagType === "student"
      ? true // Show all student flags in admin submission
      : question.flagStatus === "pending" || !question.flagStatus);

  // Check if gatherer/admin rejected a flag (has flagRejectionReason AND was rejected by gatherer/admin)
  // This should only be true when a gatherer/admin rejected a flag, not when creator/explainer flags were rejected
  const gathererRejectedFlag =
    question &&
    question.flagRejectionReason &&
    question.flagRejectionReason.trim() !== "" &&
    question.status === "pending_processor" &&
    // Check history to ensure the rejection was done by gatherer/admin
    question.history &&
    Array.isArray(question.history) &&
    question.history.some(
      (h) =>
        h.action === "flag_rejected_by_gatherer" &&
        (h.role === "gatherer" || h.role === "admin")
    );

  // Determine flag type
  const flagType = question?.flagType || null;

  const getFormattedHistory = () => {
    if (!question || !question.history) return [];
    
    return question.history.map(item => ({
      ...item,
      performedBy: item.performedBy || item.createdBy,
      notes: item.notes || item.action || item.description,
      timestamp: item.timestamp || item.createdAt
    }));
  };

  // Check if processor has already made a decision (approved or rejected)
  // Hide buttons if status is not pending_processor (already processed)
  // OR if flagged and flagStatus is not 'pending' (flag already reviewed)
  // OR if from gatherer submission but question has already been approved (moved to next stage)
  // Show buttons if gatherer rejected a flag (has flagRejectionReason) - ALWAYS show buttons for gatherer rejections
  // Show buttons if gatherer updated after flag (wasUpdatedAfterFlag) - these need processor approval
  // For student flags from admin submission, show buttons even if flagStatus is 'approved' (processor can still review)
  const isStudentFlagFromAdmin =
    isFromAdminSubmission && flagType === "student" && question.isFlagged;
  const canProcessQuestion =
    question &&
    question.status === "pending_processor" &&
    (!isFlagged ||
      (isFlagged &&
        (question.flagStatus === "pending" ||
          (isStudentFlagFromAdmin && question.flagStatus !== "rejected"))) ||
      gathererRejectedFlag ||
      wasUpdatedAfterFlag) &&
    // If gatherer rejected flag or updated after flag, always show buttons (needs processor review)
    // Otherwise, if from gatherer submission, only show buttons if question hasn't been approved yet
    (gathererRejectedFlag ||
      wasUpdatedAfterFlag ||
      !isFromGathererSubmission ||
      !question.approvedBy);

  // Determine next destination based on flag type if updated after flag
  // OR based on source page and question state (which indicates the workflow stage)
  const getNextDestination = () => {
    if (question && wasUpdatedAfterFlag && question.flagType) {
      if (question.flagType === "creator" && question.isFlagged === true) {
        return "creator";
      } else if (
        question.flagType === "explainer" &&
        question.isFlagged === true
      ) {
        return "explainer";
      }
    }

    // Check if explainer has already submitted explanation
    const hasExplanation =
      question &&
      question.explanation &&
      typeof question.explanation === "string" &&
      question.explanation.trim() !== "";

    // If explainer has submitted explanation, next step is always completed
    // Check both pending_processor and pending_explainer status (in case status wasn't updated yet)
    if (
      hasExplanation &&
      (question.status === "pending_processor" ||
        question.status === "pending_explainer")
    ) {
      return "completed";
    }

    // CRITICAL: Check if question was actually submitted by creator (regardless of source page)
    // This ensures correct routing even if question appears in wrong submission page
    const isVariant =
      question?.isVariant === true || question?.isVariant === "true";
    const hasVariants =
      question?.variants &&
      Array.isArray(question.variants) &&
      question.variants.length > 0;
    const hasCreatorHistory =
      question?.history &&
      Array.isArray(question.history) &&
      question.history.some(
        (h) =>
          h.role === "creator" &&
          (h.action === "approved" || h.action === "variant_created")
      );
    const wasModifiedByCreator =
      question?.lastModifiedById &&
      question?.history &&
      Array.isArray(question.history) &&
      question.history.some(
        (h) => h.role === "creator" && h.action === "updated"
      );
    const isCreatorSubmitted =
      question?.status === "pending_processor" &&
      question?.approvedById &&
      wasModifiedByCreator;

    // If question was submitted by creator (variant, has variants, or creator modified), route to explainer
    if (
      isVariant ||
      hasVariants ||
      hasCreatorHistory ||
      wasModifiedByCreator ||
      isCreatorSubmitted
    ) {
      return "explainer";
    }

    // Use source to determine next destination (more reliable than inferring from question)
    if (isFromExplainerSubmission) {
      return "completed";
    } else if (isFromCreatorSubmission) {
      // From creator submission - check if explainer already submitted
      if (hasExplanation) {
        return "completed"; // Explainer already submitted, ready to complete
      }
      // From creator submission - next step is explainer (if explainer hasn't submitted yet)
      return "explainer";
    } else {
      // From gatherer submission (default) - next step is creator
      return "creator";
    }
  };

  const nextDestination = question ? getNextDestination() : "creator";

  // Helper function to get navigation path based on source
  const getNavigationPath = () => {
    if (isFromAllProcessedQuestions) {
      return "/processor/question-bank/all-processed-questions";
    } else if (isFromAdminSubmission) {
      return "/processor/question-bank/admin-submission";
    } else if (isFromExplainerSubmission) {
      return "/processor/question-bank/explainer-submission";
    } else if (isFromCreatorSubmission) {
      return "/processor/question-bank/creator-submission";
    } else {
      return "/processor/question-bank/gatherer-submission";
    }
  };

  // Fetch creators and explainers
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);

        // Fetch creators
        const creatorsResponse = await usersAPI.getAllUsers({
          adminRole: "creator",
          status: "active",
          limit: 100,
        });
        if (creatorsResponse.success && creatorsResponse.data?.admins) {
          setCreators(
            creatorsResponse.data.admins.map((admin) => ({
              id: admin.id,
              name: admin.username || admin.name || "Unknown",
            }))
          );
        }

        // Fetch explainers
        const explainersResponse = await usersAPI.getAllUsers({
          adminRole: "explainer",
          status: "active",
          limit: 100,
        });
        if (explainersResponse.success && explainersResponse.data?.admins) {
          setExplainers(
            explainersResponse.data.admins.map((admin) => ({
              id: admin.id,
              name: admin.username || admin.name || "Unknown",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) {
        showErrorToast("Question ID is missing");
        navigate(getNavigationPath());
        return;
      }

      try {
        setLoading(true);
        const response = await questionsAPI.getProcessorQuestionById(
          questionId
        );

        if (response.success && response.data?.question) {
          const fetchedQuestion = response.data.question;
          setQuestion(fetchedQuestion);

          // If this is a variant and viewing from creator/explainer submission, fetch parent question
          const isVariant =
            fetchedQuestion.isVariant === true ||
            fetchedQuestion.isVariant === "true";
          const originalQuestionId =
            fetchedQuestion.originalQuestionId ||
            fetchedQuestion.originalQuestion?.id ||
            fetchedQuestion.originalQuestion;

          // Check source from searchParams directly
          const currentSource = searchParams.get("source");
          const isFromCreator = currentSource === "creator-submission";
          const isFromExplainer = currentSource === "explainer-submission";

          if (
            isVariant &&
            originalQuestionId &&
            (isFromCreator || isFromExplainer)
          ) {
            try {
              setLoadingParent(true);
              const parentResponse =
                await questionsAPI.getProcessorQuestionById(originalQuestionId);
              if (parentResponse.success && parentResponse.data?.question) {
                setParentQuestion(parentResponse.data.question);
              }
            } catch (parentError) {
              console.error("Error fetching parent question:", parentError);
              // Don't show error toast for parent question fetch failure
            } finally {
              setLoadingParent(false);
            }
          }
        } else {
          showErrorToast("Failed to load question");
          navigate(getNavigationPath());
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        showErrorToast("Failed to load question");
        navigate(getNavigationPath());
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, navigate, searchParams]);

  const handleClose = () => {
    navigate(getNavigationPath());
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      showErrorToast("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      await questionsAPI.rejectQuestion(questionId, rejectionReason);
      showSuccessToast("Question rejected successfully");
      // Add a small delay to ensure backend has processed the update
      setTimeout(() => {
        navigate(getNavigationPath());
      }, 500);
    } catch (error) {
      console.error("Error rejecting question:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to reject question"
      );
    } finally {
      setProcessing(false);
      setShowRejectModal(false);
      setRejectionReason("");
    }
  };

  // Handle approve flag reason (send back to gatherer or creator based on flag type)
  const handleApproveFlagReason = async () => {
    try {
      setProcessing(true);

      // Use appropriate API based on flag type
      if (flagType === "student") {
        // For student flags, approve the flag
        // Backend will route to gatherer (original) or creator (variant)
        await questionsAPI.reviewStudentFlag(questionId, "approve");

        // Determine navigation based on whether it's a variant or original question
        const isVariant =
          question.isVariant === true ||
          question.isVariant === "true" ||
          question.originalQuestionId;
        if (isVariant) {
          showSuccessToast(
            "Student flag approved. Question sent to creator for correction."
          );
        } else {
          showSuccessToast(
            "Student flag approved. Question sent to gatherer for correction."
          );
        }

        setTimeout(() => {
          // Navigate based on source first, then variant status
          if (isFromAdminSubmission || isFromAllProcessedQuestions) {
            navigate(getNavigationPath());
          } else if (isVariant) {
            navigate("/processor/question-bank/creator-submission");
          } else {
            navigate("/processor/question-bank/gatherer-submission");
          }
        }, 500);
        return; // Early return to avoid the navigation logic below
      } else if (flagType === "explainer") {
        await questionsAPI.reviewExplainerFlag(questionId, "approve");
        showSuccessToast(
          "Flag reason approved. Question sent back for correction."
        );
      } else {
        // Default to creator flag review
        await questionsAPI.reviewCreatorFlag(questionId, "approve");
        showSuccessToast(
          "Flag reason approved. Question sent back for correction."
        );
      }

      setTimeout(() => {
        // Navigate based on flag type and source
        if (isFromAdminSubmission || isFromAllProcessedQuestions) {
          navigate(getNavigationPath());
        } else if (flagType === "explainer") {
          navigate("/processor/question-bank/explainer-submission");
        } else {
          navigate("/processor/question-bank/creator-submission");
        }
      }, 500);
    } catch (error) {
      console.error("Error approving flag reason:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to approve flag reason"
      );
    } finally {
      setProcessing(false);
    }
  };

  // Handle reject flag reason (send back to flagger)
  const handleRejectFlagReason = async () => {
    if (!flagRejectionReason.trim()) {
      showErrorToast("Please provide a reason for rejecting the flag");
      return;
    }

    try {
      setProcessing(true);

      // If gatherer rejected the flag, we're rejecting the gatherer's rejection (send back to gatherer)
      if (gathererRejectedFlag) {
        // Reject gatherer's rejection - send back to gatherer with the flag
        // This means processor disagrees with gatherer's rejection and wants to keep the flag
        await questionsAPI.rejectGathererFlagRejection(
          questionId,
          flagRejectionReason
        );
        showSuccessToast(
          "Gatherer's rejection rejected. Question sent back to gatherer."
        );
        setTimeout(() => {
          // If from all processed questions or admin submission, stay there; otherwise go to gatherer submission
          if (isFromAllProcessedQuestions || isFromAdminSubmission) {
            navigate(getNavigationPath());
          } else {
            navigate("/processor/question-bank/gatherer-submission");
          }
        }, 500);
      } else {
        // Use appropriate API based on flag type
        if (flagType === "student") {
          // For student flags, reject the flag (question marked as completed)
          await questionsAPI.reviewStudentFlag(
            questionId,
            "reject",
            flagRejectionReason
          );
          showSuccessToast(
            "Student flag rejected. Question marked as completed."
          );
          setTimeout(() => {
            // Navigate back to the source page
            if (isFromAllProcessedQuestions || isFromAdminSubmission) {
              navigate(getNavigationPath());
            } else {
              navigate("/processor/question-bank/admin-submission");
            }
          }, 500);
        } else if (flagType === "explainer") {
          await questionsAPI.reviewExplainerFlag(
            questionId,
            "reject",
            flagRejectionReason
          );
          showSuccessToast(
            "Flag reason rejected. Question sent back to explainer."
          );
          setTimeout(() => {
            if (isFromAllProcessedQuestions || isFromAdminSubmission) {
              navigate(getNavigationPath());
            } else {
              navigate("/processor/question-bank/explainer-submission");
            }
          }, 500);
        } else {
          // Default to creator flag review
          await questionsAPI.reviewCreatorFlag(
            questionId,
            "reject",
            flagRejectionReason
          );
          showSuccessToast(
            "Flag reason rejected. Question sent back to creator."
          );
          setTimeout(() => {
            if (isFromAllProcessedQuestions || isFromAdminSubmission) {
              navigate(getNavigationPath());
            } else {
              navigate("/processor/question-bank/creator-submission");
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error rejecting flag reason:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to reject flag reason"
      );
    } finally {
      setProcessing(false);
      setShowRejectFlagModal(false);
      setFlagRejectionReason("");
    }
  };

  // Handle accept gatherer's flag rejection (processor agrees with gatherer, clears flag)
  const handleAcceptGathererRejection = async () => {
    try {
      setProcessing(true);
      // Approve the question, which will clear the flagRejectionReason
      await questionsAPI.approveQuestion(questionId, { status: "approve" });
      showSuccessToast("Gatherer's rejection accepted. Question approved.");

      setTimeout(() => {
        // If from all processed questions or admin submission, stay there; otherwise go to gatherer submission
        if (isFromAllProcessedQuestions || isFromAdminSubmission) {
          navigate(getNavigationPath());
        } else {
          navigate("/processor/question-bank/gatherer-submission");
        }
      }, 500);
    } catch (error) {
      console.error("Error accepting gatherer's rejection:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to accept gatherer's rejection"
      );
    } finally {
      setProcessing(false);
    }
  };

  // Check if question already has assigned creator/explainer
  // Show modal only when:
  // 1. Accepting from gatherer (first time) - need to select creator (if not already assigned)
  // 2. Accepting from creator (first time sending to explainer) - need to select explainer (if not already assigned)
  // After that, the same users remain assigned

  // Check if question already has assigned users
  const hasAssignedCreator =
    question && (question.assignedCreatorId || question.assignedCreator?.id);
  const hasAssignedExplainer =
    question &&
    (question.assignedExplainerId || question.assignedExplainer?.id);

  // Check if this is a variant that came back from creator
  const isVariantFromCreator =
    question &&
    (question.isVariant === true ||
      question.isVariant === "true" ||
      (question.history &&
        Array.isArray(question.history) &&
        question.history.some(
          (h) =>
            h.role === "creator" &&
            (h.action === "approved" || h.action === "variant_created")
        )));

  // If coming from gatherer or admin submission and creator not assigned, need to select creator
  // If coming from creator and explainer not assigned, need to select explainer
  // Admin-created questions also need creator selection when first accepted by processor
  // Variants from creator should always go to explainer and need explainer selection if not assigned
  const needsCreatorSelection =
    (isFromGathererSubmission || isFromAdminSubmission) && !hasAssignedCreator;
  const needsExplainerSelection =
    (isFromCreatorSubmission || isVariantFromCreator) && !hasAssignedExplainer;

  const handleAccept = async (assignedUserId = null) => {
    try {
      setProcessing(true);

      // Prepare approve data
      const approveData = { status: "approve" };
      if (assignedUserId) {
        // If we have an assigned user, include it in the request
        // Note: Backend may need to be updated to handle this
        approveData.assignedUserId = assignedUserId;
      }

      await questionsAPI.approveQuestion(questionId, approveData);

      // Determine next destination based on flag type if updated after flag
      // OR based on whether explainer has already submitted
      const getNextDest = () => {
        if (question && wasUpdatedAfterFlag && question.flagType) {
          if (question.flagType === "creator") {
            return { type: "creator", message: "creator" };
          } else if (question.flagType === "explainer") {
            return { type: "explainer", message: "explainer" };
          }
        }

        // Check if explainer has already submitted explanation
        const hasExplanation =
          question &&
          question.explanation &&
          typeof question.explanation === "string" &&
          question.explanation.trim() !== "";

        // If explainer has submitted, next step is always completed
        if (hasExplanation && question.status === "pending_processor") {
          return { type: "explainer", message: "completed" };
        }

        // Default logic based on submission source
        if (isFromExplainerSubmission) {
          return { type: "explainer", message: "completed" };
        } else if (isFromCreatorSubmission) {
          // From creator submission - check if explainer already submitted
          if (hasExplanation) {
            return { type: "explainer", message: "completed" }; // Explainer already submitted, ready to complete
          }
          // From creator submission - next step is explainer (if explainer hasn't submitted yet)
          return { type: "creator", message: "explainer" };
        } else if (isFromAdminSubmission) {
          // Admin-created questions go to creator after processor accepts
          return { type: "creator", message: "creator" };
        } else {
          return { type: "gatherer", message: "creator" };
        }
      };

      const nextDest = getNextDest();

      // Show success message
      if (nextDest.message === "completed") {
        showSuccessToast("Question approved successfully");
      } else if (nextDest.message === "explainer") {
        showSuccessToast("Question approved and sent to explainer");
      } else {
        showSuccessToast("Question approved and sent to creator");
      }

      // Add a small delay to ensure backend has processed the update
      setTimeout(() => {
        // If from all processed questions or admin submission, stay there; otherwise navigate based on next destination
        if (isFromAllProcessedQuestions || isFromAdminSubmission) {
          navigate(getNavigationPath());
        } else if (nextDest.type === "explainer") {
          navigate("/processor/question-bank/explainer-submission");
        } else if (nextDest.type === "creator") {
          navigate("/processor/question-bank/creator-submission");
        } else {
          navigate("/processor/question-bank/gatherer-submission");
        }
      }, 500);
    } catch (error) {
      console.error("Error approving question:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to approve question"
      );
    } finally {
      setProcessing(false);
    }
  };

  // Handle accept button click - show modal if needed
  const handleAcceptClick = () => {
    // Determine next destination
    const getNextDest = () => {
      if (question && wasUpdatedAfterFlag && question.flagType) {
        if (question.flagType === "creator" && question.isFlagged === true) {
          return { type: "creator", message: "creator" };
        } else if (question.flagType === "explainer" && question.isFlagged === true) {
          return { type: "explainer", message: "explainer" };
        }
      }

      const hasExplanation =
        question &&
        question.explanation &&
        typeof question.explanation === "string" &&
        question.explanation.trim() !== "";

      if (hasExplanation && question.status === "pending_processor") {
        return { type: "explainer", message: "completed" };
      }

      // Check if this is a variant or was submitted by creator (regardless of source)
      const isVariant =
        question?.isVariant === true || question?.isVariant === "true";
      const hasVariants =
        question?.variants &&
        Array.isArray(question.variants) &&
        question.variants.length > 0;
      const hasCreatorHistory =
        question?.history &&
        Array.isArray(question.history) &&
        question.history.some(
          (h) =>
            h.role === "creator" &&
            (h.action === "approved" || h.action === "variant_created")
        );
      const wasModifiedByCreator =
        question?.lastModifiedById &&
        question?.history &&
        Array.isArray(question.history) &&
        question.history.some(
          (h) => h.role === "creator" && h.action === "updated"
        );
      const isCreatorSubmitted =
        question?.status === "pending_processor" &&
        question?.approvedById &&
        wasModifiedByCreator;

      // If question was submitted by creator (variant, has variants, or creator modified), route to explainer
      if (
        isVariant ||
        hasVariants ||
        hasCreatorHistory ||
        wasModifiedByCreator ||
        isCreatorSubmitted
      ) {
        return { type: "explainer", message: "explainer" };
      }

      if (isFromExplainerSubmission) {
        return { type: "explainer", message: "completed" };
      } else if (isFromCreatorSubmission) {
        if (hasExplanation) {
          return { type: "explainer", message: "completed" };
        }
        return { type: "creator", message: "explainer" };
      } else if (isFromAdminSubmission) {
        // Admin-created questions go to creator after processor accepts
        return { type: "creator", message: "creator" };
      } else {
        return { type: "gatherer", message: "creator" };
      }
    };

    const nextDest = getNextDest();

    // Check if this is a variant from creator that needs explainer assignment
    const isVariantNeedingExplainer =
      isVariantFromCreator && !hasAssignedExplainer;

    // Show creator modal if needed (first time accepting from gatherer)
    if (
      nextDest.message === "creator" &&
      needsCreatorSelection &&
      creators.length > 0
    ) {
      setShowCreatorModal(true);
      return;
    }

    // Show explainer modal if needed:
    // 1. Next destination is explainer AND needs explainer selection, OR
    // 2. It's a variant from creator that needs explainer assignment
    if (
      nextDest.message === "explainer" &&
      needsExplainerSelection &&
      !isFromExplainerSubmission
    ) {
      if (explainers.length > 0) {
        setShowExplainerModal(true);
        return;
      }
    }

    // Otherwise, proceed directly (question already has assigned users or going to completed)
    handleAccept();
  };

  // Handle creator selection
  const handleCreatorSelect = () => {
    if (!selectedCreator) {
      showErrorToast("Please select a creator");
      return;
    }
    setShowCreatorModal(false);
    handleAccept(selectedCreator);
    setSelectedCreator("");
  };

  // Handle explainer selection
  const handleExplainerSelect = () => {
    if (!selectedExplainer) {
      showErrorToast("Please select an explainer");
      return;
    }
    setShowExplainerModal(false);
    handleAccept(selectedExplainer);
    setSelectedExplainer("");
  };

  // Format date for history
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Strip HTML tags and return plain text
  const stripHtmlTags = (html) => {
    if (!html) return "—";
    // Create a temporary div element to parse HTML
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    // Get text content which automatically strips HTML tags
    return tmp.textContent || tmp.innerText || "—";
  };

  if (loading) {
    return (
      <Loader
        fullScreen={true}
        size="lg"
        color="oxford-blue"
        text={t("processor.viewQuestion.loading") || "Loading question..."}
        className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]"
      />
    );
  }

  if (!question) {
    return null;
  }

  return (
    <>
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <Loader
              size="lg"
              color="oxford-blue"
              text={t("processor.viewQuestion.processing") || "Processing..."}
              className="py-4"
            />
          </div>
        </div>
      )}
      <div
        className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]"
        dir={dir}
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
          {/* Header */}
          <ProcessorHeader
            t={t}
            handleClose={handleClose}
            processing={processing}
            canProcessQuestion={canProcessQuestion}
            isFlagged={isFlagged}
            gathererRejectedFlag={gathererRejectedFlag}
            nextDestination={nextDestination}
            setShowRejectModal={setShowRejectModal}
            setShowRejectFlagModal={setShowRejectFlagModal}
            handleApproveFlagReason={handleApproveFlagReason}
            handleAcceptGathererRejection={handleAcceptGathererRejection}
            handleAcceptClick={handleAcceptClick}
          />

          {/* Main Content - Two Columns */}
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Parent Question Reference - Show when viewing a variant from creator/explainer submission */}
              {question.isVariant &&
                (isFromCreatorSubmission || isFromExplainerSubmission) &&
                parentQuestion && (
                  <ParentQuestionReference
                    parentQuestion={parentQuestion}
                    t={t}
                    stripHtmlTags={stripHtmlTags}
                  />
                )}

              {/* Question Info Card */}
              <QuestionInfoCard
                question={question}
                t={t}
                stripHtmlTags={stripHtmlTags}
              />

              {/* Question Options Card */}
              <QuestionOptionsCard question={question} t={t} />

              {/* Original Flag Reason Section */}
              <FlagReasonSection
                question={question}
                isFlagged={isFlagged}
                gathererRejectedFlag={gathererRejectedFlag}
                isFromAdminSubmission={isFromAdminSubmission}
                flagType={flagType}
                t={t}
              />

              {/* Gatherer Flag Rejection Section */}
              <GathererFlagRejectionSection
                gathererRejectedFlag={gathererRejectedFlag}
                question={question}
                t={t}
              />

              {/* Explanation Section */}
              <ExplanationSection
                isFromExplainerSubmission={isFromExplainerSubmission}
                question={question}
                t={t}
              />

              {question.attachments && question.attachments.length > 0 && (
                <Attachments files={question.attachments} t={t} />
              )}
             {getFormattedHistory().length > 0 && (
                  <QuestionHistory historyItems={getFormattedHistory()} t={t} />
                )}
            </div>

            <div className="flex flex-col gap-4 lg:w-[376px]">
              {/* Classification Card */}
              <ClassificationCard
                question={question}
                wasUpdatedAfterFlag={wasUpdatedAfterFlag}
                isFlagged={isFlagged}
                flagType={flagType}
                isFromExplainerSubmission={isFromExplainerSubmission}
                isFromCreatorSubmission={isFromCreatorSubmission}
                t={t}
              />

              {/* Creator / Gatherer Notes Card */}
              <CreatorGathererNotesCard question={question} t={t} />
            </div>
          </div>
        </div>

        {/* Reject Modal */}
        <RejectModal
          isOpen={showRejectModal}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onClose={() => {
            setShowRejectModal(false);
            setRejectionReason("");
          }}
          onConfirm={handleReject}
          processing={processing}
          t={t}
        />

        {/* Reject Flag Reason Modal */}
        <RejectFlagModal
          isOpen={showRejectFlagModal}
          flagRejectionReason={flagRejectionReason}
          setFlagRejectionReason={setFlagRejectionReason}
          onClose={() => {
            setShowRejectFlagModal(false);
            setFlagRejectionReason("");
          }}
          onConfirm={handleRejectFlagReason}
          processing={processing}
          gathererRejectedFlag={gathererRejectedFlag}
          flagType={flagType}
          t={t}
        />

        {/* Select Creator Modal */}
        <SelectCreatorModal
          isOpen={showCreatorModal}
          selectedCreator={selectedCreator}
          setSelectedCreator={setSelectedCreator}
          creators={creators}
          loadingUsers={loadingUsers}
          onClose={() => {
            setShowCreatorModal(false);
            setSelectedCreator("");
          }}
          onConfirm={handleCreatorSelect}
          processing={processing}
          t={t}
        />

        {/* Select Explainer Modal */}
        <SelectExplainerModal
          isOpen={showExplainerModal}
          selectedExplainer={selectedExplainer}
          setSelectedExplainer={setSelectedExplainer}
          explainers={explainers}
          loadingUsers={loadingUsers}
          onClose={() => {
            setShowExplainerModal(false);
            setSelectedExplainer("");
          }}
          onConfirm={handleExplainerSelect}
          processing={processing}
          t={t}
        />
      </div>
    </>
  );
};

export default ProcessorViewQuestion;
