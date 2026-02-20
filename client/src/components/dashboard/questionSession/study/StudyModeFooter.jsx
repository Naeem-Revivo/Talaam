import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const StudyModeFooter = ({ currentIndex, totalQuestions, onNavigate, onExit }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4D4D4] px-4 md:px-[89px] py-3 md:py-5 z-30 shadow-footer">
      <div className="md:hidden flex items-center justify-between gap-2 mb-3">
        <button
          onClick={() => onNavigate(-1)}
          disabled={currentIndex === 0}
          aria-label={t('dashboard.questionSession.actions.previousQuestion')}
          className={`flex-1 h-12 rounded-[10px] flex items-center justify-center gap-2 text-[14px] font-bold font-roboto transition-colors ${
            currentIndex === 0 ? 'text-[#A3A3A3] cursor-not-allowed bg-[#F8FAFC]' : 'text-oxford-blue bg-[#F3F4F6] hover:bg-[#E5E7EB]'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{t('dashboard.questionSession.actions.previousQuestion')}</span>
        </button>
        <button
          onClick={() => onNavigate(1)}
          disabled={currentIndex === totalQuestions - 1}
          aria-label={t('dashboard.questionSession.actions.nextQuestion')}
          className={`flex-1 h-12 rounded-[10px] flex items-center justify-center gap-2 text-[14px] font-bold font-roboto transition-colors ${
            currentIndex === totalQuestions - 1 ? 'text-[#A3A3A3] cursor-not-allowed bg-[#F8FAFC]' : 'text-oxford-blue bg-[#F3F4F6] hover:bg-[#E5E7EB]'
          }`}
        >
          <span>{t('dashboard.questionSession.actions.nextQuestion')}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="hidden md:flex items-center justify-between">
        <button
          onClick={() => onNavigate(-1)}
          disabled={currentIndex === 0}
          aria-label={t('dashboard.questionSession.actions.previousQuestion')}
          className={`px-8 h-12 py-2 rounded-[14px] flex gap-2 items-center text-base font-bold tracking-[-0.31px] font-roboto transition-colors shadow-sm shadow-[#0000000D] ${
            currentIndex === 0
              ? 'text-[#A3A3A3] cursor-not-allowed bg-[#F8FAFC]'
              : 'text-oxford-blue bg-[#F3F4F6] hover:bg-[#E5E7EB]'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{t('dashboard.questionSession.actions.previousQuestion')}</span>
        </button>

        <button
          onClick={onExit}
          className="text-[16px] leading-[24px] font-bold text-[#A3A3A3] font-roboto hover:text-[#737373] transition-colors"
        >
          {t('dashboard.questionSession.actions.exitSession')}
        </button>

        <button
          onClick={() => onNavigate(1)}
          disabled={currentIndex === totalQuestions - 1}
          aria-label={t('dashboard.questionSession.actions.nextQuestion')}
          className={`px-8 h-12 py-2 rounded-[14px] flex gap-2 items-center text-base font-bold tracking-[-0.31px] font-roboto transition-colors shadow-sm shadow-[#0000000D] ${
            currentIndex === totalQuestions - 1
              ? 'text-[#A3A3A3] cursor-not-allowed bg-[#F8FAFC]'
              : 'bg-[#EF4444] text-white hover:opacity-90'
          }`}
        >
          <span>{t('dashboard.questionSession.actions.nextQuestion')}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="md:hidden flex justify-center mt-1">
        <button
          onClick={onExit}
          className="text-[14px] leading-[21px] font-bold text-[#A3A3A3] font-roboto hover:text-[#737373] transition-colors"
        >
          {t('dashboard.questionSession.actions.exitSession')}
        </button>
      </div>
    </div>
  );
};

export default StudyModeFooter;


