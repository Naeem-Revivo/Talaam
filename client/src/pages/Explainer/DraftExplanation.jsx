import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState } from "react";
import SearchFilter from "../../components/common/SearchFilter";
import { Table } from "../../components/common/TableComponent";

const DraftExplanationPage = () => {
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Define columns for the draft explanation table
  const draftExplanationColumns = [
    { key: "questionTitle", label: "QUESTION TITLE" },
    { key: "lastEdited", label: "LAST EDITED" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTION" },
  ];

  // Sample data matching the image (with the inconsistencies as shown)
  const draftExplanationData = [
    {
      id: 1,
      questionTitle: "Newton MCQ",
      lastEdited: "2 days ago",
      status: "Draft",
      actionType: "continue",
    },
    {
      id: 2,
      questionTitle: "Plant Nutrition",
      lastEdited: "5 days ago",
      status: "Draft",
      actionType: "continue",
    },
    {
      id: 3,
      questionTitle: "Force & Motion",
      lastEdited: "John Doe", // Inconsistent data as shown in image
      status: "Draft",
      actionType: "continue",
    },
    {
      id: 4,
      questionTitle: "Newton MCQ",
      lastEdited: "Ali Raza", // Inconsistent data as shown in image
      status: "Draft",
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

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue mb-2">
              Draft Explanations
            </h1>
          </div>
          <OutlineButton text="Back" className="py-[10px] px-5" />
        </header>

        <SearchFilter
          searchValue={search}
          subjectValue={subject}
          topicValue={topic}
          subtopicValue={subtopic}
          onSearchChange={setSearch}
          onSubjectChange={setSubject}
          onTopicChange={setTopic}
          onSubtopicChange={setSubtopic}
          subjectOptions={subjectOptions}
          topicOptions={topicOptions}
          subtopicOptions={subtopicOptions}
          searchPlaceholder="Search draft explanations..."
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
          emptyMessage="No questions found"
        />
      </div>
    </div>
  );
};

export default DraftExplanationPage;
