
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState } from "react";
import SearchFilter from "../../components/common/SearchFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";


const CompletedQuestionPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Define columns for the completed questions table
  const completedQuestionsColumns = [
    { key: 'questionTitle', label: 'QUESTION TITLE' },
    { key: 'processor', label: 'PROCESSOR' },
    { key: 'variants', label: 'VARIANTS' },
    { key: 'completedOn', label: 'COMPLETED ON' },
    { key: 'actions', label: 'ACTIONS' }
  ];

  // Sample data matching the image
  const completedQuestionsData = [
    {
      id: 1,
      questionTitle: 'Plant Cell Functions',
      processor: 'Ali Raza',
      variants: 2,
      completedOn: 'Today',
      actionType: 'view'
    },
    {
      id: 2,
      questionTitle: 'Newton\'s 3rd Law',
      processor: 'Sarah',
      variants: 3,
      completedOn: 'Today',
      actionType: 'view'
    },
    {
      id: 3,
      questionTitle: 'Chemical Reactions',
      processor: 'John Doe',
      variants: 2,
      completedOn: 'Yesterday',
      actionType: 'view'
    },
    {
      id: 4,
      questionTitle: 'Plant Cell Functions',
      processor: 'Ali Raza',
      variants: 5,
      completedOn: 'Today',
      actionType: 'view'
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
  const topicOptions = ["Processor", "Approved", "Failed", "Reject"];
  const subtopicOptions = ["Date", "Medium", "Easy", "Hard"];


  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue mb-2">
              Completed Questions
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              Review, refine, and create variant for questions assigned to you.
            </p>
          </div>
            <OutlineButton text="Back" className="py-[10px] px-5" onClick={handleCancel}/>
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
        items={completedQuestionsData}
        columns={completedQuestionsColumns}
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
        emptyMessage="No questions found"
      />
      </div>
    </div>
  );
};

export default CompletedQuestionPage;
