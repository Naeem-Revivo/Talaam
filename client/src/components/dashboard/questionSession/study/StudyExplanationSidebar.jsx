import React from 'react';

const StudyExplanationSidebar = ({
  showExplanation,
  showReview,
  correctOption,
  selectedOption,
  currentQuestion,
  currentState,
  onToggleExplanation,
  onToggleHint,
}) => (
  <div className="hidden lg:flex w-[256px] h-full bg-[#F9FAFB] border-l border-[#E5E7EB] overflow-y-auto">
    <div className="p-4 md:p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] md:text-[20px] font-bold text-[#032746] font-archivo">Explanation</h3>
        <button onClick={onToggleExplanation} className="text-[14px] font-normal text-[#032746] font-roboto hover:opacity-70">
          {showExplanation ? 'Hide' : 'Show'}
        </button>
      </div>

      {showExplanation ? (
        showReview ? (
          <div className="space-y-6">
            <div>
              <h4 className="text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-3">
                Correct Answer Explanation
              </h4>
              <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%] mb-2">
                Answer: {correctOption?.id}. {correctOption?.text}
              </p>
              <h5 className="text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-2">
                Explanation:
              </h5>
              <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                {correctOption?.explanation || 'This answer choice aligns with the underlying concept tested in the question.'}
              </p>
            </div>

            {selectedOption && selectedOption.id !== correctOption?.id && (
              <div>
                <h4 className="text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-3">
                  Your Answer
                </h4>
                <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%] mb-2">
                  Answer: {selectedOption.id}. {selectedOption.text}
                </p>
                <h5 className="text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-2">
                  Consider:
                </h5>
                <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                  Review why this option may not address the scenario described. Focus on differentiating the mechanisms.
                </p>
              </div>
            )}

            <div>
              <h4 className="text-[16px] font-medium text-[#032746] font-archivo leading-[24px] tracking-[0%] mb-3">
                Hints
              </h4>
              <button onClick={onToggleHint} className="text-[14px] font-roboto text-[#0369A1] hover:underline mb-2">
                {currentState.showHint ? 'Hide hints' : 'Show hints'}
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
                <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
                  Reveal hints to get strategic nudges before reattempting the question.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-[14px] font-normal text-[#6B7280] font-roboto leading-[24px] tracking-[0%]">
            Submit your answer to see explanations and hints.
          </p>
        )
      ) : null}
    </div>
  </div>
);

export default StudyExplanationSidebar;


