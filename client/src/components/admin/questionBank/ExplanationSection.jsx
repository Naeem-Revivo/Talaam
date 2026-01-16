import React from 'react';

const ExplanationSection = ({ explanation, t }) => {
  if (!explanation) return null;

  return (
    <div className="rounded-[12px] border border-[#03274633] bg-white pt-[20px] px-[30px] pb-[30px] w-full">
      <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-oxford-blue">
        {t("processor.viewQuestion.explanation") || "Explanation"}
      </h2>
      <div
        className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue whitespace-pre-wrap"
        dir="ltr"
      >
        {explanation}
      </div>
    </div>
  );
};

export default ExplanationSection;
