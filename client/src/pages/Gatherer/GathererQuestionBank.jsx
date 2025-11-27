import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { Table } from "../../components/common/TableComponent";
import { useState } from "react";
import ReviewFeedback from "../../components/gatherer/ReviewFeedback";
import WorkflowProgress from "../../components/gatherer/WorkflowProgress";
import RecentActivity from "../../components/gatherer/RecentActiveity";
import { useNavigate } from "react-router-dom";
import { UploadFileModal } from "../../components/gatherer/UploadFileModal";

const GathererQuestionBank = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data) => {
    console.log("Submitted:", data);
  };

  const gathererColumns = [
    { key: "questionTitle", label: t("gatherer.questionBank.table.question") },
    { key: "processor", label: t("gatherer.questionBank.table.processor") },
    { key: "lastUpdate", label: t("gatherer.questionBank.table.lastUpdate") },
    { key: "status", label: t("gatherer.questionBank.table.status") },
    { key: "actions", label: t("gatherer.questionBank.table.actions") },
  ];
  const handleAddQuestion = () => {
    navigate("/gatherer/question-bank/Gatherer-addQuestion");
  };

  const gathererData = [
    {
      id: 1,
      questionTitle: "Cell Theory Basics",
      processor: "John Doe",
      lastUpdate: "Today",
      status: "Approved",
      actionType: "viewicon",
    },
    {
      id: 2,
      questionTitle: "Newton MCQ",
      processor: "John Smith",
      lastUpdate: "Today",
      status: "Approved",
      actionType: "viewicon",
    },
    {
      id: 3,
      questionTitle: "Gravity Concepts",
      processor: "Admin",
      lastUpdate: "Yesterday",
      status: "Sent back",
      actionType: "viewicon",
    },
    {
      id: 4,
      questionTitle: "Organic Chemistry",
      processor: "John Doe",
      lastUpdate: "2 days ago",
      status: "Reject",
      actionType: "viewicon",
    },
  ];

  const handleView = () => {
    navigate("/gatherer/question-bank/Gatherer-QuestionDetail");
  };

  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  const handleCustomAction = (item) => {
    console.log("Custom action for item:", item);
  };

  const stats = [
    { label: t("gatherer.questionBank.stats.questionAdded"), value: 128, color: "blue" },
    { label: t("gatherer.questionBank.stats.pendingReview"), value: 12, color: "red" },
    { label: t("gatherer.questionBank.stats.acceptedByProcessor"), value: 95, color: "red" },
    { label: t("gatherer.questionBank.stats.rejected"), value: 8, color: "red" },
  ];

  const feedbackData = {
    title: "Feedback For Q-ID-12345 Quantum Physics Basis",
    message:
      "\"The wording is unclear and potentially misleading. Please provide more context for the term 'quantum entanglement' and simplify the explanation for beginner audience.\"",
    author: "Possessor A",
  };

  const activityData = [
    {
      icon: "submit",
      title: t("gatherer.questionBank.activity.submitted"),
      timestamp: "Today",
      variant: "default",
    },
    {
      icon: "reject",
      title: t("gatherer.questionBank.activity.rejected"),
      timestamp: "Today",
      variant: "default",
    },
    {
      icon: "approve",
      title: t("gatherer.questionBank.activity.approved"),
      timestamp: "Yesterday",
      variant: "approved",
    },
    {
      icon: "assign",
      title: t("gatherer.questionBank.activity.assigned"),
      timestamp: "2 days ago",
      variant: "default",
    },
  ];

  const workflowSteps = [
    t("gatherer.questionBank.workflowSteps.gatherer"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.creator"),
    t("gatherer.questionBank.workflowSteps.processor"),
    t("gatherer.questionBank.workflowSteps.explainer"),
  ];

  const handleDismiss = () => {
    console.log("Dismissed");
  };

  const _handleEditNotification = () => {
    console.log("Edit Question");
  };

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
          <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo mb-5">
            {t("gatherer.questionBank.mySubmissions")}
          </div>
          <Table
            items={gathererData}
            columns={gathererColumns}
            page={currentPage}
            pageSize={10}
            total={25}
            onPageChange={setCurrentPage}
            onView={handleView}
            onEdit={handleEdit}
            onCustomAction={handleCustomAction}
            emptyMessage={t("gatherer.questionBank.emptyMessage")}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <h1 className="text-[24px] leading-[32px] font-bold font-archivo text-blue-dark mb-4">
            {t("gatherer.questionBank.reviewFeedback")}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Feedback Card and Workflow */}
            <div className="lg:col-span-2 space-y-6">
              <ReviewFeedback
                title={feedbackData.title}
                message={feedbackData.message}
                author={feedbackData.author}
                onDismiss={handleDismiss}
                onEdit={handleEdit}
              />
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
      <UploadFileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default GathererQuestionBank;
