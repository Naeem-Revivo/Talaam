import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const TestModeFooter = ({
  onExit,
}) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-10">
        <button
          onClick={onExit}
          className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E5E7EB] text-oxford-blue rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
        >
          {t('dashboard.questionSession.actions.exitSession')}
        </button>
      </div>
    </footer>
  );
};

export default TestModeFooter;