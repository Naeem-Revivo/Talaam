import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import questionsAPI from "../../api/questions";
import { showErrorToast } from "../../utils/toastConfig";
import Loader from "../../components/common/Loader";

const CreatorVariantsListPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  // Fetch questions with their variants (optimized single API call)
  useEffect(() => {
    const fetchQuestionsWithVariants = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the optimized endpoint that fetches questions with variants in a single query
        const statusesToFetch = ['pending_creator', 'pending_processor', 'pending_explainer', 'completed', 'rejected'];
        const response = await questionsAPI.getCreatorQuestionsWithVariants({ statuses: statusesToFetch });

        if (response.success && response.data?.questions) {
          // The endpoint already returns only questions with variants, so we can use them directly
          setQuestions(response.data.questions);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Error fetching questions with variants:", err);
        setError(err.message || "Failed to fetch questions");
        showErrorToast(err.message || "Failed to fetch questions with variants");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsWithVariants();
  }, []);

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleQuestionClick = (question) => {
    // Navigate to view question page
    navigate(`/creator/question-bank/question/${question.id}`, {
      state: { question, variants: question.variants }
    });
  };

  const handleVariantClick = (variant) => {
    // Navigate to view variant page
    navigate(`/creator/question-bank/view-variant`, {
      state: { variant, originalQuestion: questions.find(q => q.id === variant.originalQuestionId) }
    });
  };

  const handleBack = () => {
    navigate("/creator/question-bank");
  };

  // Extract question title from questionText (first 100 characters)
  const getQuestionTitle = (questionText) => {
    if (!questionText) return "—";
    // First clean code tags with data attributes
    let cleaned = questionText.replace(/<code[^>]*data-start[^>]*>(.*?)<\/code>/gi, '$1');
    // Then strip all remaining HTML tags
    const text = cleaned.replace(/<[^>]*>/g, '');
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[38px] text-oxford-blue mb-2">
              Variants List
            </h1>
            <p className="font-roboto text-[14px] md:text-[18px] font-normal leading-[20px] md:leading-[24px] text-dark-gray">
              View all questions and their variants
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <OutlineButton 
              text={t('admin.variantQuestionReview.buttons.cancel') || "Back"} 
              className="py-[10px] px-5" 
              onClick={handleBack}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Loader fullScreen={false} size="lg" text={"Loading questions..."} className="py-10" />
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-600 text-lg font-roboto mb-4">{error}</div>
            <OutlineButton 
              text="Retry" 
              className="py-[10px] px-5" 
              onClick={() => window.location.reload()}
            />
          </div>
        )}

        {/* Questions List */}
        {!loading && !error && (
          <div className="space-y-4">
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-dark-gray text-lg font-roboto">
                  No questions with variants found.
                </p>
              </div>
            ) : (
              questions.map((question) => {
                const isExpanded = expandedQuestions.has(question.id);
                const variants = question.variants || [];

                return (
                  <div
                    key={question.id}
                    className="rounded-[12px] border border-[#03274633] bg-white overflow-hidden"
                  >
                    {/* Main Question Header */}
                    <div className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={`transition-transform cursor-pointer ${isExpanded ? 'rotate-90' : ''}`}
                              onClick={() => toggleQuestion(question.id)}
                            >
                              <path
                                d="M7.5 15L12.5 10L7.5 5"
                                stroke="#032746"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <h3
                              className="font-archivo text-[18px] md:text-[20px] font-bold text-oxford-blue cursor-pointer hover:text-[#ED4122] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuestionClick(question);
                              }}
                            >
                              {getQuestionTitle(question.questionText)}
                            </h3>
                            <span className="px-2 py-1 rounded bg-[#ED4122] text-white text-xs font-roboto">
                              {variants.length} {variants.length === 1 ? 'Variant' : 'Variants'}
                            </span>
                          </div>
                          <p className="font-roboto text-[12px] text-dark-gray ml-8">
                            ID: {question.id || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Variants List (Expanded) */}
                    {isExpanded && (
                      <div className="border-t border-[#E5E7EB] bg-[#F9FAFB]">
                        <div className="p-4 md:p-6">
                          <div className="space-y-3">
                            {variants.length === 0 ? (
                              <p className="text-dark-gray text-sm font-roboto">No variants available</p>
                            ) : (
                              variants.map((variant, index) => {
                                // Format status
                                const formatStatus = (status, isFlagged) => {
                                  // Check if variant is flagged first
                                  if (isFlagged) {
                                    return 'Flagged';
                                  }
                                  if (!status) return "—";
                                  const statusMap = {
                                    'pending_processor': 'Pending',
                                    'pending_creator': 'Pending',
                                    'pending_explainer': 'In Review',
                                    'completed': 'Approved',
                                    'rejected': 'Rejected'
                                  };
                                  return statusMap[status] || status.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ');
                                };

                                const isFlagged = variant.isFlagged === true || variant.isFlagged === 'true';
                                const isRejected = variant.status === 'rejected' && variant.rejectionReason;

                                return (
                                  <div
                                    key={variant.id || index}
                                    className={`p-4 rounded-[8px] border ${isRejected || isFlagged ? 'border-[#ED4122] bg-[#FEF2F2]' : 'border-[#E5E7EB] bg-white'} hover:border-[#ED4122] transition-colors cursor-pointer`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVariantClick(variant);
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <p
                                          className="font-roboto text-[14px] font-normal text-oxford-blue mb-2"
                                          dangerouslySetInnerHTML={{ __html: getQuestionTitle(variant.questionText) }}
                                        />
                                        <div className="flex flex-col gap-1">
                                          <span className={`font-roboto text-[12px] ${isRejected || isFlagged ? 'text-[#ED4122] font-semibold' : 'text-dark-gray'}`}>
                                            Status: {formatStatus(variant.status, isFlagged)}
                                          </span>
                                          {isRejected && variant.rejectionReason && (
                                            <span className="font-roboto text-[11px] text-dark-gray line-clamp-2">
                                              Reason: {variant.rejectionReason.length > 80 ? variant.rejectionReason.substring(0, 80) + '...' : variant.rejectionReason}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M7.5 15L12.5 10L7.5 5"
                                          stroke="#032746"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorVariantsListPage;

