
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useCallback } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import subjectsAPI from "../../api/subjects";
import Loader from "../../components/common/Loader";


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
  const [subjects, setSubjects] = useState([]);

  const gathererSubmissionColumns = [
    { key: 'questionTitle', label: t("processor.gathererSubmission.table.question") },
    { key: 'subject', label: t("processor.gathererSubmission.table.subject") },
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
      'pending_creator': 'Approved', // Approved and moved to creator
      'pending_explainer': 'Approved', // Approved and moved to explainer
      'approved': 'Approved',
      'accepted': 'Approved',
      'rejected': 'Reject',
      'reject': 'Reject',
      'fix_request': 'Fix Request',
      'fix_requested': 'Fix Request',
      'revision': 'Fix Request',
      'completed': 'Approved',
      'flagged': 'Flag',
      'flag': 'Flag'
    };
    return statusMap[status?.toLowerCase()] || status || 'Pending';
  };

  // Transform API data to table format
  const transformQuestionData = (questions) => {
    return questions.map((question) => ({
      id: question.id,
      questionTitle: question.questionText || "—",
      subject: question.subject?.name || "—",
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
      
      // Fetch all questions by getting multiple statuses
      // When no filter is selected, fetch all relevant statuses
      let allQuestions = [];
      
      if (subtopic && subtopic !== t("filter.status")) {
        // Filter by specific status
        const statusFilterMap = {
          'Pending': ['pending_processor'],
          'Approved': ['approved', 'pending_creator', 'pending_explainer', 'completed'],
          'Reject': ['rejected'],
          'Flag': ['flagged'],
          'Fix Request': ['fix_request', 'fix_requested', 'revision'],
          'pending_processor': ['pending_processor'],
          'approved': ['approved', 'pending_creator', 'pending_explainer', 'completed'],
          'rejected': ['rejected'],
          'flagged': ['flagged'],
          'fix_request': ['fix_request', 'fix_requested', 'revision']
        };
        
        const statusesToFetch = statusFilterMap[subtopic] || [subtopic.toLowerCase()];
        
        // Fetch questions for each status, filtered by gatherer role
        const promises = statusesToFetch.map(status => 
          questionsAPI.getProcessorQuestions({ status, submittedBy: 'gatherer' })
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
      } else {
        // No status filter - fetch all relevant statuses for gatherer submissions
        const allStatuses = [
          'pending_processor',
          'pending_creator',
          'pending_explainer',
          'approved',
          'rejected',
          'flagged',
          'fix_request',
          'fix_requested',
          'revision',
          'completed'
        ];
        
        const promises = allStatuses.map(status => 
          questionsAPI.getProcessorQuestions({ status, submittedBy: 'gatherer' })
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
      }
      
      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        allQuestions = allQuestions.filter(q => 
          q.questionText?.toLowerCase().includes(searchLower) ||
          q.createdBy?.name?.toLowerCase().includes(searchLower)
        );
      }

      // Filter by subject
      if (subject && subject !== t("filter.subject")) {
        allQuestions = allQuestions.filter(q => 
          q.subject?.name === subject || 
          q.subject?.id === subject
        );
      }

      const transformedData = transformQuestionData(allQuestions);
      setGathererSubmissionData(transformedData);
      setTotal(transformedData.length);
    } catch (error) {
      console.error('Error fetching gatherer submissions:', error);
      setGathererSubmissionData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, subject, subtopic, t]);

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectsAPI.getAllSubjects();
        let subjectsList = [];
        
        // Handle different response structures
        if (response.success) {
          if (response.data?.subjects && Array.isArray(response.data.subjects)) {
            subjectsList = response.data.subjects;
          } else if (Array.isArray(response.data)) {
            subjectsList = response.data;
          }
        }
        
        const subjectNames = [t("filter.subject"), ...subjectsList.map(s => s.name || s)];
        setSubjects(subjectNames);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        // Fallback to placeholder only
        setSubjects([t("filter.subject")]);
      }
    };
    fetchSubjects();
  }, [t]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, subject, subtopic]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchGathererSubmissions();
  }, [fetchGathererSubmissions]);

  // Refresh data when component becomes visible (e.g., returning from view page)
  useEffect(() => {
    const handleFocus = () => {
      fetchGathererSubmissions();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchGathererSubmissions]);

  // Status options for filter
  const statusOptions = [
    t("filter.status"),
    "Pending",
    "Approved",
    "Flag",
    "Reject"
  ];

  // Handler for view action
  const handleView = (item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=gatherer-submission`);
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
        subjectOptions={subjects.length > 0 ? subjects : undefined}
        statusOptions={statusOptions}
      />

      {loading ? (
        <Loader 
          size="lg" 
          color="oxford-blue" 
          text={t("processor.gathererSubmission.loading") || "Loading..."}
          className="py-20"
        />
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
