import React, { useState } from 'react';
import { analytics, watch, tick, cross } from '../icons';
import { useLanguage } from '../../../../context/LanguageContext';
import studentQuestionsAPI from '../../../../api/studentQuestions';
import { showSuccessToast, showErrorToast } from '../../../../utils/toastConfig';
import { cleanHtmlForDisplay } from '../../../../utils/textUtils';

const OptionCard = ({ option, groupName, isSelected, disabled, onOptionChange, highlight }) => {
  const language = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  const baseClass = 'w-full min-h-[50px] rounded-lg flex items-center px-3 md:px-4 py-2 border bg-white';
  const borderClass = highlight
    ? 'border-[#ED4122]'
    : isSelected
      ? 'border-[#ED4122]'
      : 'border-[#E5E7EB]';

  return (
    <div className={`${baseClass} ${borderClass}`} dir={dir}>
      <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full" dir="ltr">
        <input
          type="radio"
          name={groupName}
          value={option.id}
          checked={isSelected}
          onChange={() => onOptionChange(option.id)}
          className="w-3 h-3 checked:w-2 checked:h-2 flex-shrink-0 appearance-none rounded-full border border-[#767676] checked:border-[#ED4122] checked:bg-[#ED4122] cursor-pointer checked:outline-none checked:ring-[1px] checked:ring-[#ED4122] checked:ring-offset-2"
          disabled={disabled}
        />
        <span className="text-[14px] md:text-[16px] font-normal text-oxford-blue font-roboto flex-1">
          <span className="font-medium">{option.id}.</span> {option.text}
        </span>
      </label>
    </div>
  );
};
const ReviewOptionCard = ({ option, groupName, isCorrect, isUserAnswer, userAnswerIsCorrect }) => {
  const isChecked = isCorrect; // ONLY correct answer gets full checked look
  // Only show incorrect styling if user selected this option AND their overall answer was incorrect
  const isWrong = isUserAnswer && !isCorrect && !userAnswerIsCorrect;

  // Card background + border
  const cardClass = isCorrect
    ? "border border-[#ED4122] bg-[#C6D8D3]" // correct card style from screenshot
    : isWrong
      ? "border border-[#ED4122] bg-[#FDF0D5]" // wrong card style from screenshot
      : "border border-[#E5E7EB] bg-white";

  return (
    <div
      className={`w-full rounded-lg px-3 py-2 md:px-4 min-h-[50px] flex items-center ${cardClass}`}
    >
      <label className="flex items-center gap-3 w-full cursor-default">

        {/* ====================== RADIO ====================== */}
        <span
          className={`
            relative flex items-center justify-center
            w-4 h-4 rounded-full border
            ${isChecked ? "border-[#ED4122]" : isWrong ? "border-[#ED4122]" : "border-[#767676]"}
            pointer-events-none
          `}
        >

          {/* INNER DOT only for correct */}
          {isChecked && (
            <span className="w-2 h-2 bg-[#ED4122] rounded-full" />
          )}
        </span>

        {/* ====================== TEXT ====================== */}
        <span className="text-[14px] md:text-[16px] font-normal text-oxford-blue flex-1">
          <span className="font-medium">{option.id}.</span> {option.text}
        </span>

        {/* ====================== ICONS ====================== */}
        {isCorrect ? (
          <img src={tick} alt="Correct" className="text-white bg-cinnebar-red rounded-full p-1" />
        ) : isWrong ? (
          <div>
            <img src={cross} alt="Incorrect" className="text-white bg-cinnebar-red rounded-full p-1" />
          </div>
        ) : null}
      </label>
    </div>
  );
};



