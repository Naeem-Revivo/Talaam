
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useMemo } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import Loader from "../../components/common/Loader";

const CreaterSubmission = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState(""); // This is the processor status filter
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedFlagReason, setSelectedFlagReason] = useState("");

  // Processor status options for the filter
  const processorStatusOptions = useMemo(() => [
    t("filter.status") || "All Status",
    "Pending Review",
    "Approved",
    "Rejected"
  ], [t]);

  const createSubmissionColumns = [
    { key: 'questionTitle', label: t("processor.creatorSubmission.table.question") },
    { key: 'creator', label: t("processor.creatorSubmission.table.creator") },
    { key: 'processorStatus', label: t("processor.creatorSubmission.table.processorStatus") || "PROCESSOR STATUS" },
    { key: 'creatorStatus', label: t("processor.creatorSubmission.table.creatorStatus") || "CREATOR STATUS" },
    { key: 'submittedOn', label: t("processor.creatorSubmission.table.submittedOn") },
    { key: 'actions', label: t("processor.creatorSubmission.table.actions") }
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

  // Map API status to creator status - comprehensive mapping for creator statuses
  const mapCreatorStatus = (status, isFlagged, hasVariants, isSubmittedByCreator, isCompleted) => {
    // Priority: Flag > Variant Created > Approved (if submitted/completed by creator or sent to explainer) > Other statuses
    if (isFlagged) {
      return 'Flag';
    }
    
    if (hasVariants && status === 'pending_processor') {
      return 'Variant Created';
    }

    // Check if approved/completed or sent to explainer (means creator approved and processor sent to explainer)
    if (isSubmittedByCreator || isCompleted || status === 'completed' || status === 'pending_explainer') {
      return 'Approved';
    }

    const statusMap = {
      'pending_processor': 'Pending',
      'pending_creator': 'Pending',
      'pending_explainer': 'Approved', // Sent to explainer means creator approved it
      'completed': 'Approved',
      'approved': 'Approved',
      'accepted': 'Approved',
      'rejected': 'Rejected',
      'reject': 'Rejected',
      'flagged': 'Flag',
      'flag': 'Flag',
      'variant_created': 'Variant Created'
    };
    return statusMap[status?.toLowerCase()] || 'Pending';
  };

  // Fetch creator submissions from API
  useEffect(() => {
    const fetchCreatorSubmissions = async () => {
      try {
        setLoading(true);
        
        // Fetch questions with multiple statuses to get all creator submissions
        // This includes: pending_processor (submitted by creator, including flagged), rejected, 
        // pending_explainer (approved and sent to explainer), completed, etc.
        // Note: 'flagged' is not a status - flagged questions have status 'pending_processor' with isFlagged=true
        const statusesToFetch = [
          'pending_processor', // Includes questions submitted by creator AND flagged questions
          'rejected',
          'pending_explainer', // Questions approved and sent to explainer
          'completed'
        ];

        let allQuestions = [];

        // Fetch questions for each status, filtered by creator role
        const promises = statusesToFetch.map(status => 
          questionsAPI.getProcessorQuestions({ status, submittedBy: 'creator' })
        );
        
        const responses = await Promise.all(promises);
        
        // Combine all questions
        responses.forEach(response => {
          if (response.success && response.data?.questions) {
            allQuestions = [...allQuestions, ...response.data.questions];
        }
        });
        
        // Also fetch creator-flagged questions explicitly
        // Creator-flagged questions might not be included in the above fetch if they don't match the role filter
        // Fetch questions with flagType='creator' and isFlagged=true, regardless of status
        try {
          // Fetch all pending_processor questions and filter for creator-flagged ones
          const flaggedResponse = await questionsAPI.getProcessorQuestions({ status: 'pending_processor' });
          if (flaggedResponse.success && flaggedResponse.data?.questions) {
            const creatorFlaggedQuestions = flaggedResponse.data.questions.filter(q => 
              q.isFlagged === true && 
              q.flagType === 'creator' && 
              (q.flagStatus === 'pending' || q.flagStatus === null || q.flagStatus === undefined)
            );
            // Add creator-flagged questions that aren't already in the list
            const existingIds = new Set(allQuestions.map(q => q.id));
            creatorFlaggedQuestions.forEach(q => {
              if (!existingIds.has(q.id)) {
                allQuestions.push(q);
              }
            });
          }
        } catch (error) {
          console.warn('Error fetching creator-flagged questions:', error);
          // Continue with existing questions if this fails
        }
        
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
          
        // Fetch individual question details to get full information (rejection reason, flag reason, variants, etc.)
        const questionsWithDetails = await Promise.all(
          allQuestions.map(async (question) => {
              try {
                const detailResponse = await questionsAPI.getProcessorQuestionById(question.id);
                if (detailResponse.success && detailResponse.data) {
                const detailedQuestion = detailResponse.data.question;
                  return {
                    ...question,
                  ...detailedQuestion, // Merge detailed question data
                  rejectionReason: detailedQuestion?.rejectionReason || question.rejectionReason || null,
                  flagReason: detailedQuestion?.flagReason || question.flagReason || null,
                  flagStatus: detailedQuestion?.flagStatus || question.flagStatus || null,
                  // Only mark as flagged if explicitly set to true AND flagStatus is pending
                  // Don't use flagReason alone as it might be from history
                  isFlagged: (detailedQuestion?.isFlagged === true || detailedQuestion?.isFlagged === 'true') &&
                            (detailedQuestion?.flagStatus === 'pending' || detailedQuestion?.flagStatus === null || detailedQuestion?.flagStatus === undefined) &&
                            (detailedQuestion?.status?.toLowerCase() !== 'pending_explainer' && detailedQuestion?.status?.toLowerCase() !== 'completed'),
                  variants: detailedQuestion?.variants || question.variants || [],
                  history: detailedQuestion?.history || question.history || [],
                  approvedBy: detailedQuestion?.approvedBy || question.approvedBy || null,
                  assignedCreator: detailedQuestion?.assignedCreator || question.assignedCreator || null,
                  isVariant: detailedQuestion?.isVariant || question.isVariant || false
                  };
                }
                return question;
              } catch (error) {
                console.error(`Error fetching details for question ${question.id}:`, error);
                return question;
              }
            })
          );

        // Backend now filters by role, so we don't need complex frontend filtering
        // Just filter out rejected questions that were rejected after gatherer submission (never went through creator)
        const filteredQuestions = questionsWithDetails.filter((question) => {
          // If rejected, only include if it went through creator workflow first
          if (question.status === 'rejected') {
            const hasCreatorHistory = question.history && Array.isArray(question.history) &&
              question.history.some(h => h.role === 'creator');
            const hasApprovedBy = question.approvedBy || question.originalData?.approvedBy;
            // Exclude if rejected after gatherer submission (never went through creator)
            return hasCreatorHistory || hasApprovedBy;
          }
          
          // Include all other questions (backend already filtered by creator role)
          return true;
        });

        // Transform API data to match table structure
        const transformedData = filteredQuestions.map((question) => {
          // Get creator name from assignedCreator (the creator who performed operations on the question)
          // Priority: assignedCreator > creator from history > lastModifiedBy > createdBy
          let creatorName = null;
          
          // First, try to get from assignedCreator (the creator assigned to work on this question)
          if (question.assignedCreator) {
            creatorName = question.assignedCreator.name || 
                         question.assignedCreator.username ||
                         question.assignedCreator.fullName ||
                         null;
          }
          
          // If not found, try to get from history (creator who performed actions)
          if (!creatorName && question.history && Array.isArray(question.history)) {
            // Find the most recent creator action
            const creatorHistory = question.history
              .filter(h => h.role === 'creator' && (h.action === 'approved' || h.action === 'variant_created' || h.action === 'updated'))
              .sort((a, b) => {
                const timeA = new Date(a.timestamp || a.createdAt || 0);
                const timeB = new Date(b.timestamp || b.createdAt || 0);
                return timeB - timeA; // Most recent first
              });
            
            if (creatorHistory.length > 0) {
              const latestCreatorAction = creatorHistory[0];
              creatorName = latestCreatorAction.performedBy?.name || 
                           latestCreatorAction.performedBy?.username ||
                           latestCreatorAction.performedBy?.fullName ||
                           null;
            }
          }
          
          // Fallback to lastModifiedBy or createdBy
          if (!creatorName) {
            creatorName = question.lastModifiedBy?.name || 
                         question.lastModifiedBy?.username || 
                         question.createdBy?.name || 
                         question.createdBy?.username || 
                         'Unknown';
          }

          // Check if question has variants created from it
          // Check if question has variants array with items, or if history shows variant_created action
          const hasVariants = (question.variants && Array.isArray(question.variants) && question.variants.length > 0) ||
                             (question.history && Array.isArray(question.history) && question.history.some(h => h.action === 'variant_created'));

          // Check if creator has submitted the question back to processor (approved submission)
          // A question is considered "approved" by creator if:
          // 1. Status is pending_processor AND has approvedBy (processor approved it, sent to creator, creator submitted back)
          // 2. Status is completed (fully approved)
          // 3. Status is pending_processor AND was previously in pending_creator (went through creator workflow)
          const hasApprovedBy = question.approvedBy || question.originalData?.approvedBy;
          const wasInCreatorWorkflow = question.history && Array.isArray(question.history) && 
                                      question.history.some(h => h.status === 'pending_creator' || h.action === 'approved');
          
          // Check if question is currently flagged by creator
          // A question is flagged ONLY if:
          // 1. isFlagged property is explicitly true
          // 2. flagType is 'creator' (flagged by creator)
          // 3. flagStatus is 'pending' (or null/undefined for backward compatibility)
          // 4. Status is not 'pending_explainer' or 'completed' (flag has been resolved if moved forward)
          // Note: Don't check history or flagReason alone, as these persist even after flag is cleared
          const isFlagged = (question.isFlagged === true || question.isFlagged === 'true') &&
                           (question.flagType === 'creator') &&
                           (question.flagStatus === 'pending' || question.flagStatus === null || question.flagStatus === undefined) &&
                           question.status?.toLowerCase() !== 'pending_explainer' &&
                           question.status?.toLowerCase() !== 'completed';
          
          const isSubmittedByCreator = question.status === 'pending_processor' && 
                                       !isFlagged && 
                                       (hasApprovedBy || wasInCreatorWorkflow);
          
          // Check if question was completed (approved by processor)
          const isCompleted = question.status === 'completed' && !isFlagged;

          // Get processor status
          const processorStatus = mapProcessorStatus(question.status);

          // Check if this question is a variant
          const isVariant = question.isVariant === true || question.isVariant === 'true';

          // Get creator status with proper mapping
          // For variants: show "Variant"
          // For questions with variants: show "Variant Created"
          let creatorStatus;
          if (isVariant) {
            creatorStatus = 'Variant';
          } else if (hasVariants) {
            creatorStatus = 'Variant Created';
          } else {
            // Priority: Flag > Approved (if submitted/completed) > Other statuses
            creatorStatus = mapCreatorStatus(question.status, isFlagged, false, isSubmittedByCreator, isCompleted);
          }

          // Get flag reason
          const flagReason = question.flagReason || null;

          return {
            id: question.id,
            questionTitle: question.questionText || 'Untitled Question',
            creator: creatorName,
            processorStatus: processorStatus,
            creatorStatus: creatorStatus,
            submittedOn: formatDate(question.updatedAt || question.createdAt),
            flagReason: flagReason,
            isVariant: isVariant, // Store isVariant for table component
            indicators: {
              approved: creatorStatus.includes('Approved') || question.status === 'completed' || isSubmittedByCreator,
              flag: isFlagged,
              reject: question.status === 'rejected',
              variant: hasVariants || isVariant // Include variant indicator for variant questions
            },
            actionType: 'review',
            originalData: question // Store original data for navigation
          };
        });

        // Sort: pending_processor questions first (newest first), then others (newest first)
        transformedData.sort((a, b) => {
          const isAPendingProcessor = a.originalData?.status === 'pending_processor';
          const isBPendingProcessor = b.originalData?.status === 'pending_processor';
          
          // If one is pending_processor and the other isn't, pending_processor comes first
          if (isAPendingProcessor && !isBPendingProcessor) return -1;
          if (!isAPendingProcessor && isBPendingProcessor) return 1;
          
          // Both have same priority, sort by date (most recent first)
          const dateA = new Date(a.originalData?.updatedAt || a.originalData?.createdAt);
          const dateB = new Date(b.originalData?.updatedAt || b.originalData?.createdAt);
          return dateB - dateA;
        });

        setSubmissions(transformedData);
      } catch (error) {
        console.error('Error fetching creator submissions:', error);
        setSubmissions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorSubmissions();
  }, [currentPage, search, topic, subtopic]);

  // Filter submissions based on processor status and search
  useEffect(() => {
    let filtered = [...submissions];

    // Filter by processor status (subtopic)
    if (subtopic && subtopic !== processorStatusOptions[0] && subtopic !== t("filter.status")) {
      filtered = filtered.filter(item => item.processorStatus === subtopic);
    }

    // Filter by search term
    if (search && search.trim() !== "") {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.questionTitle?.toLowerCase().includes(searchLower) ||
        item.creator?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredSubmissions(filtered);
    setTotal(filtered.length);
  }, [submissions, subtopic, search, processorStatusOptions, t]);

  // Handler for review action
  const handleReview = (item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=creator-submission`);
    }
  };

  // Handler for view action
  const handleView = (item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=creator-submission`);
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
                {t("processor.creatorSubmission.title")}
            </h1>
          </div>
            <OutlineButton text={t("processor.creatorSubmission.back")} className="py-[10px] px-5" onClick={handleCancel}/>
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
        showSubject={false}
        statusOptions={processorStatusOptions}
      />

      {loading ? (
        <Loader 
          size="lg" 
          color="oxford-blue" 
          text="Loading..."
          className="py-12"
        />
      ) : (
        <Table
          items={filteredSubmissions}
          columns={createSubmissionColumns}
          page={currentPage}
          pageSize={10}
          total={total}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onCustomAction={handleReview}
          onShowFlagReason={handleShowFlagReason}
          emptyMessage={t("processor.creatorSubmission.emptyMessage")}
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

export default CreaterSubmission;
