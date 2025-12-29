
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [loading, setLoading] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [pageSize] = useState(10);
  const [subjects, setSubjects] = useState([]);

  // Memoize columns to prevent rerenders
  const gathererSubmissionColumns = useMemo(() => [
    { key: 'questionTitle', label: t("processor.gathererSubmission.table.question") },
    { key: 'subject', label: t("processor.gathererSubmission.table.subject") },
    { key: 'gatherer', label: t("processor.gathererSubmission.table.gatherer") },
    { key: 'uploadOn', label: t("processor.gathererSubmission.table.uploadOn") },
    { key: 'status', label: t("processor.gathererSubmission.table.status") },
    { key: 'actions', label: t("processor.gathererSubmission.table.actions") }
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
      // Format as "MMM DD, YYYY" or similar
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  // Map API status to display status
  const mapStatus = useCallback((status, isFlagged) => {
    if (isFlagged) return 'Flag';
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
  }, []);

  // Map display status to API status
  const mapStatusToAPI = useCallback((displayStatus) => {
    if (!displayStatus || displayStatus === t("filter.status")) return null;
    const statusMap = {
      "Pending": "pending_processor",
      "Approved": "approved", // Use "approved" as base, will filter for all approved statuses client-side
      "Reject": "rejected",
      "Flag": "flagged",
      "Flagged": "flagged",
    };
    return statusMap[displayStatus] || null;
  }, [t]);

  // Check if a status is considered "Approved"
  const isApprovedStatus = useCallback((status) => {
    const approvedStatuses = ['pending_creator', 'pending_explainer', 'completed', 'approved', 'accepted'];
    return approvedStatuses.includes(status?.toLowerCase());
  }, []);

  // Transform API data to table format
  const transformQuestionData = useCallback((questions) => {
    return questions.map((question) => ({
      id: question.id,
      questionTitle: question.questionText || "—",
      subject: question.subject?.name || "—",
      gatherer: question.createdBy?.name || "—",
      uploadOn: formatDate(question.createdAt),
      status: mapStatus(question.status, question.isFlagged),
      actionType: 'view',
      originalData: question // Keep original data for navigation
    }));
  }, []);

  // Fetch gatherer submissions with backend pagination
  const fetchGathererSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Map status filter to API status
      const apiStatus = mapStatusToAPI(subtopic);
      const isApprovedFilter = subtopic === "Approved";
      
      // Build base params
      const baseParams = {
        submittedBy: 'gatherer',
      };
      
      // Add search and subject filters if provided
      if (search && search.trim()) {
        baseParams.search = search.trim();
      }
      if (subject && subject !== t("filter.subject")) {
        baseParams.subject = subject;
      }
      
      let allQuestions = [];
      let totalCount = 0;
      
      // If "Approved" filter is selected, fetch ALL pages to get all approved questions
      // Then filter and paginate client-side
      if (isApprovedFilter) {
        const fetchLimit = 100;
        let page = 1;
        let hasMorePages = true;
        
        while (hasMorePages) {
          const params = {
            ...baseParams,
            page: page,
            limit: fetchLimit,
          };
          
          const response = await questionsAPI.getProcessorQuestions(params);
          if (response.success && response.data) {
            const questions = response.data.questions || [];
            const pagination = response.data.pagination || {};
            
            // IMPORTANT: Client-side filter to exclude superadmin-created questions
            let filteredQuestions = questions.filter(q => {
              const isSuperadminCreated = q.createdBy?.adminRole === 'superadmin' || 
                                          (q.history?.find(h => h.action === 'created')?.performedBy?.adminRole === 'superadmin');
              return !isSuperadminCreated;
            });
            
            // Filter for approved statuses
            const approvedQuestions = filteredQuestions.filter(q => isApprovedStatus(q.status));
            allQuestions.push(...approvedQuestions);
            
            hasMorePages = pagination.hasNextPage === true && questions.length > 0;
            page++;
            
            // Safety limit to prevent infinite loops
            if (page > 100) hasMorePages = false;
          } else {
            hasMorePages = false;
          }
        }
        
        totalCount = allQuestions.length;
      } else {
        // For other statuses, use normal backend pagination
        const params = {
          ...baseParams,
          page: currentPage,
          limit: pageSize,
        };
        
        if (apiStatus === 'flagged') {
          // For flagged, use flagType parameter
          params.flagType = 'flagged';
        } else if (apiStatus) {
          // For specific status, use status filter
          params.status = apiStatus;
        }
        
        const response = await questionsAPI.getProcessorQuestions(params);

        if (response.success && response.data) {
          let questions = response.data.questions || [];
          const pagination = response.data.pagination || {};
          
          // IMPORTANT: Client-side filter to exclude superadmin-created questions
          // This is a backup in case backend filtering doesn't catch all cases
          questions = questions.filter(q => {
            const isSuperadminCreated = q.createdBy?.adminRole === 'superadmin' || 
                                        (q.history?.find(h => h.action === 'created')?.performedBy?.adminRole === 'superadmin');
            return !isSuperadminCreated;
          });

          allQuestions = questions;
          totalCount = pagination.totalItems || pagination.total || 0;
        } else {
          allQuestions = [];
          totalCount = 0;
        }
      }
      
      // Transform API data to table format
      const transformedData = transformQuestionData(allQuestions);
      
      // For "Approved" filter, apply client-side pagination
      let paginatedData = transformedData;
      if (isApprovedFilter) {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        paginatedData = transformedData.slice(startIndex, endIndex);
        // Use the filtered count for total
        totalCount = transformedData.length;
      }
      
      setGathererSubmissionData(paginatedData);
      setTotalQuestions(totalCount);
    } catch (error) {
      console.error('Error fetching gatherer submissions:', error);
      setGathererSubmissionData([]);
      setTotalQuestions(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, subtopic, search, subject, pageSize, mapStatusToAPI, transformQuestionData, isApprovedStatus, t]);

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

  // Memoize status options
  const statusOptions = useMemo(() => [
    t("filter.status"),
    "Pending",
    "Approved",
    "Flag",
    "Reject"
  ], [t]);

  // Memoize loading component for table
  const tableLoadingComponent = useMemo(() => (
    <Loader 
      size="lg" 
      color="oxford-blue" 
      text={t("processor.gathererSubmission.loading") || "Loading..."}
      className="py-10"
    />
  ), [t]);

  // Handler for view action
  const handleView = useCallback((item) => {
    if (item.originalData?.id) {
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=gatherer-submission`);
    }
  }, [navigate]);

  // Handler for edit action
  const handleEdit = useCallback((item) => {
    console.log('Edit item:', item);
  }, []);

  const handleCancel = useCallback(() => {
    navigate("/processor/question-bank");
  }, [navigate]);

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
        searchPlaceholder={t("processor.gathererSubmission.searchPlaceholder")}
      />

        <Table
          items={gathererSubmissionData}
          columns={gathererSubmissionColumns}
          page={currentPage}
          pageSize={pageSize}
          total={totalQuestions}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          emptyMessage={t("processor.gathererSubmission.emptyMessage")}
          loading={loading}
          loadingComponent={tableLoadingComponent}
        />
      </div>
    </div>
  );
};

export default GathererSubmission;
