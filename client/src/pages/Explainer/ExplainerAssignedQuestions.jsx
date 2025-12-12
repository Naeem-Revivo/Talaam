import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useCallback, useMemo } from "react";
import SearchFilter from "../../components/common/SearchFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import subjectsAPI from "../../api/subjects";
import Loader from "../../components/common/Loader";

const ExplainerAssignedQuestions = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [questionsData, setQuestionsData] = useState([]);
  const [allQuestionsData, setAllQuestionsData] = useState([]);
  const [total, setTotal] = useState(0);
  const [subjects, setSubjects] = useState([]);

  // Define columns for the assigned questions table
  const assignedQuestionsColumns = [
    { key: 'questionTitle', label: t("explainer.assignedQuestions.table.question") || "Question" },
    { key: 'subject', label: t("explainer.assignedQuestions.table.subject") || "Subject" },
    { key: 'processor', label: t("explainer.assignedQuestions.table.processor") || "Processor" },
    { key: 'status', label: t("explainer.assignedQuestions.table.status") || "Status" },
    { key: 'updatedOn', label: t("explainer.assignedQuestions.table.updatedOn") || "Updated On" },
    { key: 'actions', label: t("explainer.assignedQuestions.table.actions") || "Actions" }
  ];

  // Format date to "Today", "Yesterday", or formatted date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Today";
    } else if (date.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  // Map status to display status
  const mapStatus = (status, hasExplanation) => {
    // Pending - yet to add explanation (pending_explainer without explanation)
    if (status === 'pending_explainer' && !hasExplanation) {
      return 'Pending';
    }
    // Pending Review - pending from processor (pending_processor or pending_explainer with explanation)
    if (status === 'pending_processor' || (status === 'pending_explainer' && hasExplanation)) {
      return 'Pending Review';
    }
    // Completed
    if (status === 'completed' || status === 'approved') {
      return 'Completed';
    }
    // Rejected
    if (status === 'rejected') {
      return 'Rejected';
    }
    return status || '—';
  };

  // Transform API response to table format
  const transformQuestionData = (questions) => {
    return questions.map((question) => {
      const processorName = question.assignedProcessor?.name || 
                           question.assignedProcessor?.fullName || 
                           question.approvedBy?.name ||
                           question.approvedBy?.fullName ||
                           "—";

      const subjectName = question.subject?.name || "—";
      
      const questionText = question.questionText || question.question || "";
      const questionTitle = questionText 
        ? (questionText.length > 50 
            ? questionText.substring(0, 50) + "..." 
            : questionText)
        : "—";

      const hasExplanation = question.explanation && question.explanation.trim().length > 0;
      const status = mapStatus(question.status, hasExplanation);

      return {
        id: question.id || question._id,
        questionTitle: questionTitle,
        subject: subjectName,
        processor: processorName,
        status: status,
        updatedOn: formatDate(question.updatedAt || question.createdAt),
        actionType: 'view',
        originalData: question
      };
    });
  };

  // Fetch assigned questions from API - get all questions assigned to explainer
  const fetchAssignedQuestions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch questions with all relevant statuses for explainer
      const statusesToFetch = ['pending_explainer', 'pending_processor', 'completed', 'rejected'];
      const allQuestions = [];
      
      // Fetch questions for each status
      for (const status of statusesToFetch) {
        try {
          const response = await questionsAPI.getExplainerQuestions({ status });
          if (response.success && response.data?.questions) {
            allQuestions.push(...response.data.questions);
          }
        } catch (err) {
          console.warn(`Failed to fetch questions with status ${status}:`, err);
        }
      }
      
      // Remove duplicates based on question ID
      const uniqueQuestions = Array.from(
        new Map(allQuestions.map(q => [q.id || q._id, q])).values()
      );
      
      const transformedData = transformQuestionData(uniqueQuestions);
      
      setAllQuestionsData(uniqueQuestions);
      setQuestionsData(transformedData);
      setTotal(transformedData.length);
    } catch (error) {
      console.error('Error fetching assigned questions:', error);
      setAllQuestionsData([]);
      setQuestionsData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch subjects for filter
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectsAPI.getAllSubjects();
        let subjectsList = [];
        
        if (response.success) {
          if (response.data?.subjects && Array.isArray(response.data.subjects)) {
            subjectsList = response.data.subjects;
          } else if (Array.isArray(response.data)) {
            subjectsList = response.data;
          }
        }
        
        setSubjects(subjectsList);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchAssignedQuestions();
  }, [fetchAssignedQuestions]);

  // Get unique subjects from questions for filter
  const getSubjectOptions = () => {
    const subjectSet = new Set();
    allQuestionsData.forEach(q => {
      const subjectName = q.subject?.name;
      if (subjectName) {
        subjectSet.add(subjectName);
      }
    });
    return ["All Subject", ...Array.from(subjectSet).sort()];
  };

  const subjectOptions = getSubjectOptions();
  const subtopicOptions = ["All Status", "Pending", "Pending Review", "Completed", "Rejected"];

  // Apply filters
  const filteredData = useMemo(() => {
    let filtered = [...questionsData];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((item) => {
        return (
          item.questionTitle?.toLowerCase().includes(searchLower) ||
          item.subject?.toLowerCase().includes(searchLower) ||
          item.processor?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by subject
    if (subject && subject !== "All Subject") {
      filtered = filtered.filter((item) => {
        const questionSubject = item.originalData?.subject?.name || "";
        return questionSubject.toLowerCase() === subject.toLowerCase();
      });
    }

    // Filter by status
    if (subtopic && subtopic !== "All Status") {
      filtered = filtered.filter((item) => {
        const itemStatus = item.status?.toLowerCase();
        const filterStatus = subtopic.toLowerCase();
        return itemStatus === filterStatus;
      });
    }

    return filtered;
  }, [search, subject, subtopic, questionsData]);

  // Handler for view action
  const handleView = (item) => {
    if (item.originalData?.id) {
      navigate(`/explainer/question-bank/question/${item.originalData.id}`);
    }
  };

  const handleCancel = () => {
    navigate("/explainer/question-bank");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue mb-2">
              {t("explainer.assignedQuestions.title") || "Assigned Questions"}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("explainer.assignedQuestions.subtitle") || "View all questions where you have added explanations"}
            </p>
          </div>
          <OutlineButton 
            text={t("explainer.assignedQuestions.back") || "Back"} 
            className="py-[10px] px-5" 
            onClick={handleCancel}
          />
        </header>

        <SearchFilter
          searchValue={search}
          subjectValue={subject}
          subtopicValue={subtopic}
          onSearchChange={setSearch}
          onSubjectChange={setSubject}
          onSubtopicChange={setSubtopic}
          subjectOptions={subjectOptions}
          subtopicOptions={subtopicOptions}
          subjectLabel="All Subject"
          subtopicLabel="All Status"
          searchPlaceholder={t("explainer.assignedQuestions.searchPlaceholder") || "Search questions..."}
        />

        {loading ? (
          <Loader 
            size="lg" 
            color="oxford-blue" 
            text={t("explainer.assignedQuestions.loading") || "Loading..."}
            className="py-12 min-h-[300px]"
          />
        ) : (
          <Table
            items={filteredData.slice((currentPage - 1) * 10, currentPage * 10)}
            columns={assignedQuestionsColumns}
            page={currentPage}
            pageSize={10}
            total={filteredData.length}
            onPageChange={setCurrentPage}
            onView={handleView}
            emptyMessage={t("explainer.assignedQuestions.emptyMessage") || "No assigned questions found"}
          />
        )}
      </div>
    </div>
  );
};

export default ExplainerAssignedQuestions;

