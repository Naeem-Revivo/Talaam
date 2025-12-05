
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";

const CreaterSubmission = () => {
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

  const createSubmissionColumns = [
    { key: 'questionTitle', label: t("processor.creatorSubmission.table.question") },
    { key: 'creator', label: t("processor.creatorSubmission.table.creator") },
    { key: 'variants', label: t("processor.creatorSubmission.table.variants") },
    { key: 'status', label: t("processor.creatorSubmission.table.status") },
    { key: 'rejectionReason', label: t("processor.creatorSubmission.table.rejectionReason") },
    { key: 'submittedOn', label: t("processor.creatorSubmission.table.submittedOn") },
    { key: 'actions', label: t("processor.creatorSubmission.table.actions") }
  ];

  // Fetch creator submissions from API
  useEffect(() => {
    const fetchCreatorSubmissions = async () => {
      try {
        setLoading(true);
        
        // Fetch both pending and rejected questions
        const [pendingResponse, rejectedResponse] = await Promise.all([
          questionsAPI.getProcessorQuestions({ status: 'pending_processor' }),
          questionsAPI.getProcessorQuestions({ status: 'rejected' })
        ]);

        let allQuestions = [];

        // Combine pending questions
        if (pendingResponse.success && pendingResponse.data) {
          allQuestions = [...allQuestions, ...(pendingResponse.data.questions || [])];
        }

        // Combine rejected questions
        if (rejectedResponse.success && rejectedResponse.data) {
          const rejectedQuestions = rejectedResponse.data.questions || [];
          
          // Fetch individual question details for rejected questions to get rejection reason
          const rejectedWithReasons = await Promise.all(
            rejectedQuestions.map(async (question) => {
              try {
                const detailResponse = await questionsAPI.getProcessorQuestionById(question.id);
                if (detailResponse.success && detailResponse.data) {
                  return {
                    ...question,
                    rejectionReason: detailResponse.data.question?.rejectionReason || null
                  };
                }
                return question;
              } catch (error) {
                console.error(`Error fetching details for question ${question.id}:`, error);
                return question;
              }
            })
          );
          
          allQuestions = [...allQuestions, ...rejectedWithReasons];
        }

        // Transform API data to match table structure
        const transformedData = allQuestions.map((question) => {
          // Format date
          const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (date.toDateString() === today.toDateString()) {
              return 'Today';
            } else if (date.toDateString() === yesterday.toDateString()) {
              return 'Yesterday';
            } else {
              return date.toLocaleDateString();
            }
          };

          // Get creator name (lastModifiedBy would be the creator who submitted)
          const creatorName = question.lastModifiedBy?.name || 
                             question.lastModifiedBy?.username || 
                             question.createdBy?.name || 
                             question.createdBy?.username || 
                             'Unknown';

          // Get rejection reason
          const rejectionReason = question.rejectionReason || null;

          // Format status
          const formatStatus = (status) => {
            if (!status) return 'Pending';
            const statusMap = {
              'pending_processor': 'Pending',
              'pending_creator': 'Pending',
              'pending_explainer': 'Pending',
              'completed': 'Approved',
              'rejected': 'Rejected'
            };
            return statusMap[status] || status;
          };

          return {
            id: question.id,
            questionTitle: question.questionText || 'Untitled Question',
            creator: creatorName,
            variants: question.variants?.length || 0, // Assuming variants array exists
            status: formatStatus(question.status),
            submittedOn: formatDate(question.updatedAt || question.createdAt),
            rejectionReason: rejectionReason || (question.status === 'rejected' ? 'N/A' : ''), // Show rejection reason or N/A for rejected, empty for pending
            actionType: 'review'
          };
        });

        setSubmissions(transformedData);
        setTotal(transformedData.length);
      } catch (error) {
        console.error('Error fetching creator submissions:', error);
        setSubmissions([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorSubmissions();
  }, [currentPage, search, subject, topic, subtopic]);

  // Handler for review action
  const handleReview = (item) => {
    console.log('Review item:', item);
    // Add your review logic here
  };

  // Handler for view action (if needed)
  const handleView = (item) => {
    console.log('View item:', item);
  };

  // Handler for edit action (if needed)
  const handleEdit = (item) => {
    console.log('Edit item:', item);
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
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-oxford-blue font-roboto text-lg">Loading...</div>
        </div>
      ) : (
        <Table
          items={submissions}
          columns={createSubmissionColumns}
          page={currentPage}
          pageSize={10}
          total={total}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onCustomAction={handleReview}
          emptyMessage={t("processor.creatorSubmission.emptyMessage")}
        />
      )}
      </div>
    </div>
  );
};

export default CreaterSubmission;
