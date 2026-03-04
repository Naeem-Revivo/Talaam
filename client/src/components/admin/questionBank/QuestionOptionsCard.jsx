import React from 'react';
import { getOptionText, getCorrectAnswerLetter } from './utils/questionHelpers';

const QuestionOptionsCard = ({ question, t }) => {
  return (
    <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 w-full">
      <div>
        <div className="text-[16px] leading-[100%] font-normal font-roboto mb-[30px]">
          {t("processor.viewQuestion.options")}
        </div>
        {(question.questionType === "MCQ" || question.questionType === "TRUE_FALSE") && question.options ? (
          <>
            <div className="space-y-5" dir="ltr">
              {question.questionType === "TRUE_FALSE" ? (
                <>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="A"
                      checked={getCorrectAnswerLetter(question.correctAnswer) === "A"}
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      True
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value="B"
                      checked={getCorrectAnswerLetter(question.correctAnswer) === "B"}
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      False
                    </span>
                  </label>
                </>
              ) : (
                Object.entries(question.options).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="option"
                      value={key}
                      checked={key === getCorrectAnswerLetter(question.correctAnswer)}
                      className="w-4 h-4 text-[#ED4122] border-[#03274633] focus:ring-[#ED4122] focus:ring-2"
                      disabled
                    />
                    <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                      {key}. {getOptionText(value)}
                    </span>
                  </label>
                ))
              )}
            </div>

            <div className="border-t border-[#E5E7EB] mt-10 pt-4">
              <p className="font-archivo text-[20px] font-bold leading-[20px] text-oxford-blue mb-2">
                {t("admin.questionDetails.fields.correctAnswer")}
              </p>
              <label
                className="flex items-center gap-3 pt-2 cursor-pointer"
                dir="ltr"
              >
                <input
                  type="radio"
                  name="correctAnswer"
                  value={getCorrectAnswerLetter(question.correctAnswer) || ""}
                  checked
                  className="w-4 h-4 text-[#ED4122] border-[#03274633]"
                  disabled
                />
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-[#ED4122]">
                  {(() => {
                    const correctAnswerLetter = getCorrectAnswerLetter(question.correctAnswer);
                    if (question.questionType === "TRUE_FALSE") {
                      return correctAnswerLetter === "A" ? "True" : "False";
                    }
                    return correctAnswerLetter 
                      ? `${correctAnswerLetter}. ${getOptionText(question.options?.[correctAnswerLetter])}`
                      : "—";
                  })()}
                </span>
              </label>
            </div>
          </>
        ) : (
          <p className="text-dark-gray font-roboto text-[16px]">
            {t("processor.viewQuestion.noOptions") || "No options available for this question type."}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionOptionsCard;
