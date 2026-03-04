import React from 'react';

const FlaggedVariantBanner = ({ originalQuestion, flagType, onRejectFlagClick, t }) => {
  if (!originalQuestion?.isFlagged || originalQuestion?.flagStatus !== 'approved') return null;

  return (
    <div className="rounded-[12px] border-2 border-orange-500 bg-orange-50 pt-[20px] px-[30px] pb-[30px] w-full">
      <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[32px] text-orange-700">
        {t("creator.flaggedVariant.title") || "Flagged Variant"}
      </h2>
      <div className="mb-4">
        <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-2">
          {flagType === 'student'
            ? (t("creator.flaggedVariant.descriptionStudent") || "This variant has been flagged by a student with the following reason:")
            : flagType === 'explainer'
            ? (t("creator.flaggedVariant.descriptionExplainer") || "This variant has been flagged by an explainer with the following reason:")
            : (t("creator.flaggedVariant.description") || "This variant has been flagged with the following reason:")}
        </p>
      </div>
      <div
        className="font-roboto text-[16px] font-normal leading-[24px] text-oxford-blue whitespace-pre-wrap bg-white p-4 rounded-lg border border-orange-200 mb-4"
        dir="ltr"
      >
        {originalQuestion?.flagReason || "No reason provided"}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRejectFlagClick}
          className="flex h-[36px] items-center justify-center rounded-[8px] border border-orange-600 bg-white px-4 text-[14px] font-archivo font-semibold leading-[16px] text-orange-600 transition hover:bg-orange-50"
        >
          {t("creator.flaggedVariant.rejectFlag") || "Reject Flag"}
        </button>
        <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] flex items-center">
          {t("creator.flaggedVariant.updateHint") || "Update the variant below and click 'Update Variant' to fix the issue."}
        </p>
      </div>
    </div>
  );
};

export default FlaggedVariantBanner;
