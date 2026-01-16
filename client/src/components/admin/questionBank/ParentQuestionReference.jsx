import React from 'react';
import { getOptionText, getCorrectAnswerLetter } from './utils/questionHelpers';
import { cleanHtmlForDisplay, cleanQuestionText } from '../../../utils/textUtils';

const ParentQuestionReference = ({ parentQuestion, t }) => {
  if (!parentQuestion) return null;

  return (
    <div className="rounded-[12px] border border-[#03274633] bg-white pt-[20px] px-[30px] pb-[30px] w-full">
      <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-oxford-blue">
        {t("processor.viewQuestion.parentQuestionReference")}
      </h2>
      <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-4">
        {t("processor.viewQuestion.parentQuestionDescription")}
      </p>
      <div className="bg-[#F6F7F8] rounded-lg p-4 border border-[#E5E7EB]">
        <div className="mb-3">
          <span className="font-roboto text-[14px] font-semibold text-oxford-blue">{t("processor.viewQuestion.parentQuestionLabel")}:</span>
          <div
            className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue mt-2 max-w-[600px] cursor-help"
            dir="ltr"
            title={cleanQuestionText(parentQuestion.questionText)}
          >
            <span dangerouslySetInnerHTML={{ __html: cleanHtmlForDisplay(parentQuestion.questionText) }} />
          </div>
        </div>
        
        {parentQuestion.questionType === "MCQ" && parentQuestion.options && (
          <>
            <div className="mt-4 mb-3">
              <span className="font-roboto text-[14px] font-semibold text-oxford-blue">{t("processor.viewQuestion.parentOptionsLabel")}:</span>
              <div className="space-y-2 mt-2" dir="ltr">
                {Object.entries(parentQuestion.options).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="font-roboto text-[14px] font-normal text-dark-gray min-w-[20px]">
                      {key}.
                    </span>
                    <span className="font-roboto text-[14px] font-normal text-dark-gray">
                      {getOptionText(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {(() => {
              const parentCorrectAnswerLetter = getCorrectAnswerLetter(parentQuestion.correctAnswer);
              return parentCorrectAnswerLetter && (
                <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                  <span className="font-roboto text-[14px] font-semibold text-oxford-blue">{t("processor.viewQuestion.parentCorrectAnswerLabel")}: </span>
                  <span className="font-roboto text-[14px] font-normal text-[#ED4122]">
                    {parentCorrectAnswerLetter}. {getOptionText(parentQuestion.options?.[parentCorrectAnswerLetter])}
                  </span>
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default ParentQuestionReference;
