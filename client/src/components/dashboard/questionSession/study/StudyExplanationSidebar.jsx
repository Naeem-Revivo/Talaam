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
  
  // Collapsed state: narrow sidebar with a chevron "<<" style button
  if (!showExplanation) {
    return (
      <div
        className={`hidden lg:flex w-[48px] h-full bg-[#F9FAFB] border-[#E5E7EB] ${
          dir === 'rtl' ? 'border-r' : 'border-l'
        } items-center justify-center`}
      >
        <button
          onClick={onToggleExplanation}
          aria-label={t('dashboard.questionSession.explanation.show')}
          className="flex h-10 w-10 items-center justify-center rounded-full text-oxford-blue hover:bg-[#E5E7EB] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Double chevron pointing towards the content area */}
            <path d="M13 5L8 12l5 7" />
            <path d="M19 5L14 12l5 7" />
          </svg>
        </button>
      </div>
    );
  }
  
  return (
    <div className={`hidden lg:flex w-[256px] h-full bg-[#F9FAFB] border-l border-[#E5E7EB] overflow-y-auto ${dir === 'rtl' ? "border-r" : "border-l"}`}>
      <div className="p-4 md:p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] leading-[24px] font-bold text-oxford-blue font-archivo">{t('dashboard.questionSession.explanation.title')}</h3>
          <button onClick={onToggleExplanation} className="text-[18px] leading-[14px] font-normal text-oxford-blue font-archivo hover:opacity-70">
            {t('dashboard.questionSession.explanation.hide')}
          </button>
        </div>

        {showReview ? (
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
                {currentState?.explanation || currentQuestion?.explanation || (correctOption && correctOption.explanation) || 'This answer choice aligns with the underlying concept tested in the question.'}
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

           
          </div>
        ) : (
          <p className="text-[14px] font-normal text-dark-gray font-roboto leading-[24px] tracking-[0%]">
            {t('dashboard.questionSession.submitToSee')}
          </p>
        )}
      </div>
    </div>
  );
};

export default StudyExplanationSidebar;
