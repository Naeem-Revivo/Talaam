
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState } from "react";
import ProcessorFilter from "../../components/Processor/ProcessorFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";


const ExplainerSubmission = () => {
  const { t } = useLanguage();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();


  const explainerColumns = [
    { key: 'questionTitle', label: t("processor.explainerSubmission.table.question") },
    { key: 'explainer', label: t("processor.explainerSubmission.table.explainer") },
    { key: 'explanationSummary', label: t("processor.explainerSubmission.table.explanationSummary") },
    { key: 'submittedOn', label: t("processor.explainerSubmission.table.submittedOn") },
    { key: 'actions', label: t("processor.explainerSubmission.table.actions") }
  ];

  // Sample data matching the image
  const explainerData = [
    {
      id: 1,
      questionTitle: 'Newton\'s 2nd Law',
      explainer: 'Ali Raza',
      explanationSummary: 'Detailed analysis of Newton\'s 2nd Law...',
      submittedOn: 'Today',
      actionType: 'review'
    },
    {
      id: 2,
      questionTitle: 'Photosynthesis',
      explainer: 'Sarah',
      explanationSummary: 'A brief overview of how Photosynthesis ...',
      submittedOn: 'Today',
      actionType: 'review'
    },
    {
      id: 3,
      questionTitle: 'Acid Base Theory',
      explainer: 'John Doe',
      explanationSummary: 'Moderate summary of the...',
      submittedOn: 'Yesterday',
      actionType: 'review'
    },
    {
      id: 4,
      questionTitle: 'Newton\'s 2nd Law',
      explainer: 'Ali Raza',
      explanationSummary: 'Detailed analysis of Newton\'s 2nd Law...',
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
              {t("processor.explainerSubmission.title")}
            </h1>
          </div>
            <OutlineButton text={t("processor.explainerSubmission.back")} className="py-[10px] px-5" onClick={handleCancel}/>
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
        items={explainerData}
        columns={explainerColumns}
        page={currentPage}
        pageSize={10}
        total={25}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
        onCustomAction={handleReview}
        emptyMessage={t("processor.explainerSubmission.emptyMessage")}
      />
      </div>
    </div>
  );
};

export default ExplainerSubmission;
