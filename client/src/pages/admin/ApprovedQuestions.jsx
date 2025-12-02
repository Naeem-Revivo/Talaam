import { useLanguage } from "../../context/LanguageContext";
import { useState } from "react";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../../components/common/SearchFilter";

const ApprovedQuestions = () => {
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [exam, setExam] = useState("");
  const [topic, setTopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Updated columns to match the image but with actions column
 const processedColumns = [
    { key: 'question', label: t("admin.approvedQuestion.table.question") },
    { key: 'subject', label: t("admin.approvedQuestion.table.subject") },
    { key: 'exam', label: t("admin.approvedQuestion.table.exam") },
    { key: 'topic', label: t("admin.approvedQuestion.table.topic") },
    { key: 'status', label: t("admin.approvedQuestion.table.status") },
    { key: 'actions', label: t("admin.approvedQuestion.table.actions") }
  ];

  // Sample data matching the image exactly with actionType as 'toggle'
  const processedData = [
    {
      id: 1,
      question: 'What is the Capital of France?',
      subject: 'Geography',
      exam: 'World Capitals Quiz',
      topic: 'European Capitals',
      status: 'Visible',
      actionType: 'toggle',
      visibility: true // true for visible, false for hidden
    },
    {
      id: 2,
      question: 'Solve for x: 2x + 5 = 15',
      subject: 'Mathematics',
      exam: 'Algebra',
      topic: 'Linear Equations',
      status: 'Hidden',
      actionType: 'toggle',
      visibility: false
    },
    {
      id: 3,
      question: 'Who wrote "To Kill a Mockingbird"?',
      subject: 'Literature',
      exam: 'American Literature',
      topic: '20th Century Novels',
      status: 'Visible',
      actionType: 'toggle',
      visibility: true
    },
    {
      id: 4,
      question: 'What is the powerhouse of the cell?',
      subject: 'Biology',
      exam: 'Cellular Biology',
      topic: 'Organelles',
      status: 'Hidden',
      actionType: 'toggle',
      visibility: false
    }
  ];

  const subjectOptions = [
    { label: t("admin.approvedQuestion.filter.subject"), value: 'All' },
    { label: 'Geography', value: 'Geography' },
    { label: 'Mathematics', value: 'Mathematics' },
    { label: 'Literature', value: 'Literature' },
    { label: 'Biology', value: 'Biology' }
  ];

  const examOptions = [
    { label: t("admin.approvedQuestion.filter.exam"), value: 'All' },
    { label: 'Algebra', value: 'Algebra' },
    { label: 'American Literature', value: 'American Literature' },
    { label: 'Cellular Biology', value: 'Cellular Biology' }
  ];

  const topicOptions = [
    { label: t("admin.approvedQuestion.filter.topic"), value: 'All' },
    { label: 'Linear Equations', value: 'Linear Equations' },
    { label: '20th Century Novels', value: '20th Century Novels' },
    { label: 'Organelles', value: 'Organelles' }
  ];

  // Handler for visibility toggle
  const handleToggle = (item) => {
    console.log('Toggle visibility for item:', item.id, 'current:', item.visibility);
    // Toggle the visibility
    // Example: setProcessedData(prev => prev.map(i => 
    //   i.id === item.id ? {...i, visibility: !i.visibility, status: !i.visibility ? 'Visible' : 'Hidden'} : i
    // ));
  };

  // Handler for view action
  const handleView = (item) => {
    console.log('View item:', item);
  };

  const handleCancel = () => {
    navigate("/processor/question-bank");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
             {t("admin.approvedQuestion.heading")}
            </h1>
          </div>
        </header>

        <SearchFilter
          searchValue={search}
          subjectValue={subject}
          topicValue={exam}  // Note: We're using 'exam' state for topicValue prop
          subtopicValue={topic} // Note: We're using 'topic' state for subtopicValue prop
          onSearchChange={setSearch}
          onSubjectChange={setSubject}
          onTopicChange={setExam}  // This sets the exam state
          onSubtopicChange={setTopic} // This sets the topic state
          searchPlaceholder={t("admin.approvedQuestion.filter.search")}
          subjectLabel={t("admin.approvedQuestion.filter.subject")}
          topicLabel={t("admin.approvedQuestion.filter.exam")} // Changed from "Gatherer" to "Exam"
          subtopicLabel={t("admin.approvedQuestion.filter.topic")} // Changed from "Status" to "Topic"
          subjectOptions={subjectOptions}
          topicOptions={examOptions} // Passing exam options as topicOptions
          subtopicOptions={topicOptions} // Passing topic options as subtopicOptions
        />

      <Table
        items={processedData}
        columns={processedColumns}
        page={currentPage}
        pageSize={10}
        total={25}
        onPageChange={setCurrentPage}
        onView={handleView}
        onCustomAction={handleToggle}
        emptyMessage={t("processor.allProcessedQuestions.emptyMessage")}
      />
      </div>
    </div>
  );
};

export default ApprovedQuestions;