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
    const baseClasses = 'border font-roboto transition-colors';
    const fontWeight = status === 'default' ? 'font-normal' : 'font-bold';

    switch (status) {
      case 'correct':
        return `${baseClasses} border-[#22C55E] bg-[#F0FDF4] text-[#22C55E] ${fontWeight}`;
      case 'incorrect':
        return `${baseClasses} border-[#EF4444] bg-[#FEF2F0] text-[#EF4444] ${fontWeight}`;
      case 'current':
        return `${baseClasses} border-[#6697B7] bg-[#E6EEF3] text-[#6697B7] ${fontWeight}`;
      case 'marked':
        return `${baseClasses} border-[#EAB308] bg-[#FEFCE8] text-[#EAB308] ${fontWeight}`;
      case 'visited':
        return `${baseClasses} border-[#D1D5DB] bg-[#F5F6F7] text-[#6B7280] ${fontWeight}`;
      default:
        return `${baseClasses} border-[#D4D4D4] bg-[#F8FAFC] text-[#737373] ${fontWeight}`;
    }
  };

  const renderButtonContent = (status, index) => {
    if (status === 'correct') {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#22C55E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

      );
    }
    if (status === 'incorrect') {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5L5 15M5 5L15 15" stroke="#EF4444" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
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
                      className={`h-12 rounded-[10px] text-[14px] leading-[21px] ${getButtonClass(status)}`}
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
                className={`w-[46px] h-[46px] gap-2 rounded-[10px] text-[14px] leading-[21px] flex items-center justify-center mx-auto ${getButtonClass(status)}`}
              >
                {renderButtonContent(status, index)}
              </button>
            );
          })}
        </div>
      </div>

    </>
  );
};

export default StudyQuestionNavigator;


