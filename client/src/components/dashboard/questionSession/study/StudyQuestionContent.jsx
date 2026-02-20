import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import studentQuestionsAPI from '../../../../api/studentQuestions';
import { showSuccessToast, showErrorToast } from '../../../../utils/toastConfig';
import { cleanHtmlForDisplay } from '../../../../utils/textUtils';

const OptionCard = ({ option, isSelected, disabled, onOptionChange }) => {
  const { language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const cardClass = isSelected
    ? 'border-[#75A9CC] bg-[#ECF4FA]'
    : 'border-[#D4D4D4] bg-white';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onOptionChange(option.id)}
      className={`w-full min-h-[62px] rounded-[12px] border-[1.5px] flex items-center px-6 py-3 text-left transition-colors ${cardClass} ${disabled ? 'cursor-default' : 'hover:bg-[#F8FAFC]'}`}
      dir={dir}
    >
      <div className="flex items-center gap-3 w-full" dir="ltr">
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[12px] leading-[28px] font-medium font-roboto ${
          isSelected ? 'bg-[#0B4A73] text-white border border-[#0B4A73]' : 'bg-white border border-[#E6EEF3] text-[#737373]'
        }`}>
          {option.id}
        </span>
        <span className={`text-base font-normal font-roboto flex-1 ${
          isSelected ? 'text-[#1F4E79]' : 'text-dashboard-dark'
        }`}>
          {option.text}
        </span>
      </div>
    </button>
  );
};
const ReviewOptionCard = ({ option, isCorrect, isUserAnswer, userAnswerIsCorrect }) => {
  const isWrong = isUserAnswer && !isCorrect && !userAnswerIsCorrect;

  const cardClass = isCorrect
    ? 'border-[#16A34A] bg-[#F0FDF4]'
    : isWrong
      ? 'border-[#EF4444] bg-[#FEF2F2]'
      : 'border-[#D4D4D4] bg-white';

  return (
    <div className={`w-full min-h-[62px] rounded-[12px] border-[1.5px] flex items-center px-6 py-3 ${cardClass}`}>
      <div className="flex items-center gap-3 w-full">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-[#E6EEF3] text-[12px] leading-[28px] font-medium text-[#737373] font-roboto">
          {option.id}
        </span>
        <span className="text-base font-normal text-dashboard-dark font-roboto flex-1">
          {option.text}
        </span>
        {isCorrect ? (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#15803D] text-[#15803D]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        ) : isWrong ? (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#EF4444] text-[#EF4444]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
        ) : null}
      </div>
    </div>
  );
};
const StudyQuestionContent = ({
  currentQuestion,
  currentState,
  showReview,
  isCorrect,
  selectedOption,
  correctOption,
  hasSelectedOption,
  onOptionChange,
  onSubmit,
  onToggleHint,
  showExplanationPanel,
  onToggleExplanationPanel,
}) => {
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [isFlagging, setIsFlagging] = useState(false);
  const promptHtml = cleanHtmlForDisplay(currentQuestion.prompt || '');
  const firstInlineImageMatch = promptHtml.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  const inlineImageSrc = firstInlineImageMatch?.[1] || '';
  const questionImageSrc = (
    currentQuestion?.image ||
    currentQuestion?.imageUrl ||
    currentQuestion?.questionImage ||
    inlineImageSrc ||
    ''
  ).trim();
  const promptWithoutInlineImages = promptHtml.replace(/<img[^>]*>/gi, '').trim();
  const isMarkedForReview = Boolean(
    currentState?.isMarked ||
    currentQuestion?.isMarked ||
    currentQuestion?.markedForReview ||
    currentQuestion?.isFlagged
  );
  const explanationText =
    currentState?.explanation ||
    currentQuestion?.explanation ||
    (correctOption && correctOption.explanation) ||
    'This answer choice aligns with the underlying concept tested in the question.';

  return (
    <div className="" dir={dir}>
      <div className="mb-6 border bg-white border-[#E6EEF3] rounded-[16px] p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-[30px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[11px] bg-gradient-to-r from-[#032746] to-[#173B50] flex items-center justify-center text-white font-medium text-[14px] leading-[21px] font-roboto">
              {currentQuestion.itemNumber}
            </div>
            <span className="text-[14px] font-normal text-[#525252] font-roboto">
              Question {currentQuestion.itemNumber}
            </span>
          </div>

          {isMarkedForReview && (
            <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] bg-[#FEF3C7] text-[#D97706]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.44434 0.5L6.86719 1.29395L5.59863 3.03613L6.86719 4.7793L7.44434 5.57422H2.05566V7.65137C2.05566 8.07935 1.70533 8.42969 1.27734 8.42969C0.849549 8.42946 0.5 8.07921 0.5 7.65137V2.11133C0.5 1.6639 0.611812 1.23584 0.923828 0.923828C1.23584 0.611812 1.6639 0.5 2.11133 0.5H7.44434Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-[14px] leading-[21px] font-medium font-roboto">Marked for Review</span>
            </div>
          )}
        </div>

        <div className={`grid gap-4 ${questionImageSrc ? 'grid-cols-1 md:grid-cols-[1fr_230px]' : 'grid-cols-1'}`}>
          <div
            dir="ltr"
            className="text-[18px] font-normal text-[#0A0A0A] font-archivo leading-[27px] text-left"
            dangerouslySetInnerHTML={{ __html: promptWithoutInlineImages || promptHtml }}
          />
          {questionImageSrc && (
            <img
              src={questionImageSrc}
              alt="Question visual"
              className="w-full h-[155px] object-cover rounded-[10px] border border-[#D4D4D4]"
            />
          )}
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option) => {
          const isSelected = option.id === currentState?.selectedOption;

          return (
            showReview ? (
              <ReviewOptionCard
                key={option.id}
                option={option}
                isCorrect={option.id === currentQuestion.correctAnswer}
                isUserAnswer={option.id === selectedOption?.id}
                userAnswerIsCorrect={isCorrect}
              />
            ) : (
              <OptionCard
                key={option.id}
                option={option}
                isSelected={isSelected}
                disabled={false}
                onOptionChange={onOptionChange}
              />
            )
          );
        })}
      </div>

      <div className="flex justify-center md:justify-start mb-4">
        <button
          onClick={onSubmit}
          disabled={!hasSelectedOption || showReview}
          className={`w-full h-[48px] md:h-[60px] rounded-[10px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] transition ${
            hasSelectedOption && !showReview
              ? 'bg-gradient-to-r from-[#032746] to-[#0B4A73] text-white hover:opacity-90'
              : 'bg-[#E5E7EB] text-[#A3A3A3] cursor-not-allowed'
          }`}
        >
          {t('dashboard.questionSession.submitAnswer')}
        </button>
      </div>

      {showReview && (
        <>
      <button
        onClick={onToggleExplanationPanel}
        className="lg:hidden w-full mb-4 px-4 py-3 bg-[#F3F4F6] text-oxford-blue rounded-lg text-[14px] font-normal font-roboto hover:opacity-90 transition-opacity flex items-center justify-between"
      >
        <span className="font-bold">{t('dashboard.questionSession.explanation.title')}</span>
        <svg className={`w-5 h-5 transition-transform ${showExplanationPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showExplanationPanel && (
        <div className="lg:hidden mb-4 bg-[#F5F7FA] border border-[#D4D4D4] rounded-[12px] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#F3F4F6] flex items-center justify-between">
            <h4 className="text-[24px] leading-[32px] font-bold text-oxford-blue font-archivo">
              {t('dashboard.questionSession.explanation.title')}
            </h4>
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-medium text-[#16A34A] font-roboto">
                Ans: {correctOption?.id || '--'}
              </span>
              <button onClick={onToggleExplanationPanel} className="text-[#94A3B8] hover:text-[#64748B]" aria-label="Close explanation">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="rounded-[12px] border border-[#A7F3D0] bg-[#ECFDF3] px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#16A34A] text-white">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] leading-[12px] tracking-[0.4px] uppercase font-bold text-[#16A34A] font-roboto">
                    {t('dashboard.questionSession.explanation.correctAnswerExplanation')}
                  </p>
                  <p className="text-[24px] leading-[30px] text-[#14532D] font-normal font-roboto">
                    {correctOption?.id}. {correctOption?.text}
                  </p>
                </div>
              </div>
            </div>

            {selectedOption && selectedOption.id !== correctOption?.id && (
              <div className="rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#EF4444] text-white">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] leading-[12px] tracking-[0.4px] uppercase font-bold text-[#EF4444] font-roboto">
                      {t('dashboard.questionSession.yourAnswer')}
                    </p>
                    <p className="text-[24px] leading-[30px] text-[#B91C1C] font-normal font-roboto">
                      {selectedOption.id}. {selectedOption.text}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div
              className="text-[16px] leading-[29px] font-normal text-[#334155] font-roboto"
              dangerouslySetInnerHTML={{ __html: cleanHtmlForDisplay(explanationText) }}
            />
          </div>
        </div>
          )}
        </>
      )}

      {/* Flag Question Button and Rejection Notice */}
      {showReview && (
        <div className="mt-4 space-y-3">
          {/* Show rejection reason if flag was rejected */}
          {currentQuestion.flagStatus === 'rejected' && currentQuestion.flagRejectionReason && (
            <div className="bg-[#FDF0D5] border border-[#ED4122] rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-[#ED4122] text-[18px]">⚠</span>
                <div>
                  <p className="text-[14px] font-roboto font-medium text-[#ED4122] mb-1">
                    {t('dashboard.questionSession.flagRejected') || 'Your flag was rejected'}
                  </p>
                  <p className="text-[12px] font-roboto text-oxford-blue">
                    <span className="font-medium">{t('dashboard.questionSession.adminReason') || 'Admin reason:'} </span>
                    {currentQuestion.flagRejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Show pending status if flag is pending */}
          {currentQuestion.isFlagged && currentQuestion.flagStatus === 'pending' && (
            <div className="flex justify-end">
              <div className="px-4 py-2 text-[14px] font-roboto text-[#ED4122] border border-[#ED4122] rounded-lg bg-[#FEF2F2]">
                {t('dashboard.questionSession.flagPending') || 'Flag pending review'}
              </div>
            </div>
          )}
          {/* Show approved status if flag is approved */}
          {currentQuestion.flagStatus === 'approved' && (
            <div className="flex justify-end">
              <div className="px-4 py-2 text-[14px] font-roboto text-[#047857] border border-[#10B981] rounded-lg bg-[#ECFDF5]">
                {t('dashboard.questionSession.flagApproved') || 'Flag approved - Question under review'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6" dir={dir}>
            <h3 className="text-[18px] font-archivo font-bold text-oxford-blue mb-4">
              {t('dashboard.questionSession.flagQuestion') || 'Flag Question'}
            </h3>
            <p className="text-[14px] font-roboto text-dark-gray mb-4">
              {t('dashboard.questionSession.flagReasonLabel') || 'Please provide a reason for flagging this question:'}
            </p>
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder={t('dashboard.questionSession.flagReasonPlaceholder') || 'Enter reason...'}
              className="w-full h-32 p-3 border border-[#E5E7EB] rounded-lg text-[14px] font-roboto text-oxford-blue mb-4 resize-none"
              dir={dir}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason('');
                }}
                className="px-4 py-2 text-[14px] font-roboto text-oxford-blue border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition"
                disabled={isFlagging}
              >
                {t('dashboard.questionSession.cancel') || 'Cancel'}
              </button>
              <button
                onClick={async () => {
                  if (!flagReason.trim()) {
                    showErrorToast(t('dashboard.questionSession.flagReasonRequired') || 'Please provide a reason');
                    return;
                  }
                  setIsFlagging(true);
                  try {
                    await studentQuestionsAPI.flagQuestion(currentQuestion.id, flagReason);
                    showSuccessToast(t('dashboard.questionSession.flagSuccess') || 'Question flagged successfully');
                    setShowFlagModal(false);
                    setFlagReason('');
                  } catch (error) {
                    showErrorToast(error.message || t('dashboard.questionSession.flagError') || 'Failed to flag question');
                  } finally {
                    setIsFlagging(false);
                  }
                }}
                disabled={isFlagging || !flagReason.trim()}
                className="px-4 py-2 text-[14px] font-roboto text-white bg-[#ED4122] rounded-lg hover:bg-[#d43a1f] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFlagging ? (t('dashboard.questionSession.flagging') || 'Flagging...') : (t('dashboard.questionSession.submitFlag') || 'Submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyQuestionContent;


