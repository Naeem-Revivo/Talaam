import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { useState } from "react";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import WorkflowProgress from "../../components/gatherer/WorkflowProgress";
import RecentActivity from "../../components/gatherer/RecentActiveity";

const ExplainerQuestionBank = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const explanationRequestsColumns = [
    { key: "questionTitle", label: "QUESTION TITLE" },
    { key: "fromProcessor", label: "FROM PROCESSOR" },
    { key: "difficulty", label: "DIFFICULTY" },
    { key: "finalUpdate", label: "FINAL UPDATE" },
    { key: "actions", label: "ACTIONS" },
  ];

  // Sample data matching the image (with the typos as shown)
  const explanationRequestsData = [
    {
      id: 1,
      questionTitle: "Photopyrthicetic Basics",
      fromProcessor: "John Doe",
      difficulty: "Easy",
      finalUpdate: "Today",
      actionType: "addExplanation",
    },
    {
      id: 2,
      questionTitle: "Newton's 1st Law",
      fromProcessor: "John Smith",
      difficulty: "Medium",
      finalUpdate: "Today",
      actionType: "addExplanation",
    },
    {
      id: 3,
      questionTitle: "Add Base Theory",
      fromProcessor: "Sarah",
      difficulty: "Heat",
      finalUpdate: "Vesterley",
      actionType: "addExplanation",
    },
  ];

  // Handler for review action
  const handleReview = (item) => {
    console.log("Review item:", item);
    // Add your review logic here
  };

  // Handler for view action (if needed)
  const handleView = () => {
    navigate("/processor/Processed-ViewQuestion");
  };

  // Handler for edit action (if needed)
  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  const workflowSteps = [
    "Gatherer",
    "Processor",
    "Creator",
    "Processor",
    "Explainer",
  ];

  const activityData = [
    {
      icon: "submit",
      title: "You added 2 new diagrams.",
      timestamp: "Today",
      variant: "default",
    },
    {
      icon: "reject",
      title: 'Processor sent back "NewtonVariant". ',
      timestamp: "Today",
      variant: "default",
    },
    {
      icon: "approve",
      title: 'You completed explanation for "Force & Motion"',
      timestamp: "Yesterday",
      variant: "approved",
    },
  ];

  const stats = [
    { label: "Questions Needing Explanation  ", value: 12, color: "blue" },
    { label: "Completed Explanations", value: 84, color: "blue" },
    { label: "Draft Explanations", value: 5, color: "red" },
    { label: "Sent Back for Revision", value: 2, color: "red" },
  ];

  const handleAddExplanation = () => {
    navigate("/explainer/question-bank/add-explanation");
  };

  const handleCompletedExplanation = () => {
    navigate("/explainer/question-bank/completed-explanation");
  };

  const handleDraftExplanation = () => {
    navigate("/explainer/question-bank/draft-explanation");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              Explainer Dashboard
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              Add explanations, diagrams, and supporting notes to finalized
              Questions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
            <OutlineButton
              text="Draft"
                onClick={handleDraftExplanation}
              className="py-[10px] px-9"
            />

            <OutlineButton
              text="Completed"
                onClick={handleCompletedExplanation}
              className="py-[10px] px-6"
            />

            <PrimaryButton
              text="+ Add Explanation"
              className="py-[10px] px-8"
                onClick={handleAddExplanation}
            />
          </div>
        </header>

        <StatsCards stats={stats} />

        <div>
          <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo mb-5">
            Pending Explanations
          </div>
          <Table
            items={explanationRequestsData}
            columns={explanationRequestsColumns}
            page={currentPage}
            pageSize={10}
            total={25}
            onPageChange={setCurrentPage}
            onView={handleView}
            onEdit={handleEdit}
            onCustomAction={() => {
              console.log("custom");
              // Handle different custom actions based on actionType
              //   if (item.actionType === 'open') {
              //     handleOpen(item);
              //   } else if (item.actionType === 'createVariant') {
              //     handleCreateVariant(item);
              //   }
            }}
            emptyMessage="No questions found"
          />
        </div>

        <div>
          <h2 className="text-[24px] leading-[32px] font-bold font-archivo text-blue-dark mb-5">
            Workflow Progress
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Feedback Card and Workflow */}
            <div className="lg:col-span-2 space-y-6">
              <WorkflowProgress steps={workflowSteps} currentStep={5} />
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

export default ExplainerQuestionBank;
