import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLanguage } from "../../context/LanguageContext";
import questionsAPI from "../../api/questions";
import adminAPI from "../../api/admin";
import usersAPI from "../../api/users";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig.jsx";
import Loader from "../../components/common/Loader";
import { getCorrectAnswerLetter } from "../../components/admin/questionBank/utils/questionHelpers";
import Attachments from "../../components/admin/questionBank/Attachments";
import QuestionHistory from "../../components/admin/questionBank/QuestionHistory";
import ParentQuestionReference from "../../components/admin/questionBank/ParentQuestionReference";
import QuestionInfoCard from "../../components/admin/questionBank/QuestionInfoCard";
import QuestionOptionsCard from "../../components/admin/questionBank/QuestionOptionsCard";
import FlagReasonSection from "../../components/admin/questionBank/FlagReasonSection";
import GathererFlagRejectionSection from "../../components/admin/questionBank/GathererFlagRejectionSection";
import ExplanationSection from "../../components/admin/questionBank/ExplanationSection";
import ClassificationCard from "../../components/admin/questionBank/ClassificationCard";
import CreatorGathererNotesCard from "../../components/admin/questionBank/CreatorGathererNotesCard";
import ProcessorViewHeader from "../../components/admin/questionBank/processor/ProcessorViewHeader";
import RejectModal from "../../components/admin/questionBank/modals/RejectModal";
import RejectFlagModal from "../../components/admin/questionBank/modals/RejectFlagModal";
import SelectUserModal from "../../components/admin/questionBank/modals/SelectUserModal";

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
  const [showRejectModal, setShowRejectModal] = useState(false);
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
      if (question.flagType === 'creator' && question.isFlagged === true) {
        return 'creator';
      } else if (question.flagType === 'explainer' && question.isFlagged === true) {
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

  const handleReject = async (rejectionReason) => {
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

  const handleRejectFlagReason = async (flagRejectionReason) => {
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
    
    // If question has explanation, it should be completed - no need for modals
    if (nextDest === 'completed') {
      handleAccept();
      return;
    }
    
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
        <ProcessorViewHeader
          t={t}
          onClose={handleClose}
          canProcessQuestion={canProcessQuestion}
          isFlagged={isFlagged}
          flagStatus={question.flagStatus}
          gathererRejectedFlag={gathererRejectedFlag}
          nextDestination={nextDestination}
          onReject={() => setShowRejectModal(true)}
          onApproveFlagReason={handleApproveFlagReason}
          onRejectFlagReason={() => setShowRejectFlagModal(true)}
          onAcceptGathererRejection={handleAcceptGathererRejection}
          onAccept={handleAcceptClick}
          processing={processing}
        />

        {/* Main Content - Two Columns */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Parent Question Reference */}
            {question.isVariant && parentQuestion && (
              <ParentQuestionReference parentQuestion={parentQuestion} t={t} />
            )}

            {/* Question Info Card */}
            <QuestionInfoCard question={question} t={t} />
            
            {/* Question Options Card */}
            <QuestionOptionsCard question={question} t={t} />

            {/* Flag Reason Section */}
            <FlagReasonSection
              question={question}
              isFlagged={isFlagged}
              gathererRejectedFlag={gathererRejectedFlag}
              flagType={flagType}
              t={t}
            />

            {/* Gatherer Flag Rejection Section */}
            <GathererFlagRejectionSection
              question={question}
              gathererRejectedFlag={gathererRejectedFlag}
              t={t}
            />

            {/* Explanation Section */}
            <ExplanationSection explanation={question.explanation} t={t} />

            {question.attachments && question.attachments.length > 0 && (
              <Attachments files={question.attachments} t={t} />
            )}
            {getHistory().length > 0 && (
              <QuestionHistory historyItems={getHistory()} t={t} />
            )}
          </div>

          <div className="flex flex-col gap-4 lg:w-[376px]">
            {/* Classification Card */}
            <ClassificationCard
              question={question}
              wasUpdatedAfterFlag={wasUpdatedAfterFlag}
              isFlagged={isFlagged}
              flagType={flagType}
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
        onClose={() => {
          setShowRejectModal(false);
        }}
        onConfirm={handleReject}
        processing={processing}
        t={t}
      />

      {/* Reject Flag Reason Modal */}
      <RejectFlagModal
        isOpen={showRejectFlagModal}
        onClose={() => {
          setShowRejectFlagModal(false);
        }}
        onConfirm={handleRejectFlagReason}
        processing={processing}
        gathererRejectedFlag={gathererRejectedFlag}
        flagType={flagType}
        t={t}
      />

      {/* Select Creator Modal */}
      <SelectUserModal
        isOpen={showCreatorModal}
        onClose={() => {
          setShowCreatorModal(false);
          setSelectedCreator("");
        }}
        onConfirm={handleCreatorSelect}
        processing={processing}
        loadingUsers={loadingUsers}
        users={creators}
        selectedUser={selectedCreator}
        setSelectedUser={setSelectedCreator}
        title="Select Creator"
        description="Please select a creator to assign this question to:"
        placeholder="Select a creator..."
        t={t}
      />

      {/* Select Explainer Modal */}
      <SelectUserModal
        isOpen={showExplainerModal}
        onClose={() => {
          setShowExplainerModal(false);
          setSelectedExplainer("");
        }}
        onConfirm={handleExplainerSelect}
        processing={processing}
        loadingUsers={loadingUsers}
        users={explainers}
        selectedUser={selectedExplainer}
        setSelectedUser={setSelectedExplainer}
        title="Select Explainer"
        description="Please select an explainer to assign this question to:"
        placeholder="Select an explainer..."
        t={t}
      />
    </div>
    </>
  );
};
export default AdminPendingProcessorViewQuestion;