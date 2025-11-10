import React from 'react';
import { analytics, watch, tick, cross } from '../icons';

const OptionCard = ({ option, groupName, isSelected, disabled, onOptionChange, highlight }) => {
  const baseClass = 'w-full min-h-[50px] rounded-lg flex items-center px-3 md:px-4 py-2 border-2 bg-white';
  const borderClass = highlight
    ? 'border-[#ED4122]'
    : isSelected
    ? 'border-[#ED4122]'
    : 'border-[#E5E7EB]';

  return (
    <div className={`${baseClass} ${borderClass}`}>
      <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full">
        <input
          type="radio"
          name={groupName}
          value={option.id}
          checked={isSelected}
          onChange={() => onOptionChange(option.id)}
          className="w-4 h-4 md:w-5 md:h-5 text-[#EF4444] border-[#EF4444] focus:ring-[#EF4444] flex-shrink-0"
          disabled={disabled}
        />
        <span className="text-[14px] md:text-[16px] font-normal text-[#032746] font-roboto flex-1">
          <span className="font-medium">{option.id}.</span> {option.text}
        </span>
      </label>
    </div>
  );
};

const ReviewOptionCard = ({ option, groupName, isCorrect, isUserAnswer }) => {
  const cardClass = isCorrect
    ? 'border-2 border-[#10B981] bg-[#ECFDF5]'
    : isUserAnswer
    ? 'border-2 border-[#EF4444] bg-[#FEF2F2]'
    : 'border-2 border-[#E5E7EB] bg-white';

  const radioClass = isCorrect
    ? 'text-[#10B981] border-[#10B981] focus:ring-[#10B981]'
    : isUserAnswer
    ? 'text-[#EF4444] border-[#EF4444] focus:ring-[#EF4444]'
    : 'text-[#E5E7EB] border-[#E5E7EB] focus:ring-[#E5E7EB]';

  return (
    <div className={`w-full min-h-[50px] rounded-lg flex items-center px-3 md:px-4 py-2 ${cardClass}`}>
      <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full">
        <input
          type="radio"
          name={groupName}
          value={option.id}
          checked={isCorrect || isUserAnswer}
          readOnly
          className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${radioClass}`}
        />
        <span className="text-[14px] md:text-[16px] font-normal text-[#032746] font-roboto flex-1">
          <span className="font-medium">{option.id}.</span> {option.text}
        </span>
        {isCorrect ? (
          <img src={tick} alt="Correct" className="text-white bg-cinnebar-red rounded-full p-1" />
        ) : isUserAnswer ? (
          <img src={cross} alt="Incorrect" className="text-white bg-cinnebar-red rounded-full p-1" />
        ) : null}
      </label>
    </div>
  );
};

const StatusPill = ({ isCorrect, label }) => (
  <div className={`${isCorrect ? 'bg-[#ECFDF5]' : 'bg-[#FDF0D5]'} rounded-lg px-3 md:px-4 py-2 flex items-center gap-2`}>
    <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-[#10B981]' : 'bg-[#ED4122]'}`}>
      <img src={isCorrect ? tick : cross} alt={isCorrect ? 'Correct' : 'Incorrect'} className="w-3 h-3 md:w-4 md:h-4" />
    </div>
    <span className={`text-[12px] md:text-[14px] font-normal font-roboto ${isCorrect ? 'text-[#047857]' : 'text-[#ED4122]'}`}>
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
  const statusButtonClass = isCorrect ? 'bg-[#10B981] text-white' : 'bg-[#ED4122] text-white';
  const statusButtonLabel = isCorrect ? 'Correct Answer' : 'Incorrect Answer';
  const infoContainerClass = isCorrect ? 'bg-[#ECFDF5] border-l-4 border-[#10B981]' : 'bg-[#FDF0D5] border-l-4 border-[#ED4122]';
  const infoTitleClass = isCorrect ? 'text-[#047857]' : 'text-[#ED4122]';

  const optionGroupName = `answer-${currentQuestion.id}`;
  const reviewGroupName = `answer-review-${currentQuestion.id}`;

  return (
    <div className="max-w-4xl mx-auto lg:ml-5">
      <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-[#032746] mb-6 md:mb-10 font-archivo leading-tight tracking-[0%]">
        Question Solving Page
      </h2>

      <div className="mb-4 md:mb-6">
        <p className="text-[16px] md:text-[18px] font-normal text-[#032746] font-roboto leading-[24px] tracking-[0%]">
          {currentQuestion.prompt}
        </p>
      </div>

      <div className="mb-4 md:mb-6">
        <div className="space-y-3 mb-6 md:mb-10 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-[2px_2px_10px_0px_#0000000D] rounded-lg">
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
            className={`w-full md:w-[316px] h-[50px] md:h-[60px] rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] transition ${
              hasSelectedOption ? 'bg-[#ED4122] text-white hover:opacity-90' : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        </div>
      )}

      {showReview && (
        <>
          <div className="w-full md:w-[316px] mb-6 md:mb-10 h-[50px] md:h-[60px] rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] flex items-center justify-center px-4 text-center transition-colors shadow-[0px_6px_20px_rgba(3,39,70,0.08)]">
            <span className={`w-full h-full flex items-center justify-center gap-2 rounded-[8px] ${statusButtonClass}`}>
              <img src={isCorrect ? tick : cross} alt={isCorrect ? 'Correct' : 'Incorrect'} className="h-4 w-4 md:h-[22px] md:w-[22px]" />
              {statusButtonLabel}
            </span>
          </div>

          <div className={`mb-4 md:mb-6 w-full min-h-[110px] rounded-[14px] shadow-[0px_0px_5px_0px_#0000001A] flex flex-col md:flex-row items-start md:items-center ${infoContainerClass} p-4 md:p-0`}>
            <div className="flex-1 flex flex-col justify-center items-start pl-0 md:pl-6 mb-4 md:mb-0">
              <div className={`text-[14px] md:text-[16px] font-bold font-roboto mb-1 ${infoTitleClass}`}>{statusButtonLabel}</div>
              <div className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto">Correct answer: {currentQuestion.correctAnswer}</div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-start md:items-center mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <img src={analytics} alt="Analytics" className="w-4 h-4 md:w-5 md:h-5" />
                <div className="text-[14px] md:text-[16px] font-bold text-[#032746] font-roboto">{currentQuestion.percentageCorrect ?? '--'}%</div>
              </div>
              <div className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto">Answered correctly</div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-start md:items-center">
              <div className="flex items-center gap-2">
                <img src={watch} alt="Time" className="w-4 h-4 md:w-5 md:h-5" />
                <div className="text-[14px] md:text-[16px] font-bold text-[#032746] font-roboto">{currentQuestion.timeSpent || '--:--'}</div>
              </div>
              <div className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto">Time spent</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 md:mb-6">
            <StatusPill isCorrect={isCorrect} label={statusButtonLabel} />
            <div>
              <span className="text-[12px] md:text-[14px] font-normal text-[#032746] font-roboto">
                Correct Answer {currentQuestion.correctAnswer}
              </span>
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <div className="space-y-3 mb-4 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-[2px_2px_10px_0px_#0000000D] rounded-lg">
              {currentQuestion.options.map((option) => (
                <ReviewOptionCard
                  key={option.id}
                  option={option}
                  groupName={reviewGroupName}
                  isCorrect={option.id === currentQuestion.correctAnswer}
                  isUserAnswer={option.id === selectedOption?.id}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6" />
        </>
      )}

      <button
        onClick={onToggleExplanationPanel}
        className="lg:hidden w-full mb-4 px-4 py-3 bg-[#F3F4F6] text-[#032746] rounded-lg text-[14px] font-normal font-roboto hover:opacity-90 transition-opacity flex items-center justify-between"
      >
        <span className="font-bold">Explanation</span>
        <svg className={`w-5 h-5 transition-transform ${showExplanationPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showExplanationPanel && (
        <div className="lg:hidden mb-4 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
          {showReview ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-[14px] md:text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-3">
                  Correct Answer Explanation
                </h4>
                <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%] mb-2">
                  Answer: {correctOption?.id}. {correctOption?.text}
                </p>
                <h5 className="text-[14px] md:text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-2">
                  Explanation:
                </h5>
                <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                  {correctOption?.explanation || 'This answer choice aligns with the underlying concept tested in the question.'}
                </p>
              </div>

              {selectedOption && selectedOption.id !== correctOption?.id && (
                <div>
                  <h4 className="text-[14px] md:text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-3">
                    Your Answer Explanation
                  </h4>
                  <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%] mb-2">
                    Answer: {selectedOption.id}. {selectedOption.text}
                  </p>
                  <h5 className="text-[14px] md:text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-2">
                    Consider:
                  </h5>
                  <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                    Review why this option may not address the scenario described. Focus on differentiating the mechanisms.
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[14px] md:text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%]">
                    Hints
                  </h4>
                  <button onClick={onToggleHint} className="text-[14px] font-roboto text-[#0369A1] hover:underline">
                    {currentState.showHint ? 'Hide hints' : 'Show hints'}
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
                  <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                    Reveal hints to get strategic nudges before reattempting the question.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[12px] md:text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
              Submit your answer to view the full explanation and hints.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyQuestionContent;


