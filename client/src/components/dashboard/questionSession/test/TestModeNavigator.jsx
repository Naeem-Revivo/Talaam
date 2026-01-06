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

      <div className="hidden lg:flex w-[110px] h-full bg-white overflow-y-auto flex-col border-r border-[#E5E7EB]">
        <div className="flex-1 py-2">
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
              className={`w-full py-2 text-[14px] font-medium font-roboto transition-colors text-center border border-[#B9C9C5] ${
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
    </>
  );
};

export default TestQuestionNavigator;