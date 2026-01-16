import React from 'react';

const QuestionInfoCard = ({ question, t, stripHtmlTags }) => {
  return (
    <div
      className="rounded-[12px] border border-[#03274633] bg-white pt-[20px] px-[30px] pb-[67px] w-full"
      style={{}}
    >
      <h2 className="mb-2 font-archivo text-[20px] font-bold leading-[32px] text-oxford-blue">
        {t("processor.viewQuestion.questionInfo")}
      </h2>
      <p
        className="font-roboto text-[16px] font-normal leading-[100%] text-oxford-blue pt-[30px]"
        dir="ltr"
      >
        {stripHtmlTags(question.questionText)}
      </p>
    </div>
  );
};

export default QuestionInfoCard;
