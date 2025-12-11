import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { Table } from "../../components/common/TableComponent";
import SearchFilter from "../../components/common/SearchFilter";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import WorkflowProgress from "../../components/gatherer/WorkflowProgress";
import RecentActivity from "../../components/gatherer/RecentActiveity";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import { showErrorToast } from "../../utils/toastConfig";
import Loader from "../../components/common/Loader";

const CreatorQuestionBank = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [questionsData, setQuestionsData] = useState([]);
  const [allQuestionsData, setAllQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [stats, setStats] = useState([
    { label: t("creator.questionBank.stats.questionsAssigned"), value: 0, color: "blue" },
    { label: t("creator.questionBank.stats.variantsPending"), value: 0, color: "blue" },
    { label: t("creator.questionBank.stats.completed"), value: 0, color: "red" },
  ]);
  const pollingIntervalRef = useRef(null);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedFlagReason, setSelectedFlagReason] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState("");

  const QuestionsColumns = [
    { key: 'questionTitle', label: t("creator.assignedQuestionPage.table.question") },
    { key: 'subject', label: t("creator.assignedQuestionPage.table.subject") },
    { key: 'processor', label: t("creator.assignedQuestionPage.table.processor") },
    { key: 'status', label: t("creator.assignedQuestionPage.table.status") },
    { key: 'indicators', label: t("creator.assignedQuestionPage.table.indicators") },
    { key: 'updatedOn', label: t("creator.assignedQuestionPage.table.updatedOn") },
    { key: 'actions', label: t("creator.assignedQuestionPage.table.actions") }
  ];

  // Format date to relative time (Today, Yesterday, or date)
  const formatDate = (dateString) => {
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
  };

  // Format status to readable format
  const formatStatus = (status) => {
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
  };

  // Transform API response to table format
  const transformQuestionData = (questions, allQuestions = []) => {
    const questionIdStr = (id) => String(id || '');
    const variantsByParentId = new Map();
    const processedQuestionIds = new Set();
    const result = [];
    
    // Build map of variants by parent question ID
    allQuestions.forEach((q) => {
      const isVariant = q.isVariant === true || q.isVariant === 'true';
      if (isVariant) {
        const originalId = q.originalQuestionId || q.originalQuestion;
        if (originalId) {
          const parentId = questionIdStr(originalId);
          if (!variantsByParentId.has(parentId)) {
            variantsByParentId.set(parentId, []);
          }
          variantsByParentId.get(parentId).push(q);
        }
      }
    });

    // Process all questions (including variants) to show both original and variants
    questions.forEach((question) => {
      const processorName = question.approvedBy?.name || question.assignedProcessor?.name || "—";
      const subjectName = question.subject?.name || "—";
      
      const isApproved = question.status === 'completed';
      const isFlagged = question.isFlagged === true;
      const isRejected = question.status === 'rejected';
      const isVariant = question.isVariant === true || question.isVariant === 'true';
      
      const questionId = questionIdStr(question.id || question._id);
      const hasVariants = variantsByParentId.has(questionId) && variantsByParentId.get(questionId).length > 0;
      
      const isVariantQuestion = isVariant && question.status === 'pending_processor' && !isFlagged;
      const isParentWithVariants = hasVariants && question.status === 'pending_processor' && !isFlagged;
      const isSubmittedByCreator = question.status === 'pending_processor' && 
                                   !isFlagged && 
                                   (question.approvedBy || question.originalData?.approvedBy);
      
      let status;
      if (isFlagged) {
        status = 'Flag';
      } else if (isVariantQuestion || isParentWithVariants || isSubmittedByCreator) {
        status = 'Approved';
      } else if (question.status === 'pending_explainer') {
        status = 'In Review';
      } else {
        status = formatStatus(question.status);
      }
      
      const questionTitle = question.questionText 
        ? (question.questionText.length > 50 
            ? question.questionText.substring(0, 50) + "..." 
            : question.questionText)
        : "—";

      const questionData = {
        id: question.id,
        questionTitle: questionTitle,
        subject: subjectName,
        processor: processorName,
        status: status,
        indicators: {
          approved: isApproved || isVariantQuestion || isParentWithVariants || isSubmittedByCreator,
          flag: isFlagged,
          reject: isRejected,
          variant: isVariant
        },
        flagReason: question.flagReason || null,
        rejectionReason: question.rejectionReason || null,
        updatedOn: formatDate(question.updatedAt),
        actionType: question.isVariant ? 'createVariant' : 'open',
        originalData: question
      };
      
      result.push(questionData);
      processedQuestionIds.add(questionIdStr(question.id || question._id));
    });

    // Also include variants that might not be in the questions array
    // This ensures both original questions and their variants are shown
    allQuestions.forEach((q) => {
      const isVariant = q.isVariant === true || q.isVariant === 'true';
      if (isVariant) {
        const variantId = questionIdStr(q.id || q._id);
        // Only add if not already processed
        if (!processedQuestionIds.has(variantId)) {
          const processorName = q.approvedBy?.name || q.assignedProcessor?.name || "—";
          const subjectName = q.subject?.name || "—";
          const isFlagged = q.isFlagged === true;
          const isRejected = q.status === 'rejected';
          const isVariantQuestion = q.status === 'pending_processor' && !isFlagged;
          
          let status;
          if (isFlagged) {
            status = 'Flag';
          } else if (isVariantQuestion) {
            status = 'Approved';
          } else if (q.status === 'pending_explainer') {
            status = 'In Review';
          } else {
            status = formatStatus(q.status);
          }
          
          const questionTitle = q.questionText 
            ? (q.questionText.length > 50 
                ? q.questionText.substring(0, 50) + "..." 
                : q.questionText)
            : "—";

          result.push({
            id: q.id,
            questionTitle: questionTitle,
            subject: subjectName,
            processor: processorName,
            status: status,
            indicators: {
              approved: isVariantQuestion || q.status === 'completed',
              flag: isFlagged,
              reject: isRejected,
              variant: true
            },
            flagReason: q.flagReason || null,
            rejectionReason: q.rejectionReason || null,
            updatedOn: formatDate(q.updatedAt),
            actionType: 'createVariant',
            originalData: q
          });
        }
      }
    });

    return result;
  };

  // Calculate stats from questions
  const calculateStats = (questions) => {
    const assignedCount = questions.length;
    const variantsPending = questions.filter(q => {
      const isVariant = q.isVariant === true || q.isVariant === 'true';
      return isVariant && q.status === 'pending_processor' && !q.isFlagged;
    }).length;
    
    // Fetch completed questions count
    const completedCount = questions.filter(q => q.status === 'completed').length;

    setStats([
      { label: t("creator.questionBank.stats.questionsAssigned"), value: assignedCount, color: "blue" },
      { label: t("creator.questionBank.stats.variantsPending"), value: variantsPending, color: "blue" },
      { label: t("creator.questionBank.stats.completed"), value: completedCount, color: "red" },
    ]);
  };

  // Fetch assigned questions from API
  const fetchAssignedQuestions = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setError(null);
        setLoading(true);
      }
      
      const statusesToFetch = ['pending_creator', 'pending_processor', 'pending_explainer', 'rejected'];
      const allQuestions = [];
      
      for (const status of statusesToFetch) {
        try {
          const response = await questionsAPI.getCreatorQuestions({ status });
          if (response.success && response.data?.questions) {
            allQuestions.push(...response.data.questions);
          }
        } catch (err) {
          console.warn(`Failed to fetch questions with status ${status}:`, err);
        }
      }
      
      // Also fetch completed questions for stats
      try {
        const completedResponse = await questionsAPI.getCreatorQuestions({ status: 'completed' });
        if (completedResponse.success && completedResponse.data?.questions) {
          allQuestions.push(...completedResponse.data.questions);
        }
      } catch (err) {
        console.warn('Failed to fetch completed questions:', err);
      }
      
      const uniqueQuestions = Array.from(
        new Map(allQuestions.map(q => [q.id || q._id, q])).values()
      );
      
      const nonFlaggedQuestions = uniqueQuestions.filter(q => {
        if (q.isFlagged === true && q.flagType === 'creator') {
          return false;
        }
        return true;
      });
      
      const transformedData = transformQuestionData(nonFlaggedQuestions, allQuestions);
      
      // Only update state if data actually changed (prevent unnecessary re-renders and blinking)
      if (isInitialLoad || allQuestionsData.length === 0) {
        // Initial load - always update
        setAllQuestionsData(transformedData);
        setTotalQuestions(nonFlaggedQuestions.length);
        calculateStats(nonFlaggedQuestions);
        applyFilters(transformedData);
      } else {
        // Subsequent updates - only update if data changed
        const currentDataIds = new Set(allQuestionsData.map(q => q.id));
        const newDataIds = new Set(transformedData.map(q => q.id));
        
        // Check if IDs changed
        const idsChanged = currentDataIds.size !== newDataIds.size ||
          ![...currentDataIds].every(id => newDataIds.has(id));
        
        // Check if any question data changed
        const dataChanged = idsChanged || transformedData.some((newQ) => {
          const oldQ = allQuestionsData.find(q => q.id === newQ.id);
          if (!oldQ) return true; // New question
          return oldQ.status !== newQ.status ||
                 oldQ.updatedOn !== newQ.updatedOn ||
                 oldQ.indicators?.flag !== newQ.indicators?.flag ||
                 oldQ.indicators?.approved !== newQ.indicators?.approved ||
                 oldQ.indicators?.reject !== newQ.indicators?.reject;
        });
        
        if (dataChanged) {
          setAllQuestionsData(transformedData);
          setTotalQuestions(nonFlaggedQuestions.length);
          calculateStats(nonFlaggedQuestions);
          applyFilters(transformedData);
        }
      }
    } catch (err) {
      console.error("Error fetching assigned questions:", err);
      if (isInitialLoad) {
        setError(err.message || "Failed to fetch questions");
        setQuestionsData([]);
        setAllQuestionsData([]);
        showErrorToast(err.message || "Failed to fetch questions");
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  // Apply client-side filters (memoized to prevent unnecessary re-renders)
  const applyFilters = useCallback((data) => {
    let filtered = [...data];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((item) =>
        item.questionTitle.toLowerCase().includes(searchLower) ||
        item.processor.toLowerCase().includes(searchLower) ||
        item.subject.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower)
      );
    }

    if (subject && subject !== "All Subject") {
      filtered = filtered.filter((item) => {
        const questionSubject = item.originalData?.subject?.name || "";
        return questionSubject.toLowerCase() === subject.toLowerCase();
      });
    }

    if (subtopic && subtopic !== "All Status") {
      filtered = filtered.filter((item) => {
        if (subtopic.toLowerCase() === "flag") {
          return item.status?.toLowerCase() === "flag" ||
                 item.indicators?.flag === true || 
                 item.originalData?.isFlagged === true;
        } else {
          const questionStatus = item.originalData?.status || "";
          const displayStatus = item.status || "";
          return questionStatus.toLowerCase().includes(subtopic.toLowerCase()) ||
                 displayStatus.toLowerCase().includes(subtopic.toLowerCase());
        }
      });
    }

    setQuestionsData(filtered);
    setTotalQuestions(filtered.length);
    setCurrentPage(1);
  }, [search, subject, subtopic]);

  // Apply filters when filter values or data change
  useEffect(() => {
    if (allQuestionsData.length > 0) {
      applyFilters(allQuestionsData);
    }
  }, [allQuestionsData, applyFilters]);

  // Fetch data only once on mount to prevent blinking
  useEffect(() => {
    fetchAssignedQuestions(true);

    // Polling disabled to prevent UI blinking
    // If real-time updates are needed, uncomment below and increase interval
    // pollingIntervalRef.current = setInterval(() => {
    //   fetchAssignedQuestions(false);
    // }, 30000); // 30 seconds minimum to reduce blinking

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompletedQuestion = () => {
    navigate("/creator/question-bank/completed-question");
  };

  const handleView = (item) => {
    if (item.originalData) {
      navigate(`/creator/question-bank/question/${item.id}`);
    }
  };

  const handleEdit = (item) => {
    if (item.originalData) {
      navigate(`/creator/question-bank/question/${item.id}/edit`);
    }
  };

  const handleCreateVariant = (item) => {
    if (item.originalData) {
      navigate(`/creator/question-bank/create-variants`, { 
        state: { questionId: item.id, question: item.originalData } 
      });
    } else {
      navigate("/creator/question-bank/create-variants");
    }
  };

  const handleShowFlagReason = (flagReason) => {
    setSelectedFlagReason(flagReason || "");
    setIsFlagModalOpen(true);
  };

  const handleCloseFlagModal = () => {
    setIsFlagModalOpen(false);
    setSelectedFlagReason("");
  };

  const handleShowRejectionReason = (rejectionReason) => {
    setSelectedRejectionReason(rejectionReason || "");
    setIsRejectionModalOpen(true);
  };

  const handleCloseRejectionModal = () => {
    setIsRejectionModalOpen(false);
    setSelectedRejectionReason("");
  };

  // Get unique subjects from questions for filter
  const getSubjectOptions = () => {
    const subjects = new Set();
    allQuestionsData.forEach(q => {
      const subjectName = q.originalData?.subject?.name;
      if (subjectName) {
        subjects.add(subjectName);
      }
    });
    return ["All Subject", ...Array.from(subjects).sort()];
  };

  const subjectOptions = getSubjectOptions();
  const subtopicOptions = ["All Status", "Approved", "Pending", "Reject", "Flag"];

  const workflowSteps = [
    t("gatherer.questionBank.workflowSteps.gatherer"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.creator"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.explainer"),
  ];

  // Get recent activity from question history
  const getRecentActivity = () => {
    if (!allQuestionsData.length) return [];
    
    const activities = [];
    
    // Collect all activities from all questions
    allQuestionsData.forEach((q) => {
      const question = q.originalData;
      if (question?.history && Array.isArray(question.history)) {
        // Process all history entries, not just the first one
        question.history.forEach((historyEntry) => {
          // Only include activities where creator was involved
          if (historyEntry.role === 'creator' || 
              (historyEntry.action && ['approved', 'rejected', 'variant_created', 'flagged', 'submitted'].includes(historyEntry.action))) {
            
            let icon = "submit";
            let variant = "default";
            let title = "";
            
            // Determine icon and variant based on action
            if (historyEntry.action === 'approved' || historyEntry.action === 'approve') {
              icon = "approve";
              variant = "approved";
              title = `Question approved: ${q.questionTitle?.substring(0, 50) || 'Question'}${q.questionTitle?.length > 50 ? '...' : ''}`;
            } else if (historyEntry.action === 'rejected' || historyEntry.action === 'reject') {
              icon = "reject";
              variant = "default";
              title = `Question rejected: ${q.questionTitle?.substring(0, 50) || 'Question'}${q.questionTitle?.length > 50 ? '...' : ''}`;
            } else if (historyEntry.action === 'variant_created' || historyEntry.action === 'create_variant') {
              icon = "submit";
              variant = "default";
              title = `Variant created: ${q.questionTitle?.substring(0, 50) || 'Question'}${q.questionTitle?.length > 50 ? '...' : ''}`;
            } else if (historyEntry.action === 'flagged' || historyEntry.action === 'flag') {
              icon = "submit";
              variant = "default";
              title = `Question flagged: ${q.questionTitle?.substring(0, 50) || 'Question'}${q.questionTitle?.length > 50 ? '...' : ''}`;
            } else if (historyEntry.action === 'submitted' || historyEntry.action === 'submit') {
              icon = "submit";
              variant = "default";
              title = `Question submitted: ${q.questionTitle?.substring(0, 50) || 'Question'}${q.questionTitle?.length > 50 ? '...' : ''}`;
            } else {
              // Default for other actions
              title = `${historyEntry.action || 'Updated'}: ${q.questionTitle?.substring(0, 50) || 'Question'}${q.questionTitle?.length > 50 ? '...' : ''}`;
            }
            
            const rawTimestamp = historyEntry.timestamp || historyEntry.date || question.updatedAt || question.createdAt;
            activities.push({
              icon,
              title,
              timestamp: rawTimestamp, // Store raw timestamp for sorting
              formattedTimestamp: formatDate(rawTimestamp), // Store formatted for display
              variant
            });
          }
        });
      }
    });
    
    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB - dateA;
    });
    
    // Return 4-5 most recent activities and format timestamps
    return activities.slice(0, 5).map(activity => ({
      ...activity,
      timestamp: activity.formattedTimestamp
    }));
  };

  const activityData = getRecentActivity();

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

          {loading ? (
            <Loader 
              size="lg" 
              color="oxford-blue" 
              text="Loading questions..."
              className="py-12"
            />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-cinnebar-red text-lg font-roboto mb-4">{error}</div>
              <OutlineButton 
                text="Retry" 
                className="py-[10px] px-5" 
                onClick={fetchAssignedQuestions}
              />
            </div>
          ) : (
          <Table
              items={questionsData.slice((currentPage - 1) * 10, currentPage * 10)}
              columns={QuestionsColumns}
              page={currentPage}
            pageSize={10}
              total={totalQuestions}
              onPageChange={setCurrentPage}
              onView={handleView}
              onEdit={handleEdit}
              onCustomAction={(item) => {
                if (item.actionType === 'open') {
                  handleCreateVariant(item);
                } else if (item.actionType === 'createVariant') {
                  handleCreateVariant(item);
                }
              }}
              emptyMessage={t("creator.assignedQuestionPage.emptyMessage")}
              onShowFlagReason={handleShowFlagReason}
              onShowRejectionReason={handleShowRejectionReason}
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
