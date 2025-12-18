import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import adminAPI from "../../api/admin";
import { showErrorToast } from "../../utils/toastConfig";
import Loader from "../../components/common/Loader";

const QuestionDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const questionId = searchParams.get('id');

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      if (!questionId) {
        showErrorToast("Question ID is missing");
        navigate("/admin/question-bank");
        return;
      }

      try {
        setLoading(true);
        const response = await adminAPI.getQuestionDetails(questionId);
        if (response.success && response.data?.question) {
          setQuestion(response.data.question);
        } else {
          showErrorToast(response.message || "Failed to load question details");
          navigate("/admin/question-bank");
        }
      } catch (error) {
        showErrorToast(error.message || "Failed to load question details");
        navigate("/admin/question-bank");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [questionId, navigate]);

  // Format date helper
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Map status to display text
  const getStatusText = (status) => {
    const statusMap = {
      'pending_processor': t('admin.questionDetails.status.inReview'),
      'pending_creator': t('admin.questionDetails.status.pending'),
      'pending_explainer': t('admin.questionDetails.status.pending'),
      'completed': t('admin.questionDetails.status.approved'),
      'rejected': t('admin.questionDetails.status.rejected'),
    };
    return statusMap[status] || status;
  };

  // Get status color
  const getStatusColor = (status) => {
    if (status === 'completed') return 'text-[#10B981]';
    if (status === 'rejected') return 'text-[#ED4122]';
    return 'text-[#ED4122]';
  };

  // Map question type to display
  const getQuestionTypeDisplay = (type) => {
    if (type === 'MCQ') return 'Multiple Choice (MCQ)';
    if (type === 'TRUE_FALSE') return 'True/False';
    return type;
  };

  // Get activity log icon and color based on action
  const getActivityIcon = (action) => {
    if (action === 'created') {
      return {
        icon: (
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15Z" fill="#ED4122"/>
            <path d="M21.125 14.125H15.875V8.875C15.875 8.392 15.483 8 15 8C14.517 8 14.125 8.392 14.125 8.875V14.125H8.875C8.392 14.125 8 14.517 8 15C8 15.483 8.392 15.875 8.875 15.875H14.125V21.125C14.125 21.608 14.517 22 15 22C15.483 22 15.875 21.608 15.875 21.125V15.875H21.125C21.608 15.875 22 15.483 22 15C22 14.517 21.608 14.125 21.125 14.125Z" fill="white" stroke="white" strokeWidth="0.5"/>
          </svg>
        ),
        bg: '#ED4122'
      };
    }
    if (action === 'updated' || action === 'edit') {
      return {
        icon: (
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="15" fill="#6CA6C1"/>
            <path d="M20.3967 15.0017C20.2376 15.0017 20.085 15.0649 19.9726 15.1774C19.8601 15.2899 19.7969 15.4425 19.7969 15.6016V19.2005C19.7969 19.3596 19.7337 19.5122 19.6212 19.6247C19.5087 19.7372 19.3561 19.8003 19.197 19.8003H10.7995C10.6404 19.8003 10.4878 19.7372 10.3753 19.6247C10.2628 19.5122 10.1997 19.3596 10.1997 19.2005V10.803C10.1997 10.6439 10.2628 10.4913 10.3753 10.3788C10.4878 10.2663 10.6404 10.2031 10.7995 10.2031H14.3984C14.5575 10.2031 14.7101 10.1399 14.8226 10.0274C14.9351 9.91496 14.9983 9.76239 14.9983 9.6033C14.9983 9.44422 14.9351 9.29165 14.8226 9.17916C14.7101 9.06667 14.5575 9.00348 14.3984 9.00348H10.7995C10.3222 9.00348 9.86452 9.19307 9.52706 9.53053C9.18959 9.868 9 10.3257 9 10.803V19.2005C9 19.6778 9.18959 20.1355 9.52706 20.4729C9.86452 20.8104 10.3222 21 10.7995 21H19.197C19.6743 21 20.132 20.8104 20.4695 20.4729C20.8069 20.1355 20.9965 19.6778 20.9965 19.2005V15.6016C20.9965 15.4425 20.9333 15.2899 20.8208 15.1774C20.7083 15.0649 20.5558 15.0017 20.3967 15.0017Z" fill="white"/>
          </svg>
        ),
        bg: '#6CA6C1'
      };
    }
    if (action === 'approved') {
      return {
        icon: (
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="15" fill="#FDF0D5"/>
            <path d="M12.7496 20C12.7496 20 12.7481 20 12.7466 20C12.5464 19.9993 12.3559 19.919 12.2156 19.7765L9.21582 16.7298C8.92484 16.4343 8.92859 15.9595 9.22407 15.6692C9.51955 15.379 9.99352 15.382 10.2845 15.6775L12.7541 18.1856L19.7197 11.22C20.0129 10.9267 20.4868 10.9267 20.7801 11.22C21.0733 11.5125 21.0733 11.988 20.7801 12.2805L13.2806 19.781C13.1396 19.9213 12.9483 20 12.7496 20Z" fill="#ED4122" stroke="#ED4122" strokeWidth="0.5"/>
          </svg>
        ),
        bg: '#FDF0D5'
      };
    }
    return {
      icon: (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="15" fill="#6CA6C1"/>
        </svg>
      ),
      bg: '#6CA6C1'
    };
  };

  if (loading) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px] flex items-center justify-center">
        <Loader size="lg" color="oxford-blue" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
          <p className="text-center text-oxford-blue">Question not found</p>
        </div>
      </div>
    );
  }

  const options = question.options || {};
  // Handle correctAnswer - it might be an object {option, text} or a string
  const correctAnswerValue = typeof question.correctAnswer === 'object' && question.correctAnswer !== null
    ? (question.correctAnswer.option || question.correctAnswer.text || String(question.correctAnswer))
    : (question.correctAnswer || '');
  const isTrueFalse = question.questionType === 'TRUE_FALSE';
  
  // Handle options - ensure they're strings, not objects
  const getOptionText = (optionKey) => {
    if (!optionKey) return 'N/A';
    // If optionKey is an object, extract text
    if (typeof optionKey === 'object' && optionKey !== null) {
      return optionKey.text || optionKey.option || String(optionKey);
    }
    // If optionKey is a string, use it to look up the option
    if (!options[optionKey]) return 'N/A';
    if (typeof options[optionKey] === 'string') return options[optionKey];
    if (typeof options[optionKey] === 'object' && options[optionKey]?.text) return options[optionKey].text;
    return String(options[optionKey]);
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]" dir={dir}>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
            {t('admin.questionDetails.hero.title')}
          </h1>
          <button
            type="button"
            onClick={() => navigate("/admin/question-bank")}
            className="flex h-[36px] items-center justify-center gap-2 rounded-[8px] border border-[#03274633] bg-white px-3 md:px-4 text-[14px] md:text-[16px] font-archivo font-semibold leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 9L4.5 6L7.5 3" stroke="#032746" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('admin.questionDetails.buttons.back') || 'Back'}
          </button>
        </header>

        {/* Main Content - Two Columns */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Question Info Card */}
            <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto lg:h-[472px]">
              <h2 className="mb-2 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.questionDetails.sections.questionInfo')}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    ID: {question.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-roboto text-[18px] font-normal leading-[20px] text-oxford-blue">
                      {t('admin.questionDetails.fields.status')}:
                    </span>
                    <span className={`font-roboto text-[18px] font-normal leading-[20px] ${getStatusColor(question.status)}`}>
                      {getStatusText(question.status)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#E5E7EB] pt-4"></div>

                <div>
                  <p className="pb-7 font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue" dir="ltr" dangerouslySetInnerHTML={{ __html: question.questionText || 'N/A' }}></p>

                  {/* Options */}
                  {!isTrueFalse ? (
                    <div className="space-y-5" dir="ltr">
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="option"
                            value={option}
                            checked={correctAnswerValue === option}
                            className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                            disabled
                          />
                          <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                            {option}. {getOptionText(option)}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-5" dir="ltr">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="option"
                          value="A"
                          checked={correctAnswerValue === 'A'}
                          className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                          disabled
                        />
                        <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                          A. True
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="option"
                          value="B"
                          checked={correctAnswerValue === 'B'}
                          className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                          disabled
                        />
                        <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                          B. False
                        </span>
                      </label>
                    </div>
                  )}

                  <div className="border-t border-[#E5E7EB] mt-10 pt-4">
                    <p className="font-archivo text-[20px] font-bold leading-[20px] text-oxford-blue mb-2">
                      {t('admin.questionDetails.fields.correctAnswer')}
                    </p>
                    <label className="flex items-center gap-3 pt-2 cursor-pointer" dir="ltr">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={correctAnswerValue}
                        checked
                        className="w-4 h-4 text-[#ED4122] border-[#03274633]"
                        disabled
                      /> 
                      <span className="font-roboto text-[16px] font-normal leading-[20px] text-[#ED4122]">
                        {(() => {
                          // Handle TRUE_FALSE questions
                          if (isTrueFalse) {
                            return correctAnswerValue === 'A' ? 'A. True' : 'B. False';
                          }
                          // Handle MCQ questions - ensure we get the text properly
                          const optionText = getOptionText(correctAnswerValue);
                          return `${correctAnswerValue}. ${optionText}`;
                        })()}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation Card */}
            <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto lg:h-[199px]">
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.questionDetails.sections.explanation')}
              </h2>
              <div className="border-t border-[#E5E7EB] pt-4">
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue" dir="ltr" dangerouslySetInnerHTML={{ __html: question.explanation || 'No explanation available' }}></p>
              </div>
            </div>

            {/* Activity Log Card */}
            <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full h-auto lg:h-[351px]">
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.questionDetails.sections.activityLog')}
              </h2>
              <div className="space-y-4 max-h-[280px] overflow-y-auto">
                {question.history && question.history.length > 0 ? (
                  question.history.map((entry, index) => {
                    const activityIcon = getActivityIcon(entry.action);
                    const performerName = entry.performedBy?.name || entry.performedBy?.fullName || 'Unknown';
                    const timestamp = entry.timestamp ? formatDate(entry.timestamp) : 'N/A';
                    const actionText = entry.action === 'created' ? 'Question Created' : 
                                      entry.action === 'updated' || entry.action === 'edit' ? 'Question Edited' :
                                      entry.action === 'approved' ? 'Question Approved' :
                                      entry.action === 'rejected' ? 'Question Rejected' :
                                      entry.action || 'Action';
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-[8px] border border-[#E5E7EB] bg-white p-4 w-full max-w-[672px] h-auto" dir="ltr"
                      >
                        <div className="flex-shrink-0">
                          {activityIcon.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                            {actionText} by {performerName}
                          </p>
                          <p className="font-roboto text-[12px] font-normal leading-[20px] text-dark-gray">
                            {timestamp}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-dark-gray">No activity log available</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 lg:w-[376px]">
            {/* Classification Card */}
            <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[338px]">
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.questionDetails.sections.classification')}
              </h2>

              <div className="border-t border-[#E5E7EB] pt-4"></div>

              <div className="space-y-6 mt-4">
                {/* Exam */}
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.exam') || 'Exam'}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    {question.classification?.exam?.name || question.exam?.name || 'N/A'}
                  </p>
                </div>

                {/* Subject */}
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.subject')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    {question.classification?.subject?.name || question.subject?.name || 'N/A'}
                  </p>
                </div>

                {/* Topic */}
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.topic')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    {question.classification?.topic?.name || question.topic?.name || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow Information Card */}
            <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[338px]">
              <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.questionDetails.sections.workflowInformation')}
              </h2>

              <div className="border-t border-[#E5E7EB] pt-4"></div>

              <div className="space-y-6 mt-4">
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.createdBy')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    {question.workflow?.createdBy?.name || question.createdBy?.name || question.createdBy?.fullName || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.submittedOn')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    {question.workflow?.submittedOn || formatDate(question.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.questionDetails.fields.lastUpdate')}
                  </label>
                  <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                    {question.workflow?.lastUpdate || formatDate(question.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Variants Card */}
            {question.variants && question.variants.length > 0 && (
              <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full lg:w-[376px] h-auto lg:h-[271px]">
                <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                  {t('admin.questionDetails.sections.variants')}
                </h2>

                <div className="border-t border-[#E5E7EB] pt-4"></div>

                <div className="space-y-6 mt-4">
                  {question.variants.map((variant, index) => (
                    <div key={variant.id || index}>
                      <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                        {t('admin.questionDetails.fields.variantId')} #{index + 1}
                      </label>
                      <p className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue">
                        {variant.id || 'N/A'}
                      </p>
                      {variant.createdBy && (
                        <div className="mt-2">
                          <label className="mb-2 block font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                            {t('admin.questionDetails.fields.createdByVariant')}
                          </label>
                          <p className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue">
                            {variant.createdBy?.name || variant.createdBy?.fullName || 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailsPage;
