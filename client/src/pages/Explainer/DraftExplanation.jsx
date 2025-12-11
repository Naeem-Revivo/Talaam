import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import { useState, useEffect, useRef } from "react";
import SearchFilter from "../../components/common/SearchFilter";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import Loader from "../../components/common/Loader";

const DraftExplanationPage = () => {
  const { t } = useLanguage();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [draftExplanationData, setDraftExplanationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const pollingIntervalRef = useRef(null);

  // Define columns for the draft explanation table
  const draftExplanationColumns = [
    { key: "questionTitle", label: t("explainer.draftExplanation.table.question") },
    { key: "lastEdited", label: t("explainer.draftExplanation.table.lastEdited") },
    { key: "status", label: t("explainer.draftExplanation.table.status") },
    { key: "actions", label: t("explainer.draftExplanation.table.action") },
  ];

  const subjectOptions = ["Subject", "Mathematics", "Physics", "Chemistry", "Biology"];
  const topicOptions = ["Processor", "Approved", "Failed", "Reject"];
  const subtopicOptions = ["Date", "Medium", "Easy", "Hard"];

  // Format date to relative time (Today, Yesterday, or date)
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return minutes <= 1 ? "Just now" : `${minutes} minutes ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (diffInDays < 2) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      // Format as "DD/MM/YYYY at HH:MM"
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} at ${hours}:${minutes}`;
    }
  };

  // Transform API response to table format
  const transformQuestionData = (questions) => {
    return questions
      .filter(question => {
        // Only include questions with status pending_explainer that have explanations
        const hasExplanation = question.explanation && question.explanation.trim().length > 0;
        return question.status === 'pending_explainer' && hasExplanation;
      })
      .map((question) => {
        // Extract question title from questionText (first 50 characters)
        // Add prefix for variants
        const isVariant = question.isVariant === true || question.isVariant === 'true';
        const questionTitlePrefix = isVariant ? "  └─ Variant: " : "";
        const questionTitle = question.questionText 
          ? (question.questionText.length > 50 
              ? questionTitlePrefix + question.questionText.substring(0, 50) + "..." 
              : questionTitlePrefix + question.questionText)
          : "—";

        return {
          id: question.id || question._id,
          questionTitle: questionTitle,
          lastEdited: formatDate(question.updatedAt || question.createdAt),
          status: "Draft",
          actionType: "continue",
          originalData: question // Store original data for navigation
        };
      });
  };

  // Fetch draft explanation questions from API
  const fetchDraftQuestions = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Fetch questions with pending_explainer status
      const response = await questionsAPI.getExplainerQuestions({ status: 'pending_explainer' });
      
      if (response && response.success && response.data) {
        const questions = response.data.questions || [];
        
        // Filter to only include questions with explanations (drafts)
        const transformedData = transformQuestionData(questions);
        setDraftExplanationData(transformedData);
        setTotalQuestions(transformedData.length);
      } else {
        setDraftExplanationData([]);
        setTotalQuestions(0);
      }
    } catch (err) {
      console.error("Error fetching draft questions:", err);
      setError(err.message || "Failed to fetch draft questions");
      setDraftExplanationData([]);
      setTotalQuestions(0);
    } finally {
      setLoading(false);
    }
  };

  // Set up polling for real-time updates
  useEffect(() => {
    // Fetch immediately on mount
    fetchDraftQuestions();

    // Set up polling every 30 seconds for real-time updates
    pollingIntervalRef.current = setInterval(() => {
      fetchDraftQuestions();
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Handler for continue action (edit draft)
  const handleContinue = (item) => {
    if (item.originalData) {
      navigate(`/explainer/question-bank/add-explanation`, { 
        state: { question: item.originalData } 
      });
    } else {
      navigate(`/explainer/question-bank/add-explanation`);
    }
  };

  // Handler for view action (if needed)
  const handleView = (item) => {
    if (item.originalData) {
      navigate(`/explainer/question-bank/add-explanation`, { 
        state: { question: item.originalData, view: true } 
      });
    }
  };

  // Handler for edit action (if needed)
  const handleEdit = (item) => {
    handleContinue(item);
  };

  const handleCancel = () => {
    navigate("/explainer/question-bank");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[60px]">
        <header className="flex justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue mb-2">
              {t("explainer.draftExplanation.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("explainer.draftExplanation.subtitle")}
            </p>
          </div>
          <OutlineButton text={t("explainer.draftExplanation.back")} className="py-[10px] px-5" onClick={handleCancel}/>
        </header>

        <SearchFilter
          searchValue={search}
          subtopicValue={subtopic}
          onSearchChange={setSearch}
          onSubjectChange={setSubject}
          onTopicChange={setTopic}
          onSubtopicChange={setSubtopic}
          subtopicOptions={subtopicOptions}
          searchPlaceholder={t("explainer.draftExplanation.searchPlaceholder")}
        />

        {loading ? (
          <Loader 
            size="lg" 
            color="oxford-blue" 
            text={t("common.loading") || "Loading..."}
            className="py-10"
          />
        ) : error ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <Table
            items={draftExplanationData}
            columns={draftExplanationColumns}
            page={currentPage}
            pageSize={10}
            total={totalQuestions}
            onPageChange={setCurrentPage}
            onView={handleView}
            onEdit={handleEdit}
            onCustomAction={(item) => {
              // Handle different custom actions based on actionType
              if (item.actionType === "continue") {
                handleContinue(item);
              }
            }}
            emptyMessage={t("explainer.draftExplanation.emptyMessage")}
          />
        )}
      </div>
    </div>
  );
};

export default DraftExplanationPage;
