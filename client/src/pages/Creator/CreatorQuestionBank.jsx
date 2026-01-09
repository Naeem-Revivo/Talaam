import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { Table } from "../../components/common/TableComponent";
import SearchFilter from "../../components/common/SearchFilter";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import WorkflowProgress from "../../components/gatherer/WorkflowProgress";
import RecentActivity from "../../components/gatherer/RecentActiveity";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import { showErrorToast } from "../../utils/toastConfig";
import Loader from "../../components/common/Loader";
import subjectsAPI from "../../api/subjects";

const CreatorQuestionBank = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [stats, setStats] = useState([
    { label: t("creator.questionBank.stats.questionsAssigned"), value: 0, color: "blue" },
    { label: t("creator.questionBank.stats.variantsPending"), value: 0, color: "blue" },
    { label: t("creator.questionBank.stats.completed"), value: 0, color: "red" },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedFlagReason, setSelectedFlagReason] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState("");


  // Memoize columns to prevent rerenders
  const QuestionsColumns = useMemo(() => [
    { key: 'questionTitle', label: t("creator.assignedQuestionPage.table.question") },
    { key: 'subject', label: t("creator.assignedQuestionPage.table.subject") },
    { key: 'processor', label: t("creator.assignedQuestionPage.table.processor") },
    { key: 'status', label: t("creator.assignedQuestionPage.table.status") },
    { key: 'indicators', label: t("creator.assignedQuestionPage.table.flagsIssues") },
    { key: 'updatedOn', label: t("creator.assignedQuestionPage.table.updatedOn") },
    { key: 'actions', label: t("creator.assignedQuestionPage.table.actions") }
  ], [t]);

  // Format date to relative time (Today, Yesterday, or date)
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const questionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (questionDate.getTime() === today.getTime()) {
      return "Today";
    } else if (questionDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }, []);

  // Format status to readable format
  const formatStatus = useCallback((status) => {
    if (!status) return "—";
    
    const statusMap = {
      'pending_processor': 'Pending',
      'pending_creator': 'Pending',
      'pending_explainer': 'Pending',
      'pending_gatherer': 'Pending',
      'completed': 'Approved',
      'rejected': 'Reject'
    };
    
    if (statusMap[status]) {
      return statusMap[status];
    }
    
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }, []);

  // Map display status to API status - backend handles all filtering
  const mapStatusToAPI = useCallback((displayStatus) => {
    if (!displayStatus || displayStatus === "All Status") return 'all';
    const statusMap = {
      "Approved": "pending_processor", // Show completed questions as approved
      "Pending": "pending_creator",
      "Reject": "rejected",
      "Flag": "flagged", // Backend handles flagged status
    };
    return statusMap[displayStatus] || 'all';
  }, []);

  // Check if a status is considered "Approved"
  const isApprovedStatus = useCallback((status) => {
    const approvedStatuses = ['pending_creator', 'pending_explainer', 'completed', 'approved', 'accepted'];
    return approvedStatuses.includes(status?.toLowerCase());
  }, []);

  // Transform API response to table format - only shows variants that are flagged or rejected
  const transformQuestionData = useCallback((questions) => {
    const questionIdStr = (id) => String(id || '');
    const result = [];
    
    // Process questions - only include variants if they are flagged OR rejected
    questions.forEach((question) => {
      const isVariant = question.isVariant === true || question.isVariant === 'true';
      const isFlagged = question.isFlagged === true;
      const isRejected = question.status === 'rejected';
      
      // Only show variants if they are flagged OR rejected
      if (isVariant && !isFlagged && !isRejected) {
        return; // Skip variants that are not flagged or rejected
      }
      
      const processorName = question.approvedBy?.name || question.assignedProcessor?.name || "—";
      const subjectName = question.subject?.name || "—";
      
      const isApproved = question.status === 'completed';
      
      // Determine status display
      let status;
      if (isFlagged) {
        status = 'Flag';
      } else if (question.status === 'pending_explainer') {
        status = 'In Review';
      } else if (question.status === 'pending_processor' && !isFlagged && (question.approvedBy || question.lastModifiedById)) {
        status = 'Approved';
      } else {
        status = formatStatus(question.status);
      }
      
      const questionTitle = question.questionText 
        ? (question.questionText.length > 50 
            ? question.questionText.substring(0, 50) + "..." 
            : question.questionText)
        : "—";

      // Determine action type based on question status and type
      let actionType = 'view';
      if (question.status === 'pending_creator' && !isVariant) {
        actionType = 'createVariant';
      } else if (isRejected && isVariant) {
        // Show edit icon for rejected variants
        actionType = 'editicon';
      } else if (isFlagged && isVariant) {
        // Show edit icon for flagged variants so creator can respond
        actionType = 'editicon';
      } else {
        actionType = 'view';
      }

      const questionData = {
        id: question.id || question._id,
        questionTitle: questionTitle,
        subject: subjectName,
        processor: processorName,
        status: status,
        indicators: {
          approved: isApproved,
          flag: isFlagged,
          reject: isRejected,
          variant: isVariant
        },
        flagReason: question.flagReason || null,
        rejectionReason: question.rejectionReason || null,
        updatedOn: formatDate(question.updatedAt),
        actionType: actionType,
        originalData: question,
        isVariant: isVariant,
        originalQuestionId: question.originalQuestionId || question.originalQuestion || null
      };
      
      result.push(questionData);
    });

    return result;
  }, [formatDate, formatStatus]);

  // Fetch stats separately - only once on mount, not affected by status filter
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        // Optimized: Use single API call with status='all' to get all questions, then calculate stats
        // Fetch a reasonable sample to calculate stats (we don't need all questions, just enough for accurate counts)
        try {
          const allQuestionsResponse = await questionsAPI.getCreatorQuestions({ 
            status: 'all', 
            page: 1, 
            limit: 100 // Fetch enough to get accurate stats
          });
          
          if (allQuestionsResponse.success && allQuestionsResponse.data) {
            const allQuestions = allQuestionsResponse.data.questions || [];
            const pagination = allQuestionsResponse.data.pagination || {};
            const totalFromBackend = pagination.totalItems || pagination.total || 0;
            
            // Filter out creator-flagged questions
            const nonFlaggedQuestions = allQuestions.filter(q => {
              if (q.isFlagged === true && q.flagType === 'creator') {
                return false;
              }
              return true;
            });
            
            // Calculate stats from the fetched data
            const totalAssigned = totalFromBackend; // Total assigned (backend already filters by assignedCreatorId)
            const totalCompleted = nonFlaggedQuestions.filter(q => q.status === 'completed').length;
            
            // Estimate variants pending from sample
            const variantsPending = nonFlaggedQuestions.filter(q => 
              (q.isVariant === true || q.isVariant === 'true') && 
              q.status === 'pending_processor' && 
              !q.isFlagged
            ).length;
            
            // If we have a sample, estimate total variants pending
            let totalVariantsPending = 0;
            if (variantsPending > 0 && nonFlaggedQuestions.length > 0) {
              // Estimate based on sample ratio
              const variantRatio = variantsPending / nonFlaggedQuestions.length;
              // Estimate total variants from total pending_processor count
              const pendingProcessorCount = nonFlaggedQuestions.filter(q => q.status === 'pending_processor').length;
              if (pendingProcessorCount > 0) {
                totalVariantsPending = Math.round(pendingProcessorCount * variantRatio);
              }
            }
            
            // If we got all questions (sample size >= total), use exact counts
            if (nonFlaggedQuestions.length >= totalFromBackend) {
              totalVariantsPending = variantsPending;
            }

            setStats([
              { label: t("creator.questionBank.stats.questionsAssigned"), value: totalAssigned, color: "blue" },
              { label: t("creator.questionBank.stats.variantsPending"), value: totalVariantsPending, color: "blue" },
              { label: t("creator.questionBank.stats.completed"), value: totalCompleted, color: "red" },
            ]);
          }
        } catch (err) {
          console.error('Failed to fetch stats:', err);
          // Set default stats on error
          setStats([
            { label: t("creator.questionBank.stats.questionsAssigned"), value: 0, color: "blue" },
            { label: t("creator.questionBank.stats.variantsPending"), value: 0, color: "blue" },
            { label: t("creator.questionBank.stats.completed"), value: 0, color: "red" },
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

  // Fetch questions from API - SINGLE API CALL with backend pagination (limit 10) - NO CLIENT-SIDE FILTERING
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Map status filter to API status - backend handles all filtering
      const apiStatus = mapStatusToAPI(subtopic);
      
      // Build API params - Always use backend pagination with limit 10
      const params = {
        page: currentPage,
        limit: 10,
        status: apiStatus || 'all', // Use 'all' if no specific status
      };
      
      // Add search and subject filters
      if (search) params.search = search;
      if (subject && subject !== "All Subject") params.subject = subject;
      
      // SINGLE API CALL - Backend handles all filtering and pagination
      const response = await questionsAPI.getCreatorQuestions(params);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch questions");
      }
      
      const questions = response.data.questions || [];
      const pagination = response.data.pagination || {};
      const totalCount = pagination.totalItems || pagination.total || questions.length;
      
      // Remove duplicates (in case backend returns duplicates)
      const uniqueQuestions = Array.from(
        new Map(questions.map(q => [q.id || q._id, q])).values()
      );
      
      // Transform to table format - filters variants to only show flagged/rejected
      const transformedData = transformQuestionData(uniqueQuestions);
      
      // Note: We filter variants client-side (only show flagged/rejected variants)
      // This means the backend total count might include variants we filter out
      // For accurate pagination, we use the transformed data length if it's different
      // But for backend pagination to work correctly, we should ideally filter at backend
      // For now, use backend count as it's more accurate for original questions
      setQuestionsData(transformedData);
      setTotalQuestions(totalCount);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err.message || "Failed to fetch questions");
      setQuestionsData([]);
      setTotalQuestions(0);
      showErrorToast(err.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  }, [currentPage, subtopic, search, subject, mapStatusToAPI, transformQuestionData]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, subject, subtopic]);

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
        
        const subjectNames = ["All Subject", ...subjectsList.map(s => s.name || s)];
        setSubjects(subjectNames);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects(["All Subject"]);
      }
    };
    fetchSubjects();
  }, []);

  // Memoize status options
  const subtopicOptions = useMemo(() => ["All Status", "Approved", "Pending", "Reject", "Flag"], []);

  // Memoize loading component for table
  const tableLoadingComponent = useMemo(() => (
    <Loader 
      size="lg" 
      color="oxford-blue" 
      text="Loading questions..."
      className="py-10"
    />
  ), []);

  const handleCompletedQuestion = useCallback(() => {
    navigate("/creator/question-bank/completed-question");
  }, [navigate]);

  const handleView = useCallback((item) => {
    if (item.originalData) {
      const question = item.originalData;
      // For pending_creator questions, navigate to create-variants
      if (question.status === 'pending_creator') {
        handleCreateVariant(item);
      } else {
        // For other questions, navigate to view question page
        navigate(`/creator/question-bank/question/${item.id}`);
      }
    }
  }, [navigate]);

  const handleEdit = useCallback((item) => {
    if (item.originalData) {
      const question = item.originalData;
      const isVariant = question.isVariant === true || question.isVariant === 'true';
      const isFlagged = question.isFlagged === true;
      const isRejected = question.status === 'rejected';
      
      // For flagged variants, navigate to view variant page (has reject flag and update buttons)
      if (isVariant && isFlagged) {
        // Fetch original question if we have the ID
        const fetchOriginalAndNavigate = async () => {
          try {
            let originalQ = null;
            if (question.originalQuestionId) {
              const response = await questionsAPI.getCreatorQuestionById(question.originalQuestionId);
              if (response.success && response.data?.question) {
                originalQ = response.data.question;
              }
            }
            
            navigate("/creator/question-bank/view-variant", {
              state: {
                variantId: item.id,
                variant: question,
                originalQuestion: originalQ || (question.originalQuestionId ? { id: question.originalQuestionId } : null)
              }
            });
          } catch (err) {
            console.error("Error fetching original question:", err);
            // Navigate anyway with what we have
            navigate("/creator/question-bank/view-variant", {
              state: {
                variantId: item.id,
                variant: question,
                originalQuestion: question.originalQuestionId ? { id: question.originalQuestionId } : null
              }
            });
          }
        };
        
        fetchOriginalAndNavigate();
      } 
      // For rejected variants, navigate to edit variant page (update variant page)
      else if (isVariant && isRejected) {
        navigate("/creator/question-bank/edit-variant", {
          state: {
            variantId: item.id,
            variant: question,
            originalQuestion: question.originalQuestionId ? { id: question.originalQuestionId } : null,
            isRejected: true
          }
        });
      }
      // For regular questions, navigate to edit page
      else {
        navigate(`/creator/question-bank/question/${item.id}/edit`);
      }
    }
  }, [navigate]);

  const handleCreateVariant = useCallback((item) => {
    if (item.originalData) {
      navigate(`/creator/question-bank/create-variants`, { 
        state: { questionId: item.id, question: item.originalData } 
      });
    } else {
      navigate("/creator/question-bank/create-variants");
    }
  }, [navigate]);

  const handleShowFlagReason = useCallback((flagReason) => {
    setSelectedFlagReason(flagReason || "");
    setIsFlagModalOpen(true);
  }, []);

  const handleCloseFlagModal = useCallback(() => {
    setIsFlagModalOpen(false);
    setSelectedFlagReason("");
  }, []);

  const handleShowRejectionReason = useCallback((rejectionReason) => {
    setSelectedRejectionReason(rejectionReason || "");
    setIsRejectionModalOpen(true);
  }, []);

  const handleCloseRejectionModal = useCallback(() => {
    setIsRejectionModalOpen(false);
    setSelectedRejectionReason("");
  }, []);

  // Memoize subject options
  const subjectOptions = useMemo(() => {
    return subjects.length > 0 ? subjects : ["All Subject"];
  }, [subjects]);

  // Memoize workflow steps
  const workflowSteps = useMemo(() => [
    t("gatherer.questionBank.workflowSteps.gatherer"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.creator"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.explainer"),
  ], [t]);

  // Get recent activity from question history (memoized)
  const getRecentActivity = useCallback(() => {
    if (!questionsData.length) return [];
    
    const activities = [];
    
    // Collect all activities from current questions
    questionsData.forEach((q) => {
      const question = q.originalData;
      if (!question) return;
      
      // Check if question has history array
      if (question.history && Array.isArray(question.history) && question.history.length > 0) {
        // Process all history entries
        question.history.forEach((historyEntry) => {
          if (!historyEntry) return;
          
          // Only include activities where creator was involved
          const isCreatorAction = historyEntry.role === 'creator';
          const isCreatorRelevantAction = historyEntry.action && [
            'approved', 'approve', 
            'rejected', 'reject', 
            'variant_created', 'create_variant', 'variant_created',
            'flagged', 'flag', 
            'submitted', 'submit',
            'updated', 'update',
            'flag_rejected_by_creator'
          ].includes(historyEntry.action);
          
          if (isCreatorAction || isCreatorRelevantAction) {
            let icon = "submit";
            let variant = "default";
            let title = "";
            
            const questionTitle = q.questionTitle?.substring(0, 50) || 'Question';
            const questionTitleSuffix = q.questionTitle?.length > 50 ? '...' : '';
            
            // Determine icon and variant based on action
            const action = historyEntry.action?.toLowerCase() || '';
            if (action === 'approved' || action === 'approve') {
              icon = "approve";
              variant = "approved";
              title = `Question approved: ${questionTitle}${questionTitleSuffix}`;
            } else if (action === 'rejected' || action === 'reject') {
              icon = "reject";
              variant = "default";
              title = `Question rejected: ${questionTitle}${questionTitleSuffix}`;
            } else if (action === 'variant_created' || action === 'create_variant' || action === 'variant_created') {
              icon = "submit";
              variant = "default";
              title = `Variant created: ${questionTitle}${questionTitleSuffix}`;
            } else if (action === 'flagged' || action === 'flag') {
              icon = "submit";
              variant = "default";
              title = `Question flagged: ${questionTitle}${questionTitleSuffix}`;
            } else if (action === 'submitted' || action === 'submit') {
              icon = "submit";
              variant = "default";
              title = `Question submitted: ${questionTitle}${questionTitleSuffix}`;
            } else if (action === 'updated' || action === 'update') {
              icon = "submit";
              variant = "default";
              title = `Question updated: ${questionTitle}${questionTitleSuffix}`;
            } else if (action === 'flag_rejected_by_creator') {
              icon = "submit";
              variant = "default";
              title = `Flag rejected: ${questionTitle}${questionTitleSuffix}`;
            } else {
              // Default for other actions
              const actionName = historyEntry.action || 'Updated';
              title = `${actionName}: ${questionTitle}${questionTitleSuffix}`;
            }
            
            // Get timestamp - try multiple possible fields
            const rawTimestamp = historyEntry.timestamp || 
                                historyEntry.date || 
                                (historyEntry.time ? new Date(historyEntry.time) : null) ||
                                question.updatedAt || 
                                question.createdAt;
            
            if (rawTimestamp) {
              activities.push({
                icon,
                title,
                timestamp: rawTimestamp, // Store raw timestamp for sorting
                formattedTimestamp: formatDate(rawTimestamp), // Store formatted for display
                variant
              });
            }
          }
        });
      } else {
        // If no history, create activity from question status/updates
        // Only for questions that were recently updated and have creator involvement
        const isVariant = question.isVariant === true || question.isVariant === 'true';
        const wasCreatedByCreator = question.createdById || question.createdBy;
        
        if (isVariant && wasCreatedByCreator && question.updatedAt) {
          const questionTitle = q.questionTitle?.substring(0, 50) || 'Question';
          const questionTitleSuffix = q.questionTitle?.length > 50 ? '...' : '';
          
          let icon = "submit";
          let variant = "default";
          let title = "";
          
          if (question.status === 'completed') {
            icon = "approve";
            variant = "approved";
            title = `Variant completed: ${questionTitle}${questionTitleSuffix}`;
          } else if (question.status === 'pending_processor') {
            icon = "submit";
            variant = "default";
            title = `Variant submitted: ${questionTitle}${questionTitleSuffix}`;
          } else {
            return; // Skip if status doesn't indicate creator action
          }
          
          activities.push({
            icon,
            title,
            timestamp: question.updatedAt,
            formattedTimestamp: formatDate(question.updatedAt),
            variant
          });
        }
      }
    });
    
    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => {
      try {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        // Handle invalid dates
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return 0;
        }
        return dateB - dateA;
      } catch {
        return 0;
      }
    });
    
    // Return 5 most recent activities and format timestamps
    return activities.slice(0, 5).map(activity => ({
      ...activity,
      timestamp: activity.formattedTimestamp
    }));
  }, [questionsData]);

  // Memoize activity data
  const activityData = useMemo(() => getRecentActivity(), [getRecentActivity]);

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("creator.questionBank.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("creator.questionBank.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
            <OutlineButton
              text={t("creator.questionBank.completedQuestions")}
              onClick={handleCompletedQuestion}
              className="py-[10px] px-[14px]"
            />
            <OutlineButton
              text="View Variants"
              onClick={() => navigate("/creator/question-bank/variants-list")}
              className="py-[10px] px-[14px]"
            />
          </div>
        </header>

        <StatsCards stats={stats} />

        <div>
          <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo mb-5">
            {t("creator.assignedQuestionPage.title")}
          </div>
          
          <div className="mb-6">
            <SearchFilter
              searchValue={search}
              subjectValue={subject}
              subtopicValue={subtopic}
              onSearchChange={setSearch}
              onSubjectChange={setSubject}
              onSubtopicChange={setSubtopic}
              subjectOptions={subjectOptions}
              subtopicOptions={subtopicOptions}
              searchPlaceholder={t("creator.assignedQuestionPage.searchPlaceholder")}
            />
          </div>

          {error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-cinnebar-red text-lg font-roboto mb-4">{error}</div>
              <OutlineButton 
                text="Retry" 
                className="py-[10px] px-5" 
                onClick={fetchQuestions}
              />
            </div>
          ) : (
          <Table
              items={questionsData}
              columns={QuestionsColumns}
              page={currentPage}
              pageSize={10}
              total={totalQuestions}
              onPageChange={setCurrentPage}
              onView={handleView}
              onEdit={handleEdit}
              onCustomAction={(item) => {
                if (item.actionType === 'createVariant') {
                  handleCreateVariant(item);
                } else if (item.actionType === 'view') {
                  handleView(item);
                }
              }}
              emptyMessage={t("creator.assignedQuestionPage.emptyMessage")}
              onShowFlagReason={handleShowFlagReason}
              onShowRejectionReason={handleShowRejectionReason}
              loading={loading}
              loadingComponent={tableLoadingComponent}
          />
          )}
        </div>

        <div>
          <h2 className="text-[24px] leading-[32px] font-bold font-archivo text-blue-dark mb-5">
            {t("creator.questionBank.workflowProgress")}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <WorkflowProgress steps={workflowSteps} currentStep={3} />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
                <h2 className="text-[20px] leading-[28px] font-semibold font-archivo text-blue-dark mb-4">
                  {t("creator.questionBank.recentActivity")}
                </h2>

                <div className="space-y-3">
                  {activityData.length > 0 ? (
                    activityData.map((activity, index) => (
                    <RecentActivity
                      key={index}
                      icon={activity.icon}
                      title={activity.title}
                      subtitle={activity.subtitle}
                      timestamp={activity.timestamp}
                      variant={activity.variant}
                    />
                    ))
                  ) : (
                    <p className="text-[14px] leading-5 font-normal font-roboto text-[#6B7280]">
                      {t("creator.questionBank.noActivity")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Reason Modal */}
      {isFlagModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-[600px] w-full p-8">
            <h2 className="text-[24px] leading-[100%] font-bold text-oxford-blue mb-2">
              {t("creator.assignedQuestionPage.flagReasonModal.title")}
            </h2>
            <p className="text-[16px] leading-[100%] font-normal text-dark-gray mb-6">
              {t("creator.assignedQuestionPage.flagReasonModal.subtitle")}
            </p>
            <div className="mb-6">
              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-oxford-blue mb-2">
                {t("creator.assignedQuestionPage.flagReasonModal.reasonLabel")}
              </label>
              <div className="w-full min-h-[120px] rounded-[8px] border border-[#03274633] bg-white px-4 py-3 font-roboto text-[16px] leading-[20px] text-oxford-blue">
                {selectedFlagReason || t("creator.assignedQuestionPage.flagReasonModal.noReason")}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCloseFlagModal}
                className="flex-1 font-roboto px-4 py-3 border-[0.5px] text-base font-normal border-[#032746] rounded-lg text-blue-dark hover:bg-gray-50 transition-colors"
              >
                {t("creator.assignedQuestionPage.flagReasonModal.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {isRejectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-[600px] w-full p-8">
            <h2 className="text-[24px] leading-[100%] font-bold text-oxford-blue mb-2">
              {t("creator.assignedQuestionPage.rejectionReasonModal.title")}
            </h2>
            <p className="text-[16px] leading-[100%] font-normal text-dark-gray mb-6">
              {t("creator.assignedQuestionPage.rejectionReasonModal.subtitle")}
            </p>
            <div className="mb-6">
              <label className="block text-[16px] leading-[100%] font-roboto font-normal text-oxford-blue mb-2">
                {t("creator.assignedQuestionPage.rejectionReasonModal.reasonLabel")}
              </label>
              <div className="w-full min-h-[120px] rounded-[8px] border border-[#03274633] bg-white px-4 py-3 font-roboto text-[16px] leading-[20px] text-oxford-blue">
                {selectedRejectionReason || t("creator.assignedQuestionPage.rejectionReasonModal.noReason")}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCloseRejectionModal}
                className="flex-1 font-roboto px-4 py-3 border-[0.5px] text-base font-normal border-[#032746] rounded-lg text-blue-dark hover:bg-gray-50 transition-colors"
              >
                {t("creator.assignedQuestionPage.rejectionReasonModal.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorQuestionBank;
