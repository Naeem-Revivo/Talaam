import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { useState, useEffect, useRef } from "react";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";

const ExplainerQuestionBank = () => {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [explanationRequestsData, setExplanationRequestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const pollingIntervalRef = useRef(null);

  const explanationRequestsColumns = [
    { key: "questionTitle", label: t("explainer.questionBank.table.question") },
    { key: "fromProcessor", label: t("explainer.questionBank.table.fromProcessor") },
    { key: "finalUpdate", label: t("explainer.questionBank.table.finalUpdate") },
    { key: "actions", label: t("explainer.questionBank.table.actions") },
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

  // Transform API response to table format
  const transformQuestionData = (questions) => {
    return questions.map((question) => {
      // Get processor name from approvedBy or assignedProcessor
      const processorName = question.approvedBy?.name || question.assignedProcessor?.name || "—";
      
      // Get difficulty from question data or default
      const difficulty = question.difficulty || question.metadata?.difficulty || "—";
      
      // Extract question title from questionText (first 50 characters)
      const questionTitle = question.questionText 
        ? (question.questionText.length > 50 
            ? question.questionText.substring(0, 50) + "..." 
            : question.questionText)
        : "—";

      return {
        id: question.id || question._id,
        questionTitle: questionTitle,
        fromProcessor: processorName,
        difficulty: difficulty,
        finalUpdate: formatDate(question.updatedAt || question.createdAt),
        actionType: "addExplanation",
        originalData: question // Store original data for navigation
      };
    });
  };

  // Fetch explainer questions from API
  const fetchExplainerQuestions = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Fetch questions with pending_explainer status
      const response = await questionsAPI.getExplainerQuestions({ status: 'pending_explainer' });
      
      if (response.success && response.data?.questions) {
        const transformedData = transformQuestionData(response.data.questions);
        setExplanationRequestsData(transformedData);
        setTotalQuestions(response.data.total || transformedData.length);
      } else {
        setExplanationRequestsData([]);
        setTotalQuestions(0);
      }
    } catch (err) {
      console.error("Error fetching explainer questions:", err);
      setError(err.message || "Failed to fetch questions");
      setExplanationRequestsData([]);
      setTotalQuestions(0);
    } finally {
      setLoading(false);
    }
  };

  // Set up polling for real-time updates
  useEffect(() => {
    // Fetch immediately on mount
    fetchExplainerQuestions();

    // Set up polling every 30 seconds for real-time updates
    pollingIntervalRef.current = setInterval(() => {
      fetchExplainerQuestions();
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Handler for add explanation action
  const handleAddExplanation = (item) => {
    // Navigate to add explanation page with question ID
    if (item.originalData) {
      navigate(`/explainer/question-bank/add-explanation`, { 
        state: { question: item.originalData } 
      });
    } else {
      navigate(`/explainer/question-bank/add-explanation`);
    }
  };

  // Calculate stats from real-time data
  const [stats, setStats] = useState([
    { label: t("explainer.questionBank.stats.questionsNeedingExplanation"), value: 0, color: "blue" },
    { label: t("explainer.questionBank.stats.completedExplanations"), value: 0, color: "blue" },
    { label: t("explainer.questionBank.stats.draftExplanations"), value: 0, color: "red" },
    { label: t("explainer.questionBank.stats.sentBackForRevision"), value: 0, color: "red" },
  ]);

  // Fetch stats from API
  const fetchStats = async () => {
    try {
      // Fetch questions with different statuses to calculate stats
      const [pendingResponse, completedResponse, draftResponse, sentBackResponse] = await Promise.all([
        questionsAPI.getExplainerQuestions({ status: 'pending_explainer' }).catch(() => ({ success: false, data: { questions: [] } })),
        questionsAPI.getExplainerQuestions({ status: 'completed' }).catch(() => ({ success: false, data: { questions: [] } })),
        questionsAPI.getExplainerQuestions({ status: 'draft' }).catch(() => ({ success: false, data: { questions: [] } })),
        questionsAPI.getExplainerQuestions({ status: 'revision' }).catch(() => ({ success: false, data: { questions: [] } })),
      ]);

      const pendingCount = pendingResponse.success ? (pendingResponse.data?.total || pendingResponse.data?.questions?.length || 0) : 0;
      const completedCount = completedResponse.success ? (completedResponse.data?.total || completedResponse.data?.questions?.length || 0) : 0;
      const draftCount = draftResponse.success ? (draftResponse.data?.total || draftResponse.data?.questions?.length || 0) : 0;
      const sentBackCount = sentBackResponse.success ? (sentBackResponse.data?.total || sentBackResponse.data?.questions?.length || 0) : 0;

      setStats([
        { label: t("explainer.questionBank.stats.questionsNeedingExplanation"), value: pendingCount, color: "blue" },
        { label: t("explainer.questionBank.stats.completedExplanations"), value: completedCount, color: "blue" },
        { label: t("explainer.questionBank.stats.draftExplanations"), value: draftCount, color: "red" },
        { label: t("explainer.questionBank.stats.sentBackForRevision"), value: sentBackCount, color: "red" },
      ]);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Fetch stats when component mounts
  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const statsInterval = setInterval(fetchStats, 30000);
    return () => clearInterval(statsInterval);
  }, []);

  const handleAddExplanationButton = () => {
    navigate("/explainer/question-bank/add-explanation");
  };

  const handleCompletedExplanation = () => {
    navigate("/explainer/question-bank/completed-explanation");
  };

  const handleDraftExplanation = () => {
    navigate("/explainer/question-bank/draft-explanation");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("explainer.questionBank.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("explainer.questionBank.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
            <OutlineButton
              text={t("explainer.questionBank.draft")}
                onClick={handleDraftExplanation}
              className="py-[10px] px-9"
            />

            <OutlineButton
              text={t("explainer.questionBank.completed")}
                onClick={handleCompletedExplanation}
              className="py-[10px] px-6"
            />

            <PrimaryButton
              text={t("explainer.questionBank.addExplanation")}
              className="py-[10px] px-8"
                onClick={handleAddExplanationButton}
            />
          </div>
        </header>

        <StatsCards stats={stats} />

        <div>
          <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo mb-5">
            {t("explainer.questionBank.pendingExplanations")}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-dark-gray">{t("common.loading") || "Loading..."}</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <Table
              items={explanationRequestsData}
              columns={explanationRequestsColumns}
              page={currentPage}
              pageSize={10}
              total={totalQuestions}
              onPageChange={setCurrentPage}
              onCustomAction={handleAddExplanation}
              emptyMessage={t("explainer.questionBank.emptyMessage")}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default ExplainerQuestionBank;
