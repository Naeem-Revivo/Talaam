import React from 'react';

const CreatorHeader = ({ questionIdDisplay, loading, isEditMode, isFlagged, onAddVariant, t }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-10">
      <div>
        <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
          {t("admin.questionBank.pendingCreator.viewQuestion.title") || "Create Variants"}
        </h1>
        <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
          {loading ? "Loading question..." : `Question ID: ${questionIdDisplay}`}
        </p>
      </div>
      {(!isEditMode && !isFlagged) && (
        <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
          <button
            type="button"
            onClick={onAddVariant}
            className="flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white transition hover:bg-[#d43a1f]"
          >
            + Add New Variant
          </button>
        </div>
      )}
    </header>
  );
};

export default CreatorHeader;
