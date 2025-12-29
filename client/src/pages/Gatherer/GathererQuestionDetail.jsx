import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton } from "../../components/common/Button";
import questionsAPI from "../../api/questions";
import { cleanHtmlForDisplay } from "../../utils/textUtils";

const GathererQuestionDetailsPage = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!questionId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await questionsAPI.getGathererQuestionById(questionId);
        
        if (response.success && response.data?.question) {
          setQuestion(response.data.question);
        } else {
          setError("Question not found");
        }
      } catch (err) {
        console.error("Error fetching question:", err);
        setError(err.response?.data?.message || "Failed to load question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleCancel = () => {
    navigate("/gatherer/question-bank");
  };

  // Map status to display label
  const getStatusLabel = (status) => {
    const statusMap = {
      'pending_processor': 'Pending Review',
      'pending_creator': 'Pending Creator',
      'pending_explainer': 'Pending Explainer',
      'completed': 'Completed',
      'rejected': 'Rejected',
      'pending_gatherer': 'Pending Gatherer',
    };
    return statusMap[status] || status;
  };

  return (
    <div
      className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]"
      dir={dir}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
            {t("gatherer.questionDetail.title")}
          </h1>
          <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
            <OutlineButton text={t("explainer.completedExplanation.back")} className="py-[10px] px-5" onClick={handleCancel}/>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-[16px] text-gray-600">Loading question...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-10">
            <p className="text-[16px] text-red-600">{error}</p>
            <OutlineButton 
              text="Go Back" 
              className="mt-4 py-[10px] px-5" 
              onClick={handleCancel}
            />
          </div>
        )}

        {/* Main Content - Two Columns */}
        {!loading && !error && question && (
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Question Info Card */}
              <div
                className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto lg:h-[472px]"
                style={{}}
              >
                <h2 className="mb-2 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  {t("gatherer.questionDetail.questionInfo")}
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      ID: {question.id?.substring(0, 8) || "N/A"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-roboto text-[18px] font-normal leading-[20px] text-oxford-blue">
                        {t("admin.questionDetails.fields.status")}:
                      </span>
                      <span className="font-roboto text-[18px] font-normal leading-[20px] text-[#ED4122]">
                        {getStatusLabel(question.status) || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-4"></div>

                  <div>
                    <p
                      className="pb-7 font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue"
                      dir="ltr"
                      dangerouslySetInnerHTML={{ __html: cleanHtmlForDisplay(question.questionText || "") }}
                    />

                    {/* Options - Only show for MCQ */}
                    {question.questionType === "MCQ" && question.options && (
                      <div className="space-y-5" dir="ltr">
                        {['A', 'B', 'C', 'D'].map((option) => (
                          <label key={option} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="option"
                              value={option}
                              checked={question.correctAnswer === option}
                              className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                              disabled
                            />
                            <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                              {option}. {question.options[option] || ""}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* True/False Options */}
                    {question.questionType === "TRUE_FALSE" && (
                      <div className="space-y-5" dir="ltr">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="option"
                            value="A"
                            checked={question.correctAnswer === "A"}
                            className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                            disabled
                          />
                          <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                            True
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="option"
                            value="B"
                            checked={question.correctAnswer === "B"}
                            className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                            disabled
                          />
                          <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                            False
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Two Columns */}
        {!loading && !error && question && (
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Explanation Card */}
              <div
                className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 relative w-full h-auto lg:h-[271px]"
                style={{}}
              >
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  Explanation
                </h2>
                {question.explanation && question.explanation.trim() ? (
                  <div 
                    className="font-roboto text-[16px] leading-[20px] text-oxford-blue"
                    dangerouslySetInnerHTML={{ __html: question.explanation }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[143px]">
                    <p className="font-roboto text-[16px] leading-[20px] text-dark-gray text-center">
                      Explanation not available
                    </p>
                  </div>
                )}
              </div>

              {/* Activity Log Card */}
              <div
                className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto"
              >
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  {t("admin.questionDetails.sections.activityLog")}
                </h2>
                <div className="space-y-4 overflow-y-auto">
                  {question.history && question.history.length > 0 ? (
                    question.history.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4 w-full max-w-full h-auto"
                        dir="ltr"
                      >
                        <div className="flex-shrink-0">
                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="15" cy="15" r="15" fill="#ED4122" />
                            <path
                              d="M21.125 14.125H15.875V8.875C15.875 8.392 15.483 8 15 8C14.517 8 14.125 8.392 14.125 8.875V14.125H8.875C8.392 14.125 8 14.517 8 15C8 15.483 8.392 15.875 8.875 15.875H14.125V21.125C14.125 21.608 14.517 22 15 22C15.483 22 15.875 21.608 15.875 21.125V15.875H21.125C21.608 15.875 22 15.483 22 15C22 14.517 21.608 14.125 21.125 14.125Z"
                              fill="white"
                              stroke="white"
                              strokeWidth="0.5"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                            {activity.notes || activity.action || "Activity"}
                          </p>
                          <p className="font-roboto text-[12px] font-normal leading-[20px] text-dark-gray">
                            {activity.performedBy?.name || "Unknown"} - {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="font-roboto text-[14px] text-gray-500">
                      No activity log available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6 lg:w-[376px]">
              {/* Classification Card */}
              <div
                className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[338px]"
                style={{}}
              >
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  {t("admin.questionDetails.sections.classification")}
                </h2>

                <div className="border-t border-[#E5E7EB] pt-4"></div>

                <div className="space-y-6 mt-4">
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      Exam
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.exam?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {t("admin.questionDetails.fields.subject")}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.subject?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {t("admin.questionDetails.fields.topic")}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.topic?.name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Workflow Information Card */}
              <div
                className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[338px]"
                style={{}}
              >
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  {t("admin.questionDetails.sections.workflowInformation")}
                </h2>

                <div className="border-t border-[#E5E7EB] pt-4"></div>

                <div className="space-y-6 mt-4">
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {t("admin.questionDetails.fields.createdBy")}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.createdBy?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {t("admin.questionDetails.fields.submittedOn")}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {t("admin.questionDetails.fields.lastUpdate")}
                    </label>
                    <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                      {question.updatedAt ? new Date(question.updatedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GathererQuestionDetailsPage;

