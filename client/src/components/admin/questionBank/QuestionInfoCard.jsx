import React from 'react';
import { cleanHtmlForDisplay, cleanQuestionText } from '../../../utils/textUtils';

const QuestionInfoCard = ({ question, t }) => {
  return (
    <div className="rounded-[12px] border border-[#03274633] bg-white pt-[20px] px-[30px] pb-[67px] w-full">
      <h2 className="mb-2 font-archivo text-[20px] font-bold leading-[32px] text-oxford-blue">
        {t("processor.viewQuestion.questionInfo")}
      </h2>
      <div
        className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue pt-[30px] max-w-[600px] cursor-help"
        dir="ltr"
        title={cleanQuestionText(question.questionText)}
      >
        <span dangerouslySetInnerHTML={{ __html: cleanHtmlForDisplay(question.questionText) }} />
      </div>
    </div>
  );
};

export default QuestionInfoCard;
