import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { Table } from "../../components/common/TableComponent";
import { useState, useEffect, useMemo, useCallback } from "react";
import ReviewFeedback from "../../components/gatherer/ReviewFeedback";
import WorkflowProgress from "../../components/gatherer/WorkflowProgress";
import RecentActivity from "../../components/gatherer/RecentActiveity";
import { useNavigate } from "react-router-dom";
import { UploadFileModal } from "../../components/gatherer/UploadFileModal";
import questionsAPI from "../../api/questions";
import Dropdown from "../../components/shared/Dropdown";

const GathererQuestionBank = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gathererData, setGathererData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [statusFilter, setStatusFilter] = useState(""); // Empty string means "all"
  const [stats, setStats] = useState([
    { label: t("gatherer.questionBank.stats.questionAdded"), value: 0, color: "blue" },
    { label: t("gatherer.questionBank.stats.pendingReview"), value: 0, color: "red" },
    { label: t("gatherer.questionBank.stats.acceptedByProcessor"), value: 0, color: "red" },
    { label: t("gatherer.questionBank.stats.rejected"), value: 0, color: "red" },
  ]);

  const handleSubmit = (data) => {
    console.log("Submitted:", data);
  };

  const gathererColumns = useMemo(() => [
    { key: "questionTitle", label: t("gatherer.questionBank.table.question") },
    { key: "processor", label: t("gatherer.questionBank.table.processor") },
    { key: "lastUpdate", label: t("gatherer.questionBank.table.lastUpdate") },
    { key: "status", label: t("gatherer.questionBank.table.status") },
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
  const formatStatus = (status) => {
    if (!status) return "—";
    const statusMap = {
      pending_processor: "Pending Review",
      pending_creator: "Pending Creator",
      pending_explainer: "Pending Explainer",
      approved: "Approved",
      rejected: "Rejected",
      completed: "Completed",
      sent_back: "Sent Back",
    };
    return statusMap[status] || status;
  };

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 10,
        };
        
        // Add status filter if selected
        if (statusFilter) {
          params.status = statusFilter;
        }

        const response = await questionsAPI.getGathererQuestions(params);

        if (response.success && response.data?.questions) {
          const questions = response.data.questions;
          console.log('Questions from API:', questions);
          console.log('First question assignedProcessor:', questions[0]?.assignedProcessor);
          
          // Map API response to table format
          const mappedData = questions.map((question) => {
            const processorName = question.assignedProcessor?.name || 
                                  question.assignedProcessor?.fullName || 
                                  question.assignedProcessor?.username || 
                                  "—";
            console.log('Question ID:', question.id, 'Processor:', processorName, 'assignedProcessor object:', question.assignedProcessor);
            return {
              id: question.id,
              questionTitle: question.questionText?.substring(0, 50) + (question.questionText?.length > 50 ? "..." : "") || "—",
              processor: processorName,
              lastUpdate: formatDate(question.updatedAt || question.createdAt),
              status: formatStatus(question.status),
              actionType: "viewicon",
            };
          });

          setGathererData(mappedData);
          
          // Use pagination totalItems if available, otherwise use questions length
          const total = response.data?.pagination?.totalItems || questions.length;
          setTotalQuestions(total);

          // Calculate stats from summary if available, otherwise calculate from current questions
          if (response.data?.summary) {
            const summary = response.data.summary;
            setStats([
              { label: t("gatherer.questionBank.stats.questionAdded"), value: summary.totalSubmitted || 0, color: "blue" },
              { label: t("gatherer.questionBank.stats.pendingReview"), value: summary.totalPending || 0, color: "red" },
              { label: t("gatherer.questionBank.stats.acceptedByProcessor"), value: summary.totalApproved || 0, color: "red" },
              { label: t("gatherer.questionBank.stats.rejected"), value: summary.totalRejected || 0, color: "red" },
            ]);
          } else {
            // Fallback: calculate from current questions
            const questionAdded = questions.length;
            const pendingReview = questions.filter(q => q.status === "pending_processor").length;
            const acceptedByProcessor = questions.filter(q => 
              q.status === "pending_creator" || q.status === "pending_explainer" || q.status === "completed"
            ).length;
            const rejected = questions.filter(q => q.status === "rejected").length;

            setStats([
              { label: t("gatherer.questionBank.stats.questionAdded"), value: questionAdded, color: "blue" },
              { label: t("gatherer.questionBank.stats.pendingReview"), value: pendingReview, color: "red" },
              { label: t("gatherer.questionBank.stats.acceptedByProcessor"), value: acceptedByProcessor, color: "red" },
              { label: t("gatherer.questionBank.stats.rejected"), value: rejected, color: "red" },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setGathererData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [t, currentPage, statusFilter]);

  const handleView = useCallback((item) => {
    if (item?.id) {
      navigate(`/gatherer/question-bank/Gatherer-QuestionDetail/${item.id}`);
    } else {
      navigate("/gatherer/question-bank/Gatherer-QuestionDetail");
    }
  }, [navigate]);

  const handleEdit = useCallback((item) => {
    console.log("Edit item:", item);
  }, []);

  const handleCustomAction = useCallback((item) => {
    console.log("Custom action for item:", item);
  }, []);

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

  const _handleEditNotification = useCallback(() => {
    console.log("Edit Question");
  }, []);

  const statusFilterOptions = useMemo(() => [
    { value: "", label: "All Statuses" },
    { value: "pending_processor", label: "Pending Review" },
    { value: "pending_creator", label: "Pending Creator" },
    { value: "pending_explainer", label: "Pending Explainer" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
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
            <OutlineButton
              text={t("gatherer.questionBank.bulkUpload")}
              onClick={() => setIsModalOpen(true)}
              className="py-[10px] px-[14px]"
            />

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
          {/* {loading ? (
            <div className="text-center py-10">
              <p className="text-[16px] text-gray-600">{t("gatherer.questionBank.loading") || "Loading questions..."}</p>
            </div>
          ) : ( */}
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
            />
          {/* )} */}
        </div>

        <div className="max-w-7xl mx-auto">
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
            <div className="lg:col-span-1">
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
    </div>
  );
};

export default GathererQuestionBank;
