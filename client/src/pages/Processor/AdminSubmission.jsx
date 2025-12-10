
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";


const AdminSubmission = () => {
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

  const adminColumns = [
    { key: 'questionTitle', label: t("processor.adminSubmission.table.question") },
    { key: 'student', label: t("processor.adminSubmission.table.student") },
    { key: 'processorStatus', label: t("processor.adminSubmission.table.processorStatus") || "PROCESSOR STATUS" },
    { key: 'adminStatus', label: t("processor.adminSubmission.table.adminStatus") || "ADMIN STATUS" },
    { key: 'submittedOn', label: t("processor.adminSubmission.table.submittedOn") },
    { key: 'actions', label: t("processor.adminSubmission.table.actions") }
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
      'flagged': 'Pending Review',
      'flag': 'Pending Review'
    };
    return statusMap[status?.toLowerCase()] || 'Pending Review';
  };

  // Map API status to admin status
  const mapAdminStatus = (status, isFlagged) => {
    // Priority: Flag > Other statuses
    if (isFlagged) {
      return 'Flag';
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

  // Fetch admin submissions from API - questions flagged by students
  useEffect(() => {
    const fetchAdminSubmissions = async () => {
      try {
        setLoading(true);
        
        // Fetch questions with flagType='student'
        // These are questions flagged by students
        const statusesToFetch = [
          'pending_processor', // Questions with student flags
          'pending_creator',
          'pending_explainer',
          'completed',
          'rejected'
        ];

        let allQuestions = [];

        // Fetch questions for each status with flagType='student'
        // This will fetch only student-flagged questions
        const promises = statusesToFetch.map(status => 
          questionsAPI.getProcessorQuestions({ status, flagType: 'student' })
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
          
        // Fetch individual question details to get full information (flag reason, etc.)
        const questionsWithDetails = await Promise.all(
          allQuestions.map(async (question) => {
            try {
              const detailResponse = await questionsAPI.getProcessorQuestionById(question.id);
              if (detailResponse.success && detailResponse.data) {
                const detailedQuestion = detailResponse.data.question;
                return {
                  ...question,
                  ...detailedQuestion, // Merge detailed question data
                  flagReason: detailedQuestion?.flagReason || question.flagReason || null,
                  flagStatus: detailedQuestion?.flagStatus || question.flagStatus || null,
                  flagType: detailedQuestion?.flagType || question.flagType || null,
                  // For admin submission page, show ALL student-flagged questions regardless of flagStatus
                  // This allows viewing all student flags (pending, approved, rejected)
                  isFlagged: (detailedQuestion?.isFlagged === true || detailedQuestion?.isFlagged === 'true') &&
                            (detailedQuestion?.flagType === 'student'),
                  history: detailedQuestion?.history || question.history || []
                };
              }
              return question;
            } catch (error) {
              console.error(`Error fetching details for question ${question.id}:`, error);
              return question;
            }
          })
        );

        // Filter to only show questions with flagType='student'
        const filteredQuestions = questionsWithDetails.filter((question) => {
          return question.flagType === 'student';
        });

        // Transform API data to match table structure
        const transformedData = filteredQuestions.map((question) => {
          // Get student name (flaggedBy would be the student who flagged)
          const studentName = question.flaggedBy?.name || 
                             question.flaggedBy?.fullName ||
                             question.lastModifiedBy?.name || 
                             question.lastModifiedBy?.fullName ||
                             'Unknown';

          // Check if question is flagged by student
          // For admin submission page, show ALL student-flagged questions regardless of flagStatus
          // This allows viewing all student flags (pending, approved, rejected)
          const isFlagged = (question.isFlagged === true || question.isFlagged === 'true') &&
                           (question.flagType === 'student');

          // Get processor status
          const processorStatus = mapProcessorStatus(question.status);

          // Get admin status with proper mapping
          // For admin submission page, always show "Flagged" for student-flagged questions
          const adminStatus = isFlagged ? 'Flagged' : mapAdminStatus(question.status, false);

          // Get flag reason
          const flagReason = question.flagReason || null;

          return {
            id: question.id,
            questionTitle: question.questionText || 'Untitled Question',
            student: studentName,
            processorStatus: processorStatus,
            adminStatus: adminStatus,
            submittedOn: formatDate(question.updatedAt || question.createdAt),
            flagReason: flagReason,
            indicators: {
              approved: adminStatus === 'Approved' || question.status === 'completed',
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
        console.error('Error fetching admin submissions:', error);
        setSubmissions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminSubmissions();
  }, [currentPage, search, subject, topic, subtopic]);

  // Handler for review action
  const handleReview = (item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=admin-submission`);
    }
  };

  // Handler for view action
  const handleView = (item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=admin-submission`);
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
              {t("processor.adminSubmission.title")}
            </h1>
          </div>
            <OutlineButton text={t("processor.adminSubmission.back")} className="py-[10px] px-5" onClick={handleCancel}/>
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
          columns={adminColumns}
          page={currentPage}
          pageSize={10}
          total={total}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onCustomAction={handleReview}
          onShowFlagReason={handleShowFlagReason}
          emptyMessage={t("processor.adminSubmission.emptyMessage")}
        />
      )}

      {/* Flag Reason Modal */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-oxford-blue mb-2">
              {t("processor.adminSubmission.flagReasonModal.title") || "Flag Reason"}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("processor.adminSubmission.flagReasonModal.subtitle") || "The reason why this question was flagged by the student."}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-oxford-blue mb-2">
                {t("processor.adminSubmission.flagReasonModal.reasonLabel") || "Reason for Flagging"}
              </label>
              <div className="p-3 bg-gray-50 rounded border border-gray-200 min-h-[100px]">
                <p className="text-gray-700 text-sm">
                  {selectedFlagReason || t("processor.adminSubmission.flagReasonModal.noReason") || "No reason provided"}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <OutlineButton
                text={t("processor.adminSubmission.flagReasonModal.close") || "Close"}
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

export default AdminSubmission;

