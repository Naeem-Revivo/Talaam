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
    { key: "questionTitle", label: "QUESTION TITLE" },
    { key: "processor", label: "PROCESSOR" },
    { key: "lastUpdate", label: "LAST UPDATE" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTIONS" },
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
      actionType: "view",
    },
    {
      id: 2,
      questionTitle: "Newton MCQ",
      processor: "John Smith",
      lastUpdate: "Today",
      status: "Approved",
      actionType: "update",
    },
    {
      id: 3,
      questionTitle: "Gravity Concepts",
      processor: "Admin",
      lastUpdate: "Yesterday",
      status: "Sent back",
      actionType: "fix",
    },
    {
      id: 4,
      questionTitle: "Organic Chemistry",
      processor: "John Doe",
      lastUpdate: "2 days ago",
      status: "Reject",
      actionType: "fix",
    },
  ];

  const handleView = (item) => {
    navigate("/gatherer/question-bank/Gatherer-QuestionDetail");
  };

  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  const handleCustomAction = (item) => {
    console.log("Custom action for item:", item);
  };

  const stats = [
    { label: "Question Added", value: 128, color: "blue" },
    { label: "Pending Review", value: 12, color: "red" },
    { label: "Accepted By Processor", value: 95, color: "red" },
    { label: "Rejected", value: 8, color: "red" },
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
      title: "You submitted 2 new questions.",
      timestamp: "Today",
      variant: "default",
    },
    {
      icon: "reject",
      title: 'Possessor A rejected Q-ID-112345 for "Improve wording"',
      timestamp: "Today",
      variant: "default",
    },
    {
      icon: "approve",
      title: "Your submission for Q-ID-12345 was approved.",
      timestamp: "Yesterday",
      variant: "approved",
    },
    {
      icon: "assign",
      title: "John smith assigned you Q-ID-2345 for variant creation.",
      timestamp: "2 days ago",
      variant: "default",
    },
  ];

  const workflowSteps = [
    "Gatherer",
    "Processor",
    "Creator",
    "Processor",
    "Explainer",
  ];

  const handleDismiss = () => {
    console.log("Dismissed");
  };

  const handleEditNotification = () => {
    console.log("Edit Question");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              Gatherer Dashboard
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              Submit Questions and track their review progress.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <OutlineButton
              text="Bulk Upload"
              onClick={() => setIsModalOpen(true)}
              className="py-[10px] px-[14px]"
            />

            <PrimaryButton
              text="+ Add New Questions"
              className="py-[10px] px-5"
              onClick={handleAddQuestion}
            />
          </div>
        </header>

        <StatsCards stats={stats} />

        <div>
          <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo mb-5">
            My Submissions
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
            emptyMessage="No questions found"
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <h1 className="text-[24px] leading-[32px] font-bold font-archivo text-blue-dark mb-4">
            Review Feedback
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
                  Workflow Progress
                </h2>
                <WorkflowProgress steps={workflowSteps} currentStep={1} />
              </div>
            </div>

            {/* Right Column - Recent Activity */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
                <h2 className="text-[20px] leading-[28px] font-semibold font-archivo text-blue-dark mb-4">
                  Recent Activity
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