const StatusPill = ({ isCorrect, label }) => (
  <div className={`${isCorrect ? 'bg-[#ECFDF5]' : 'bg-[#FDF0D5]'} rounded-lg px-3 md:px-4 py-2 flex items-center gap-2`}>
    <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 p-[6px] ${isCorrect ? 'bg-[#10B981]' : 'bg-[#ED4122]'}`}>
      <img src={isCorrect ? tick : cross} alt={isCorrect ? 'Correct' : 'Incorrect'} className="w-3 h-3 md:w-4 md:h-4" />
    </div>
    <span className={`text-[12px] md:text-[16px] leading-[100%] font-normal font-roboto ${isCorrect ? 'text-[#047857]' : 'text-[#ED4122]'}`}>
      {label}
    </span>
  </div>
);

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
  const statusButtonClass = isCorrect ? 'bg-[#10B981] text-white' : 'bg-[#ED4122] text-white';
  const statusButtonLabel = isCorrect ? t('dashboard.questionSession.correctAnswer') : t('dashboard.questionSession.incorrectAnswer');
  const infoContainerClass = isCorrect ? 'bg-[#ECFDF5] border-l-4 border-[#10B981]' : 'bg-[#FDF0D5] border-l-4 border-[#ED4122]';
  const infoTitleClass = isCorrect ? 'text-[#047857]' : 'text-[#ED4122]';

  const optionGroupName = `answer-${currentQuestion.id}`;
  const reviewGroupName = `answer-review-${currentQuestion.id}`;

  return (
    <div className="max-w-4xl mx-auto lg:ml-5" dir={dir}>
      <div className="mb-4 md:mb-6">
        <div
          dir="ltr"
          className="text-[16px] md:text-[18px] font-normal text-oxford-blue font-roboto leading-[24px] tracking-[0%] text-left"
          dangerouslySetInnerHTML={{ 
            __html: cleanHtmlForDisplay(currentQuestion.prompt || '')
          }}
        />
      </div>

      <div className="mb-4 md:mb-6">
        <div className="space-y-3 mb-6 md:mb-10 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-content rounded-lg">
          {currentQuestion.options.map((option) => {
            const isSelected = option.id === currentState?.selectedOption;
            const selectedForReview = showReview && option.id === selectedOption?.id;

            return (
              <OptionCard
                key={option.id}
                option={option}
                groupName={optionGroupName}
                isSelected={isSelected}
                disabled={showReview}
                onOptionChange={onOptionChange}
                highlight={selectedForReview}
              />
            );
          })}
        </div>
      </div>

      {!showReview && (
        <div className="flex justify-center md:justify-start mb-10">
          <button
            onClick={onSubmit}
            disabled={!hasSelectedOption}
            className={`w-full md:w-[316px] h-[50px] md:h-[60px] rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] transition ${hasSelectedOption ? 'bg-[#ED4122] text-white hover:opacity-90' : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
              }`}
          >
            {t('dashboard.questionSession.submitAnswer')}
          </button>
        </div>
      )}

      {showReview && isCorrect && (
        <div className="w-full md:w-[316px] mb-6 md:mb-10 h-[50px] md:h-[60px] rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] flex items-center justify-center text-center transition-colors shadow-button">
          <span className="w-full h-full flex items-center justify-center gap-2 rounded-[8px] bg-[#10B981] text-white">
            <img src={tick} alt="Correct" className="h-4 w-4" />
            {t('dashboard.questionSession.correctAnswer')}
          </span>
        </div>
      )}

      {showReview && !isCorrect && (
        <>
          <div className="w-full md:w-[316px] mb-6 md:mb-10 h-[50px] md:h-[60px] rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] flex items-center justify-center text-center transition-colors shadow-button">
            <span className={`w-full h-full flex items-center justify-center gap-2 rounded-[8px] ${statusButtonClass}`}>
              <img src={cross} alt="Incorrect" className="h-4 w-4" />
              {statusButtonLabel}
            </span>
          </div>

          <div className={`mb-4 md:mb-6 w-full min-h-[110px] rounded-[14px] shadow-small justify-around flex flex-col md:flex-row items-start md:items-center ${infoContainerClass} p-4 md:p-0`}>
            <div className="flex flex-col justify-center items-start md:items-center gap-2">
              <div className={`text-[14px] md:text-[20px] leading-[25px] font-medium font-roboto ${infoTitleClass}`}>{statusButtonLabel}</div>
              <div className="text-[12px] md:text-[18px] leading-[25px] font-normal text-oxford-blue font-roboto">{t('dashboard.questionSession.correctAnswerLabel')} {currentQuestion.correctAnswer}</div>
            </div>

            <div className="flex flex-col justify-center items-start md:items-center gap-2">
              <div className="flex items-center gap-2">
                <img src={analytics} alt="Analytics" className="w-4 h-4 md:w-5 md:h-5" />
                <div className="text-[14px] md:text-[20px] leading-[25px] font-medium text-oxford-blue font-roboto">{currentQuestion.percentageCorrect ?? '--'}%</div>
              </div>
              <div className="text-[12px] md:text-[18px] leading-[25px] font-normal font-roboto">{t('dashboard.questionSession.answeredCorrectly')}</div>
            </div>

            <div className="flex flex-col justify-center items-start md:items-center gap-2">
              <div className="flex items-center gap-2">
                <img src={watch} alt="Time" className="w-4 h-4 md:w-5 md:h-5" />
                <div className="text-[14px] md:text-[20px] leading-[25px] font-medium text-oxford-blue font-roboto">{currentQuestion.timeSpent || '--:--'}</div>
              </div>
              <div className="text-[12px]  md:text-[18px] leading-[25px] font-normal font-roboto">{t('dashboard.questionSession.timeSpent')}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 md:mb-6">
            <StatusPill isCorrect={isCorrect} label={statusButtonLabel} />
            <div>
              <span className="text-[12px] md:text-[18px] leading-[24px] font-normal text-oxford-blue font-roboto">
                {t('dashboard.questionSession.correctAnswerLabel')} {currentQuestion.correctAnswer}
              </span>
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <div className="space-y-3 mb-4 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-content rounded-lg">
              {currentQuestion.options.map((option) => (
                <ReviewOptionCard
                  key={option.id}
                  option={option}
                  groupName={reviewGroupName}
                  isCorrect={option.id === currentQuestion.correctAnswer}
                  isUserAnswer={option.id === selectedOption?.id}
                  userAnswerIsCorrect={isCorrect}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6" />
        </>
      )}

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
        <div className="lg:hidden mb-4 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <div className="space-y-6">
              <div>
                <h4 className="text-[14px] md:text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-3">
                  {t('dashboard.questionSession.explanation.correctAnswerExplanation')}
                </h4>
                <p className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%] mb-2">
                  {t('dashboard.questionSession.explanation.answer')} {correctOption?.id}. {correctOption?.text}
                </p>
                <h5 className="text-[14px] md:text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-2">
                  {t('dashboard.questionSession.explanation.explanationLabel')}
                </h5>
                <p className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%]">
                  {currentState?.explanation || currentQuestion?.explanation || (correctOption && correctOption.explanation) || 'This answer choice aligns with the underlying concept tested in the question.'}
                </p>
              </div>

              {selectedOption && selectedOption.id !== correctOption?.id && (
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-3">
                    {t('dashboard.questionSession.yourAnswerExplanation')}
                  </h4>
                  <p className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%] mb-2">
                    {t('dashboard.questionSession.explanation.answer')} {selectedOption.id}. {selectedOption.text}
                  </p>
                  <h5 className="text-[14px] md:text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-2">
                    {t('dashboard.questionSession.consider')}
                  </h5>
                  <p className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%]">
                    Review why this option may not address the scenario described. Focus on differentiating the mechanisms.
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[14px] md:text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%]">
                    {t('dashboard.questionSession.hints')}
                  </h4>
                  <button onClick={onToggleHint} className="text-[14px] font-roboto text-[#0369A1] hover:underline">
                    {currentState.showHint ? t('dashboard.questionSession.hideHints') : t('dashboard.questionSession.showHints')}
                  </button>
                </div>
                {currentState.showHint ? (
                  <ul className="space-y-3">
                    {currentQuestion.hints.map((hint, index) => (
                      <li key={index} className="rounded-md bg-white p-3 text-[14px] text-[#4B5563] font-roboto border border-[#E5E7EB]">
                        {hint}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%]">
                    {t('dashboard.questionSession.revealHints')}
                  </p>
                )}
              </div>
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
          {/* Show flag button only if not already flagged or if rejected */}
          {(!currentQuestion.isFlagged || currentQuestion.flagStatus === 'rejected') && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowFlagModal(true)}
                className="px-4 py-2 text-[14px] font-roboto text-[#ED4122] border border-[#ED4122] rounded-lg hover:bg-[#FEF2F2] transition"
              >
                {t('dashboard.questionSession.flagQuestion') || 'Flag Question'}
              </button>
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


