import React from 'react';

const FlagReasonSection = ({ question, isFlagged, gathererRejectedFlag, isFromAdminSubmission, flagType, t }) => {
  if (!question.flagReason ||
    (!isFlagged &&
      !gathererRejectedFlag &&
      !(isFromAdminSubmission &&
        flagType === "student" &&
        question.isFlagged))) {
    return null;
  }

  return (
    <div className="rounded-[12px] border-2 border-orange-dark bg-orange-50 pt-[20px] px-[30px] pb-[30px] w-full">
      <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-orange-dark">
        {t("processor.viewQuestion.flagReason") ||
          "Original Flag Reason"}
      </h2>
      <div className="mb-2">
        <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-2">
          {flagType === "student"
            ? t(
                "processor.viewQuestion.flagReasonDescriptionStudent"
              ) ||
              "The student has flagged this question with the following reason:"
            : flagType === "explainer"
            ? t(
                "processor.viewQuestion.flagReasonDescriptionExplainer"
              ) ||
              "The explainer has flagged this question with the following reason:"
            : t("processor.viewQuestion.flagReasonDescription") ||
              "The creator has flagged this question with the following reason:"}
        </p>
      </div>
      <div
        className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue whitespace-pre-wrap bg-white p-4 rounded-lg border border-orange-200"
        dir="ltr"
      >
        {question.flagReason}
      </div>
    </div>
  );
};

export default FlagReasonSection;
