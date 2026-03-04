import React from 'react';

const FlagReasonSection = ({ question, isFlagged, gathererRejectedFlag, flagType, t }) => {
  if (!question.flagReason && !gathererRejectedFlag) return null;

  // Show flag reason if question is flagged, gatherer rejected flag, or has flagType
  const shouldShowFlagReason = question.flagReason && (
    isFlagged || 
    gathererRejectedFlag || 
    (question.isFlagged === true && question.flagType) || 
    (question.flagType && question.flagStatus === 'rejected')
  );

  if (!shouldShowFlagReason) return null;

  return (
    <div className="rounded-[12px] border-2 border-orange-dark bg-orange-50 pt-[20px] px-[30px] pb-[30px] w-full">
      <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-orange-dark">
        {t("processor.viewQuestion.flagReason") || "Original Flag Reason"}
      </h2>
      <div className="mb-2">
        <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-2">
          {question.flagStatus === 'rejected'
            ? (flagType === 'student'
                ? (t("processor.viewQuestion.flagReasonDescriptionStudentRejected") || "The student flagged this question (rejected by processor) with the following reason:")
                : flagType === 'explainer'
                ? (t("processor.viewQuestion.flagReasonDescriptionExplainerRejected") || "The explainer flagged this question (rejected by processor) with the following reason:")
                : (t("processor.viewQuestion.flagReasonDescriptionRejected") || "The creator flagged this question (rejected by processor) with the following reason:"))
            : (flagType === 'student'
                ? (t("processor.viewQuestion.flagReasonDescriptionStudent") || "The student has flagged this question with the following reason:")
                : flagType === 'explainer' 
                ? (t("processor.viewQuestion.flagReasonDescriptionExplainer") || "The explainer has flagged this question with the following reason:")
                : (t("processor.viewQuestion.flagReasonDescription") || "The creator has flagged this question with the following reason:"))}
        </p>
        {question.flagStatus === 'rejected' && (
          <p className="font-roboto text-[14px] font-semibold text-orange-600 mb-2">
            {t("processor.viewQuestion.flagRejectedNote") || "Note: This flag was previously rejected by the processor, but you can still review and process the question."}
          </p>
        )}
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
