
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";

const GathererSubmission = () => {
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

   const gathererSubmissionColumns = [
    { key: 'questionTitle', label: 'QUESTION TITLE' },
    { key: 'gatherer', label: 'GATHERER' },
    { key: 'uploadOn', label: 'UPLOAD ON' },
    { key: 'status', label: 'STATUS' },
    { key: 'actions', label: 'ACTIONS' }
  ];

  // Sample data matching the image
  const gathererSubmissionData = [
    {
      id: 1,
      questionTitle: 'Newton\'s 2nd Law',
      gatherer: 'Ali Raza',
      uploadOn: 'Today',
      status: 'Accepted',
      actionType: 'view'
    },
    {
      id: 2,
      questionTitle: 'Photosynthesis',
      gatherer: 'Sarah',
      uploadOn: 'Today',
      status: 'Accepted',
      actionType: 'view'
    },
    {
      id: 3,
      questionTitle: 'Acid Base Theory',
      gatherer: 'John Doe',
      uploadOn: 'Yesterday',
      status: 'Fix Request',
      actionType: 'view'
    },
    {
      id: 4,
      questionTitle: 'Newton\'s 2nd Law',
      gatherer: 'Ali Raza',
      uploadOn: 'Today',
      status: 'Reject',
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

  const stats=[
    { label: "New Questions to Review", value: 124, color: "blue" },
    { label: "Creator Submissions", value: 12, color: "blue" },
    { label: "Accepted (Today)", value: 32, color: "red" },
    { label: "Rejected (Today)", value: 8, color: "red" }
  ]


  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              Gatherer Submissions
            </h1>
          </div>
            <OutlineButton text="Back" className="py-[10px] px-5"/>
        </header>

        <ProcessorFilter
        searchValue={search}
        subjectValue={subject}
        topicValue={topic}
        subtopicValue={subtopic}
        onSearchChange={setSearch}
        onSubjectChange={setSubject}
        onTopicChange={setTopic}
        onSubtopicChange={setSubtopic}
      />

      <Table
        items={gathererSubmissionData}
        columns={gathererSubmissionColumns}
        page={currentPage}
        pageSize={10}
        total={25}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
        onCustomAction={handleReview}
        emptyMessage="No questions found"
      />
      </div>
    </div>
  );
};

export default GathererSubmission;
