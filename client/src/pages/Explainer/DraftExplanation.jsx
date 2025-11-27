import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState } from "react";
import SearchFilter from "../../components/common/SearchFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";

const DraftExplanationPage = () => {
  const { t } = useLanguage();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Define columns for the draft explanation table
  const draftExplanationColumns = [
    { key: "questionTitle", label: t("explainer.draftExplanation.table.question") },
    { key: "lastEdited", label: t("explainer.draftExplanation.table.lastEdited") },
    { key: "status", label: t("explainer.draftExplanation.table.status") },
    { key: "actions", label: t("explainer.draftExplanation.table.action") },
  ];

  // Sample data matching the image (with the inconsistencies as shown)
  const draftExplanationData = [
    {
      id: 1,
      questionTitle: "Newton MCQ",
      lastEdited: "2 days ago",
      status: "Pending",
      actionType: "continue",
    },
    {
      id: 2,
      questionTitle: "Plant Nutrition",
      lastEdited: "5 days ago",
      status: "Pending",
      actionType: "continue",
    },
    {
      id: 3,
      questionTitle: "Force & Motion",
      lastEdited: "John Doe", // Inconsistent data as shown in image
      status: "Pending",
      actionType: "continue",
    },
    {
      id: 4,
      questionTitle: "Newton MCQ",
      lastEdited: "Ali Raza", // Inconsistent data as shown in image
      status: "Pending",
      actionType: "continue",
    },
  ];

  const subjectOptions = ["Subject", "Mathematics", "Physics", "Chemistry", "Biology"];
  const topicOptions = ["Processor", "Approved", "Failed", "Reject"];
  const subtopicOptions = ["Date", "Medium", "Easy", "Hard"];

  // Handler for review action
  const handleReview = (item) => {
    console.log("Review item:", item);
    // Add your review logic here
  };

  // Handler for view action (if needed)
  const handleView = (item) => {
    console.log("View item:", item);
  };

  // Handler for edit action (if needed)
  const handleEdit = (item) => {
    console.log("Edit item:", item);
  };

  const handleCancel = () => {
    navigate("/explainer/question-bank");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue mb-2">
              {t("explainer.draftExplanation.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("explainer.draftExplanation.subtitle")}
            </p>
          </div>
          <OutlineButton text={t("explainer.draftExplanation.back")} className="py-[10px] px-5" onClick={handleCancel}/>
        </header>

        <SearchFilter
          searchValue={search}
          subtopicValue={subtopic}
          onSearchChange={setSearch}
          onSubjectChange={setSubject}
          onTopicChange={setTopic}
          onSubtopicChange={setSubtopic}
          subtopicOptions={subtopicOptions}
          searchPlaceholder={t("explainer.draftExplanation.searchPlaceholder")}
        />

        <Table
          items={draftExplanationData}
          columns={draftExplanationColumns}
          page={currentPage}
          pageSize={10}
          total={25}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          onCustomAction={(item) => {
            // Handle different custom actions based on actionType
            if (item.actionType === "open") {
              handleOpen(item);
            } else if (item.actionType === "createVariant") {
              handleCreateVariant(item);
            }
          }}
          emptyMessage={t("explainer.draftExplanation.emptyMessage")}
        />
      </div>
    </div>
  );
};

export default DraftExplanationPage;
