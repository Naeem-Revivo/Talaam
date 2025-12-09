import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import questionsAPI from "../../api/questions";
import { showErrorToast } from "../../utils/toastConfig";

const CreatorViewQuestion = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const location = useLocation();
  const { t } = useLanguage();
  const [question, setQuestion] = useState(location.state?.question || null);
  const [variants, setVariants] = useState(location.state?.variants || []);
  const [loading, setLoading] = useState(!question && !questionId);
  const [error, setError] = useState(null);

  // Fetch question data if not provided in location state
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!question && questionId) {
        try {
          setLoading(true);
          setError(null);
          const response = await questionsAPI.getCreatorQuestionById(questionId);
          
          if (response.success && response.data?.question) {
            setQuestion(response.data.question);
            
            // Fetch variants if not provided
            if (!variants || variants.length === 0) {
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

                const questionIdStr = String(questionId);
                const relatedVariants = allCreatorQuestions.filter(
                  (q) => {
                    const isVariant = q.isVariant === true || q.isVariant === 'true';
                    const originalId = q.originalQuestionId || q.originalQuestion;
                    return isVariant && originalId && String(originalId) === questionIdStr;
                  }
                );
                setVariants(relatedVariants);
              } catch (variantError) {
                console.warn("Could not fetch variants:", variantError);
              }
            }
          } else {
            setError("Question not found");
          }
        } catch (err) {
          console.error("Error fetching question:", err);
          setError(err.message || "Failed to load question");
        } finally {
          setLoading(false);
        }
      } else if (question) {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId, question, variants]);

  const handleBack = () => {
    navigate("/creator/question-bank/variants-list");
  };

  const handleVariantClick = (variant) => {
    navigate(`/creator/question-bank/view-variant`, {
      state: { variant, originalQuestion: question }
    });
  };

  // Extract question title from questionText
  const getQuestionTitle = (questionText) => {
    if (!questionText) return "—";
    const text = questionText.replace(/<[^>]*>/g, '');
    return text;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[38px] text-oxford-blue mb-2">
              View Question
            </h1>
            <p className="font-roboto text-[14px] md:text-[18px] font-normal leading-[20px] md:leading-[24px] text-dark-gray">
              Question ID: {question?.id || questionId || "—"}
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
          <div className="flex items-center justify-center py-12">
            <div className="text-oxford-blue text-lg font-roboto">Loading question...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-600 text-lg font-roboto mb-4">{error}</div>
            <OutlineButton 
              text="Go Back" 
              className="py-[10px] px-5" 
              onClick={handleBack}
            />
          </div>
        )}

        {/* Question Content */}
        {!loading && !error && question && (
          <div className="space-y-6">
            {/* Main Question Card */}
            <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6">
              <h2 className="font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue mb-4">
                Question Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                    Question ID
                  </label>
                  <p className="font-roboto text-[16px] font-normal text-oxford-blue">
                    {question.id || "—"}
                  </p>
                </div>
                <div>
                  <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                    Question Text
                  </label>
                  <div
                    className="font-roboto text-[16px] font-normal leading-[24px] text-dark-gray"
                    dangerouslySetInnerHTML={{ __html: question.questionText || "—" }}
                  />
                </div>
                {question.questionType && (
                  <div>
                    <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                      Question Type
                    </label>
                    <p className="font-roboto text-[16px] font-normal text-oxford-blue">
                      {question.questionType}
                    </p>
                  </div>
                )}
                {question.options && (
                  <div>
                    <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-2">
                      Options
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(question.options).map(([key, value]) => (
                        <div key={key} className="p-3 rounded border border-[#E5E7EB] bg-[#F9FAFB]">
                          <span className="font-roboto text-[14px] font-semibold text-oxford-blue">{key}: </span>
                          <span className="font-roboto text-[14px] text-dark-gray">{value || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {question.correctAnswer && (
                  <div>
                    <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                      Correct Answer
                    </label>
                    <p className="font-roboto text-[16px] font-normal text-[#ED4122]">
                      {question.correctAnswer}
                    </p>
                  </div>
                )}
                {question.explanation && (
                  <div>
                    <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                      Explanation
                    </label>
                    <div
                      className="font-roboto text-[16px] font-normal leading-[24px] text-dark-gray"
                      dangerouslySetInnerHTML={{ __html: question.explanation }}
                    />
                  </div>
                )}
                {question.subject && (
                  <div>
                    <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                      Subject
                    </label>
                    <p className="font-roboto text-[16px] font-normal text-oxford-blue">
                      {typeof question.subject === 'object' ? question.subject.name : question.subject}
                    </p>
                  </div>
                )}
                {question.topic && (
                  <div>
                    <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                      Topic
                    </label>
                    <p className="font-roboto text-[16px] font-normal text-oxford-blue">
                      {typeof question.topic === 'object' ? question.topic.name : question.topic}
                    </p>
                  </div>
                )}
                {question.status && (
                  <div>
                    <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                      Status
                    </label>
                    <p className="font-roboto text-[16px] font-normal text-oxford-blue">
                      {question.status}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Variants Section */}
            {variants && variants.length > 0 && (
              <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6">
                <h2 className="font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue mb-4">
                  Variants ({variants.length})
                </h2>
                <div className="space-y-3">
                  {variants.map((variant, index) => {
                    // Format status
                    const formatStatus = (status) => {
                      if (!status) return "—";
                      const statusMap = {
                        'pending_processor': 'Pending',
                        'pending_creator': 'Pending',
                        'pending_explainer': 'Pending',
                        'completed': 'Approved',
                        'rejected': 'Rejected'
                      };
                      return statusMap[status] || status.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ');
                    };

                    return (
                      <div
                        key={variant.id || index}
                        className="p-4 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#ED4122] transition-colors cursor-pointer"
                        onClick={() => handleVariantClick(variant)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p
                              className="font-roboto text-[14px] font-normal text-oxford-blue mb-2"
                              dangerouslySetInnerHTML={{ __html: getQuestionTitle(variant.questionText) }}
                            />
                            <span className="font-roboto text-[12px] text-dark-gray">
                              Status: {formatStatus(variant.status)}
                            </span>
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
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorViewQuestion;

