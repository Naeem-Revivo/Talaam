import React from 'react';

const CreatorGathererNotesCard = ({ question, t }) => {
  return (
    <div className="rounded-lg border border-[#CDD4DA] bg-white">
      <div className="border-b border-[#CDD4DA] pt-10 px-6 pb-6 ">
        <h2 className="text-[20px] leading-[100%] font-bold font-archivo text-blue-dark">
          {t("processor.viewQuestion.creatorGathererNotes")}
        </h2>
      </div>
      <p className="text-[16px] leading-[100%] font-normal font-roboto text-[#6B7280] pb-[60px] pt-[30px] px-6">
        {question.notes || question.gathererNotes || question.creatorNotes || "No notes available"}
      </p>
    </div>
  );
};

export default CreatorGathererNotesCard;
