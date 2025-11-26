
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState } from "react";
import SearchFilter from "../../components/common/SearchFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";


const AssignedQuestionPage = () => {
  const { t } = useLanguage();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const QuestionsColumns = [
    { key: 'questionTitle', label: t("creator.assignedQuestionPage.table.question") },
    { key: 'processor', label: t("creator.assignedQuestionPage.table.processor") },
    { key: 'difficulty', label: t("creator.assignedQuestionPage.table.difficulty") },
    { key: 'updatedOn', label: t("creator.assignedQuestionPage.table.updatedOn") },
    { key: 'actions', label: t("creator.assignedQuestionPage.table.actions") }
  ];

  // Sample data matching the image
  const QuestionsData = [
    {
      id: 1,
      questionTitle: 'Plant Cell Basics',
      processor: 'Ali Raza',
      difficulty: 'Easy',
      updatedOn: 'Today',
      actionType: 'open'
    },
    {
      id: 2,
      questionTitle: 'Newton\'s First Law',
      processor: 'Sarah',
      difficulty: 'Medium',
      updatedOn: 'Today',
      actionType: 'createVariant'
    },
    {
      id: 3,
      questionTitle: 'Organic Chemistry MCQ',
      processor: 'John Doe',
      difficulty: 'Hard',
      updatedOn: 'Yesterday',
      actionType: 'open'
    },
    {
      id: 4,
      questionTitle: 'Plant Cell Basics',
      processor: 'Ali Raza',
      difficulty: 'Easy',
      updatedOn: 'Today',
      actionType: 'open'
    }
  ];

  // Handler for review action
  const handleReview = (item) => {
    console.log('Review item:', item);
    // Add your review logic here
  };

  // Handler for view action (if needed)
  const handleView = (item) => {
    console.log('View item:', item);
  };

  // Handler for edit action (if needed)
  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  const handleCancel = () => {
    navigate("/creator/question-bank");
  };

  const subjectOptions = ["Subject", "Mathematics", "Physics", "Chemistry", "Biology"];
  const topicOptions = ["Difficulty", "Medium", "Easy", "Hard"];
  const subtopicOptions = ["Status", "Approved", "Failed", "Reject"];


  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue mb-2">
              {t("creator.assignedQuestionPage.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("creator.assignedQuestionPage.subtitle")}
            </p>
          </div>
            <OutlineButton text={t("creator.assignedQuestionPage.back")} className="py-[10px] px-5" onClick={handleCancel}/>
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
          searchPlaceholder={t("creator.assignedQuestionPage.searchPlaceholder")}
        />

      <Table
        items={QuestionsData}
        columns={QuestionsColumns}
        page={currentPage}
        pageSize={10}
        total={25}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
        onCustomAction={(item) => {
          // Handle different custom actions based on actionType
          if (item.actionType === 'open') {
            handleOpen(item);
          } else if (item.actionType === 'createVariant') {
            handleCreateVariant(item);
          }
        }}
        emptyMessage={t("creator.assignedQuestionPage.emptyMessage")}
      />
      </div>
    </div>
  );
};

export default AssignedQuestionPage;
