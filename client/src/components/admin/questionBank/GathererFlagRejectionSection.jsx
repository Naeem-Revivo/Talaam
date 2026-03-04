import React from 'react';

const GathererFlagRejectionSection = ({ question, gathererRejectedFlag, t }) => {
  if (!gathererRejectedFlag || !question.flagRejectionReason) return null;

  return (
    <div className="rounded-[12px] border-2 border-blue-500 bg-blue-50 pt-[20px] px-[30px] pb-[30px] w-full">
      <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-blue-700">
        {t("processor.viewQuestion.gathererFlagRejection") || "Gatherer's Flag Rejection"}
      </h2>
      <div className="mb-2">
        <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-2">
          {t("processor.viewQuestion.gathererFlagRejectionDescription") || "The gatherer has rejected the flag with the following reason:"}
        </p>
      </div>
      <div
        className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue whitespace-pre-wrap bg-white p-4 rounded-lg border border-blue-200"
        dir="ltr"
      >
        {question.flagRejectionReason}
      </div>
    </div>
  );
};

export default GathererFlagRejectionSection;
