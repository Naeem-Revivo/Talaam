import { useLanguage } from "../../context/LanguageContext";
import { PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { Table } from "../../components/common/TableComponent";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import ReviewFeedback from "../../components/gatherer/ReviewFeedback";
import WorkflowProgress from "../../components/gatherer/WorkflowProgress";
import RecentActivity from "../../components/gatherer/RecentActiveity";
import { useNavigate } from "react-router-dom";
import { UploadFileModal } from "../../components/gatherer/UploadFileModal";
import questionsAPI from "../../api/questions";
import Dropdown from "../../components/shared/Dropdown";
import Loader from "../../components/common/Loader";
import ReasonModal from "../../components/common/ReasonModal";

const GathererQuestionBank = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gathererData, setGathererData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [statusFilter, setStatusFilter] = useState(""); // Empty string means "all"
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [selectedRejectionReason, setSelectedRejectionReason] = useState("");
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [selectedFlagReason, setSelectedFlagReason] = useState("");
  const [stats, setStats] = useState([
    { label: t("gatherer.questionBank.stats.questionAdded"), value: 0, color: "blue" },
    { label: t("gatherer.questionBank.stats.pendingReview"), value: 0, color: "red" },
    { label: t("gatherer.questionBank.stats.acceptedByProcessor"), value: 0, color: "red" },
    { label: t("gatherer.questionBank.stats.rejected"), value: 0, color: "red" },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);

  const handleSubmit = (data) => {
    console.log("Submitted:", data);
  };

  const gathererColumns = useMemo(() => [
    { key: "questionTitle", label: t("gatherer.questionBank.table.question") },
    { key: "processor", label: t("gatherer.questionBank.table.processor") },
    { key: "lastUpdate", label: t("gatherer.questionBank.table.lastUpdate") },
    { key: "status", label: t("gatherer.questionBank.table.status") },
    { key: "indicators", label: t("gatherer.questionBank.table.flagsIssues") || "FLAGS / ISSUES" },
    { key: "actions", label: t("gatherer.questionBank.table.actions") },
  ], [t]);
  
  const handleAddQuestion = useCallback(() => {
    navigate("/gatherer/question-bank/Gatherer-addQuestion");
  }, [navigate]);

  // Format date to relative time
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  // Format status for display
  // Priority: Flagged > Rejected > Other statuses
  const formatStatus = (status, isFlagged, flagStatus) => {
    // Show "Flagged" status if flag has been approved by processor
    if (isFlagged && flagStatus === 'approved') {
      return "Flagged";
    }
    // Show "Rejected" for rejected questions
    if (status === 'rejected') {
      return "Rejected";
    }
    if (!status) return "—";
    const statusMap = {
      pending_processor: "Pending Review",
      pending_creator: "Pending Creator",
      pending_explainer: "Pending Explainer",
      approved: "Approved",
      completed: "Completed",
      sent_back: "Sent Back",
    };
    return statusMap[status] || status;
  };

  // Fetch stats separately - only once on mount, not affected by status filter
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        // Fetch stats without any status filter
        const response = await questionsAPI.getGathererQuestions({ page: 1, limit: 10 });
        
        if (response.success && response.data) {
          const pagination = response.data.pagination || {};
          
          // Get stats from API response if available
          if (response.data.summary) {
            const summary = response.data.summary;
            setStats([
              { label: t("gatherer.questionBank.stats.questionAdded"), value: summary.totalSubmitted || 0, color: "blue" },
              { label: t("gatherer.questionBank.stats.pendingReview"), value: summary.totalPending || 0, color: "red" },
              { label: t("gatherer.questionBank.stats.acceptedByProcessor"), value: summary.totalAccepted || 0, color: "red" },
              { label: t("gatherer.questionBank.stats.rejected"), value: summary.totalRejected || 0, color: "red" },
            ]);
          } else {
            // Fallback: use totalItems from pagination
            setStats([
              { label: t("gatherer.questionBank.stats.questionAdded"), value: pagination.totalItems || 0, color: "blue" },
              { label: t("gatherer.questionBank.stats.pendingReview"), value: 0, color: "red" },
              { label: t("gatherer.questionBank.stats.acceptedByProcessor"), value: 0, color: "red" },
              { label: t("gatherer.questionBank.stats.rejected"), value: 0, color: "red" },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [t]); // Only fetch stats once on mount

  // Fetch questions from API - affected by status filter and page
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 10,
        };
        
        // Pass status filter to API (empty string means "all")
        if (statusFilter && statusFilter !== '') {
          params.status = statusFilter;
        }
        
        const response = await questionsAPI.getGathererQuestions(params);

        if (response.success && response.data) {
          const questions = response.data.questions || [];
          const pagination = response.data.pagination || {};
          
          // Map API response to table format
          const mappedData = questions.map((question) => {
            const processorName = question.assignedProcessor?.name || 
                                  question.assignedProcessor?.fullName || 
                                  question.assignedProcessor?.username || 
                                  "—";
            const isRejected = question.status === 'rejected';
            
            // Only consider question as flagged if flag has been approved by processor
            // Don't show flagged status if flag is pending processor review (flagStatus === 'pending' or null)
            const flagStatus = question.flagStatus;
            const isFlagged = question.isFlagged === true && flagStatus === 'approved';
            
            // Determine action type: 
            // - edit icon for rejected questions (gatherer can update and resubmit)
            // - edit icon for flagged questions (gatherer can edit and resubmit)
            // - view icon for all other cases
            const actionType = (isRejected || isFlagged) ? "editicon" : "viewicon";
            
            return {
              id: question.id,
              questionTitle: question.questionText || "—",
              processor: processorName,
              lastUpdate: formatDate(question.updatedAt || question.createdAt),
              status: formatStatus(question.status, isFlagged, flagStatus),
              indicators: {
                reject: isRejected,
                flag: isFlagged, // Only show flag indicator if flag is approved
              },
              rejectionReason: question.rejectionReason || null,
              flagReason: question.flagReason || null,
              actionType: actionType,
              originalData: question, // Store full question data for edit page
            };
          });

          setGathererData(mappedData);
          
          // Use pagination totalItems from API response
          setTotalQuestions(pagination.totalItems || 0);
        } else {
          // No questions found
          setGathererData([]);
          setTotalQuestions(0);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setGathererData([]);
        setTotalQuestions(0);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage, statusFilter]); // Removed 't' dependency as it's stable

  const handleView = useCallback((item) => {
    if (item?.id) {
      navigate(`/gatherer/question-bank/Gatherer-QuestionDetail/${item.id}`);
    } else {
      navigate("/gatherer/question-bank/Gatherer-QuestionDetail");
    }
  }, [navigate]);

  const handleEdit = useCallback((item) => {
    if (item?.id) {
      const questionStatus = item.originalData?.status || item.status;
      const flagStatus = item.originalData?.flagStatus;
      const isFlagged = item.originalData?.isFlagged === true && flagStatus === 'approved';
      
      // Allow editing if:
      // 1. Question is rejected (gatherer can update and resubmit)
      // 2. Question is flagged with approved flag status (gatherer can edit and resubmit)
      // Prevent editing other questions with pending_processor status
      if (questionStatus === 'pending_processor' && !isFlagged && questionStatus !== 'rejected') {
        console.warn('Cannot edit question with pending_processor status');
        return;
      }
      
      // Navigate to edit page with question ID and pass the question data via state
      navigate(`/gatherer/question-bank/Gatherer-editQuestion/${item.id}`, {
        state: { questionData: item.originalData }
      });
    }
  }, [navigate]);

  const handleCustomAction = useCallback((item) => {
    console.log("Custom action for item:", item);
  }, []);

  const handleShowRejectionReason = useCallback((rejectionReason) => {
    setSelectedRejectionReason(rejectionReason || "");
    setIsRejectionModalOpen(true);
  }, []);

  const handleCloseRejectionModal = useCallback(() => {
    setIsRejectionModalOpen(false);
    setSelectedRejectionReason("");
  }, []);

  const handleShowFlagReason = useCallback((flagReason) => {
    setSelectedFlagReason(flagReason || "");
    setIsFlagModalOpen(true);
  }, []);

  const handleCloseFlagModal = useCallback(() => {
    setIsFlagModalOpen(false);
    setSelectedFlagReason("");
  }, []);

  // Memoize loading component for table
  const tableLoadingComponent = useMemo(() => (
    <Loader 
      size="lg" 
      color="oxford-blue" 
      text={t("gatherer.questionBank.loading") || "Loading questions..."}
      className="py-10"
    />
  ), [t]);

  const feedbackData = useMemo(() => ({}), []);

  const activityData = useMemo(() => [], []);

  const workflowSteps = useMemo(() => [
    t("gatherer.questionBank.workflowSteps.gatherer"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.creator"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.explainer"),
  ], [t]);

  const handleDismiss = useCallback(() => {
    console.log("Dismissed");
  }, []);
  
  const statusFilterOptions = useMemo(() => [
    { value: "", label: "All" },
    { value: "pending_processor", label: "Pending Review" },
    { value: "pending_creator", label: "Pending Creator" },
    { value: "pending_explainer", label: "Pending Explainer" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
    { value: "flagged", label: "Flagged" },
  ], []);

  const handleStatusFilterChange = useCallback((value) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("gatherer.questionBank.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("gatherer.questionBank.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <PrimaryButton
              text={t("gatherer.questionBank.addNewQuestions")}
              className="py-[10px] px-5"
              onClick={handleAddQuestion}
            />
          </div>
        </header>

        <StatsCards stats={stats} />

        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo">
              {t("gatherer.questionBank.mySubmissions")}
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="status-filter" className="text-[14px] font-medium text-gray-700">
                Filter by Status:
              </label>
              <Dropdown
                value={statusFilter}
                onChange={handleStatusFilterChange}
                options={statusFilterOptions}
                showDefaultOnEmpty={true}
                className="min-w-[200px]"
                height="h-[40px]"
                textClassName="text-[14px] font-roboto text-gray-700"
              />
            </div>
          </div>
          <Table
            items={gathererData}
            columns={gathererColumns}
            page={currentPage}
            pageSize={10}
            total={totalQuestions}
            onPageChange={setCurrentPage}
            onView={handleView}
            onEdit={handleEdit}
            onCustomAction={handleCustomAction}
            emptyMessage={t("gatherer.questionBank.emptyMessage")}
            onShowRejectionReason={handleShowRejectionReason}
            onShowFlagReason={handleShowFlagReason}
            loading={loading}
            loadingComponent={tableLoadingComponent}
          />
        </div>

        <div className="">
          <h1 className="text-[24px] leading-[32px] font-bold font-archivo text-blue-dark mb-4">
            {t("gatherer.questionBank.reviewFeedback")}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Feedback Card and Workflow */}
            <div className="lg:col-span-2 space-y-6">
              {feedbackData.title && (
                <ReviewFeedback
                  title={feedbackData.title}
                  message={feedbackData.message}
                  author={feedbackData.author}
                  onDismiss={handleDismiss}
                  onEdit={handleEdit}
                />
              )}
              <div>
                <h2 className="text-[24px] leading-[32px] font-bold font-archivo text-blue-dark mb-5">
                  {t("gatherer.questionBank.workflowProgress")}
                </h2>
                <WorkflowProgress steps={workflowSteps} currentStep={1} />
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="lg:col-span-1 pt-[54px]">
              <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
                <h2 className="text-[20px] leading-[28px] font-semibold font-archivo text-blue-dark mb-4">
                  {t("gatherer.questionBank.recentActivity")}
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
                      {t("gatherer.questionBank.noActivity") || "No recent activity"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UploadFileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Rejection Reason Modal */}
      <ReasonModal
        isOpen={isRejectionModalOpen}
        onClose={handleCloseRejectionModal}
        title={t("gatherer.questionBank.rejectionReasonModal.title") || "Rejection Reason"}
        subtitle={t("gatherer.questionBank.rejectionReasonModal.subtitle") || "The question was rejected with the following reason:"}
        reason={selectedRejectionReason}
        noReasonText={t("gatherer.questionBank.rejectionReasonModal.noReason") || "No reason provided"}
        closeText={t("gatherer.questionBank.rejectionReasonModal.close") || "Close"}
      />

      {/* Flag Reason Modal */}
      <ReasonModal
        isOpen={isFlagModalOpen}
        onClose={handleCloseFlagModal}
        title={t("gatherer.questionBank.flagReasonModal.title") || "Flag Reason"}
        subtitle={t("gatherer.questionBank.flagReasonModal.subtitle") || "The question was flagged with the following reason:"}
        reason={selectedFlagReason}
        noReasonText={t("gatherer.questionBank.flagReasonModal.noReason") || "No reason provided"}
        closeText={t("gatherer.questionBank.flagReasonModal.close") || "Close"}
      />
    </div>
  );
};

export default GathererQuestionBank;
