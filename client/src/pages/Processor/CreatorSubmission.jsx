
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";

const CreaterSubmission = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

    const createSubmissionColumns = [
    { key: 'questionTitle', label: 'QUESTION TITLE' },
    { key: 'creator', label: 'CREATOR' },
    { key: 'variants', label: 'VARIANTS' },
    { key: 'status', label: 'STATUS' },
    { key: 'submittedOn', label: 'SUBMITTED ON' },
    { key: 'actions', label: 'ACTIONS' }
  ];

  // Sample data matching the image
  const createSubmissionData = [
    {
      id: 1,
      questionTitle: 'Newtons 2nd Law',
      creator: 'Ali Raza',
      variants: 3,
      status: 'Approved',
      submittedOn: 'Today',
      actionType: 'review'
    },
    {
      id: 2,
      questionTitle: 'Photosynthesis',
      creator: 'Sarah',
      variants: 2,
      status: 'Approved',
      submittedOn: 'Today',
      actionType: 'review'
    },
    {
      id: 3,
      questionTitle: 'Acid Base Theory',
      creator: 'John Doe',
      variants: 1,
      status: 'Revision',
      submittedOn: 'Yesterday',
      actionType: 'review'
    },
    {
      id: 4,
      questionTitle: 'Newtons 2nd Law',
      creator: 'Ali Raza',
      variants: 5,
      status: 'Pending',
      submittedOn: 'Today',
      actionType: 'review'
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
    navigate("/processor/question-bank");
  };


  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
                Creator Submissions
            </h1>
          </div>
            <OutlineButton text="Back" className="py-[10px] px-5" onClick={handleCancel}/>
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
        items={createSubmissionData}
        columns={createSubmissionColumns}
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

export default CreaterSubmission;
