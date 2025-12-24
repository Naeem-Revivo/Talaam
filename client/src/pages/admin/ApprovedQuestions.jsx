import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect } from "react";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../../components/common/SearchFilter";
import questionsAPI from "../../api/questions";
import subjectsAPI from "../../api/subjects";
import examsAPI from "../../api/exams";
import topicsAPI from "../../api/topics";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import Loader from "../../components/common/Loader";
import { cleanHtmlForDisplay } from "../../utils/textUtils";

const ApprovedQuestions = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState(""); // For the input field
  const [subject, setSubject] = useState("");
  const [exam, setExam] = useState("");
  const [topic, setTopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [subjectOptions, setSubjectOptions] = useState([
    { label: t("admin.approvedQuestion.filter.subject"), value: "" }
  ]);
  const [examOptions, setExamOptions] = useState([
    { label: t("admin.approvedQuestion.filter.exam"), value: "" }
  ]);
  const [topicOptions, setTopicOptions] = useState([
    { label: t("admin.approvedQuestion.filter.topic"), value: "" }
  ]);

  // Updated columns to match the image but with actions column
 const processedColumns = [
    { key: 'question', label: t("admin.approvedQuestion.table.question") },
    { key: 'subject', label: t("admin.approvedQuestion.table.subject") },
    { key: 'exam', label: t("admin.approvedQuestion.table.exam") },
    { key: 'topic', label: t("admin.approvedQuestion.table.topic") },
    { key: 'status', label: t("admin.approvedQuestion.table.status") },
    { key: 'actions', label: t("admin.approvedQuestion.table.actions") }
  ];

  // Fetch approved questions
  const fetchApprovedQuestions = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };
      
      if (search) params.search = search;
      if (subject && subject !== "") params.subject = subject;
      if (exam && exam !== "") params.exam = exam;
      if (topic && topic !== "") params.topic = topic;

      const response = await questionsAPI.getApprovedQuestions(params);
      
      if (response.success) {
        // Clean question text to remove code tags with data attributes
        const cleanedQuestions = (response.data.questions || []).map(q => ({
          ...q,
          question: q.question ? cleanHtmlForDisplay(q.question) : q.question
        }));
        setQuestions(cleanedQuestions);
        setTotal(response.data.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching approved questions:", error);
      showErrorToast(error.message || "Failed to fetch approved questions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options (subjects, exams, topics)
  const fetchFilterOptions = async () => {
    try {
      // Fetch subjects
      const subjectsResponse = await subjectsAPI.getAllSubjects();
      if (subjectsResponse.success && subjectsResponse.data) {
        const subjects = Array.isArray(subjectsResponse.data) 
          ? subjectsResponse.data 
          : subjectsResponse.data.subjects || [];
        setSubjectOptions([
          { label: t("admin.approvedQuestion.filter.subject"), value: "" },
          ...subjects.map((s) => ({
            label: s.name,
            value: s.id,
          }))
        ]);
      }

      // Fetch exams
      const examsResponse = await examsAPI.getAllExams({ status: 'active' });
      if (examsResponse.success && examsResponse.data) {
        const exams = Array.isArray(examsResponse.data)
          ? examsResponse.data
          : examsResponse.data.exams || [];
        setExamOptions([
          { label: t("admin.approvedQuestion.filter.exam"), value: "" },
          ...exams.map((e) => ({
            label: e.name,
            value: e.id,
          }))
        ]);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  // Fetch topics when subject changes
  const fetchTopicsBySubject = async (subjectId) => {
    if (!subjectId) {
      setTopicOptions([
        { label: t("admin.approvedQuestion.filter.topic"), value: "" }
      ]);
      return;
    }

    try {
      // Use topics API with parentSubject parameter
      const response = await topicsAPI.getAllTopics({ parentSubject: subjectId });
      if (response.success && response.data) {
        const topics = Array.isArray(response.data)
          ? response.data
          : response.data.topics || [];
        setTopicOptions([
          { label: t("admin.approvedQuestion.filter.topic"), value: "" },
          ...topics.map((t) => ({
            label: t.name,
            value: t.id,
          }))
        ]);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      setTopicOptions([
        { label: t("admin.approvedQuestion.filter.topic"), value: "" }
      ]);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchApprovedQuestions();
  }, [currentPage, search, subject, exam, topic]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch topics when subject changes
  useEffect(() => {
    if (subject) {
      fetchTopicsBySubject(subject);
      // Reset topic when subject changes
      setTopic("");
    } else {
      setTopicOptions([
        { label: t("admin.approvedQuestion.filter.topic"), value: "" }
      ]);
      setTopic("");
    }
  }, [subject]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, subject, exam, topic]);

  // Handler for visibility toggle
  const handleToggle = async (item) => {
    try {
      const newVisibility = !item.visibility;
      
      await questionsAPI.toggleQuestionVisibility(item.id, newVisibility);
      
      // Update local state optimistically
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === item.id
            ? {
                ...q,
                visibility: newVisibility,
                status: newVisibility ? 'Visible' : 'Hidden',
              }
            : q
        )
      );
      
      showSuccessToast(
        `Question ${newVisibility ? 'shown' : 'hidden'} successfully`
      );
    } catch (error) {
      console.error("Error toggling visibility:", error);
      showErrorToast(error.message || "Failed to toggle question visibility");
    }
  };

  // Handler for view action
  const handleView = (item) => {
    console.log('View item:', item);
    // Navigate to question detail page if needed
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
          searchValue={searchInput}
          subjectValue={subject}
          topicValue={exam}  // Note: We're using 'exam' state for topicValue prop
          subtopicValue={topic} // Note: We're using 'topic' state for subtopicValue prop
          onSearchChange={setSearchInput}
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

      {loading ? (
        <Loader 
          size="lg" 
          color="oxford-blue" 
          text="Loading..."
          className="py-12"
        />
      ) : (
      <Table
          items={questions}
        columns={processedColumns}
        page={currentPage}
        pageSize={10}
          total={total}
        onPageChange={setCurrentPage}
        onView={handleView}
        onCustomAction={handleToggle}
        emptyMessage={t("processor.allProcessedQuestions.emptyMessage")}
      />
      )}
      </div>
    </div>
  );
};

export default ApprovedQuestions;