import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import questionsAPI from "../../api/questions";
import { showErrorToast } from "../../utils/toastConfig";
import Loader from "../../components/common/Loader";

const ExplainerViewQuestion = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const location = useLocation();
  const { t } = useLanguage();
  const [question, setQuestion] = useState(location.state?.question || null);
  const [loading, setLoading] = useState(!question && !questionId);
  const [error, setError] = useState(null);

  // Fetch question data if not provided in location state
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!question && questionId) {
        try {
          setLoading(true);
          setError(null);
          const response = await questionsAPI.getExplainerQuestionById(questionId);
          
          if (response.success && response.data?.question) {
            setQuestion(response.data.question);
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
  }, [questionId, question]);

  const handleBack = () => {
    navigate("/explainer/question-bank/assigned-questions");
  };

  // Format status by removing underscores and capitalizing words
  const formatStatus = (status) => {
    if (!status) return '—';
    
    // Replace underscores with spaces and capitalize each word
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[38px] text-oxford-blue mb-2">
              {t("explainer.assignedQuestions.viewTitle") || "View Question"}
            </h1>
            <p className="font-roboto text-[14px] md:text-[18px] font-normal leading-[20px] md:leading-[24px] text-dark-gray">
              {t("explainer.assignedQuestions.viewSubtitle") || "View question details and status"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <OutlineButton 
              text={t("explainer.assignedQuestions.back") || "Back"} 
              className="py-[10px] px-5" 
              onClick={handleBack}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Loader 
            size="lg" 
            color="oxford-blue" 
            text={t("explainer.assignedQuestions.loading") || "Loading..."}
            className="py-12"
          />
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-600 text-lg font-roboto mb-4">{error}</div>
            <OutlineButton 
              text={t("explainer.assignedQuestions.back") || "Go Back"} 
              className="py-[10px] px-5" 
              onClick={handleBack}
            />
          </div>
        )}

        {/* Question Content */}
        {!loading && !error && question && (() => {
          const displayStatus = formatStatus(question.status);
          
          return (
            <div className="space-y-6">
              {/* Main Question Card */}
              <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6">
                <h2 className="font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue mb-4">
                  {t("explainer.assignedQuestions.questionDetails") || "Question Details"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                      {t("explainer.assignedQuestions.status") || "Status"}
                    </label>
                    <p className="font-roboto text-[16px] font-normal text-oxford-blue">
                      {displayStatus}
                    </p>
                  </div>
                  <div>
                    <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                      {t("explainer.assignedQuestions.questionText") || "Question Text"}
                    </label>
                    <div
                      className="font-roboto text-[16px] font-normal leading-[24px] text-dark-gray"
                      dangerouslySetInnerHTML={{ __html: question.questionText || "—" }}
                    />
                  </div>
                  {question.questionType && (
                    <div>
                      <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                        {t("explainer.assignedQuestions.questionType") || "Question Type"}
                      </label>
                      <p className="font-roboto text-[16px] font-normal text-oxford-blue">
                        {question.questionType}
                      </p>
                    </div>
                  )}
                  {question.options && (question.questionType === "MCQ" || question.questionType === "TRUE_FALSE") && (
                    <div>
                      <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-2">
                        {t("explainer.assignedQuestions.options") || "Options"}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {question.questionType === "TRUE_FALSE" ? (
                          <>
                            <div className="p-3 rounded border border-[#E5E7EB] bg-[#F9FAFB]">
                              <span className="font-roboto text-[14px] font-semibold text-oxford-blue">A: </span>
                              <span className="font-roboto text-[14px] text-dark-gray">{question.options.A || "True"}</span>
                            </div>
                            <div className="p-3 rounded border border-[#E5E7EB] bg-[#F9FAFB]">
                              <span className="font-roboto text-[14px] font-semibold text-oxford-blue">B: </span>
                              <span className="font-roboto text-[14px] text-dark-gray">{question.options.B || "False"}</span>
                            </div>
                          </>
                        ) : (
                          Object.entries(question.options).map(([key, value]) => (
                          <div key={key} className="p-3 rounded border border-[#E5E7EB] bg-[#F9FAFB]">
                            <span className="font-roboto text-[14px] font-semibold text-oxford-blue">{key}: </span>
                            <span className="font-roboto text-[14px] text-dark-gray">{value || "—"}</span>
                          </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  {question.correctAnswer && (
                    <div>
                      <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                        {t("explainer.assignedQuestions.correctAnswer") || "Correct Answer"}
                      </label>
                      <p className="font-roboto text-[16px] font-normal text-[#ED4122]">
                        {question.questionType === "TRUE_FALSE" 
                          ? (question.correctAnswer === "A" ? "True" : "False")
                          : question.correctAnswer.length === 1
                          ? `Option ${question.correctAnswer}`
                          : question.correctAnswer
                        }
                      </p>
                    </div>
                  )}
                  {question.explanation && (
                    <div>
                      <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                        {t("explainer.assignedQuestions.explanation") || "Explanation"}
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
                        {t("explainer.assignedQuestions.subject") || "Subject"}
                      </label>
                      <p className="font-roboto text-[16px] font-normal text-oxford-blue">
                        {typeof question.subject === 'object' ? question.subject.name : question.subject}
                      </p>
                    </div>
                  )}
                  {question.topic && (
                    <div>
                      <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                        {t("explainer.assignedQuestions.topic") || "Topic"}
                      </label>
                      <p className="font-roboto text-[16px] font-normal text-oxford-blue">
                        {typeof question.topic === 'object' ? question.topic.name : question.topic}
                      </p>
                    </div>
                  )}
                  {question.assignedProcessor && (
                    <div>
                      <label className="block font-roboto text-[14px] font-semibold text-dark-gray mb-1">
                        {t("explainer.assignedQuestions.processor") || "Processor"}
                      </label>
                      <p className="font-roboto text-[16px] font-normal text-oxford-blue">
                        {question.assignedProcessor?.name || question.assignedProcessor?.fullName || "—"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default ExplainerViewQuestion;

