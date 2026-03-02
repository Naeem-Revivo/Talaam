import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const TestQuestionNavigator = ({
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

  // Check if a question is submitted (cannot navigate to it)
  const isQuestionSubmitted = (index) => {
    return questionState[index]?.isSubmitted || questionState[index]?.status === 'submit';
  };

  const getQuestionStatus = (index) => {
    const state = questionState[index] || {};
    const isSubmitted = isQuestionSubmitted(index);
    const isCurrent = index === currentIndex;
    const isVisited = visitedIndices.has(index);

    if (isCurrent) return 'current';
    if (isSubmitted) return 'submitted';
    if (isVisited) return 'visited';
    return 'default';
  };

  const getButtonClass = (status) => {
    const baseClasses = 'border font-roboto transition-colors';
    const fontWeight = status === 'default' ? 'font-normal' : 'font-bold';

    switch (status) {
      case 'current':
        return `${baseClasses} border-[#6697B7] bg-[#E6EEF3] text-[#6697B7] ${fontWeight}`;
      case 'submitted':
        return `${baseClasses} border-[#9BB5AD] bg-[#E8F0ED] text-[#2D4A42] cursor-not-allowed opacity-80 ${fontWeight}`;
      case 'visited':
        return `${baseClasses} border-[#D1D5DB] bg-[#F5F6F7] text-[#6B7280] ${fontWeight}`;
      default:
        return `${baseClasses} border-[#D4D4D4] bg-[#F8FAFC] text-[#737373] ${fontWeight}`;
    }
  };

  const renderButtonContent = (status, index) => {
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
                  const isDisabled = status === 'submitted';
                  return (
                    <button
                      key={index}
                      onClick={() => !isDisabled && onGoToIndex(index)}
                      disabled={isDisabled}
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
            const isDisabled = status === 'submitted';
            return (
              <button
                key={index}
                onClick={() => !isDisabled && onGoToIndex(index)}
                disabled={isDisabled}
                className={`w-[46px] h-[46px] gap-2 rounded-[10px] text-[14px] leading-[21px] flex items-center justify-center mx-auto ${getButtonClass(status)}`}
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

export default TestQuestionNavigator;