import React from "react";

const AdminSentBackHeader = ({
  t,
  isFlagged,
  onRejectFlag,
  onCancel,
  onUpdate,
  submitting,
}) => {
  return (
    <header className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center mb-10">
      <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
        {t('admin.sentBackQuestions.view.title') || 'View Sent Back Question'}
      </h1>
      <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
        {isFlagged && (
          <button
            type="button"
            onClick={onRejectFlag}
            className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white px-3 md:px-5 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
          >
            {t('gatherer.addNewQuestion.rejectFlag.button')}
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="flex h-[36px] items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white px-3 md:px-5 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
        >
          {t('gatherer.addNewQuestion.cancel')}
        </button>
        <button
          type="button"
          onClick={onUpdate}
          disabled={submitting}
          className={`flex h-[36px] items-center justify-center rounded-[8px] bg-[#ED4122] px-4 md:px-6 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white transition hover:bg-[#d43a1f] ${
            submitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? t('gatherer.addNewQuestion.updating') : t('gatherer.addNewQuestion.update')}
        </button>
      </div>
    </header>
  );
};

export default AdminSentBackHeader;
