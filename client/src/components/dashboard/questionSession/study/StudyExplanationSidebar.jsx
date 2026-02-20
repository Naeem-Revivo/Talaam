import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { cleanHtmlForDisplay } from '../../../../utils/textUtils';

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
  void onToggleHint;
  const explanationText =
    currentState?.explanation ||
    currentQuestion?.explanation ||
    (correctOption && correctOption.explanation) ||
    'This answer choice aligns with the underlying concept tested in the question.';

  // Collapsed state: narrow sidebar with a chevron "<<" style button
  if (!showExplanation) {
    return (
      <div
        className={`hidden lg:flex w-[48px] h-full bg-[#F9FAFB] border-[#E5E7EB] ${dir === 'rtl' ? 'border-r' : 'border-l'
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
    <div className={`hidden lg:flex w-[390px] h-full border-l border-[#D4D4D4] ${dir === 'rtl' ? 'border-r' : 'border-l'}`}>
      <div className="w-full flex flex-col">
        <div className="px-4 py-3 border-b border-[#E5E7EB] bg-[#FAFBFC] flex items-center justify-between">
          <h3 className="text-[15px] leading-[22px] font-bold text-oxford-blue font-archivo">
            {t('dashboard.questionSession.explanation.title')}
          </h3>
          <div className="flex items-center gap-3">
            {showReview && (
              <span className="text-[11px] leading-[16px] font-semibold text-[#16A34A] font-roboto">
                Ans: {correctOption?.id || '--'}
              </span>
            )}
            <button onClick={onToggleExplanation} className="text-[#94A3B8] hover:text-[#64748B]" aria-label={t('dashboard.questionSession.explanation.hide')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12" stroke="#94A3B8" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4 4L12 12" stroke="#94A3B8" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {showReview ? (
            <div className="space-y-3">
              <div className="w-full max-w-[465.1796875px] min-h-[65px] rounded-[14px] border border-[#BBF7D0] bg-[#F0FDF4] pl-4 pr-3 py-2.5">
                <div className="flex items-center gap-3 h-full">
                  <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#15803D] text-white">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] leading-[15px] tracking-[0.5px] uppercase font-semibold text-[#16A34A] font-roboto">
                      {t('dashboard.questionSession.explanation.correctAnswerExplanation')}
                    </p>
                    <p className="text-[13px] leading-[19.5px] text-[#15803D] font-medium font-roboto">
                      {correctOption?.id}. {correctOption?.text}
                    </p>
                  </div>
                </div>
              </div>

              {selectedOption && selectedOption.id !== correctOption?.id && (
                <div className="w-full max-w-[465.1796875px] min-h-[61px] rounded-[14px] border border-[#FECACA] bg-[#FEF2F2] pl-4 pr-3 py-2.5">
                  <div className="flex items-center gap-3 h-full">
                    <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#EF4444] text-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] leading-[15px] tracking-[0.5px] uppercase font-semibold text-[#EF4444] font-roboto">
                        {t('dashboard.questionSession.yourAnswer')}
                      </p>
                      <p className="text-[13px] leading-[19.5px] text-[#B91C1C] font-normal font-roboto">
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
          ) : (
            <p className="text-[14px] font-normal text-[#475569] font-roboto leading-[24px] tracking-[0%]">
              {t('dashboard.questionSession.submitToSee')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyExplanationSidebar;
