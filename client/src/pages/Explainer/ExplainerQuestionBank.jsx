import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../components/common/Button";
import StatsCards from "../../components/common/StatsCards";
import { Table } from "../../components/common/TableComponent";
import { useNavigate } from "react-router-dom";
import questionsAPI from "../../api/questions";
import Loader from "../../components/common/Loader";

const ExplainerQuestionBank = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [explanationRequestsData, setExplanationRequestsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [stats, setStats] = useState([
    { label: t("explainer.questionBank.stats.questionsNeedingExplanation"), value: 0, color: "blue" },
    { label: t("explainer.questionBank.stats.completedExplanations"), value: 0, color: "blue" },
    { label: t("explainer.questionBank.stats.draftExplanations"), value: 0, color: "red" },
    { label: t("explainer.questionBank.stats.sentBackForRevision"), value: 0, color: "red" },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Memoize columns to prevent rerenders
  const explanationRequestsColumns = useMemo(() => [
    { key: "questionTitle", label: t("explainer.questionBank.table.question") },
    { key: "fromProcessor", label: t("explainer.questionBank.table.fromProcessor") },
    { key: "finalUpdate", label: t("explainer.questionBank.table.finalUpdate") },
    { key: "actions", label: t("explainer.questionBank.table.actions") },
  ], [t]);

  // Format date to relative time (Today, Yesterday, or date)
  const formatDate = useCallback((dateString) => {
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
  }, []);

  // Transform API response to table format
  const transformQuestionData = useCallback((questions) => {
    return questions
      .filter(question => {
        // Exclude questions that have explanations (drafts) - they should only show in draft page
        const hasExplanation = question.explanation && question.explanation.trim().length > 0;
        return !hasExplanation; // Only show questions without explanations in pending
      })
      .map((question) => {
        // Get processor name from approvedBy or assignedProcessor
        const processorName = question.approvedBy?.name || question.assignedProcessor?.name || "—";
        
        // Get difficulty from question data or default
        const difficulty = question.difficulty || question.metadata?.difficulty || "—";
        
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
          fromProcessor: processorName,
          difficulty: difficulty,
          finalUpdate: formatDate(question.updatedAt || question.createdAt),
          actionType: "addExplanation",
          isVariant: isVariant,
          originalQuestionId: question.originalQuestionId || null,
          originalData: question // Store original data for navigation
        };
      });
  }, [formatDate]);

  // Fetch stats separately - only once on mount, not affected by status filter
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        // Fetch questions with different statuses to calculate stats
        const [pendingResponse, completedResponse, draftResponse, sentBackResponse] = await Promise.all([
          questionsAPI.getExplainerQuestions({ status: 'pending_explainer', page: 1, limit: 10 }).catch(() => ({ success: false, data: { questions: [] } })),
          questionsAPI.getExplainerQuestions({ status: 'completed', page: 1, limit: 10 }).catch(() => ({ success: false, data: { questions: [] } })),
          questionsAPI.getExplainerQuestions({ status: 'draft', page: 1, limit: 10 }).catch(() => ({ success: false, data: { questions: [] } })),
          questionsAPI.getExplainerQuestions({ status: 'revision', page: 1, limit: 10 }).catch(() => ({ success: false, data: { questions: [] } })),
        ]);

        const pendingCount = pendingResponse.success ? (pendingResponse.data?.pagination?.totalItems || pendingResponse.data?.total || pendingResponse.data?.questions?.length || 0) : 0;
        const completedCount = completedResponse.success ? (completedResponse.data?.pagination?.totalItems || completedResponse.data?.total || completedResponse.data?.questions?.length || 0) : 0;
        const draftCount = draftResponse.success ? (draftResponse.data?.pagination?.totalItems || draftResponse.data?.total || draftResponse.data?.questions?.length || 0) : 0;
        const sentBackCount = sentBackResponse.success ? (sentBackResponse.data?.pagination?.totalItems || sentBackResponse.data?.total || sentBackResponse.data?.questions?.length || 0) : 0;

        setStats([
          { label: t("explainer.questionBank.stats.questionsNeedingExplanation"), value: pendingCount, color: "blue" },
          { label: t("explainer.questionBank.stats.completedExplanations"), value: completedCount, color: "blue" },
          { label: t("explainer.questionBank.stats.draftExplanations"), value: draftCount, color: "red" },
          { label: t("explainer.questionBank.stats.sentBackForRevision"), value: sentBackCount, color: "red" },
        ]);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [t]); // Only fetch stats once on mount

  // Fetch questions from API with backend pagination
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 10,
        status: 'pending_explainer', // Explainer only sees pending_explainer questions
      };
      
      const response = await questionsAPI.getExplainerQuestions(params);
      
      if (response && response.success && response.data) {
        const questions = response.data.questions || [];
        const pagination = response.data.pagination || {};
        
        // Filter out questions that have explanations (drafts) - they should only show in draft page
        const questionsWithoutExplanation = questions.filter(question => {
          const hasExplanation = question.explanation && question.explanation.trim().length > 0;
          return !hasExplanation; // Only show questions without explanations in pending
        });
        
        const transformedData = transformQuestionData(questionsWithoutExplanation);
        
        setExplanationRequestsData(transformedData);
        setTotalQuestions(pagination.totalItems || pagination.total || transformedData.length);
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
  }, [currentPage, transformQuestionData]);

  // Fetch data on component mount and when page changes
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Handler for add explanation action
  const handleAddExplanation = useCallback((item) => {
    // Navigate to add explanation page with question ID
    if (item.originalData) {
      navigate(`/explainer/question-bank/add-explanation`, { 
        state: { question: item.originalData } 
      });
    } else {
      navigate(`/explainer/question-bank/add-explanation`);
    }
  }, [navigate]);

  // Memoize loading component for table
  const tableLoadingComponent = useMemo(() => (
    <Loader 
      size="lg" 
      color="oxford-blue" 
      text={t("common.loading") || "Loading..."}
      className="py-10"
    />
  ), [t]);

  const handleCompletedExplanation = useCallback(() => {
    navigate("/explainer/question-bank/completed-explanation");
  }, [navigate]);

  const handleDraftExplanation = useCallback(() => {
    navigate("/explainer/question-bank/draft-explanation");
  }, [navigate]);

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
            {/* <OutlineButton
              text={t("explainer.questionBank.draft")}
                onClick={handleDraftExplanation}
              className="py-[10px] px-9"
            /> */}

            <OutlineButton
              text={t("explainer.questionBank.completed")}
                onClick={handleCompletedExplanation}
              className="py-[10px] px-6"
            />

            <PrimaryButton
              text={t("explainer.questionBank.assignedQuestions")}
              className="py-[10px] px-8"
              onClick={() => navigate("/explainer/question-bank/assigned-questions")}
            />
          </div>
        </header>

        <StatsCards stats={stats} />

        <div>
          <div className="text-[24px] leading-[32px] font-bold text-blue-dark font-archivo mb-5">
            {t("explainer.questionBank.pendingExplanations")}
          </div>
          
            <Table
              items={explanationRequestsData}
              columns={explanationRequestsColumns}
              page={currentPage}
              pageSize={10}
              total={totalQuestions}
              onPageChange={setCurrentPage}
              onCustomAction={handleAddExplanation}
              emptyMessage={t("explainer.questionBank.emptyMessage")}
              loading={loading}
              loadingComponent={tableLoadingComponent}
            />
          
        </div>

      </div>
    </div>
  );
};

export default ExplainerQuestionBank;
