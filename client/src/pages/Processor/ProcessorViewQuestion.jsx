import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import ProfileDropdown from "../../components/common/ProfileDropdown";
import questionsAPI from "../../api/questions";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig.jsx";

const Attachments = ({ files, t }) => {
  return (
    <div className="bg-white border border-[#BCBCBD] rounded-lg p-5">
      <h3 className="text-blue-dark font-bold text-[20px] leading-[32px] font-archivo mb-5">
        {t("processor.viewQuestion.attachments")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#F6F7F8] border border-[#BCBCBD] rounded-lg font-normal text-[16px] leading-[100%] font-roboto text-blue-dark"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Question History Component
const QuestionHistory = ({ historyItems, t }) => {
  return (
    <div className="bg-white border border-[#BCBCBD] rounded-lg p-5">
      <h3 className="text-blue-dark font-bold text-[20px] leading-[32px] font-archivo mb-5">
        {t("processor.viewQuestion.questionHistory")}
      </h3>
      <div className="space-y-3">
        {historyItems.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <div>
              <p className="text-blue-dark text-[16px] leading-5 font-normal font-roboto">
                {item.text}
              </p>
              <p className="text-[#6B7280] text-[12px] leading-5 font-normal font-roboto mt-0.5">
                {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
  const wasUpdatedAfterFlag = question && 
                               question.isFlagged === true && 
                               question.flagStatus === 'approved' &&
                               question.history && 
                               Array.isArray(question.history) &&
                               question.history.some(h => h.role === 'gatherer' && h.action === 'updated');

  // Determine if this is from creator submission
  // ONLY use source parameter - don't infer from question properties
  // This ensures correct behavior when opened from different pages
  const isFromCreatorSubmission = source === "creator-submission";
  
  // Determine if this is from explainer submission
  // ONLY use source parameter - don't infer from question properties
  const isFromExplainerSubmission = source === "explainer-submission";
  
  // Determine if this is from gatherer submission (default if no source specified)
  const isFromGathererSubmission = !source || source === "gatherer-submission";

  // Determine if question is flagged (pending review) - for any flag type
  const isFlagged = question && 
                    question.isFlagged === true && 
                    (question.flagStatus === 'pending' || !question.flagStatus);
  
  // Check if gatherer rejected a flag (has flagRejectionReason AND was rejected by gatherer)
  // This should only be true when a gatherer rejected a flag, not when creator/explainer flags were rejected
  const gathererRejectedFlag = question && 
                               question.flagRejectionReason && 
                               question.flagRejectionReason.trim() !== '' &&
                               question.status === 'pending_processor' &&
                               // Check history to ensure the rejection was done by gatherer
                               question.history &&
                               Array.isArray(question.history) &&
                               question.history.some(h => 
                                 h.action === 'flag_rejected_by_gatherer' && 
                                 h.role === 'gatherer'
                               );
  
  // Determine flag type
  const flagType = question?.flagType || null;

  // Check if processor has already made a decision (approved or rejected)
  // Hide buttons if status is not pending_processor (already processed)
  // OR if flagged and flagStatus is not 'pending' (flag already reviewed)
  // OR if from gatherer submission but question has already been approved (moved to next stage)
  // Show buttons if gatherer rejected a flag (has flagRejectionReason) - ALWAYS show buttons for gatherer rejections
  const canProcessQuestion = question && 
                             question.status === 'pending_processor' &&
                             ((!isFlagged || (isFlagged && question.flagStatus === 'pending')) || gathererRejectedFlag) &&
                             // If gatherer rejected flag, always show buttons (needs processor review)
                             // Otherwise, if from gatherer submission, only show buttons if question hasn't been approved yet
                             (gathererRejectedFlag || !isFromGathererSubmission || !question.approvedBy);

  // Determine next destination based on flag type if updated after flag
  // OR based on source page and question state (which indicates the workflow stage)
  const getNextDestination = () => {
    if (question && wasUpdatedAfterFlag && question.flagType) {
      if (question.flagType === 'creator') {
        return 'creator';
      } else if (question.flagType === 'explainer') {
        return 'explainer';
      }
    }
    
    // Check if explainer has already submitted explanation
    const hasExplanation = question && 
                          question.explanation && 
                          typeof question.explanation === 'string' &&
                          question.explanation.trim() !== '';
    
    // If explainer has submitted explanation, next step is always completed
    // Check both pending_processor and pending_explainer status (in case status wasn't updated yet)
    if (hasExplanation && (question.status === 'pending_processor' || question.status === 'pending_explainer')) {
      return 'completed';
    }
    
    // Use source to determine next destination (more reliable than inferring from question)
    if (isFromExplainerSubmission) {
      return 'completed';
    } else if (isFromCreatorSubmission) {
      // From creator submission - check if explainer already submitted
      if (hasExplanation) {
        return 'completed'; // Explainer already submitted, ready to complete
      }
      // From creator submission - next step is explainer (if explainer hasn't submitted yet)
      return 'explainer';
    } else {
      // From gatherer submission (default) - next step is creator
      return 'creator';
    }
  };

  const nextDestination = question ? getNextDestination() : 'creator';

  // Fetch creators and explainers
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        
        // Fetch creators
        const creatorsResponse = await usersAPI.getAllUsers({ 
          adminRole: 'creator', 
          status: 'active',
          limit: 100 
        });
        if (creatorsResponse.success && creatorsResponse.data?.admins) {
          setCreators(creatorsResponse.data.admins.map(admin => ({
            id: admin.id,
            name: admin.username || admin.name || "Unknown"
          })));
        }
        
        // Fetch explainers
        const explainersResponse = await usersAPI.getAllUsers({ 
          adminRole: 'explainer', 
          status: 'active',
          limit: 100 
        });
        if (explainersResponse.success && explainersResponse.data?.admins) {
          setExplainers(explainersResponse.data.admins.map(admin => ({
            id: admin.id,
            name: admin.username || admin.name || "Unknown"
          })));
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
        navigate("/processor/question-bank/gatherer-submission");
        return;
      }

      try {
        setLoading(true);
        const response = await questionsAPI.getProcessorQuestionById(questionId);
        
        if (response.success && response.data?.question) {
          const fetchedQuestion = response.data.question;
          setQuestion(fetchedQuestion);
          
          // If this is a variant and viewing from creator/explainer submission, fetch parent question
          const isVariant = fetchedQuestion.isVariant === true || fetchedQuestion.isVariant === 'true';
          const originalQuestionId = fetchedQuestion.originalQuestionId || fetchedQuestion.originalQuestion?.id || fetchedQuestion.originalQuestion;
          
          // Check source from searchParams directly
          const currentSource = searchParams.get("source");
          const isFromCreator = currentSource === "creator-submission";
          const isFromExplainer = currentSource === "explainer-submission";
          
          if (isVariant && originalQuestionId && (isFromCreator || isFromExplainer)) {
            try {
              setLoadingParent(true);
              const parentResponse = await questionsAPI.getProcessorQuestionById(originalQuestionId);
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
          navigate("/processor/question-bank/gatherer-submission");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        showErrorToast("Failed to load question");
        navigate("/processor/question-bank/gatherer-submission");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, navigate, searchParams]);

  const handleClose = () => {
    if (isFromExplainerSubmission) {
      navigate("/processor/question-bank/explainer-submission");
    } else if (isFromCreatorSubmission) {
      navigate("/processor/question-bank/creator-submission");
    } else {
      navigate("/processor/question-bank/gatherer-submission");
    }
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
          if (isFromExplainerSubmission) {
            navigate("/processor/question-bank/explainer-submission");
          } else if (isFromCreatorSubmission) {
            navigate("/processor/question-bank/creator-submission");
          } else {
            navigate("/processor/question-bank/gatherer-submission");
          }
        }, 500);
    } catch (error) {
      console.error("Error rejecting question:", error);
      showErrorToast(error.response?.data?.message || "Failed to reject question");
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
      if (flagType === 'explainer') {
        await questionsAPI.reviewExplainerFlag(questionId, 'approve');
        showSuccessToast("Flag reason approved. Question sent back for correction.");
      } else {
        // Default to creator flag review
        await questionsAPI.reviewCreatorFlag(questionId, 'approve');
        showSuccessToast("Flag reason approved. Question sent back for correction.");
      }
      
      setTimeout(() => {
        // Navigate based on flag type
        if (flagType === 'explainer') {
          navigate("/processor/question-bank/explainer-submission");
        } else {
          navigate("/processor/question-bank/creator-submission");
        }
      }, 500);
    } catch (error) {
      console.error("Error approving flag reason:", error);
      showErrorToast(error.response?.data?.message || "Failed to approve flag reason");
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
        await questionsAPI.rejectGathererFlagRejection(questionId, flagRejectionReason);
        showSuccessToast("Gatherer's rejection rejected. Question sent back to gatherer.");
        setTimeout(() => {
          navigate("/processor/question-bank/gatherer-submission");
        }, 500);
      } else {
        // Use appropriate API based on flag type
        if (flagType === 'explainer') {
          await questionsAPI.reviewExplainerFlag(questionId, 'reject', flagRejectionReason);
          showSuccessToast("Flag reason rejected. Question sent back to explainer.");
          setTimeout(() => {
            navigate("/processor/question-bank/explainer-submission");
          }, 500);
        } else {
          // Default to creator flag review
          await questionsAPI.reviewCreatorFlag(questionId, 'reject', flagRejectionReason);
          showSuccessToast("Flag reason rejected. Question sent back to creator.");
          setTimeout(() => {
            navigate("/processor/question-bank/creator-submission");
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error rejecting flag reason:", error);
      showErrorToast(error.response?.data?.message || "Failed to reject flag reason");
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
        navigate("/processor/question-bank/gatherer-submission");
      }, 500);
    } catch (error) {
      console.error("Error accepting gatherer's rejection:", error);
      showErrorToast(error.response?.data?.message || "Failed to accept gatherer's rejection");
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
  const hasAssignedCreator = question && (question.assignedCreatorId || question.assignedCreator?.id);
  const hasAssignedExplainer = question && (question.assignedExplainerId || question.assignedExplainer?.id);
  
  // If coming from gatherer and creator not assigned, need to select creator
  // If coming from creator and explainer not assigned, need to select explainer
  const needsCreatorSelection = isFromGathererSubmission && !hasAssignedCreator;
  const needsExplainerSelection = isFromCreatorSubmission && !hasAssignedExplainer;

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
          if (question.flagType === 'creator') {
            return { type: 'creator', message: 'creator' };
          } else if (question.flagType === 'explainer') {
            return { type: 'explainer', message: 'explainer' };
          }
        }
        
        // Check if explainer has already submitted explanation
        const hasExplanation = question && 
                              question.explanation && 
                              typeof question.explanation === 'string' &&
                              question.explanation.trim() !== '';
        
        // If explainer has submitted, next step is always completed
        if (hasExplanation && question.status === 'pending_processor') {
          return { type: 'explainer', message: 'completed' };
        }
        
        // Default logic based on submission source
        if (isFromExplainerSubmission) {
          return { type: 'explainer', message: 'completed' };
        } else if (isFromCreatorSubmission) {
          // From creator submission - check if explainer already submitted
          if (hasExplanation) {
            return { type: 'explainer', message: 'completed' }; // Explainer already submitted, ready to complete
          }
          // From creator submission - next step is explainer (if explainer hasn't submitted yet)
          return { type: 'creator', message: 'explainer' };
        } else {
          return { type: 'gatherer', message: 'creator' };
        }
      };
      
      const nextDest = getNextDest();
      
      // Show success message
      if (nextDest.message === 'completed') {
        showSuccessToast("Question approved successfully");
      } else if (nextDest.message === 'explainer') {
        showSuccessToast("Question approved and sent to explainer");
      } else {
        showSuccessToast("Question approved and sent to creator");
      }
      
      // Add a small delay to ensure backend has processed the update
      setTimeout(() => {
        if (nextDest.type === 'explainer') {
          navigate("/processor/question-bank/explainer-submission");
        } else if (nextDest.type === 'creator') {
          navigate("/processor/question-bank/creator-submission");
        } else {
          navigate("/processor/question-bank/gatherer-submission");
        }
      }, 500);
    } catch (error) {
      console.error("Error approving question:", error);
      showErrorToast(error.response?.data?.message || "Failed to approve question");
    } finally {
      setProcessing(false);
    }
  };

  // Handle accept button click - show modal if needed
  const handleAcceptClick = () => {
    // Determine next destination
    const getNextDest = () => {
      if (question && wasUpdatedAfterFlag && question.flagType) {
        if (question.flagType === 'creator') {
          return { type: 'creator', message: 'creator' };
        } else if (question.flagType === 'explainer') {
          return { type: 'explainer', message: 'explainer' };
        }
      }
      
      const hasExplanation = question && 
                            question.explanation && 
                            typeof question.explanation === 'string' &&
                            question.explanation.trim() !== '';
      
      if (hasExplanation && question.status === 'pending_processor') {
        return { type: 'explainer', message: 'completed' };
      }
      
      if (isFromExplainerSubmission) {
        return { type: 'explainer', message: 'completed' };
      } else if (isFromCreatorSubmission) {
        if (hasExplanation) {
          return { type: 'explainer', message: 'completed' };
        }
        return { type: 'creator', message: 'explainer' };
      } else {
        return { type: 'gatherer', message: 'creator' };
      }
    };
    
    const nextDest = getNextDest();
    
    // Show creator modal if needed (first time accepting from gatherer)
    if (nextDest.message === 'creator' && needsCreatorSelection && creators.length > 0) {
      setShowCreatorModal(true);
      return;
    }
    
    // Show explainer modal if needed (second time accepting from creator)
    if (nextDest.message === 'explainer' && needsExplainerSelection && explainers.length > 0) {
      setShowExplainerModal(true);
      return;
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
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Build history from question data
  const getHistory = () => {
    if (!question) return [];
    const history = [];
    
    if (question.createdAt) {
      history.push({
        text: `Submitted by ${question.createdBy?.name || "Gatherer"}`,
        date: formatDate(question.createdAt)
      });
    }
    
    if (question.history && Array.isArray(question.history)) {
      question.history.forEach(item => {
        history.push({
          text: item.action || item.description || "Status updated",
          date: formatDate(item.timestamp || item.createdAt)
        });
      });
    }
    
    return history;
  };

  if (loading) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px] flex items-center justify-center">
        <div className="text-oxford-blue text-lg font-roboto">
          {t("processor.viewQuestion.loading") || "Loading question..."}
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div
      className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]"
      dir={dir}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
            {t("processor.viewQuestion.title")}
          </h1>
          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <OutlineButton
              text={t("processor.viewQuestion.close")}
              onClick={handleClose}
              className="py-[10px] px-[14px]"
              disabled={processing}
            />
            {/* Only show approve/reject buttons if question can still be processed */}
            {canProcessQuestion && (
              <>
                {/* Show different buttons for flagged questions OR gatherer rejected flag */}
                {isFlagged ? (
                  <>
                    <OutlineButton
                      text={t("processor.viewQuestion.rejectReasonButton") || "Reject Reason"}
                      onClick={() => setShowRejectFlagModal(true)}
                      className="py-[10px] px-[14px]"
                      disabled={processing}
                    />
                    <PrimaryButton
                      text={t("processor.viewQuestion.approveReason") || "Approve Reason"}
                      className="py-[10px] px-5"
                      onClick={handleApproveFlagReason}
                      disabled={processing}
                    />
                  </>
                ) : gathererRejectedFlag ? (
                  <>
                    <OutlineButton
                      text={t("processor.viewQuestion.rejectGathererRejection") || "Reject Gatherer's Rejection"}
                      onClick={() => setShowRejectFlagModal(true)}
                      className="py-[10px] px-[14px]"
                      disabled={processing}
                    />
                    <PrimaryButton
                      text={t("processor.viewQuestion.acceptGathererRejection") || "Accept Gatherer's Rejection"}
                      className="py-[10px] px-5"
                      onClick={handleAcceptGathererRejection}
                      disabled={processing}
                    />
                  </>
                ) : (
                  <>
                    <OutlineButton
                      text={t("processor.viewQuestion.reject")}
                      onClick={() => setShowRejectModal(true)}
                      className="py-[10px] px-[14px]"
                      disabled={processing}
                    />
                    <PrimaryButton
                      text={
                        nextDestination === 'completed'
                          ? t("processor.viewQuestion.approveQuestion")
                          : nextDestination === 'explainer'
                          ? t("processor.viewQuestion.acceptAndSendToExplainer")
                          : nextDestination === 'creator'
                          ? t("processor.viewQuestion.acceptAndSendToCreator")
                          : t("processor.viewQuestion.acceptAndSend")
                      }
                      className="py-[10px] px-5"
                      onClick={handleAcceptClick}
                      disabled={processing}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </header>

        {/* Main Content - Two Columns */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Parent Question Reference - Show when viewing a variant from creator/explainer submission */}
            {question.isVariant && (isFromCreatorSubmission || isFromExplainerSubmission) && parentQuestion && (
              <div className="rounded-[12px] border border-[#03274633] bg-white pt-[20px] px-[30px] pb-[30px] w-full">
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-oxford-blue">
                  {t("processor.viewQuestion.parentQuestionReference")}
                </h2>
                <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-4">
                  {t("processor.viewQuestion.parentQuestionDescription")}
                </p>
                <div className="bg-[#F6F7F8] rounded-lg p-4 border border-[#E5E7EB]">
                  <div className="mb-3">
                    <span className="font-roboto text-[14px] font-semibold text-oxford-blue">{t("processor.viewQuestion.parentQuestionLabel")}:</span>
                    <p
                      className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue mt-2"
                      dir="ltr"
                    >
                      {parentQuestion.questionText || "—"}
                    </p>
                  </div>
                  
                  {parentQuestion.questionType === "MCQ" && parentQuestion.options && (
                    <>
                      <div className="mt-4 mb-3">
                        <span className="font-roboto text-[14px] font-semibold text-oxford-blue">{t("processor.viewQuestion.parentOptionsLabel")}:</span>
                        <div className="space-y-2 mt-2" dir="ltr">
                          {Object.entries(parentQuestion.options).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <span className="font-roboto text-[14px] font-normal text-dark-gray min-w-[20px]">
                                {key}.
                              </span>
                              <span className="font-roboto text-[14px] font-normal text-dark-gray">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {parentQuestion.correctAnswer && (
                        <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                          <span className="font-roboto text-[14px] font-semibold text-oxford-blue">{t("processor.viewQuestion.parentCorrectAnswerLabel")}: </span>
                          <span className="font-roboto text-[14px] font-normal text-[#ED4122]">
                            {parentQuestion.correctAnswer}. {parentQuestion.options[parentQuestion.correctAnswer]}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Question Info Card */}
            <div
              className="rounded-[12px] border border-[#03274633] bg-white pt-[20px] px-[30px] pb-[67px] w-full"
              style={{}}
            >
              <h2 className="mb-2 font-archivo text-[20px] font-bold leading-[32px] text-oxford-blue">
                {t("processor.viewQuestion.questionInfo")}
              </h2>
              <div className="flex items-center justify-between">
                <span className="font-roboto text-[16px] font-normal leading-[100%] text-[#6B7280]">
                  ID: {question.id || "N/A"}
                </span>
              </div>
              <p
                className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue pt-[30px]"
                dir="ltr"
              >
                {question.questionText || "—"}
              </p>
            </div>
            <div
              className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full"
              style={{}}
            >
              <div>
                <div className="text-[16px] leading-[100%] font-normal font-roboto mb-[30px]">
                  {t("processor.viewQuestion.options")}
                </div>
                {/* Options */}
                {question.questionType === "MCQ" && question.options ? (
                  <>
                    <div className="space-y-5" dir="ltr">
                      {Object.entries(question.options).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="option"
                            value={key}
                            checked={key === question.correctAnswer}
                            className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                            disabled
                          />
                          <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                            {key}. {value}
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="border-t border-[#E5E7EB] mt-10 pt-4">
                      <p className="font-archivo text-[20px] font-bold leading-[20px] text-oxford-blue mb-2">
                        {t("admin.questionDetails.fields.correctAnswer")}
                      </p>
                      <label
                        className="flex items-center gap-3 pt-2 cursor-pointer"
                        dir="ltr"
                      >
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={question.correctAnswer}
                          checked
                          className="w-4 h-4 text-[#ED4122] border-[#03274633]"
                          disabled
                        />
                        <span className="font-roboto text-[16px] font-normal leading-[20px] text-[#ED4122]">
                          {question.correctAnswer}. {question.options[question.correctAnswer]}
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  <p className="text-dark-gray font-roboto text-[16px]">
                    {t("processor.viewQuestion.noOptions") || "No options available for this question type."}
                  </p>
                )}
              </div>
            </div>

            {/* Original Flag Reason Section - Show when there's an original flag (even if gatherer rejected it) */}
            {question.flagReason && (isFlagged || gathererRejectedFlag) && (
              <div className="rounded-[12px] border-2 border-orange-dark bg-orange-50 pt-[20px] px-[30px] pb-[30px] w-full">
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-orange-dark">
                  {t("processor.viewQuestion.flagReason") || "Original Flag Reason"}
                </h2>
                <div className="mb-2">
                  <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-2">
                    {flagType === 'explainer' 
                      ? (t("processor.viewQuestion.flagReasonDescriptionExplainer") || "The explainer has flagged this question with the following reason:")
                      : (t("processor.viewQuestion.flagReasonDescription") || "The creator has flagged this question with the following reason:")}
                  </p>
                </div>
                <div
                  className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue whitespace-pre-wrap bg-white p-4 rounded-lg border border-orange-200"
                  dir="ltr"
                >
                  {question.flagReason}
                </div>
              </div>
            )}

            {/* Gatherer Flag Rejection Section - Show when gatherer rejected a flag */}
            {gathererRejectedFlag && question.flagRejectionReason && (
              <div className="rounded-[12px] border-2 border-blue-500 bg-blue-50 pt-[20px] px-[30px] pb-[30px] w-full">
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-blue-700">
                  {t("processor.viewQuestion.gathererFlagRejection") || "Gatherer's Flag Rejection"}
                </h2>
                <div className="mb-2">
                  <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-2">
                    {t("processor.viewQuestion.gathererFlagRejectionDescription") || "The gatherer has rejected the flag with the following reason:"}
                  </p>
                </div>
                <div
                  className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue whitespace-pre-wrap bg-white p-4 rounded-lg border border-blue-200"
                  dir="ltr"
                >
                  {question.flagRejectionReason}
                </div>
              </div>
            )}

            {/* Explanation Section - Show for explainer submissions */}
            {isFromExplainerSubmission && question.explanation && (
              <div className="rounded-[12px] border border-[#03274633] bg-white pt-[20px] px-[30px] pb-[30px] w-full">
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-oxford-blue">
                  {t("processor.viewQuestion.explanation") || "Explanation"}
                </h2>
                <div
                  className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue whitespace-pre-wrap"
                  dir="ltr"
                >
                  {question.explanation}
                </div>
              </div>
            )}

            {question.attachments && question.attachments.length > 0 && (
              <Attachments files={question.attachments} t={t} />
            )}
            {getHistory().length > 0 && (
              <QuestionHistory historyItems={getHistory()} t={t} />
            )}
          </div>

          <div className="flex flex-col gap-4 lg:w-[376px]">
            {/* Classification Card */}
            <div className="rounded-lg border border-[#CDD4DA] bg-white">
              <div className="pt-10 px-6 pb-6 border-b border-[#CDD4DA]">
              <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark">
                {t("processor.viewQuestion.classification")}
              </h2>
              </div>
              <div className="space-y-5 text-[18px] leading-[100%] font-normal text-blue-dark pt-10 px-6 pb-6">
                {question.difficulty && (
                  <div>
                    <span className="">Difficulty: </span>
                    <span className="">{question.difficulty}</span>
                  </div>
                )}
                <div>
                  <span className="">Subject: </span>
                  <span className="">{question.subject?.name || "—"}</span>
                </div>
                <div>
                  <span className="">Topic: </span>
                  <span className="">{question.topic?.name || "—"}</span>
                </div>
                {question.subtopic && (
                  <div>
                    <span className="">Subtopic: </span>
                    <span className="">{question.subtopic.name || question.subtopic || "—"}</span>
                  </div>
                )}
                {question.isVariant && (
                  <div>
                    <span className="">Variant: </span>
                    <span className="">{question.variantNumber || "Yes"}</span>
                  </div>
                )}
                <div>
                  <span className="">Status: </span>
                  <span className="text-orange-dark">
                    {(() => {
                      if (wasUpdatedAfterFlag && question.flagType) {
                        if (question.flagType === 'creator') {
                          return "Updated by gatherer (flagged by creator)";
                        } else if (question.flagType === 'explainer') {
                          return "Updated by gatherer (flagged by explainer)";
                        }
                      }
                      if (isFlagged) {
                        if (flagType === 'explainer') {
                          return "Flagged by explainer";
                        } else {
                          return "Flagged by creator";
                        }
                      }
                      if (question.status === "pending_processor") {
                        if (isFromExplainerSubmission) {
                          return "Submitted by explainer";
                        } else if (isFromCreatorSubmission) {
                          return "Submitted by creator";
                        } else {
                          return "Submitted by gatherer";
                        }
                      }
                      return question.status || "—";
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Creator / Gatherer Notes Card */}
            <div className="rounded-lg border border-[#CDD4DA] bg-white">
              <div className="border-b border-[#CDD4DA] pt-10 px-6 pb-6 ">
              <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark">
                {t("processor.viewQuestion.creatorGathererNotes")}
              </h2>
              </div>
              <p className="text-[16px] leading-[100%] font-normal font-roboto text-[#6B7280] pb-[60px] pt-[30px] px-6">
                {question.notes || question.gathererNotes || question.creatorNotes || "No notes available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-oxford-blue mb-4">
              {t("processor.viewQuestion.rejectQuestion")}
            </h3>
            <p className="text-dark-gray mb-4">
              {t("processor.viewQuestion.rejectReason")}
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg p-3 min-h-[100px] font-roboto text-[16px]"
              placeholder={t("processor.viewQuestion.rejectReasonPlaceholder")}
            />
            <div className="flex gap-4 mt-6">
              <OutlineButton
                text={t("processor.viewQuestion.cancel")}
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                className="flex-1"
                disabled={processing}
              />
              <PrimaryButton
                text={t("processor.viewQuestion.confirmReject")}
                onClick={handleReject}
                className="flex-1"
                disabled={processing || !rejectionReason.trim()}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reject Flag Reason Modal */}
      {showRejectFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-oxford-blue mb-4">
              {t("processor.viewQuestion.rejectFlagReason") || "Reject Flag Reason"}
            </h3>
            <p className="text-dark-gray mb-4">
              {gathererRejectedFlag
                ? (t("processor.viewQuestion.rejectGathererRejectionDescription") || "Please provide a reason for rejecting the gatherer's flag rejection. The flag will be restored and the question will be sent back to the gatherer.")
                : flagType === 'explainer'
                ? (t("processor.viewQuestion.rejectFlagReasonDescriptionExplainer") || "Please provide a reason for rejecting the explainer's flag. The question will be sent back to the explainer.")
                : (t("processor.viewQuestion.rejectFlagReasonDescription") || "Please provide a reason for rejecting the creator's flag. The question will be sent back to the creator.")}
            </p>
            <textarea
              value={flagRejectionReason}
              onChange={(e) => setFlagRejectionReason(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg p-3 min-h-[100px] font-roboto text-[16px]"
              placeholder={t("processor.viewQuestion.rejectFlagReasonPlaceholder") || "Enter reason for rejecting the flag..."}
            />
            <div className="flex gap-4 mt-6">
              <OutlineButton
                text={t("processor.viewQuestion.cancel")}
                onClick={() => {
                  setShowRejectFlagModal(false);
                  setFlagRejectionReason("");
                }}
                className="flex-1"
                disabled={processing}
              />
              <PrimaryButton
                text={t("processor.viewQuestion.confirmRejectFlag") || "Reject Flag Reason"}
                onClick={handleRejectFlagReason}
                className="flex-1"
                disabled={processing || !flagRejectionReason.trim()}
              />
            </div>
          </div>
        </div>
      )}

      {/* Select Creator Modal */}
      {showCreatorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[12px] shadow-xl p-6 max-w-md w-full">
            <h3 className="text-[24px] font-bold font-archivo text-oxford-blue mb-2">
              Select Creator
            </h3>
            <p className="text-[16px] font-roboto text-dark-gray mb-6">
              Please select a creator to assign this question to:
            </p>
            {loadingUsers ? (
              <div className="text-center py-4">
                <p className="text-dark-gray">Loading creators...</p>
              </div>
            ) : creators.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-dark-gray">No creators available</p>
              </div>
            ) : (
              <div className="mb-4">
                <ProfileDropdown
                  value={selectedCreator}
                  options={creators.map((creator) => ({
                    value: creator.id,
                    label: creator.name
                  }))}
                  onChange={(value) => setSelectedCreator(value)}
                  placeholder="Select a creator..."
                  className="w-full"
                />
              </div>
            )}
            <div className="flex gap-4 mt-6">
              <OutlineButton
                text={t("processor.viewQuestion.cancel")}
                onClick={() => {
                  setShowCreatorModal(false);
                  setSelectedCreator("");
                }}
                className="flex-1"
                disabled={processing}
              />
              <PrimaryButton
                text="Confirm"
                onClick={handleCreatorSelect}
                className="flex-1"
                disabled={processing || !selectedCreator || loadingUsers}
              />
            </div>
          </div>
        </div>
      )}

      {/* Select Explainer Modal */}
      {showExplainerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[12px] shadow-xl p-6 max-w-md w-full">
            <h3 className="text-[24px] font-bold font-archivo text-oxford-blue mb-2">
              Select Explainer
            </h3>
            <p className="text-[16px] font-roboto text-dark-gray mb-6">
              Please select an explainer to assign this question to:
            </p>
            {loadingUsers ? (
              <div className="text-center py-4">
                <p className="text-dark-gray">Loading explainers...</p>
              </div>
            ) : explainers.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-dark-gray">No explainers available</p>
              </div>
            ) : (
              <div className="mb-4">
                <ProfileDropdown
                  value={selectedExplainer}
                  options={explainers.map((explainer) => ({
                    value: explainer.id,
                    label: explainer.name
                  }))}
                  onChange={(value) => setSelectedExplainer(value)}
                  placeholder="Select an explainer..."
                  className="w-full"
                />
              </div>
            )}
            <div className="flex gap-4 mt-6">
              <OutlineButton
                text={t("processor.viewQuestion.cancel")}
                onClick={() => {
                  setShowExplainerModal(false);
                  setSelectedExplainer("");
                }}
                className="flex-1"
                disabled={processing}
              />
              <PrimaryButton
                text="Confirm"
                onClick={handleExplainerSelect}
                className="flex-1"
                disabled={processing || !selectedExplainer || loadingUsers}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessorViewQuestion;
