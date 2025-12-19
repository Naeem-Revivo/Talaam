
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useRef, useCallback } from "react";
import SearchFilter from "../../components/common/SearchFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";


const CompletedQuestionPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsData, setQuestionsData] = useState([]);
  const [allQuestionsData, setAllQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const pollingIntervalRef = useRef(null);

  // Define columns for the completed questions table
  const completedQuestionsColumns = [
    { key: 'questionTitle', label: t("creator.completedQuestionPage.table.question") },
    { key: 'processor', label: t("creator.completedQuestionPage.table.processor") },
    { key: 'variants', label: t("creator.completedQuestionPage.table.variants") },
    { key: 'completedOn', label: t("creator.completedQuestionPage.table.completedOn") },
    { key: 'actions', label: t("creator.completedQuestionPage.table.actions") }
  ];

  // Format date to relative time (Today, Yesterday, or date)
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const questionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (questionDate.getTime() === today.getTime()) {
      return "Today";
    } else if (questionDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Fetch all creator questions once to count variants (memoized to prevent re-fetching)
  const fetchAllCreatorQuestionsForVariants = useCallback(async () => {
    try {
      const statusesToFetch = ['pending_creator', 'pending_processor', 'completed', 'rejected'];
      const allCreatorQuestions = [];
      
      for (const status of statusesToFetch) {
        try {
          const response = await questionsAPI.getCreatorQuestions({ status });
          if (response.success && response.data?.questions) {
            allCreatorQuestions.push(...response.data.questions);
          }
        } catch (err) {
          // Ignore errors
        }
      }
      
      return allCreatorQuestions;
    } catch (err) {
      console.warn('Error fetching creator questions for variants:', err);
      return [];
    }
  }, []);

  // Transform API response to table format
  const transformQuestionData = async (questions, allCreatorQuestions = []) => {
    // Build a map of variants by parent question ID for efficient lookup
    const variantsByParentId = new Map();
    allCreatorQuestions.forEach((q) => {
      const isVariant = q.isVariant === true || q.isVariant === 'true';
      if (isVariant) {
        const originalId = q.originalQuestionId || q.originalQuestion;
        if (originalId) {
          const parentId = String(originalId);
          if (!variantsByParentId.has(parentId)) {
            variantsByParentId.set(parentId, []);
          }
          variantsByParentId.get(parentId).push(q);
        }
      }
    });

    const transformed = questions.map((question) => {
      // Get processor name
      const processorName = question.approvedBy?.name || question.assignedProcessor?.name || "—";
      
      // Extract question title from questionText (first 50 characters)
      const questionTitle = question.questionText 
        ? (question.questionText.length > 50 
            ? question.questionText.substring(0, 50) + "..." 
            : question.questionText)
        : "—";

      // Count variants for this question using the pre-built map
      const questionIdStr = String(question.id || question._id);
      const variants = variantsByParentId.get(questionIdStr) || [];
      const variantCount = variants.length;

      return {
        id: question.id || question._id,
        questionTitle: questionTitle,
        processor: processorName,
        variants: variantCount,
        completedOn: formatDate(question.updatedAt),
        actionType: 'view',
        originalData: question
      };
    });
    
    return transformed;
  };

  // Fetch completed questions from API
  const fetchCompletedQuestions = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Fetch only completed questions
      const response = await questionsAPI.getCreatorQuestions({ status: 'completed' });
      
      if (response.success && response.data?.questions) {
        const questions = response.data.questions;
        // Fetch all creator questions once for variant counting
        const allCreatorQuestions = await fetchAllCreatorQuestionsForVariants();
        const transformedData = await transformQuestionData(questions, allCreatorQuestions);
        setAllQuestionsData(transformedData);
        setTotalQuestions(transformedData.length);
        // Don't call applyFilters here - let the useEffect handle it
      } else {
        setAllQuestionsData([]);
        setTotalQuestions(0);
        setQuestionsData([]);
      }
    } catch (err) {
      console.error("Error fetching completed questions:", err);
      setError(err.message || "Failed to fetch questions");
      setQuestionsData([]);
      setAllQuestionsData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAllCreatorQuestionsForVariants]);

  // Apply client-side filters (memoized to prevent unnecessary re-renders)
  const applyFilters = useCallback((data) => {
    let filtered = [...data];

    // Filter by search term
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((item) =>
        item.questionTitle.toLowerCase().includes(searchLower) ||
        item.processor.toLowerCase().includes(searchLower)
      );
    }

    // Filter by subject
    if (subject && subject !== "Subject") {
      filtered = filtered.filter((item) => {
        const questionSubject = item.originalData?.subject?.name || "";
        return questionSubject.toLowerCase() === subject.toLowerCase();
      });
    }

    setQuestionsData(filtered);
    setTotalQuestions(filtered.length);
    setCurrentPage(1);
  }, [search, subject, topic, subtopic]);

  // Apply filters when filter values or data change
  useEffect(() => {
    if (allQuestionsData.length > 0) {
      applyFilters(allQuestionsData);
    }
  }, [allQuestionsData, applyFilters]);

  // Set up polling for real-time updates
  useEffect(() => {
    fetchCompletedQuestions();

    // Set up polling every 30 seconds (increased to reduce re-renders)
    pollingIntervalRef.current = setInterval(() => {
      fetchCompletedQuestions();
    }, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchCompletedQuestions]);

  // Handler for view action
  const handleView = (item) => {
    if (item.originalData) {
      navigate(`/creator/question-bank/question/${item.id}`);
    }
  };

  // Handler for edit action
  const handleEdit = (item) => {
    if (item.originalData) {
      navigate(`/creator/question-bank/question/${item.id}/edit`);
    }
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
              {t("creator.completedQuestionPage.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("creator.completedQuestionPage.subtitle")}
            </p>
          </div>
            <OutlineButton text={t("creator.completedQuestionPage.back")} className="py-[10px] px-5" onClick={handleCancel}/>
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
          searchPlaceholder={t("creator.completedQuestionPage.searchPlaceholder")}
        />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-oxford-blue text-lg font-roboto">Loading questions...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-cinnebar-red text-lg font-roboto mb-4">{error}</div>
          <OutlineButton 
            text="Retry" 
            className="py-[10px] px-5" 
            onClick={fetchCompletedQuestions}
          />
        </div>
      ) : (
        <Table
          items={questionsData.slice((currentPage - 1) * 10, currentPage * 10)}
          columns={completedQuestionsColumns}
          page={currentPage}
          pageSize={10}
          total={totalQuestions}
          onPageChange={setCurrentPage}
          onView={handleView}
          onEdit={handleEdit}
          emptyMessage={t("creator.completedQuestionPage.emptyMessage")}
        />
      )}
      </div>
    </div>
  );
};

export default CompletedQuestionPage;
