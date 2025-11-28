
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";


const GathererSubmission = () => {
  const { t } = useLanguage();
    const navigate = useNavigate();


  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

   const gathererSubmissionColumns = [
    { key: 'questionTitle', label: t("processor.gathererSubmission.table.question") },
    { key: 'gatherer', label: t("processor.gathererSubmission.table.gatherer") },
    { key: 'uploadOn', label: t("processor.gathererSubmission.table.uploadOn") },
    { key: 'status', label: t("processor.gathererSubmission.table.status") },
    { key: 'actions', label: t("processor.gathererSubmission.table.actions") }
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

  const handleCancel = () => {
    navigate("/processor/question-bank");
  };


  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("processor.gathererSubmission.title")}
            </h1>
          </div>
            <OutlineButton text={t("processor.gathererSubmission.back")} className="py-[10px] px-5" onClick={handleCancel}/>
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
        showRole={false}
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
        emptyMessage={t("processor.gathererSubmission.emptyMessage")}
      />
      </div>
    </div>
  );
};

export default GathererSubmission;
