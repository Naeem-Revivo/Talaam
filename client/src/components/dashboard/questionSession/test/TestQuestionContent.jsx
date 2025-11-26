import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const TestQuestionContent = ({
  currentQuestion,
  currentState,
  hasSelectedOption,
  onOptionChange,
  onSubmit,
}) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto lg:ml-5">
      <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-oxford-blue mb-6 md:mb-10 font-archivo leading-tight tracking-[0%]">
        {t('dashboard.questionSession.title')}
      </h2>

      <div className="mb-4 md:mb-6">
        <p className="text-[16px] md:text-[18px] font-normal text-oxford-blue font-roboto leading-[24px] tracking-[0%]">
          {currentQuestion.prompt}
        </p>
      </div>

      <div className="mb-4 md:mb-6">
        <div className="space-y-3 mb-6 md:mb-10 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-content rounded-lg">
          {currentQuestion.options.map((option) => {
            const isSelected = option.id === currentState?.selectedOption;

            return (
              <div
                key={option.id}
                className={`w-full min-h-[50px] rounded-lg border-2 flex items-center px-3 md:px-4 py-2 ${
                  isSelected ? 'border-[#ED4122] bg-white' : 'border-[#E5E7EB] bg-white'
                }`}
              >
                <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full">
                  <input
                    type="radio"
                    name={`answer-${currentQuestion.id}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => onOptionChange(option.id)}
                    className="w-4 h-4 md:w-5 md:h-5 text-[#EF4444] border-[#EF4444] focus:ring-[#EF4444] flex-shrink-0"
                  />
                  <span className="text-[14px] md:text-[16px] font-normal text-oxford-blue font-roboto flex-1">
                    <span className="font-medium">{option.id}.</span> {option.text}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center md:justify-start mb-10">
        <button
          onClick={onSubmit}
          disabled={!hasSelectedOption}
          className={`w-full md:w-[316px] h-[50px] md:h-[60px] rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] transition ${
            hasSelectedOption ? 'bg-[#ED4122] text-white hover:opacity-90' : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
          }`}
        >
          {t('dashboard.questionSession.submitAnswer')}
        </button>
      </div>
    </div>
  );
};

export default TestQuestionContent;