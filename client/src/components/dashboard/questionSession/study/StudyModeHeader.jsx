import React from 'react';
import { flag, setting, listcheck } from '../icons';
import { useLanguage } from '../../../../context/LanguageContext';

const StudyModeHeader = ({
  currentIndex,
  totalQuestions,
  currentQuestion,
  onToggleQuestionNav,
  onNavigate,
}) => {
  const { t } = useLanguage();
  return (
    <header className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
          <div className="text-[20px] font-bold text-oxford-blue font-archivo leading-[28px] tracking-[0%]">
            {t('dashboard.questionSession.item').replace('{{current}}', (currentIndex + 1).toString()).replace('{{total}}', totalQuestions.toString())}
          </div>
          <div className="hidden lg:block text-[14px] md:text-[16px] leading-[100%] font-normal text-oxford-blue font-roboto">
            {t('dashboard.questionSession.questionId')} {currentQuestion.id}
          </div>
        <button className="hidden lg:block text-oxford-blue hover:opacity-70">
          <img src={flag} alt="Flag" />
        </button>
        <button onClick={onToggleQuestionNav} className="lg:hidden text-oxford-blue hover:opacity-70">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="lg:hidden flex items-center gap-2 w-full justify-between">
        <button className="px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[14px] font-normal font-roboto hover:opacity-70 flex items-center gap-2">
          <img src={flag} alt="Mark" />
        </button>
        <button className="px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[14px] font-normal font-roboto hover:opacity-70">
          {t('dashboard.questionSession.formulaSheet')}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-normal text-oxford-blue font-roboto">
            {t('dashboard.questionSession.timeRemaining')} <span className="font-bold">{currentQuestion.timeRemaining || '--:--'}</span>
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 flex-wrap flex-1 justify-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(-1)}
            disabled={currentIndex === 0}
            className={`px-3 py-1 rounded text-[14px] font-normal font-roboto transition-colors ${
              currentIndex === 0 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-oxford-blue hover:bg-[#F3F4F6]'
            }`}
          >
            {t('dashboard.questionSession.actions.previous')}
          </button>
          <button
            onClick={() => onNavigate(1)}
            disabled={currentIndex === totalQuestions - 1}
            className={`px-3 py-1 rounded text-[14px] font-normal font-roboto transition-colors ${
              currentIndex === totalQuestions - 1 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-oxford-blue hover:bg-[#F3F4F6]'
            }`}
          >
            {t('dashboard.questionSession.actions.next')}
          </button>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-2 md:gap-4 w-full lg:w-auto justify-between lg:justify-end">
        <button className="hidden lg:block px-2 md:px-4 py-3 border-[0.5px] text-oxford-blue rounded text-[10px] md:text-[100%] font-normal font-roboto hover:opacity-70">
          {/* <img src={listcheck} alt="Mark" className='w-5 h-5'/> */}
          <span className="hidden sm:inline">{t('dashboard.questionSession.formulaSheet')}</span>
          <span className="sm:hidden">{t('dashboard.questionSession.formulaSheet')}</span>
        </button>
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-[12px] md:text-[14px] leading-[24px ]font-normal text-black font-roboto border py-2 px-4 border-[#E5E7EB] rounded-lg flex flex-col">
            <span className="hidden sm:inline text-[12px] leading-[20px] font-normal text-[#4B5563]">{t('dashboard.questionSession.timeRemaining')} </span>
            {currentQuestion.timeRemaining || '--:--'}
          </span>
          <button className="text-oxford-blue hover:opacity-70">
            <img src={setting} alt="Settings" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </header>
  );
};

export default StudyModeHeader;


