import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import ProfileDropdown from "../../components/common/ProfileDropdown";
import questionsAPI from "../../api/questions";
import adminAPI from "../../api/admin";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig.jsx";
import Loader from "../../components/common/Loader";

// Helper function to extract option text (handles both string and object formats)
const getOptionText = (optionValue) => {
  if (!optionValue) return "—";
  if (typeof optionValue === 'string') return optionValue;
  if (typeof optionValue === 'object') {
    // Handle object format like {option: 'A', text: 'Some text'}
    return optionValue.text || optionValue.option || String(optionValue);
  }
  return String(optionValue);
};

// Helper function to extract correct answer letter (handles both string and object formats)
const getCorrectAnswerLetter = (correctAnswerValue) => {
  if (!correctAnswerValue) return null;
  if (typeof correctAnswerValue === 'string') return correctAnswerValue;
  if (typeof correctAnswerValue === 'object') {
    // Handle object format like {option: 'A', text: 'Some text'}
    return correctAnswerValue.option || correctAnswerValue.text || null;
  }
  return String(correctAnswerValue);
};

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

const AdminPendingProcessorViewQuestion = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get("questionId");
  
  // Get current user from Redux
  const { user } = useSelector((state) => state.auth || {});
  const isSuperAdmin = user?.role === 'superadmin';
  
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
  
  // Check if question was updated after a flag
  const hasGathererUpdate = question && 
                               question.history && 
                               Array.isArray(question.history) &&
                             question.history.some(h => (h.role === 'gatherer' || h.role === 'admin') && (h.action === 'updated' || h.action === 'update'));
  
  const wasUpdatedAfterFlag = question && 
                               hasGathererUpdate &&
                               question.flagType &&
                               ((question.isFlagged === true && question.flagStatus === 'approved') ||
                                (question.isFlagged === false && (question.flagType === 'creator' || question.flagType === 'student' || question.flagType === 'explainer')));

  // Determine if question is flagged (pending review) - for any flag type
  // Admin should see all flagged questions regardless of flagStatus (especially student flags)
  // This matches processor logic: show all flags for admin (like student flags from admin submission)
  // For admin, we treat all flagged questions like processor treats student flags from admin submission
  const isFlagged = question && 
                    question.isFlagged === true && 
                    // Admin can see all flagged questions regardless of flagStatus (like student flags from admin submission)
                    // But still respect rejected status - don't show if explicitly rejected
                    (question.flagStatus === 'pending' || !question.flagStatus || question.flagStatus === 'approved');
  
  // Check if gatherer/admin rejected a flag (has flagRejectionReason AND was rejected by gatherer/admin)
  // This should only be true when a gatherer/admin rejected a flag, not when creator/explainer flags were rejected
  const gathererRejectedFlag = question && 
                               question.flagRejectionReason && 
                               question.flagRejectionReason.trim() !== '' &&
                               question.status === 'pending_processor' &&
                               // Check history to ensure the rejection was done by gatherer/admin
                               question.history &&
                               Array.isArray(question.history) &&
                               question.history.some(h => 
                                 h.action === 'flag_rejected_by_gatherer' && 
                                 (h.role === 'gatherer' || h.role === 'admin')
                               );
  
  // Determine flag type
  const flagType = question?.flagType || null;

  console.log('flagType', flagType);
  console.log('isFlagged', isFlagged);

  // Check if question can be processed
  // Admin should be able to process all pending_processor questions, including:
  // - Non-flagged questions
  // - Flagged questions (pending or approved status - admin can review even if previously approved)
  // - Gatherer rejected flags
  // - Questions updated after flag
  // - Questions with rejected flags (flagStatus === 'rejected') - admin can still process these
  // This matches processor logic for student flags from admin submission
  // For admin, we allow processing flagged questions even if flagStatus is 'approved' or 'rejected'
  // But exclude questions where flagStatus is explicitly 'rejected' and question is not in pending_processor
  const canProcessQuestion = question && 
                             question.status === 'pending_processor' &&
                             ((!isFlagged || 
                               (isFlagged && (question.flagStatus === 'pending' || !question.flagStatus || question.flagStatus === 'approved' || question.flagStatus === 'rejected')) || 
                               gathererRejectedFlag || 
                               wasUpdatedAfterFlag)) &&
                             // If gatherer rejected flag or updated after flag, always show buttons (needs admin review)
                             // Otherwise, show buttons for all pending_processor questions
                             (gathererRejectedFlag || wasUpdatedAfterFlag || true);

  // Determine next destination
  const getNextDestination = () => {
    if (question && wasUpdatedAfterFlag && question.flagType) {
      if (question.flagType === 'creator') {
        return 'creator';
      } else if (question.flagType === 'explainer') {
        return 'explainer';
      }
    }
    
    const hasExplanation = question && 
                          question.explanation && 
                          typeof question.explanation === 'string' &&
                          question.explanation.trim() !== '';
    
    if (hasExplanation && (question.status === 'pending_processor' || question.status === 'pending_explainer')) {
      return 'completed';
    }
    
    const isVariant = question?.isVariant === true || question?.isVariant === 'true';
    const hasVariants = question?.variants && Array.isArray(question.variants) && question.variants.length > 0;
    const hasCreatorHistory = question?.history && Array.isArray(question.history) &&
      question.history.some(h => h.role === 'creator' && (h.action === 'approved' || h.action === 'variant_created'));
    const wasModifiedByCreator = question?.lastModifiedById && 
      question?.history && Array.isArray(question.history) &&
      question.history.some(h => h.role === 'creator' && h.action === 'updated');
    const isCreatorSubmitted = question?.status === 'pending_processor' && 
      question?.approvedById && 
      wasModifiedByCreator;
    
    if (isVariant || hasVariants || hasCreatorHistory || wasModifiedByCreator || isCreatorSubmitted) {
      return 'explainer';
    }
    
    return 'creator';
  };

  const nextDestination = question ? getNextDestination() : 'creator';

  // Navigation path for admin
  const getNavigationPath = () => {
    return "/admin/question-bank/pending-processor";
  };

  // Fetch creators and explainers
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        
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
        navigate(getNavigationPath());
        return;
      }

      try {
        setLoading(true);
        // Use appropriate API based on user role
        let response;
        if (isSuperAdmin) {
          // SuperAdmin uses admin API
          response = await adminAPI.getQuestionDetails(questionId);
          if (response.success && response.data?.question) {
            const fetchedQuestion = response.data.question;
            
            // Debug: Log the raw response to see what we're getting
            console.log('Admin API Response:', {
              isFlagged: fetchedQuestion.isFlagged,
              flagType: fetchedQuestion.flagType,
              flagReason: fetchedQuestion.flagReason,
              flagStatus: fetchedQuestion.flagStatus,
              fullQuestion: fetchedQuestion
            });
            
            // Transform admin API response to match processor API format
            setQuestion({
              ...fetchedQuestion,
              questionText: fetchedQuestion.questionText || fetchedQuestion.question?.text,
              questionType: fetchedQuestion.questionType || fetchedQuestion.question?.type,
              options: fetchedQuestion.options || fetchedQuestion.question?.options,
              // Handle correctAnswer - it might be an object {option, text} from admin API
              correctAnswer: getCorrectAnswerLetter(fetchedQuestion.correctAnswer || fetchedQuestion.question?.correctAnswer),
              explanation: fetchedQuestion.explanation,
              subject: fetchedQuestion.subject || fetchedQuestion.classification?.subject,
              topic: fetchedQuestion.topic || fetchedQuestion.classification?.topic,
              subtopic: fetchedQuestion.subtopic || fetchedQuestion.classification?.subtopic,
              attachments: fetchedQuestion.attachments || [],
              history: fetchedQuestion.history || [],
              // Flag fields - these should now be included in the API response
              isFlagged: fetchedQuestion.isFlagged !== undefined ? fetchedQuestion.isFlagged : false,
              flagReason: fetchedQuestion.flagReason || null,
              flagType: fetchedQuestion.flagType || null,
              flagStatus: fetchedQuestion.flagStatus || null,
              flagRejectionReason: fetchedQuestion.flagRejectionReason || null,
              isVariant: fetchedQuestion.isVariant,
              originalQuestionId: fetchedQuestion.originalQuestionId || fetchedQuestion.originalQuestion?.id || fetchedQuestion.originalQuestion,
              variants: fetchedQuestion.variants || [],
              notes: fetchedQuestion.notes || fetchedQuestion.gathererNotes || fetchedQuestion.creatorNotes,
              createdBy: fetchedQuestion.createdBy || fetchedQuestion.workflow?.createdBy,
              lastModifiedBy: fetchedQuestion.lastModifiedBy,
              assignedCreatorId: fetchedQuestion.assignedCreatorId,
              assignedCreator: fetchedQuestion.assignedCreator,
              assignedExplainerId: fetchedQuestion.assignedExplainerId,
              assignedExplainer: fetchedQuestion.assignedExplainer,
              approvedBy: fetchedQuestion.approvedBy,
              approvedById: fetchedQuestion.approvedById,
              lastModifiedById: fetchedQuestion.lastModifiedById,
            });
            
            // Fetch parent question if variant
            const isVariant = fetchedQuestion.isVariant === true || fetchedQuestion.isVariant === 'true';
            const originalQuestionId = fetchedQuestion.originalQuestionId || fetchedQuestion.originalQuestion?.id || fetchedQuestion.originalQuestion;
            
            if (isVariant && originalQuestionId) {
              try {
                setLoadingParent(true);
                const parentResponse = await adminAPI.getQuestionDetails(originalQuestionId);
                if (parentResponse.success && parentResponse.data?.question) {
                  const parentQ = parentResponse.data.question;
                  setParentQuestion({
                    ...parentQ,
                    questionText: parentQ.questionText || parentQ.question?.text,
                    questionType: parentQ.questionType || parentQ.question?.type,
                    options: parentQ.options || parentQ.question?.options,
                    correctAnswer: getCorrectAnswerLetter(parentQ.correctAnswer || parentQ.question?.correctAnswer),
                  });
                }
              } catch (parentError) {
                console.error("Error fetching parent question:", parentError);
              } finally {
                setLoadingParent(false);
              }
            }
          } else {
            showErrorToast("Failed to load question");
            navigate(getNavigationPath());
          }
        } else {
          // Regular admin uses processor API
          response = await questionsAPI.getProcessorQuestionById(questionId);
          
          if (response.success && response.data?.question) {
            const fetchedQuestion = response.data.question;
            setQuestion(fetchedQuestion);
            
            const isVariant = fetchedQuestion.isVariant === true || fetchedQuestion.isVariant === 'true';
            const originalQuestionId = fetchedQuestion.originalQuestionId || fetchedQuestion.originalQuestion?.id || fetchedQuestion.originalQuestion;
            
            if (isVariant && originalQuestionId) {
              try {
                setLoadingParent(true);
                const parentResponse = await questionsAPI.getProcessorQuestionById(originalQuestionId);
                if (parentResponse.success && parentResponse.data?.question) {
                  setParentQuestion(parentResponse.data.question);
                }
              } catch (parentError) {
                console.error("Error fetching parent question:", parentError);
              } finally {
                setLoadingParent(false);
              }
            }
          } else {
            showErrorToast("Failed to load question");
            navigate(getNavigationPath());
          }
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        showErrorToast(error.response?.data?.message || "Failed to load question");
        navigate(getNavigationPath());
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, navigate, isSuperAdmin]);

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
      showErrorToast(error.response?.data?.message || "Failed to reject question");
    } finally {
      setProcessing(false);
      setShowRejectModal(false);
      setRejectionReason("");
    }
  };

  const handleApproveFlagReason = async () => {
    try {
      setProcessing(true);
      
      if (flagType === 'student') {
        await questionsAPI.reviewStudentFlag(questionId, 'approve');
        const isVariant = question.isVariant === true || question.isVariant === 'true' || question.originalQuestionId;
        if (isVariant) {
          showSuccessToast("Student flag approved. Question sent to creator for correction.");
        } else {
          showSuccessToast("Student flag approved. Question sent to gatherer for correction.");
        }
        setTimeout(() => {
          navigate(getNavigationPath());
        }, 500);
        return;
      } else if (flagType === 'explainer') {
        await questionsAPI.reviewExplainerFlag(questionId, 'approve');
        showSuccessToast("Flag reason approved. Question sent back for correction.");
      } else {
        await questionsAPI.reviewCreatorFlag(questionId, 'approve');
        showSuccessToast("Flag reason approved. Question sent back for correction.");
      }
      
      setTimeout(() => {
        navigate(getNavigationPath());
      }, 500);
    } catch (error) {
      console.error("Error approving flag reason:", error);
      showErrorToast(error.response?.data?.message || "Failed to approve flag reason");
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectFlagReason = async () => {
    if (!flagRejectionReason.trim()) {
      showErrorToast("Please provide a reason for rejecting the flag");
      return;
    }

    try {
      setProcessing(true);
      
      if (gathererRejectedFlag) {
        await questionsAPI.rejectGathererFlagRejection(questionId, flagRejectionReason);
        showSuccessToast("Gatherer's rejection rejected. Question sent back to gatherer.");
        setTimeout(() => {
          navigate(getNavigationPath());
        }, 500);
      } else {
        if (flagType === 'student') {
          await questionsAPI.reviewStudentFlag(questionId, 'reject', flagRejectionReason);
          showSuccessToast("Student flag rejected. Question marked as completed.");
        } else if (flagType === 'explainer') {
          await questionsAPI.reviewExplainerFlag(questionId, 'reject', flagRejectionReason);
          showSuccessToast("Flag reason rejected. Question sent back to explainer.");
        } else {
          await questionsAPI.reviewCreatorFlag(questionId, 'reject', flagRejectionReason);
          showSuccessToast("Flag reason rejected. Question sent back to creator.");
        }
        setTimeout(() => {
          navigate(getNavigationPath());
        }, 500);
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

  const handleAcceptGathererRejection = async () => {
    try {
      setProcessing(true);
      await questionsAPI.approveQuestion(questionId, { status: "approve" });
      showSuccessToast("Gatherer's rejection accepted. Question approved.");
      setTimeout(() => {
        navigate(getNavigationPath());
      }, 500);
    } catch (error) {
      console.error("Error accepting gatherer's rejection:", error);
      showErrorToast(error.response?.data?.message || "Failed to accept gatherer's rejection");
    } finally {
      setProcessing(false);
    }
  };

  const hasAssignedCreator = question && (question.assignedCreatorId || question.assignedCreator?.id);
  const hasAssignedExplainer = question && (question.assignedExplainerId || question.assignedExplainer?.id);
  
  // Check if this is a variant that came back from creator
  const isVariantFromCreator = question && (
    (question.isVariant === true || question.isVariant === 'true') ||
    (question.history && Array.isArray(question.history) &&
      question.history.some(h => h.role === 'creator' && (h.action === 'approved' || h.action === 'variant_created')))
  );
  
  const needsCreatorSelection = !hasAssignedCreator;
  // Variants from creator should always go to explainer and need explainer selection if not assigned
  const needsExplainerSelection = (nextDestination === 'explainer' || isVariantFromCreator) && !hasAssignedExplainer;

  const handleAccept = async (assignedUserId = null) => {
    try {
      setProcessing(true);
      
      const approveData = { status: "approve" };
      if (assignedUserId) {
        approveData.assignedUserId = assignedUserId;
      }
      
      await questionsAPI.approveQuestion(questionId, approveData);
      
      const nextDest = getNextDestination();
      
      // Show success message based on next destination
      if (nextDest === 'completed') {
        showSuccessToast("Question approved successfully");
      } else if (nextDest === 'explainer') {
        showSuccessToast("Question approved and sent to explainer");
      } else {
        showSuccessToast("Question approved and sent to creator");
      }
      
      // Add a small delay to ensure backend has processed the update
      setTimeout(() => {
        navigate(getNavigationPath());
      }, 500);
    } catch (error) {
      console.error("Error approving question:", error);
      showErrorToast(error.response?.data?.message || "Failed to approve question");
    } finally {
      setProcessing(false);
    }
  };

  const handleAcceptClick = () => {
    const nextDest = getNextDestination();
    
    // Check if this is a variant from creator that needs explainer assignment
    const isVariantNeedingExplainer = isVariantFromCreator && !hasAssignedExplainer;
    
    if (nextDest === 'creator' && needsCreatorSelection && creators.length > 0) {
      setShowCreatorModal(true);
      return;
    }
    
    // Show explainer modal if:
    // 1. Next destination is explainer AND needs explainer selection, OR
    // 2. It's a variant from creator that needs explainer assignment
    if ((nextDest === 'explainer' && needsExplainerSelection) || isVariantNeedingExplainer) {
      if (explainers.length > 0) {
        setShowExplainerModal(true);
        return;
      }
    }
    
    handleAccept();
  };

  const handleCreatorSelect = () => {
    if (!selectedCreator) {
      showErrorToast("Please select a creator");
      return;
    }
    setShowCreatorModal(false);
    handleAccept(selectedCreator);
    setSelectedCreator("");
  };

  const handleExplainerSelect = () => {
    if (!selectedExplainer) {
      showErrorToast("Please select an explainer");
      return;
    }
    setShowExplainerModal(false);
    handleAccept(selectedExplainer);
    setSelectedExplainer("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const stripHtmlTags = (html) => {
    if (!html) return "—";
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "—";
  };

  const getHistory = () => {
    if (!question) return [];
    const history = [];
    
    if (question.createdAt) {
      const creationHistory = question.history?.find(h => h.action === 'created');
      const creatorRole = creationHistory?.role || question.createdBy?.adminRole;
      const roleLabel = creatorRole === 'admin' ? 'admin' : 'Gatherer';
      history.push({
        text: `Submitted by ${question.createdBy?.name || roleLabel}`,
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
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
            {t("header.titles.admin.pendingProcessorView") || t("admin.questionBank.pendingProcessor.viewQuestion.title") || "Review Pending Processor Question"}
          </h1>
          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <OutlineButton
              text={t("processor.viewQuestion.close")}
              onClick={handleClose}
              className="py-[10px] px-[14px]"
              disabled={processing}
            />
            {canProcessQuestion && (
              <>
                {/* Show flag action buttons if question is flagged and flagStatus is not 'rejected' */}
                {/* If flagStatus is 'rejected', show regular approve/reject buttons instead */}
                {isFlagged && question.flagStatus !== 'rejected' ? (
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
                    {/* Show regular approve/reject buttons for:
                        1. Non-flagged questions
                        2. Questions with rejected flags (flagStatus === 'rejected') - admin can still process these
                    */}
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
            {/* Parent Question Reference */}
            {question.isVariant && parentQuestion && (
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
                      className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue mt-2 max-w-[600px] truncate cursor-help"
                      dir="ltr"
                      title={stripHtmlTags(parentQuestion.questionText)}
                    >
                      {stripHtmlTags(parentQuestion.questionText)}
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
                                {getOptionText(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {(() => {
                        const parentCorrectAnswerLetter = getCorrectAnswerLetter(parentQuestion.correctAnswer);
                        return parentCorrectAnswerLetter && (
                          <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                            <span className="font-roboto text-[14px] font-semibold text-oxford-blue">{t("processor.viewQuestion.parentCorrectAnswerLabel")}: </span>
                            <span className="font-roboto text-[14px] font-normal text-[#ED4122]">
                              {parentCorrectAnswerLetter}. {getOptionText(parentQuestion.options?.[parentCorrectAnswerLetter])}
                            </span>
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Question Info Card */}
            <div className="rounded-[12px] border border-[#03274633] bg-white pt-[20px] px-[30px] pb-[67px] w-full">
              <h2 className="mb-2 font-archivo text-[20px] font-bold leading-[32px] text-oxford-blue">
                {t("processor.viewQuestion.questionInfo")}
              </h2>
              <p
                className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue pt-[30px] max-w-[600px] truncate cursor-help"
                dir="ltr"
                title={stripHtmlTags(question.questionText)}
              >
                {stripHtmlTags(question.questionText)}
              </p>
            </div>
            <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full">
              <div>
                <div className="text-[16px] leading-[100%] font-normal font-roboto mb-[30px]">
                  {t("processor.viewQuestion.options")}
                </div>
                {(question.questionType === "MCQ" || question.questionType === "TRUE_FALSE") && question.options ? (
                  <>
                    <div className="space-y-5" dir="ltr">
                      {question.questionType === "TRUE_FALSE" ? (
                        <>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="option"
                              value="A"
                              checked={getCorrectAnswerLetter(question.correctAnswer) === "A"}
                              className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                              disabled
                            />
                            <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                              True
                            </span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="option"
                              value="B"
                              checked={getCorrectAnswerLetter(question.correctAnswer) === "B"}
                              className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                              disabled
                            />
                            <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                              False
                            </span>
                          </label>
                        </>
                      ) : (
                        Object.entries(question.options).map(([key, value]) => (
                          <label key={key} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="option"
                              value={key}
                              checked={key === getCorrectAnswerLetter(question.correctAnswer)}
                              className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                              disabled
                            />
                            <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                              {key}. {getOptionText(value)}
                            </span>
                          </label>
                        ))
                      )}
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
                          value={getCorrectAnswerLetter(question.correctAnswer) || ""}
                          checked
                          className="w-4 h-4 text-[#ED4122] border-[#03274633]"
                          disabled
                        />
                        <span className="font-roboto text-[16px] font-normal leading-[20px] text-[#ED4122]">
                          {(() => {
                            const correctAnswerLetter = getCorrectAnswerLetter(question.correctAnswer);
                            if (question.questionType === "TRUE_FALSE") {
                              return correctAnswerLetter === "A" ? "True" : "False";
                            }
                            return correctAnswerLetter 
                              ? `${correctAnswerLetter}. ${getOptionText(question.options?.[correctAnswerLetter])}`
                              : "—";
                          })()}
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

            {/* Flag Reason Section */}
            {/* Show flag reason for all flagged questions - admin needs to see all flags including student flags and rejected flags */}
            {/* Show flag reason if:
                1. Question is flagged (pending or approved)
                2. Gatherer rejected a flag
                3. Question has flagType (even if flagStatus is rejected - admin should see the original flag reason)
            */}
            {question.flagReason && (isFlagged || gathererRejectedFlag || (question.isFlagged === true && question.flagType) || (question.flagType && question.flagStatus === 'rejected')) && (
              <div className="rounded-[12px] border-2 border-orange-dark bg-orange-50 pt-[20px] px-[30px] pb-[30px] w-full">
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-orange-dark">
                  {t("processor.viewQuestion.flagReason") || "Original Flag Reason"}
                </h2>
                <div className="mb-2">
                  <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-2">
                    {question.flagStatus === 'rejected'
                      ? (flagType === 'student'
                          ? (t("processor.viewQuestion.flagReasonDescriptionStudentRejected") || "The student flagged this question (rejected by processor) with the following reason:")
                          : flagType === 'explainer'
                          ? (t("processor.viewQuestion.flagReasonDescriptionExplainerRejected") || "The explainer flagged this question (rejected by processor) with the following reason:")
                          : (t("processor.viewQuestion.flagReasonDescriptionRejected") || "The creator flagged this question (rejected by processor) with the following reason:"))
                      : (flagType === 'student'
                          ? (t("processor.viewQuestion.flagReasonDescriptionStudent") || "The student has flagged this question with the following reason:")
                          : flagType === 'explainer' 
                          ? (t("processor.viewQuestion.flagReasonDescriptionExplainer") || "The explainer has flagged this question with the following reason:")
                          : (t("processor.viewQuestion.flagReasonDescription") || "The creator has flagged this question with the following reason:"))}
                  </p>
                  {question.flagStatus === 'rejected' && (
                    <p className="font-roboto text-[14px] font-semibold text-orange-600 mb-2">
                      {t("processor.viewQuestion.flagRejectedNote") || "Note: This flag was previously rejected by the processor, but you can still review and process the question."}
                    </p>
                  )}
                </div>
                <div
                  className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue whitespace-pre-wrap bg-white p-4 rounded-lg border border-orange-200"
                  dir="ltr"
                >
                  {question.flagReason}
                </div>
              </div>
            )}

            {/* Gatherer Flag Rejection Section */}
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

            {/* Explanation Section */}
            {question.explanation && (
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
                        const updateHistory = question.history?.find(h => (h.action === 'updated' || h.action === 'update') && (h.role === 'gatherer' || h.role === 'admin'));
                        const updaterRole = updateHistory?.role === 'admin' ? 'admin' : 'gatherer';
                        if (question.flagType === 'creator') {
                          return `Updated by ${updaterRole} (flagged by creator)`;
                        } else if (question.flagType === 'explainer') {
                          return `Updated by ${updaterRole} (flagged by explainer)`;
                        } else if (question.flagType === 'student') {
                          return `Updated by ${updaterRole} (flagged by student)`;
                        }
                      }
                      if (isFlagged) {
                        if (flagType === 'student') {
                          return "Flagged by student";
                        } else if (flagType === 'explainer') {
                          return "Flagged by explainer";
                        } else {
                          return "Flagged by creator";
                        }
                      }
                      if (question.status === "pending_processor") {
                        const creationHistory = question.history?.find(h => h.action === 'created');
                        const creatorRole = creationHistory?.role || question.createdBy?.adminRole;
                        const roleLabel = creatorRole === 'admin' ? 'admin' : 'gatherer';
                        return `Submitted by ${roleLabel}`;
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
                : flagType === 'student'
                ? (t("processor.viewQuestion.rejectFlagReasonDescriptionStudent") || "Please provide a reason for rejecting the student's flag. The flag will be cleared.")
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
              <Loader 
                size="md" 
                color="oxford-blue" 
                text="Loading creators..."
                className="py-4"
              />
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
              <Loader 
                size="md" 
                color="oxford-blue" 
                text="Loading explainers..."
                className="py-4"
              />
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
    </>
  );
};

export default AdminPendingProcessorViewQuestion;

