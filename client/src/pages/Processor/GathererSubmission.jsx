
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useCallback } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";


const GathererSubmission = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gathererSubmissionData, setGathererSubmissionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);

  const gathererSubmissionColumns = [
    { key: 'questionTitle', label: t("processor.gathererSubmission.table.question") },
    { key: 'gatherer', label: t("processor.gathererSubmission.table.gatherer") },
    { key: 'uploadOn', label: t("processor.gathererSubmission.table.uploadOn") },
    { key: 'status', label: t("processor.gathererSubmission.table.status") },
    { key: 'actions', label: t("processor.gathererSubmission.table.actions") }
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
      // Format as "MMM DD, YYYY" or similar
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
      'pending_processor': 'Pending',
      'pending_creator': 'Pending',
      'pending_explainer': 'Pending',
      'approved': 'Accepted',
      'accepted': 'Accepted',
      'rejected': 'Reject',
      'reject': 'Reject',
      'fix_request': 'Fix Request',
      'fix_requested': 'Fix Request',
      'revision': 'Fix Request',
      'completed': 'Accepted'
    };
    return statusMap[status?.toLowerCase()] || status || 'Pending';
  };

  // Transform API data to table format
  const transformQuestionData = (questions) => {
    return questions.map((question) => ({
      id: question.id,
      questionTitle: question.questionText || "—",
      gatherer: question.createdBy?.name || "—",
      uploadOn: formatDate(question.createdAt),
      status: mapStatus(question.status),
      actionType: 'view',
      originalData: question // Keep original data for navigation
    }));
  };

  // Fetch gatherer submissions
  const fetchGathererSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Map subtopic (status filter) to API status
      // Note: ProcessorFilter currently uses hardcoded options, so we check for common status strings
      if (subtopic) {
        const statusFilterMap = {
          'Pending': 'pending_processor',
          'Accepted': 'approved',
          'Reject': 'rejected',
          'Fix Request': 'fix_request',
          'pending_processor': 'pending_processor',
          'approved': 'approved',
          'rejected': 'rejected',
          'fix_request': 'fix_request'
        };
        
        const mappedStatus = statusFilterMap[subtopic];
        if (mappedStatus) {
          params.status = mappedStatus;
        }
      }

      const response = await questionsAPI.getProcessorQuestions(params);
      
      if (response.success && response.data?.questions) {
        let questions = response.data.questions;

        // Filter by search term
        if (search) {
          const searchLower = search.toLowerCase();
          questions = questions.filter(q => 
            q.questionText?.toLowerCase().includes(searchLower) ||
            q.createdBy?.name?.toLowerCase().includes(searchLower)
          );
        }

        // Filter by subject
        if (subject) {
          questions = questions.filter(q => 
            q.subject?.name === subject || 
            q.subject?.id === subject ||
            (q.subject && subject.includes(q.subject.name))
          );
        }

        const transformedData = transformQuestionData(questions);
        setGathererSubmissionData(transformedData);
        setTotal(transformedData.length);
      } else {
        setGathererSubmissionData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching gatherer submissions:', error);
      setGathererSubmissionData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, subject, subtopic]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, subject, subtopic]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchGathererSubmissions();
  }, [fetchGathererSubmissions]);

  // Handler for view action
  const handleView = (item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}`);
    }
  };

  // Handler for edit action
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
              {t("processor.gathererSubmission.title")}
            </h1>
          </div>
            <OutlineButton text={t("processor.gathererSubmission.back")} className="py-[10px] px-5" onClick={handleCancel}/>
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
        <div className="flex items-center justify-center py-20">
          <div className="text-oxford-blue text-lg font-roboto">
            {t("processor.gathererSubmission.loading") || "Loading..."}
          </div>
        </div>
      ) : (
        <Table
          items={gathererSubmissionData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          columns={gathererSubmissionColumns}
          page={currentPage}
          pageSize={pageSize}
          total={total}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          emptyMessage={t("processor.gathererSubmission.emptyMessage")}
        />
      )}
      </div>
    </div>
  );
};

export default GathererSubmission;
