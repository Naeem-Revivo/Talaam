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
    { key: "questionTitle", label: t("explainer.questionBank.table.question") },
    { key: "fromProcessor", label: t("explainer.questionBank.table.fromProcessor") },
    { key: "difficulty", label: t("explainer.questionBank.table.difficulty") },
    { key: "finalUpdate", label: t("explainer.questionBank.table.finalUpdate") },
    { key: "actions", label: t("explainer.questionBank.table.actions") },
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
    t("explainer.questionBank.workflowSteps.gatherer"),
    t("explainer.questionBank.workflowSteps.processor"),
    t("explainer.questionBank.workflowSteps.creator"),
    t("explainer.questionBank.workflowSteps.processor"),
    t("explainer.questionBank.workflowSteps.explainer"),
  ];

  const activityData = [
    {
      icon: "submit",
      title: t("explainer.questionBank.activity.addedDiagrams", { count: 2 }),
      timestamp: "Today",
      variant: "default",
    },
    {
      icon: "reject",
      title: t("explainer.questionBank.activity.sentBack", { item: "NewtonVariant" }),
      timestamp: "Today",
      variant: "default",
    },
    {
      icon: "approve",
      title: t("explainer.questionBank.activity.completedExplanation", { item: "Force & Motion" }),
      timestamp: "Yesterday",
      variant: "approved",
    },
  ];

  const stats = [
    { label: t("explainer.questionBank.stats.questionsNeedingExplanation"), value: 12, color: "blue" },
    { label: t("explainer.questionBank.stats.completedExplanations"), value: 84, color: "blue" },
    { label: t("explainer.questionBank.stats.draftExplanations"), value: 5, color: "red" },
    { label: t("explainer.questionBank.stats.sentBackForRevision"), value: 2, color: "red" },
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
              {t("explainer.questionBank.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("explainer.questionBank.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
            <OutlineButton
              text={t("explainer.questionBank.draft")}
                onClick={handleDraftExplanation}
              className="py-[10px] px-9"
            />

            <OutlineButton
              text={t("explainer.questionBank.completed")}
                onClick={handleCompletedExplanation}
              className="py-[10px] px-6"
            />

            <PrimaryButton
              text={t("explainer.questionBank.addExplanation")}
              className="py-[10px] px-8"
                onClick={handleAddExplanation}
            />
          </div>
        </header>

        <StatsCards stats={stats} />

        <div>
          <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo mb-5">
            {t("explainer.questionBank.pendingExplanations")}
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
            emptyMessage={t("explainer.questionBank.emptyMessage")}
          />
        </div>

        <div>
          <h2 className="text-[24px] leading-[32px] font-bold font-archivo text-blue-dark mb-5">
            {t("explainer.questionBank.workflowProgress")}
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
                  {t("explainer.questionBank.recentActivity")}
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
