import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const StudyQuestionNavigator = ({
  questions,
  currentIndex,
  questionState = [],
  showQuestionNav,
  visitedIndices,
  onGoToIndex,
  onCloseQuestionNav,
}) => {
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const getQuestionStatus = (index) => {
    const state = questionState[index] || {};
    const isReviewed = Boolean(state.showFeedback);
    const isCorrect = state.isCorrect === true;
    const isIncorrect = state.isCorrect === false;
    const isMarked = Boolean(state.isMarked);
    const isCurrent = index === currentIndex;
    const isVisited = visitedIndices.has(index);

    if (isReviewed && isCorrect) return 'correct';
    if (isReviewed && isIncorrect) return 'incorrect';
    if (isCurrent) return 'current';
    if (isMarked) return 'marked';
    if (isVisited) return 'visited';
    return 'default';
  };

  const getButtonClass = (status) => {
    switch (status) {
      case 'correct':
        return 'border-[#22C55E] bg-[#F0FDF4] text-[#22C55E]';
      case 'incorrect':
        return 'border-[#EF4444] bg-[#FEF2F0] text-[#EF4444]';
      case 'current':
        return 'border-[#75A9CC] bg-[#ECF4FA] text-[#4285B5]';
      case 'marked':
        return 'border-[#EAB308] bg-[#FEFCE8] text-[#EAB308]';
      case 'visited':
        return 'border-[#D1D5DB] bg-[#F5F6F7] text-[#6B7280]';
      default:
        return 'border-[#D1D5DB] bg-white text-[#9CA3AF]';
    }
  };

  const renderButtonContent = (status, index) => {
    if (status === 'correct') {
      return (
        <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (status === 'incorrect') {
      return (
        <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    }
    return index + 1;
  };

  return (
    <>
      {showQuestionNav && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onCloseQuestionNav} />
          <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-white overflow-y-auto z-50 lg:hidden shadow-lg">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-oxford-blue font-archivo">{t('dashboard.questionSession.questions')}</h3>
              <button onClick={onCloseQuestionNav} className="text-oxford-blue hover:opacity-70">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-3 gap-3">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <button
                      key={index}
                      onClick={() => onGoToIndex(index)}
                      className={`h-12 rounded-xl border text-[20px] font-semibold font-roboto transition-colors ${getButtonClass(status)}`}
                    >
                      {renderButtonContent(status, index)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <div className={`hidden lg:flex w-[72px] h-full bg-white flex-col ${dir === 'rtl' ? 'border-l' : 'border-r'} border-[#E5E7EB]`}>
        <div className="flex-1 overflow-y-auto py-3 px-[12px] space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {questions.map((_, index) => {
            const status = getQuestionStatus(index);
            return (
              <button
                key={index}
                onClick={() => onGoToIndex(index)}
                className={`w-[46px] h-[46px] gap-2 rounded-[10px] pt-3 pr-4 pb-3 pl-4 border text-[20px] leading-none font-semibold font-roboto transition-colors flex items-center justify-center mx-auto ${getButtonClass(status)}`}
              >
                {renderButtonContent(status, index)}
              </button>
            );
          })}
        </div>

        <div className="px-[12px] pt-3 pb-4 border-t border-[#E5E7EB] bg-white">
          <div className="flex items-center gap-2 text-[24px] leading-none font-medium text-[#748AA1] font-roboto">
            <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
            <span className="text-[12px] leading-[12px] text-[#94A3B8]">Flag</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[24px] leading-none font-medium text-[#A9B4C2] font-roboto">
            <span className="w-2 h-2 rounded-full border border-[#B7C2CF]" />
            <span className="text-[12px] leading-[12px] text-[#94A3B8]">N/A</span>
          </div>
        </div>
      </div>

    </>
  );
};

export default StudyQuestionNavigator;


