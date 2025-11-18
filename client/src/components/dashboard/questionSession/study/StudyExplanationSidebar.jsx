import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const StudyExplanationSidebar = ({
  showExplanation,
  showReview,
  correctOption,
  selectedOption,
  currentQuestion,
  currentState,
  onToggleExplanation,
  onToggleHint,
}) => {
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr'
  return (
    <div className={`hidden lg:flex w-[256px] h-full bg-[#F9FAFB] border-l border-[#E5E7EB] overflow-y-auto ${dir === 'rtl' ? "border-r" : "border-l"}`}>
      <div className="p-4 md:p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] leading-[24px] font-bold text-oxford-blue font-archivo">{t('dashboard.questionSession.explanation.title')}</h3>
          <button onClick={onToggleExplanation} className="text-[18px] leading-[14px] font-normal text-oxford-blue font-archivo hover:opacity-70">
            {showExplanation ? t('dashboard.questionSession.explanation.hide') : t('dashboard.questionSession.explanation.show')}
          </button>
        </div>

      {showExplanation ? (
        showReview ? (
          <div className="space-y-6">
            <div>
              <h4 className="text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-3">
                {t('dashboard.questionSession.explanation.correctAnswerExplanation')}
              </h4>
              <p className="text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%] mb-2">
                {t('dashboard.questionSession.explanation.answer')} {correctOption?.id}. {correctOption?.text}
              </p>
              <h5 className="text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-2">
                {t('dashboard.questionSession.explanation.explanationLabel')}
              </h5>
              <p className="text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%]">
                {correctOption?.explanation || 'This answer choice aligns with the underlying concept tested in the question.'}
              </p>
            </div>

            {selectedOption && selectedOption.id !== correctOption?.id && (
              <div>
                <h4 className="text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-3">
                  {t('dashboard.questionSession.yourAnswer')}
                </h4>
                <p className="text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%] mb-2">
                  {t('dashboard.questionSession.explanation.answer')} {selectedOption.id}. {selectedOption.text}
                </p>
                <h5 className="text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-2">
                  {t('dashboard.questionSession.consider')}
                </h5>
                <p className="text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%]">
                  Review why this option may not address the scenario described. Focus on differentiating the mechanisms.
                </p>
              </div>
            )}

            <div>
              <h4 className="text-[16px] font-medium text-oxford-blue font-archivo leading-[24px] tracking-[0%] mb-3">
                {t('dashboard.questionSession.hints')}
              </h4>
              <button onClick={onToggleHint} className="text-[14px] font-roboto text-[#0369A1] hover:underline mb-2">
                {currentState.showHint ? t('dashboard.questionSession.hideHints') : t('dashboard.questionSession.showHints')}
              </button>
              {currentState.showHint ? (
                <ul className="space-y-3">
                  {currentQuestion.hints.map((hint, index) => (
                    <li key={index} className="rounded-md bg-white p-3 text-[14px] text-[#4B5563] font-roboto border border-[#E5E7EB]">
                      {hint}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%]">
                  {t('dashboard.questionSession.revealHints')}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%]">
            {t('dashboard.questionSession.submitToSee')}
          </p>
        )
      ) : null}
    </div>
  </div>
  );
};

export default StudyExplanationSidebar;


