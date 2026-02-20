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
  const { t } = useLanguage();

  // Check if a question is submitted (cannot navigate to it)
  const isQuestionSubmitted = (index) => {
    return questionState[index]?.isSubmitted || questionState[index]?.status === 'submit';
  };

  // Check if a question is submitted (anywhere, not just before current)
  const isQuestionSubmittedAnywhere = (index) => {
    return questionState[index]?.isSubmitted || questionState[index]?.status === 'submit';
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
            <div className="p-2">
              <div className="grid grid-cols-3 gap-2">
                {questions.map((_, index) => {
                  const isSubmitted = isQuestionSubmitted(index);
                  const isDisabled = isSubmitted;
                  const isSubmittedAnywhere = isQuestionSubmittedAnywhere(index);
                  const isVisited = visitedIndices.has(index);
                  return (
                  <button
                    key={index}
                      onClick={() => !isDisabled && onGoToIndex(index)}
                      disabled={isDisabled}
                    className={`py-2 px-3 text-[14px] font-medium font-roboto transition-colors text-center border border-[#B9C9C5] rounded ${
                      index === currentIndex
                        ? 'bg-[#EF4444] text-white border-[#EF4444]'
                          : isSubmittedAnywhere
                          ? isDisabled
                            ? 'bg-[#9BB5AD] text-oxford-blue border-[#9BB5AD] cursor-not-allowed opacity-80'
                            : 'bg-[#9BB5AD] text-oxford-blue hover:opacity-90'
                          : isVisited
                        ? 'bg-[#C6D8D3] text-oxford-blue hover:opacity-80'
                        : 'bg-white text-oxford-blue hover:opacity-80'
                    }`}
                  >
                    {index + 1}
                  </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="hidden lg:flex w-[72px] h-full bg-white flex-col border-r border-[#E5E7EB]">
        <div className="flex-1 overflow-y-auto py-3 px-[12px] space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {questions.map((_, index) => {
            const isSubmitted = isQuestionSubmitted(index);
            const isDisabled = isSubmitted;
            const isSubmittedAnywhere = isQuestionSubmittedAnywhere(index);
            const isVisited = visitedIndices.has(index);
            return (
            <button
              key={index}
                onClick={() => !isDisabled && onGoToIndex(index)}
                disabled={isDisabled}
              className={`w-[46px] h-[46px] gap-2 rounded-[10px] pt-3 pr-4 pb-3 pl-4 border text-[20px] leading-none font-semibold font-roboto transition-colors flex items-center justify-center mx-auto ${
                index === currentIndex
                  ? 'bg-[#EF4444] text-white border-[#EF4444]'
                    : isSubmittedAnywhere
                    ? isDisabled
                      ? 'bg-[#C6D8D3] text-oxford-blue border-[#B9C9C5] cursor-not-allowed opacity-80'
                      : 'bg-[#C6D8D3] text-oxford-blue border-[#B9C9C5] hover:opacity-90'
                    : isVisited
                  ? 'bg-[#ECF4FA] text-[#4285B5] border-[#75A9CC] hover:opacity-80'
                  : 'bg-white text-[#9CA3AF] border-[#D1D5DB] hover:opacity-80'
              }`}
            >
              {index + 1}
            </button>
            );
          })}
        </div>

        <div className="px-[12px] pt-3 pb-4 border-t border-[#E5E7EB] bg-white">
          <div className="flex items-center gap-2 font-roboto">
            <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
            <span className="text-[12px] leading-[12px] text-[#94A3B8]">Flag</span>
          </div>
          <div className="mt-2 flex items-center gap-2 font-roboto">
            <span className="w-2 h-2 rounded-full border border-[#B7C2CF]" />
            <span className="text-[12px] leading-[12px] text-[#94A3B8]">N/A</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestQuestionNavigator;