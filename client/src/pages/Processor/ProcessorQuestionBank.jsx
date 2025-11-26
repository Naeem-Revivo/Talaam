import { useLanguage } from "../../context/LanguageContext";
import { PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { useState } from "react";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import WorkflowProgress from "../../components/gatherer/WorkflowProgress";
import RecentActivity from "../../components/gatherer/RecentActiveity";
import SearchFilter from "../../components/common/SearchFilter";

const ProcessorQuestionBank = () => {
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

   const subjectOptions = ["Subject", "Mathematics", "Physics", "Chemistry", "Biology"];
  const topicOptions = ["Status", "Approved", "Failed", "Reject"];
  
  // Note: topicLabel is used for Status dropdown, subjectLabel for Subject dropdown

  // Define columns for the gatherer table
  const gathererColumns = [
    { key: "questionTitle", label: t("processor.questionBank.table.question") },
    { key: "gatherer", label: t("processor.questionBank.table.gatherer") },
    { key: "dateSubmitted", label: t("processor.questionBank.table.dateSubmitted") },
    { key: "difficulty", label: t("processor.questionBank.table.subject") },
    { key: "actions", label: t("processor.questionBank.table.actions") },
  ];

  // Sample data matching the image
  const gathererData = [
    {
      id: 1,
      questionTitle: "Plant Cell Basics",
      gatherer: "Ali Raza",
      dateSubmitted: "Today",
      difficulty: "Easy",
      actionType: "review",
    },
    {
      id: 2,
      questionTitle: "Newton's First Law",
      gatherer: "Sarah",
      dateSubmitted: "Today",
      difficulty: "Medium",
      actionType: "review",
    },
    {
      id: 3,
      questionTitle: "Organic Chemistry MCQ",
      gatherer: "John Doe",
      dateSubmitted: "Yesterday",
      difficulty: "Hard",
      actionType: "review",
    },
    {
      id: 4,
      questionTitle: "Plant Cell Basics",
      gatherer: "Ali Raza",
      dateSubmitted: "Today",
      difficulty: "Easy",
      actionType: "review",
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
  ];

  const stats = [
    { label: t("processor.questionBank.stats.newQuestionGatherer"), value: 14, color: "blue" },
    { label: t("processor.questionBank.stats.explanationPending"), value: 4, color: "blue" },
    { label: t("processor.questionBank.stats.finalApprovalToday"), value: 5, color: "red" },
  ];

  const handleProcessedQuestion = () => {
    navigate("/processor/Processed-Question");
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
          subjectOptions={subjectOptions}
          topicOptions={topicOptions}
          topicLabel="Status"
          subjectLabel="Subject"
          searchPlaceholder={t("processor.questionBank.searchPlaceholder")}
        />

        <Table
          items={gathererData}
          columns={gathererColumns}
          page={currentPage}
          pageSize={10}
          total={25}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onCustomAction={handleReview}
          emptyMessage={t("processor.questionBank.emptyMessage")}
        />

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
