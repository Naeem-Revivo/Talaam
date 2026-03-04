import { useLanguage } from "../../context/LanguageContext";
import { PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import WorkflowProgress from "../../components/gatherer/WorkflowProgress";
import RecentActivity from "../../components/gatherer/RecentActiveity";
import SearchFilter from "../../components/common/SearchFilter";
import questionsAPI from "../../api/questions";
import subjectsAPI from "../../api/subjects";
import Loader from "../../components/common/Loader";

const ProcessorQuestionBank = () => {
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [stats, setStats] = useState([
    { label: t("processor.questionBank.stats.newQuestionGatherer"), value: 0, color: "blue" },
    { label: t("processor.questionBank.stats.explanationPending"), value: 0, color: "blue" },
    { label: t("processor.questionBank.stats.finalApprovalToday"), value: 0, color: "red" },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [subjects, setSubjects] = useState([t("filter.subject")]);
  const navigate = useNavigate();

  const topicOptions = [
    t("filter.status"), 
    "Pending Review", 
    "Pending Creator", 
    "Pending Explainer", 
    "Approved",
    "Completed", 
    "Rejected",
    "Flagged"
  ];
  
  // Note: topicLabel is used for Status dropdown, subjectLabel for Subject dropdown

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

  // Format status for display
  const formatStatus = (status, isFlagged) => {
    if (isFlagged) return "Flagged";
    const statusMap = {
      'pending_processor': 'Pending Review',
      'pending_creator': 'Pending Creator',
      'pending_explainer': 'Pending Explainer',
      'pending_gatherer': 'Pending Gatherer',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };
    return statusMap[status] || status;
  };

  // Determine source type (gatherer, creator, or explainer)
  const getSourceType = (question) => {
    // Check history to determine source
    if (question.history && Array.isArray(question.history)) {
      const lastAction = question.history[0]; // Most recent action
      if (lastAction?.role === 'explainer') {
        return 'Explainer';
      } else if (lastAction?.role === 'creator') {
        return 'Creator';
      } else if (lastAction?.role === 'gatherer') {
        return 'Gatherer';
      }
    }
    
    // Fallback: check if has explanation (explainer submission)
    if (question.explanation && question.explanation.trim() !== '') {
      return 'Explainer';
    }
    
    // Fallback: check if has approvedBy (creator submission)
    if (question.approvedBy && question.status === 'pending_processor') {
      return 'Creator';
    }
    
    // Default to gatherer for new questions
    return 'Gatherer';
  };

  // Map display status to API status
  const mapStatusToAPI = useCallback((displayStatus) => {
    if (!displayStatus || displayStatus === t("filter.status")) return null;
    const statusMap = {
      "Pending Review": "pending_processor",
      "Pending Creator": "pending_creator",
      "Pending Explainer": "pending_explainer",
      "Approved": "approved", // Use "approved" as base, will filter for all approved statuses client-side
      "Completed": "completed",
      "Rejected": "rejected",
      "Flagged": "flagged",
    };
    return statusMap[displayStatus] || null;
  }, [t]);

  // Check if a status is considered "Approved"
  const isApprovedStatus = useCallback((status) => {
    const approvedStatuses = ['pending_creator', 'pending_explainer', 'completed', 'approved', 'accepted'];
    return approvedStatuses.includes(status?.toLowerCase());
  }, []);

  // Fetch stats separately - only once on mount, not affected by status filter
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        // Fetch stats without any status filter - get a sample to calculate stats
        const response = await questionsAPI.getProcessorQuestions({});
        
        if (response.success && response.data) {
          const questions = response.data.questions || [];
          const pagination = response.data.pagination || {};
          
          // Calculate stats from response
          const newGathererQuestions = questions.filter(q => 
            q.status === 'pending_processor' && 
            !q.approvedBy && 
            !q.explanation &&
            (!q.history || !q.history.some(h => h.role === 'creator' || h.role === 'explainer'))
          ).length;

          const explanationPending = questions.filter(q => 
            q.status === 'pending_explainer'
          ).length;

          // Count completed today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const completedToday = questions.filter(q => {
            if (q.status !== 'completed') return false;
            const completedDate = new Date(q.updatedAt || q.createdAt);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate.getTime() === today.getTime();
          }).length;

          setStats([
            { label: t("processor.questionBank.stats.newQuestionGatherer"), value: newGathererQuestions, color: "blue" },
            { label: t("processor.questionBank.stats.explanationPending"), value: explanationPending, color: "blue" },
            { label: t("processor.questionBank.stats.finalApprovalToday"), value: completedToday, color: "red" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [t]); // Only fetch stats once on mount

  // Fetch questions from API - affected by status filter, page, search, and subject
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        
        // Map topic (status filter) to API status
        const apiStatus = mapStatusToAPI(topic);
        const isApprovedFilter = topic === "Approved";
        
        // Build base params
        const baseParams = {
          limit: 10,
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
          // Fetch all pages to get complete data for client-side filtering
          const fetchLimit = 100; // Fetch more items per page
          let page = 1;
          let hasMorePages = true;
          
          while (hasMorePages) {
            const params = {
              ...baseParams,
              page: page,
              limit: fetchLimit,
            };
            
            const response = await questionsAPI.getProcessorQuestions(params);
            
            if (!response.success || !response.data) {
              hasMorePages = false;
              break;
            }
            
            const questions = response.data.questions || [];
            const pagination = response.data.pagination || {};
            
            // Filter for approved statuses
            const approvedQuestions = questions.filter(q => isApprovedStatus(q.status));
            allQuestions.push(...approvedQuestions);
            
            // Check if there are more pages
            hasMorePages = pagination.hasNextPage === true && questions.length > 0;
            page++;
            
            // Safety limit to prevent infinite loops
            if (page > 100) {
              hasMorePages = false;
            }
          }
          
          totalCount = allQuestions.length;
        } else {
          // For other statuses, use normal backend pagination
          const params = {
            ...baseParams,
            page: currentPage,
            limit: 10,
          };
          
          if (apiStatus === 'flagged') {
            params.flagType = 'flagged';
          } else if (apiStatus) {
            params.status = apiStatus;
          }
          
          const response = await questionsAPI.getProcessorQuestions(params);

          if (response.success && response.data) {
            allQuestions = response.data.questions || [];
            const pagination = response.data.pagination || {};
            totalCount = pagination.totalItems || pagination.total || 0;
          } else {
            allQuestions = [];
            totalCount = 0;
          }
        }
        
        // Transform to table format
        const transformedData = allQuestions.map((question) => {
          const sourceType = getSourceType(question);
          const submittedByName = sourceType === 'Gatherer' 
            ? (question.createdBy?.name || question.createdBy?.username || 'Unknown')
            : sourceType === 'Creator'
            ? (question.lastModifiedBy?.name || question.lastModifiedBy?.username || 'Unknown')
            : sourceType === 'Explainer'
            ? (question.lastModifiedBy?.name || question.lastModifiedBy?.username || 'Unknown')
            : 'Unknown';

          return {
            id: question.id,
            questionTitle: question.questionText?.substring(0, 60) + (question.questionText?.length > 60 ? "..." : "") || "—",
            submittedBy: submittedByName,
            source: sourceType,
            dateSubmitted: formatDate(question.updatedAt || question.createdAt),
            subject: question.subject?.name || "—",
            status: formatStatus(question.status, question.isFlagged),
            actionType: "view",
            originalData: question
          };
        });

        // For "Approved" filter, apply client-side pagination
        let paginatedData = transformedData;
        if (isApprovedFilter) {
          const startIndex = (currentPage - 1) * 10;
          const endIndex = startIndex + 10;
          paginatedData = transformedData.slice(startIndex, endIndex);
          // Use the filtered count for total
          totalCount = transformedData.length;
        }

        setAllSubmissions(paginatedData);
        setTotalQuestions(totalCount);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setAllSubmissions([]);
        setTotalQuestions(0);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage, topic, search, subject, mapStatusToAPI, isApprovedStatus, t]);

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectsAPI.getAllSubjects();
        let subjectsList = [];
        
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
        setSubjects([t("filter.subject")]);
      }
    };
    fetchSubjects();
  }, [t]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [topic, search, subject]);

  // Memoize columns to prevent rerenders
  const submissionColumns = useMemo(() => [
    { key: "questionTitle", label: t("processor.questionBank.table.question") },
    { key: "submittedBy", label: t("processor.questionBank.table.submittedBy") },
    { key: "source", label: t("processor.questionBank.table.source") },
    { key: "dateSubmitted", label: t("processor.questionBank.table.dateSubmitted") },
    { key: "subject", label: t("processor.questionBank.table.subject") },
    { key: "status", label: t("processor.questionBank.table.status") },
    { key: "actions", label: t("processor.questionBank.table.actions") },
  ], [t]);

  // Memoize workflow steps
  const workflowSteps = useMemo(() => [
    t("gatherer.questionBank.workflowSteps.gatherer"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.creator"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.explainer"),
  ], [t]);

  // Memoize topic options
  const topicOptionsMemo = useMemo(() => [
    t("filter.status"), 
    "Pending Review", 
    "Pending Creator", 
    "Pending Explainer", 
    "Completed", 
    "Rejected",
    "Flagged"
  ], [t]);

  // Memoize loading component for table
  const tableLoadingComponent = useMemo(() => (
    <Loader 
      size="lg" 
      color="oxford-orange" 
      text={t("processor.questionBank.loading") || "Loading questions..."}
      className="py-10"
    />
  ), [t]);

  // Handler for review/view action
  const handleReview = useCallback((item) => {
    if (item.originalData?.id) {
      // Determine source based on question data
      const sourceType = getSourceType(item.originalData);
      let source = 'gatherer-submission';
      
      if (sourceType === 'Creator') {
        source = 'creator-submission';
      } else if (sourceType === 'Explainer') {
        source = 'explainer-submission';
      }
      
      navigate(`/processor/Processed-ViewQuestion?questionId=${item.originalData.id}&source=${source}`);
    }
  }, [navigate]);

  // Handler for view action
  const handleView = useCallback((item) => {
    handleReview(item);
  }, [handleReview]);

  // Handler for edit action
  const handleEdit = useCallback((item) => {
    console.log("Edit item:", item);
  }, []);

  // Handler for status filter change
  const handleStatusFilterChange = useCallback((value) => {
    setTopic(value);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  // Handler for subject filter change
  const handleSubjectFilterChange = useCallback((value) => {
    setSubject(value);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  // Handler for search change
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  const handleProcessedQuestion = () => {
    navigate("/processor/question-bank/Processed-Question");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("processor.questionBank.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("processor.questionBank.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <PrimaryButton
              text={t("processor.questionBank.allProcessedQuestions")}
              className="py-[10px] px-5"
              onClick={handleProcessedQuestion}
            />
          </div>
        </header>

        <StatsCards stats={stats} />

        <SearchFilter
          searchValue={search}
          subjectValue={subject}
          topicValue={topic}
          onSearchChange={handleSearchChange}
          onSubjectChange={handleSubjectFilterChange}
          onTopicChange={handleStatusFilterChange}
          subjectOptions={subjects.length > 0 ? subjects : [t("filter.subject")]}
          topicOptions={topicOptionsMemo}
          topicLabel="All Status"
          subjectLabel="All Subject"
          searchPlaceholder={t("processor.questionBank.searchPlaceholder")}
        />
        <div>
          <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo mb-5">
            {t("processor.questionBank.allSubmissions")}
          </div>
          <Table
            items={allSubmissions}
            columns={submissionColumns}
            page={currentPage}
            pageSize={10}
            total={totalQuestions}
            onPageChange={setCurrentPage}
            onView={handleView}
            onEdit={handleEdit}
            onCustomAction={handleReview}
            emptyMessage={t("processor.questionBank.emptyMessage")}
            loading={loading}
            loadingComponent={tableLoadingComponent}
          />
        </div>

        <div>
          <h2 className="text-[24px] leading-[32px] font-bold font-archivo text-blue-dark mb-5">
            {t("processor.questionBank.workflowProgress")}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Feedback Card and Workflow */}
            <div className="lg:col-span-2 space-y-6">
              <WorkflowProgress steps={workflowSteps} currentStep={2} />
            </div>

            {/* Right Column - Recent Activity */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
                <h2 className="text-[20px] leading-[28px] font-semibold font-archivo text-blue-dark mb-4">
                  {t("processor.questionBank.recentActivity")}
                </h2>

                <div className="space-y-3">
                  {activityData.map((activity, index) => (
                    <RecentActivity
                      key={index}
                      icon={activity.icon}
                      title={activity.title}
                      subtitle={activity.subtitle}
                      timestamp={activity.timestamp}
                      variant={activity.variant}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessorQuestionBank;
