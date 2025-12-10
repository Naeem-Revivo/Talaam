
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";


const ExplainerSubmission = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedFlagReason, setSelectedFlagReason] = useState("");

  const explainerColumns = [
    { key: 'questionTitle', label: t("processor.explainerSubmission.table.question") },
    { key: 'explainer', label: t("processor.explainerSubmission.table.explainer") },
    { key: 'processorStatus', label: t("processor.explainerSubmission.table.processorStatus") || "PROCESSOR STATUS" },
    { key: 'explainerStatus', label: t("processor.explainerSubmission.table.explainerStatus") || "EXPLAINER STATUS" },
    { key: 'submittedOn', label: t("processor.explainerSubmission.table.submittedOn") },
    { key: 'actions', label: t("processor.explainerSubmission.table.actions") }
  ];

  // Format date to "Today", "Yesterday", or formatted date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  // Map API status to processor status
  const mapProcessorStatus = (status) => {
    const statusMap = {
      'pending_processor': 'Pending Review',
      'pending_creator': 'Approved',
      'pending_explainer': 'Approved',
      'completed': 'Approved',
      'approved': 'Approved',
      'accepted': 'Approved',
      'rejected': 'Rejected',
      'reject': 'Rejected',
      'flagged': 'Pending Review', // Flagged questions are still pending processor review
      'flag': 'Pending Review'
    };
    return statusMap[status?.toLowerCase()] || 'Pending Review';
  };

  // Map API status to explainer status
  const mapExplainerStatus = (status, isFlagged, hasExplanation) => {
    // Priority: Flag > Submitted (if has explanation) > Other statuses
    if (isFlagged) {
      return 'Flag';
    }
    
    // Check if explainer has submitted explanation (status is pending_processor after explainer submission)
    if (hasExplanation && (status === 'pending_processor' || status === 'completed')) {
      return 'Approved';
    }

    const statusMap = {
      'pending_processor': 'Pending',
      'pending_creator': 'Pending',
      'pending_explainer': 'Pending',
      'completed': 'Approved',
      'approved': 'Approved',
      'accepted': 'Approved',
      'rejected': 'Rejected',
      'reject': 'Rejected',
      'flagged': 'Flag',
      'flag': 'Flag'
    };
    return statusMap[status?.toLowerCase()] || 'Pending';
  };

  // Fetch explainer submissions from API
  useEffect(() => {
    const fetchExplainerSubmissions = async () => {
      try {
        setLoading(true);
        
        // Fetch questions with multiple statuses to get all explainer submissions
        // This includes: pending_explainer (assigned to explainer), pending_processor (submitted by explainer),
        // flagged (flagged by explainer), completed, rejected (rejected after explainer submitted), etc.
        const statusesToFetch = [
          'pending_explainer', // Questions assigned to explainer (may or may not have explanation yet)
          'pending_processor', // Questions submitted by explainer back to processor (with explanation)
          'completed', // Completed questions
          'rejected' // Questions rejected after explainer submitted explanation
        ];

        let allQuestions = [];

        // Fetch questions for each status, filtered by explainer role
        const promises = statusesToFetch.map(status => 
          questionsAPI.getProcessorQuestions({ status, submittedBy: 'explainer' })
        );
        
        const responses = await Promise.all(promises);
        
        // Combine all questions
        responses.forEach(response => {
          if (response.success && response.data?.questions) {
            allQuestions = [...allQuestions, ...response.data.questions];
          }
        });
        
        // Remove duplicates based on question ID
        const uniqueQuestions = [];
        const seenIds = new Set();
        allQuestions.forEach(q => {
          if (!seenIds.has(q.id)) {
            seenIds.add(q.id);
            uniqueQuestions.push(q);
          }
        });
        allQuestions = uniqueQuestions;
          
        // Fetch individual question details to get full information (flag reason, explanation, etc.)
        const questionsWithDetails = await Promise.all(
          allQuestions.map(async (question) => {
            try {
              const detailResponse = await questionsAPI.getProcessorQuestionById(question.id);
              if (detailResponse.success && detailResponse.data) {
                const detailedQuestion = detailResponse.data.question;
                
                // Check if this is a variant
                const isVariant = detailedQuestion?.isVariant === true || 
                                 detailedQuestion?.isVariant === 'true' ||
                                 question?.isVariant === true || 
                                 question?.isVariant === 'true';
                const originalQuestionId = detailedQuestion?.originalQuestionId || 
                                          detailedQuestion?.originalQuestion?.id ||
                                          question?.originalQuestionId;
                
                // Get assignedExplainer from detailed question
                let assignedExplainer = detailedQuestion?.assignedExplainer || question.assignedExplainer || null;
                
                // Check if assignedExplainer is properly populated (has name/fullName/username)
                const hasExplainerInfo = assignedExplainer && 
                                        (assignedExplainer.name || 
                                         assignedExplainer.fullName || 
                                         assignedExplainer.username);
                
                // If variant doesn't have assignedExplainer properly populated, try to get it from parent question
                if (isVariant && originalQuestionId && !hasExplainerInfo) {
                  try {
                    const parentResponse = await questionsAPI.getProcessorQuestionById(originalQuestionId);
                    if (parentResponse.success && parentResponse.data?.question) {
                      const parentQuestion = parentResponse.data.question;
                      // Use parent's assignedExplainer if it's properly populated
                      if (parentQuestion.assignedExplainer && 
                          (parentQuestion.assignedExplainer.name || 
                           parentQuestion.assignedExplainer.fullName || 
                           parentQuestion.assignedExplainer.username)) {
                        assignedExplainer = parentQuestion.assignedExplainer;
                      }
                    }
                  } catch (parentError) {
                    console.warn(`Could not fetch parent question ${originalQuestionId} for variant ${question.id}:`, parentError);
                    // Continue with variant's assignedExplainer (or null)
                  }
                }
                
                return {
                  ...question,
                  ...detailedQuestion, // Merge detailed question data
                  flagReason: detailedQuestion?.flagReason || question.flagReason || null,
                  flagStatus: detailedQuestion?.flagStatus || question.flagStatus || null,
                  // Only mark as flagged if explicitly set to true AND flagStatus is pending
                  // Don't use flagReason alone as it might be from history
                  isFlagged: (detailedQuestion?.isFlagged === true || detailedQuestion?.isFlagged === 'true') &&
                            (detailedQuestion?.flagStatus === 'pending' || detailedQuestion?.flagStatus === null || detailedQuestion?.flagStatus === undefined) &&
                            (detailedQuestion?.status?.toLowerCase() !== 'completed' && detailedQuestion?.status?.toLowerCase() !== 'pending_creator'),
                  explanation: detailedQuestion?.explanation || question.explanation || null,
                  history: detailedQuestion?.history || question.history || [],
                  assignedExplainer: assignedExplainer
                };
              }
              return question;
            } catch (error) {
              console.error(`Error fetching details for question ${question.id}:`, error);
              return question;
            }
          })
        );

        // Filter out questions that haven't been through explainer workflow yet
        // A question should only appear in Explainer Submission if:
        // 1. It's assigned to explainer (status pending_explainer) - explainer needs to work on it
        // 2. OR it has explanation AND status is pending_processor/completed (explainer submitted it)
        // 3. OR it's flagged by explainer
        // 4. OR it's completed (went through explainer)
        const filteredQuestions = questionsWithDetails.filter((question) => {
          // Always include if status is pending_explainer (assigned to explainer, waiting for explainer to work)
          if (question.status === 'pending_explainer') {
            return true;
          }
          
          // Always include if completed (went through explainer)
          if (question.status === 'completed') {
            return true;
          }
          
          // Check if flagged by explainer
          if (question.isFlagged && question.flagType === 'explainer') {
            return true;
          }
          
          // Check if question has explanation (explainer submitted it)
          const hasExplanation = question.explanation !== null && 
                                question.explanation !== undefined && 
                                typeof question.explanation === 'string' &&
                                question.explanation.trim() !== '';
          
          // For pending_processor status, only include if explainer has submitted explanation
          // This ensures we don't show questions that are just in pending_processor but haven't been worked on by explainer
          if (question.status === 'pending_processor') {
            return hasExplanation; // Only include if explainer has added explanation
          }
          
          // For rejected status, only include if explainer has submitted explanation
          // This shows questions that were rejected after explainer submitted their explanation
          if (question.status === 'rejected') {
            return hasExplanation; // Only include if explainer has added explanation
          }
          
          // Include all other questions (backend already filtered by explainer role)
          return true;
        });

        // Transform API data to match table structure
        const transformedData = filteredQuestions.map((question) => {
          // Get explainer name (assignedExplainer or lastModifiedBy if explainer submitted)
          // Also check for fullName field which might be used instead of name
          const explainerName = question.assignedExplainer?.name || 
                               question.assignedExplainer?.fullName ||
                               question.assignedExplainer?.username ||
                               question.lastModifiedBy?.name || 
                               question.lastModifiedBy?.fullName ||
                               question.lastModifiedBy?.username || 
                               'Unknown';

          // Check if question has explanation
          const hasExplanation = question.explanation !== null && 
                                question.explanation !== undefined && 
                                typeof question.explanation === 'string' &&
                                question.explanation.trim() !== '';

          // Check if question is currently flagged by explainer
          // A question is flagged ONLY if:
          // 1. isFlagged property is explicitly true
          // 2. flagStatus is 'pending' (or null/undefined for backward compatibility)
          // 3. Status is not 'completed' or 'pending_creator' (flag has been resolved if moved forward)
          // Note: Don't check history or flagReason alone, as these persist even after flag is cleared
          const isFlagged = (question.isFlagged === true || question.isFlagged === 'true') &&
                           (question.flagStatus === 'pending' || question.flagStatus === null || question.flagStatus === undefined) &&
                           question.status?.toLowerCase() !== 'completed' &&
                           question.status?.toLowerCase() !== 'pending_creator';
          
          // Check if explainer has submitted (has explanation and status is pending_processor or completed)
          const isSubmittedByExplainer = hasExplanation && 
                                        (question.status === 'pending_processor' || question.status === 'completed') &&
                                        !isFlagged;

          // Get processor status
          const processorStatus = mapProcessorStatus(question.status);

          // Get explainer status with proper mapping
          const explainerStatus = mapExplainerStatus(question.status, isFlagged, hasExplanation);

          // Get flag reason
          const flagReason = question.flagReason || null;

          // Get explanation summary (truncate if too long)
          const explanationSummary = hasExplanation 
            ? (question.explanation.length > 50 
                ? question.explanation.substring(0, 50) + '...' 
                : question.explanation)
            : '—';

          return {
            id: question.id,
            questionTitle: question.questionText || 'Untitled Question',
            explainer: explainerName,
            processorStatus: processorStatus,
            explainerStatus: explainerStatus,
            explanationSummary: explanationSummary,
            submittedOn: formatDate(question.updatedAt || question.createdAt),
            flagReason: flagReason,
            indicators: {
              approved: explainerStatus === 'Approved' || question.status === 'completed' || isSubmittedByExplainer,
              flag: isFlagged,
              reject: question.status === 'rejected'
            },
            actionType: 'review',
            originalData: question // Store original data for navigation
          };
        });

        setSubmissions(transformedData);
        setTotal(transformedData.length);
      } catch (error) {
        console.error('Error fetching explainer submissions:', error);
        setSubmissions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchExplainerSubmissions();
  }, [currentPage, search, subject, topic, subtopic]);

  // Handler for review action
  const handleReview = (item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=explainer-submission`);
    }
  };

  // Handler for view action
  const handleView = (item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=explainer-submission`);
    }
  };

  // Handler for edit action
  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  // Handler for showing flag reason
  const handleShowFlagReason = (flagReason) => {
    setSelectedFlagReason(flagReason || "");
    setIsFlagModalOpen(true);
  };

  // Handler for closing flag modal
  const handleCloseFlagModal = () => {
    setIsFlagModalOpen(false);
    setSelectedFlagReason("");
  };

  const handleCancel = () => {
    navigate("/processor/question-bank");
  };


  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("processor.explainerSubmission.title")}
            </h1>
          </div>
            <OutlineButton text={t("processor.explainerSubmission.back")} className="py-[10px] px-5" onClick={handleCancel}/>
        </header>

        <ProcessorFilter
        searchValue={search}
        subjectValue={subject}
        topicValue={topic}
        subtopicValue={subtopic}
        onSearchChange={setSearch}
        onSubjectChange={setSubject}
        onTopicChange={setTopic}
        onSubtopicChange={setSubtopic}
        showRole={false}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-oxford-blue font-roboto text-lg">Loading...</div>
        </div>
      ) : (
        <Table
          items={submissions}
          columns={explainerColumns}
          page={currentPage}
          pageSize={10}
          total={total}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onCustomAction={handleReview}
          onShowFlagReason={handleShowFlagReason}
          emptyMessage={t("processor.explainerSubmission.emptyMessage")}
        />
      )}

      {/* Flag Reason Modal */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-oxford-blue mb-2">
              {t("creator.assignedQuestionPage.flagReasonModal.title") || "Flag Reason"}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("creator.assignedQuestionPage.flagReasonModal.subtitle") || "The reason why this question was flagged."}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-oxford-blue mb-2">
                {t("creator.assignedQuestionPage.flagReasonModal.reasonLabel") || "Reason for Flagging"}
              </label>
              <div className="p-3 bg-gray-50 rounded border border-gray-200 min-h-[100px]">
                <p className="text-gray-700 text-sm">
                  {selectedFlagReason || t("creator.assignedQuestionPage.flagReasonModal.noReason") || "No reason provided"}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <OutlineButton
                text={t("creator.assignedQuestionPage.flagReasonModal.close") || "Close"}
                onClick={handleCloseFlagModal}
                className="py-[10px] px-5"
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ExplainerSubmission;
