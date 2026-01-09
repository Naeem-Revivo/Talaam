import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import studentQuestionsAPI from '../../api/studentQuestions';
import { showErrorToast } from '../../utils/toastConfig';
import ReportIssueModal, { FlagReasonModal } from '../../components/common/ReportIssueModal';

const ReviewMarkedQuestionPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get('questionId');
  
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);

  // Fetch question data
  const fetchQuestion = useCallback(async () => {
    if (!questionId) {
      showErrorToast('Question ID is required');
      navigate('/dashboard/review');
      return;
    }

    try {
      setLoading(true);
      const response = await studentQuestionsAPI.getMarkedQuestionForReview(questionId);

      if (response.success && response.data) {
        const questionData = response.data;
        const optionsObj = questionData.options || {};
        const options = ['A', 'B', 'C', 'D'].map((key) => ({
          id: key,
          text: optionsObj[key] || '',
        })).filter(opt => opt.text);

        setQuestion({
          id: questionData._id || questionData.id,
          shortId: questionData.shortId || questionId.slice(0, 8),
          questionText: questionData.questionText || '',
          options,
          correctAnswer: questionData.correctAnswer,
          explanation: questionData.explanation || '',
          exam: questionData.exam?.name || 'N/A',
          subject: questionData.subject?.name || 'N/A',
          topic: questionData.topic?.name || 'N/A',
          isFlagged: questionData.isFlagged || questionData.flagStatus || false,
          flagStatus: questionData.flagStatus,
          flagReason: questionData.flagReason,
          flagRejectionReason: questionData.flagRejectionReason,
        });
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      showErrorToast(error.message || 'Failed to load question');
      navigate('/dashboard/review');
    } finally {
      setLoading(false);
    }
  }, [questionId, navigate]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-oxford-blue text-lg">Loading question...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-oxford-blue text-lg">Question not found</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/review')}
                className="text-oxford-blue hover:opacity-70"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-[20px] font-bold text-oxford-blue font-archivo leading-[28px]">
                  {t('dashboard.review.reviewMarked.title')}
                </h1>
                <p className="text-[14px] font-normal text-dark-gray font-roboto">
                  {t('dashboard.review.reviewMarked.questionId')} {question.shortId}
                </p>
              </div>
            </div>
            {/* Desktop: Report Issue and Reason buttons */}
            <div className="hidden lg:flex items-center gap-2">
              <button 
                onClick={() => setShowReportModal(true)}
                className="flex items-center justify-center gap-1 border-[0.5px] border-[#032746] rounded-[4px] px-3 h-[35px] hover:bg-[#F3F4F6] transition"
              >
                <p className='text-[10px] leading-[100%] font-normal font-archivo'>Report Issue</p>
              </button>
              {(question?.isFlagged || question?.flagStatus) && (
                <button 
                  onClick={() => setShowReasonModal(true)}
                  className="flex items-center justify-center gap-1 border-[0.5px] border-[#ED4122] rounded-[4px] px-2 h-[35px] hover:bg-[#FEF2F2] transition"
                >
                  <p className='text-[10px] leading-[100%] font-normal font-archivo text-[#ED4122]'>{t('dashboard.questionSession.reason') || 'Reason'}</p>
                </button>
              )}
            </div>
          </div>

          {/* Mobile: Report Issue and Reason buttons */}
          <div className="lg:hidden flex items-center gap-2 w-full justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowReportModal(true)}
                className="px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[14px] font-normal font-roboto hover:opacity-70 flex items-center gap-2"
              >
                <span>Report Issue</span>
              </button>
              {(question?.isFlagged || question?.flagStatus) && (
                <button 
                  onClick={() => setShowReasonModal(true)}
                  className="px-3 py-1.5 bg-[#FEF2F2] text-[#ED4122] border border-[#ED4122] rounded text-[14px] font-normal font-roboto hover:opacity-70"
                >
                  {t('dashboard.questionSession.reason') || 'Reason'}
                </button>
              )}
            </div>
          </div>

          {/* Desktop: Back button */}
          <div className="hidden lg:block">
            <button
              onClick={() => navigate('/dashboard/review')}
              className="px-4 py-2 bg-white border border-[#E5E7EB] text-oxford-blue rounded-lg text-[14px] font-normal font-roboto hover:opacity-90 transition-opacity"
            >
              {t('dashboard.review.reviewMarked.back')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Question Info */}
        <div className="mb-6 flex flex-wrap gap-4 text-[14px] font-normal text-dark-gray font-roboto">
          <span><strong>{t('dashboard.review.reviewMarked.exam')}:</strong> {question.exam}</span>
          <span><strong>{t('dashboard.review.reviewMarked.subject')}:</strong> {question.subject}</span>
          <span><strong>{t('dashboard.review.reviewMarked.topic')}:</strong> {question.topic}</span>
        </div>

        {/* Question Prompt */}
        <div className="mb-6">
          <h2 className="text-[24px] md:text-[32px] font-bold text-oxford-blue mb-4 font-archivo">
            {t('dashboard.review.reviewMarked.question')}
          </h2>
          <div 
            className="text-[16px] md:text-[18px] font-normal text-oxford-blue font-roboto leading-[24px]"
            dangerouslySetInnerHTML={{ 
              __html: question.questionText 
                ? question.questionText.replace(/<code[^>]*data-start[^>]*>(.*?)<\/code>/gi, '$1')
                : '' 
            }}
          />
        </div>

        {/* Answer Options */}
        <div className="mb-6">
          <h3 className="text-[20px] font-bold text-oxford-blue mb-4 font-archivo">
            {t('dashboard.review.reviewMarked.options')}
          </h3>
          <div className="space-y-3 w-full">
            {question.options.map((option) => {
              const isCorrect = option.id === question.correctAnswer;
              
              return (
                <div
                  key={option.id}
                  className={`w-full min-h-[50px] rounded-lg border-2 flex items-center px-4 py-3 ${
                    isCorrect
                      ? 'border-[#10B981] bg-[#ECFDF5]'
                      : 'border-[#E5E7EB] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCorrect
                        ? 'bg-[#10B981] text-white'
                        : 'bg-[#E5E7EB] text-oxford-blue'
                    }`}>
                      {isCorrect && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[16px] font-normal text-oxford-blue font-roboto flex-1">
                      <span className="font-medium">{option.id}.</span> {option.text}
                    </span>
                    {isCorrect && (
                      <span className="text-[14px] font-medium text-[#10B981] px-2 py-1 bg-[#D1FAE5] rounded">
                        {t('dashboard.review.reviewMarked.correct')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {question.explanation && (
          <div className="mb-6">
            <h3 className="text-[20px] font-bold text-oxford-blue mb-4 font-archivo">
              {t('dashboard.review.reviewMarked.explanation')}
            </h3>
            <div className="bg-[#F3F4F6] rounded-lg p-4 md:p-6">
              <div 
                className="text-[16px] font-normal text-oxford-blue font-roboto leading-[24px]"
                dangerouslySetInnerHTML={{ 
                  __html: question.explanation 
                    ? question.explanation.replace(/<code[^>]*data-start[^>]*>(.*?)<\/code>/gi, '$1')
                    : '' 
                }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={() => navigate('/dashboard/review')}
            className="px-6 py-3 bg-white border border-[#E5E7EB] text-oxford-blue rounded-lg text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
          >
            {t('dashboard.review.reviewMarked.backToReview')}
          </button>
        </div>
      </div>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        questionId={question?.id}
        question={question}
        onSuccess={() => {
          // Refresh question data to get updated flag status
          fetchQuestion();
        }}
      />

      {/* Flag Reason Modal */}
      <FlagReasonModal
        isOpen={showReasonModal}
        onClose={() => setShowReasonModal(false)}
        question={question}
      />
    </div>
  );
};

export default ReviewMarkedQuestionPage;

