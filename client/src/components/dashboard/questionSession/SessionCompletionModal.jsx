import React from 'react';

const SessionCompletionModal = ({ mode, onViewSummary, onReviewAnswers, onExit }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#E5E7EB] bg-white p-8 text-center shadow-[0px_10px_40px_rgba(3,39,70,0.08)]">
      <h2 className="font-archivo text-[24px] font-bold text-[#032746]">Session Complete</h2>
      <p className="max-w-lg text-[16px] text-[#4B5563] font-roboto">
        You have reached the end of this {mode === 'test' ? 'test' : 'study'} session. Review your performance or head back to the practice dashboard to start another set.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onViewSummary}
          className="rounded-lg border border-[#E5E7EB] px-6 py-3 text-[16px] font-roboto font-medium text-[#032746] transition hover:bg-[#F3F4F6]"
        >
          View Summary
        </button>
        <button
          onClick={onReviewAnswers}
          className="rounded-lg bg-[#EF4444] px-6 py-3 text-[16px] font-roboto font-medium text-white shadow-sm transition hover:opacity-90"
        >
          Review Answers
        </button>
        <button
          onClick={onExit}
          className="rounded-lg border border-[#E5E7EB] px-6 py-3 text-[16px] font-roboto font-medium text-[#032746] transition hover:bg-[#F3F4F6]"
        >
          Exit Session
        </button>
      </div>
    </div>
  </div>
);

export default SessionCompletionModal;


