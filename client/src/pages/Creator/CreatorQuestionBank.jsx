import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { Table } from "../../components/common/TableComponent";
import { useState } from "react";
import WorkflowProgress from "../../components/gatherer/WorkflowProgress";
import RecentActivity from "../../components/gatherer/RecentActiveity";
import { useNavigate } from "react-router-dom";

const CreatorQuestionBank = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (data) => {
    console.log("Submitted:", data);
  };

  const questionReasonsColumns = [
    { key: "questionTitle", label: "QUESTION TITLE" },
    { key: "reason", label: "REASON" },
    { key: "processor", label: "PROCESSOR" },
    { key: "actions", label: "ACTIONS" },
  ];

  // Sample data matching the image
  const questionReasonsData = [
    {
      id: 1,
      questionTitle: "Newton Laws MCQ",
      reason: "Previous word in option C",
      processor: "John Smith",
      actionType: "fix",
    },
    {
      id: 2,
      questionTitle: "Organic Chemistry",
      reason: "Previous word in option D",
      processor: "John Smith",
      actionType: "fix",
    },
  ];

  // Define columns for the assigned questions table
  const assignedQuestionsColumns = [
    { key: "questionTitle", label: "QUESTION TITLE" },
    { key: "fromProcessor", label: "FROM PROCESSOR" },
    { key: "difficulty", label: "DIFFICULTY" },
    { key: "updateOn", label: "UPDATE ON" },
    { key: "actions", label: "ACTIONS" },
  ];

  // Sample data matching the image
  const assignedQuestionsData = [
    {
      id: 1,
      questionTitle: "Plant Cell Basics",
      fromProcessor: "John Doe",
      difficulty: "Easy",
      updateOn: "Today",
      actionType: "open",
    },
    {
      id: 2,
      questionTitle: "Newton's 1st Law",
      fromProcessor: "John Smith",
      difficulty: "Medium",
      updateOn: "Today",
      actionType: "createVariant",
    },
    {
      id: 3,
      questionTitle: "Chemical Bonding",
      fromProcessor: "Sarah",
      difficulty: "Hard",
      updateOn: "Yesterday",
      actionType: "open",
    },
    {
      id: 4,
      questionTitle: "Plant Cell Basics",
      fromProcessor: "Ali Raza",
      difficulty: "Easy",
      updateOn: "Yesterday",
      actionType: "createVariant",
    },
  ];
  const handleAssignQuestion = () => {
    navigate("/creator/question-bank/assigned-question");
  };

  const handleCompletedQuestion = () => {
    navigate("/creator/question-bank/completed-question");
  };

  const handleCreateVariant = () => {
    navigate("/creator/question-bank/create-variants");
  };

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
    { label: "Questions Assigned", value: 128, color: "blue" },
    { label: "Variants Pending", value: 12, color: "blue" },
    { label: "Completed", value: 95, color: "red" },
    { label: "Sent back by processor", value: 8, color: "red" },
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
      title: "Submitted Variants for “Biology: Mitosis vs.Meiosis",
      timestamp: "Today",
      variant: "default",
    },
    {
      icon: "reject",
      title: 'Feedback received for “Physics: Thermodynamics"',
      timestamp: "Today",
      variant: "default",
    },
    {
      icon: "approve",
      title: "Completed “History: Causes of world war 1”",
      timestamp: "Yesterday",
      variant: "approved",
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
              Creator Dashboard
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              Improve questions,create variants,and submit enhanced versions for
              final review.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
            <OutlineButton
              text="Completed Questions"
              onClick={handleCompletedQuestion}
              className="py-[10px] px-[14px]"
            />

            <OutlineButton
              text="Create Variants"
              onClick={handleCreateVariant}
              className="py-[10px] px-[14px]"
            />

            <PrimaryButton
              text="Assigned Questions"
              className="py-[10px] px-5"
              onClick={handleAssignQuestion}
            />
          </div>
        </header>

        <StatsCards stats={stats} />

        <div>
          <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo mb-5">
            Sent Back by Processor
          </div>
          <Table
            items={questionReasonsData}
            columns={questionReasonsColumns}
            page={1}
            pageSize={10}
            total={3}
            onPageChange={() => {}}
            // onCustomAction={handleFix}
            emptyMessage="No questions with reasons found"
            showPagination={false} 
          />
        </div>

        <div>
          <h2 className="text-[24px] leading-[32px] font-bold font-archivo text-blue-dark mb-5">
            Workflow Progress
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Feedback Card and Workflow */}
            <div className="lg:col-span-2 space-y-6">
              <WorkflowProgress steps={workflowSteps} currentStep={3} />
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
    </div>
  );
};

export default CreatorQuestionBank;
