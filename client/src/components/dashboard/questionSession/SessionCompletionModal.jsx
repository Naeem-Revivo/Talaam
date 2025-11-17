import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

const SessionCompletionModal = ({ mode, onViewSummary, onReviewAnswers, onExit }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-[#E5E7EB] bg-white p-8 text-center shadow-filter-lg">
        <h2 className="font-archivo text-[24px] font-bold text-oxford-blue">{t('dashboard.sessionCompletion.title')}</h2>
        <p className="max-w-lg text-[16px] text-[#4B5563] font-roboto">
          {t('dashboard.sessionCompletion.description').replace('{{mode}}', mode === 'test' ? t('dashboard.sessionCompletion.test') : t('dashboard.sessionCompletion.study'))}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onViewSummary}
            className="rounded-lg border border-[#E5E7EB] px-6 py-3 text-[16px] font-roboto font-medium text-oxford-blue transition hover:bg-[#F3F4F6]"
          >
            {t('dashboard.sessionCompletion.viewSummary')}
          </button>
          <button
            onClick={onReviewAnswers}
            className="rounded-lg bg-[#EF4444] px-6 py-3 text-[16px] font-roboto font-medium text-white shadow-sm transition hover:opacity-90"
          >
            {t('dashboard.sessionCompletion.reviewAnswers')}
          </button>
          <button
            onClick={onExit}
            className="rounded-lg border border-[#E5E7EB] px-6 py-3 text-[16px] font-roboto font-medium text-oxford-blue transition hover:bg-[#F3F4F6]"
          >
            {t('dashboard.sessionCompletion.exitSession')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionCompletionModal;


