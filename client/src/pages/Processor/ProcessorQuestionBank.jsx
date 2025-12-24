import { useLanguage } from "../../context/LanguageContext";
import { PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [stats, setStats] = useState([
    { label: t("processor.questionBank.stats.newQuestionGatherer"), value: 0, color: "blue" },
    { label: t("processor.questionBank.stats.explanationPending"), value: 0, color: "blue" },
    { label: t("processor.questionBank.stats.finalApprovalToday"), value: 0, color: "red" },
  ]);
  const [activityData, setActivityData] = useState([]);
  const [subjects, setSubjects] = useState([t("filter.subject")]);
  const navigate = useNavigate();

  const topicOptions = [
    t("filter.status"), 
    "Pending Review", 
    "Pending Creator", 
    "Pending Explainer", 
    "Completed", 
    "Rejected",
    "Flagged"
  ];
  
  // Note: topicLabel is used for Status dropdown, subjectLabel for Subject dropdown

  // Define columns for the submissions table
  const submissionColumns = [
    { key: "questionTitle", label: t("processor.questionBank.table.question") },
    { key: "submittedBy", label: t("processor.questionBank.table.submittedBy") },
    { key: "source", label: t("processor.questionBank.table.source") },
    { key: "dateSubmitted", label: t("processor.questionBank.table.dateSubmitted") },
    { key: "subject", label: t("processor.questionBank.table.subject") },
    { key: "status", label: t("processor.questionBank.table.status") },
    { key: "actions", label: t("processor.questionBank.table.actions") },
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

  // Fetch all submissions from gatherer, creator, and explainer
  const fetchAllSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch questions from all relevant statuses
      const statusesToFetch = [
        'pending_processor', // New gatherer submissions, creator submissions, explainer submissions
        'pending_creator',
        'pending_explainer',
        'pending_gatherer',
        'completed',
        'rejected'
      ];

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
      allQuestions = uniqueQuestions;

      // Fetch individual question details for better information
      const questionsWithDetails = await Promise.all(
        allQuestions.slice(0, 50).map(async (question) => {
          try {
            const detailResponse = await questionsAPI.getProcessorQuestionById(question.id);
            if (detailResponse.success && detailResponse.data) {
              return {
                ...question,
                ...detailResponse.data.question,
              };
            }
            return question;
          } catch (error) {
            console.error(`Error fetching details for question ${question.id}:`, error);
            return question;
          }
        })
      );

      // Transform to table format
      const transformedData = questionsWithDetails.map((question) => {
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

      setAllSubmissions(transformedData);

      // Calculate stats
      const newGathererQuestions = allQuestions.filter(q => 
        q.status === 'pending_processor' && 
        !q.approvedBy && 
        !q.explanation &&
        (!q.history || !q.history.some(h => h.role === 'creator' || h.role === 'explainer'))
      ).length;

      const explanationPending = allQuestions.filter(q => 
        q.status === 'pending_explainer'
      ).length;

      // Count completed today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const completedToday = allQuestions.filter(q => {
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

      // Build activity data from recent history
      const recentActivities = [];
      allQuestions.slice(0, 10).forEach(q => {
        if (q.history && Array.isArray(q.history)) {
          q.history.slice(0, 1).forEach(h => {
            if (h.action === 'approved') {
              recentActivities.push({
                icon: "approve",
                title: `Question ${q.id?.substring(0, 8)} was approved.`,
                timestamp: formatDate(h.timestamp || q.updatedAt),
                variant: "approved",
              });
            } else if (h.action === 'rejected' || h.action === 'reject') {
              recentActivities.push({
                icon: "reject",
                title: `Question ${q.id?.substring(0, 8)} was rejected.`,
                timestamp: formatDate(h.timestamp || q.updatedAt),
                variant: "default",
              });
            } else if (h.action === 'created') {
              recentActivities.push({
                icon: "submit",
                title: `New question ${q.id?.substring(0, 8)} submitted.`,
                timestamp: formatDate(h.timestamp || q.createdAt),
                variant: "default",
              });
            }
          });
        }
      });

      // Sort activities by timestamp and take most recent 5
      recentActivities.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
      });

      setActivityData(recentActivities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching all submissions:', error);
      setAllSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

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

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchAllSubmissions();
  }, [fetchAllSubmissions]);

  // Apply filters
  const filteredSubmissions = allSubmissions.filter(item => {
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      if (!item.questionTitle?.toLowerCase().includes(searchLower) &&
          !item.submittedBy?.toLowerCase().includes(searchLower) &&
          !item.subject?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Filter by subject
    if (subject && subject !== t("filter.subject")) {
      if (item.subject !== subject) {
        return false;
      }
    }

    // Filter by status (topic is used for status filter)
    if (topic && topic !== t("filter.status")) {
      if (item.status !== topic) {
        return false;
      }
    }

    return true;
  });

  // Handler for review/view action
  const handleReview = (item) => {
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
  };

  // Handler for view action
  const handleView = (item) => {
    handleReview(item);
  };

  // Handler for edit action
  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  const workflowSteps = [
    t("gatherer.questionBank.workflowSteps.gatherer"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.creator"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.explainer"),
  ];

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
          onSearchChange={setSearch}
          onSubjectChange={setSubject}
          onTopicChange={setTopic}
          subjectOptions={subjects.length > 0 ? subjects : [t("filter.subject")]}
          topicOptions={topicOptions}
          topicLabel="All Status"
          subjectLabel="All Subject"
          searchPlaceholder={t("processor.questionBank.searchPlaceholder")}
        />
        <div>
          <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo mb-5">
            {t("processor.questionBank.allSubmissions")}
          </div>
          {loading ? (
            <Loader 
              size="lg" 
              color="oxford-blue" 
              text={t("processor.questionBank.loading") || "Loading questions..."}
              className="py-10"
            />
          ) : (
            <Table
              items={filteredSubmissions.slice((currentPage - 1) * 10, currentPage * 10)}
              columns={submissionColumns}
              page={currentPage}
              pageSize={10}
              total={filteredSubmissions.length}
              onPageChange={setCurrentPage}
              onView={handleView}
              onEdit={handleEdit}
              onCustomAction={handleReview}
              emptyMessage={t("processor.questionBank.emptyMessage")}
            />
          )}
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
