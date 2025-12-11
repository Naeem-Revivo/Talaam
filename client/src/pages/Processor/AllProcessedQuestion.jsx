
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useMemo } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import Loader from "../../components/common/Loader";

const AllProcessedQuestion = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processedData, setProcessedData] = useState([]);
  const [total, setTotal] = useState(0);

  const processedColumns = useMemo(() => [
    { key: 'questionTitle', label: t("processor.allProcessedQuestions.table.questionTitle") },
    { key: 'status', label: t("processor.allProcessedQuestions.table.status") },
    { key: 'reviewedOn', label: t("processor.allProcessedQuestions.table.reviewedOn") },
    { key: 'decision', label: t("processor.allProcessedQuestions.table.decision") },
    { key: 'actions', label: t("processor.allProcessedQuestions.table.actions") }
  ], [t]);

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

  // Map API status to display status
  const mapStatus = (status) => {
    const statusMap = {
      'completed': 'Accepted',
      'rejected': 'Rejected',
      'pending_creator': 'Accepted',
      'pending_explainer': 'Accepted',
      'approved': 'Accepted',
      'accepted': 'Accepted'
    };
    return statusMap[status?.toLowerCase()] || status || '—';
  };

  // Map decision based on status and history
  const mapDecision = (question) => {
    const status = question.status?.toLowerCase();
    
    if (status === 'rejected') {
      return question.rejectionReason ? 'Reason Added' : 'Rejected';
    }
    
    if (status === 'completed') {
      return 'Approved';
    }
    
    // Check history to determine decision
    if (question.history && Array.isArray(question.history)) {
      const lastAction = question.history[0];
      if (lastAction) {
        if (lastAction.action === 'approved' && lastAction.role === 'processor') {
          if (status === 'pending_creator') {
            return 'Sent to Creator';
          } else if (status === 'pending_explainer') {
            return 'Sent to Explainer';
          }
        }
      }
    }
    
    // Default based on status
    if (status === 'pending_creator') {
      return 'Sent to Creator';
    } else if (status === 'pending_explainer') {
      return 'Sent to Explainer';
    }
    
    return 'Approved';
  };

  // Fetch processed questions (completed and rejected)
  useEffect(() => {
    const fetchProcessedQuestions = async () => {
      try {
        setLoading(true);
        
        // Fetch questions with completed and rejected statuses
        const statusesToFetch = ['completed', 'rejected'];
        
        let allQuestions = [];

        // Fetch questions for each status
        const promises = statusesToFetch.map(status => 
          questionsAPI.getProcessorQuestions({ status })
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
        
        // Apply client-side filters
        let filteredQuestions = uniqueQuestions;
        
        // Filter by search (question text)
        if (search.trim()) {
          const searchLower = search.toLowerCase();
          filteredQuestions = filteredQuestions.filter(q => 
            q.questionText?.toLowerCase().includes(searchLower)
          );
        }
        
        // Filter by subject
        if (subject) {
          filteredQuestions = filteredQuestions.filter(q => 
            q.subject?.id === subject || q.subjectId === subject
          );
        }
        
        // Filter by topic
        if (topic) {
          filteredQuestions = filteredQuestions.filter(q => 
            q.topic?.id === topic || q.topicId === topic
          );
        }
        
        // Filter by subtopic
        if (subtopic) {
          filteredQuestions = filteredQuestions.filter(q => 
            q.subtopic?.id === subtopic || q.subtopicId === subtopic
          );
        }
        
        // Transform API data to match table structure
        const transformedData = filteredQuestions.map((question) => {
          // Get the date when question was last reviewed (approved or rejected)
          // Use updatedAt as it reflects the last time the question was modified
          const reviewedDate = question.updatedAt || question.createdAt;
          
          return {
            id: question.id,
            questionTitle: question.questionText?.substring(0, 50) + (question.questionText?.length > 50 ? "..." : "") || "—",
            status: mapStatus(question.status),
            reviewedOn: formatDate(reviewedDate),
            decision: mapDecision(question),
            actionType: 'view',
            originalData: question // Store full question data for navigation
          };
        });

        // Sort by reviewed date (most recent first)
        transformedData.sort((a, b) => {
          const dateA = new Date(a.originalData.updatedAt || a.originalData.createdAt);
          const dateB = new Date(b.originalData.updatedAt || b.originalData.createdAt);
          return dateB - dateA;
        });

        setProcessedData(transformedData);
        setTotal(transformedData.length);
      } catch (error) {
        console.error('Error fetching processed questions:', error);
        setProcessedData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessedQuestions();
  }, [search, subject, topic, subtopic, currentPage]);

  // Handler for view action
  const handleView = (item) => {
    if (item?.id || item?.originalData?.id) {
      const questionId = item.id || item.originalData.id;
      navigate(`/processor/Processed-ViewQuestion?questionId=${questionId}&source=all-processed-questions`);
    }
  };

  // Handler for edit action (not used for processed questions)
  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  // Handler for custom action (not used)
  const handleCustomAction = (item) => {
    console.log('Custom action:', item);
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
              {t("processor.allProcessedQuestions.title")}
            </h1>
          </div>
            <OutlineButton text={t("processor.allProcessedQuestions.back")} className="py-[10px] px-5" onClick={handleCancel}/>
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
            items={processedData}
            columns={processedColumns}
            page={currentPage}
            pageSize={10}
            total={total}
            onPageChange={setCurrentPage}
            onView={handleView}
            onEdit={handleEdit}
            onCustomAction={handleCustomAction}
            emptyMessage={t("processor.allProcessedQuestions.emptyMessage")}
          />
        )}
      </div>
    </div>
  );
};

export default AllProcessedQuestion;
