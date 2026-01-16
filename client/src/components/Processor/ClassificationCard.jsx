import React from 'react';

const ClassificationCard = ({
  question,
  wasUpdatedAfterFlag,
  isFlagged,
  flagType,
  isFromExplainerSubmission,
  isFromCreatorSubmission,
  t
}) => {
  const getStatusDisplay = () => {
    if (wasUpdatedAfterFlag && question.flagType) {
      // Determine updater role from history
      const updateHistory = question.history?.find(
        (h) =>
          (h.action === "updated" ||
            h.action === "update") &&
          (h.role === "gatherer" || h.role === "admin")
      );
      const updaterRole =
        updateHistory?.role === "admin"
          ? "admin"
          : "gatherer";
      if (question.flagType === "creator") {
        return `Updated by ${updaterRole} (flagged by creator)`;
      } else if (question.flagType === "explainer") {
        return `Updated by ${updaterRole} (flagged by explainer)`;
      } else if (question.flagType === "student") {
        return `Updated by ${updaterRole} (flagged by student)`;
      }
    }
    if (isFlagged) {
      if (flagType === "student") {
        return "Flagged by student";
      } else if (flagType === "explainer") {
        return "Flagged by explainer";
      } else {
        return "Flagged by creator";
      }
    }
    if (question.status === "pending_processor") {
      if (isFromExplainerSubmission) {
        return "Submitted by explainer";
      } else if (isFromCreatorSubmission) {
        return "Submitted by creator";
      } else {
        // Determine creator role from history or createdBy
        const creationHistory = question.history?.find(
          (h) => h.action === "created"
        );
        const creatorRole =
          creationHistory?.role ||
          question.createdBy?.adminRole;
        const roleLabel =
          creatorRole === "admin" ? "admin" : "gatherer";
        return `Submitted by ${roleLabel}`;
      }
    }
    return question.status || "—";
  };

  return (
    <div className="rounded-lg border border-[#CDD4DA] bg-white">
      <div className="pt-10 px-6 pb-6 border-b border-[#CDD4DA]">
        <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark">
          {t("processor.viewQuestion.classification")}
        </h2>
      </div>
      <div className="space-y-5 text-[18px] leading-[100%] font-normal text-blue-dark pt-10 px-6 pb-6">
        {question.difficulty && (
          <div>
            <span className="">Difficulty: </span>
            <span className="">{question.difficulty}</span>
          </div>
        )}
        <div>
          <span className="">Subject: </span>
          <span className="">{question.subject?.name || "—"}</span>
        </div>
        <div>
          <span className="">Topic: </span>
          <span className="">{question.topic?.name || "—"}</span>
        </div>
        {question.subtopic && (
          <div>
            <span className="">Subtopic: </span>
            <span className="">
              {question.subtopic.name || question.subtopic || "—"}
            </span>
          </div>
        )}
        {question.isVariant && (
          <div>
            <span className="">Variant: </span>
            <span className="">
              {question.variantNumber || "Yes"}
            </span>
          </div>
        )}
        <div>
          <span className="">Status: </span>
          <span className="text-orange-dark">
            {getStatusDisplay()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClassificationCard;
