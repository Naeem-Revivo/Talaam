import React from 'react';
import { flag, setting } from './icons';
import { useLanguage } from '../../../context/LanguageContext';

const TestModeLayout = ({
  questions,
  currentIndex,
  currentState,
  visitedIndices,
  showQuestionNav,
  onToggleQuestionNav,
  onCloseQuestionNav,
  onGoToIndex,
  onNavigate,
  onOptionChange,
  onSubmit,
  onExit,
}) => {
  const { t } = useLanguage();
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const hasSelectedOption = Boolean(currentState?.selectedOption);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
            <div className="text-[20px] font-bold text-oxford-blue font-archivo leading-[28px] tracking-[0%]">
              {t('dashboard.questionSession.item').replace('{{current}}', (currentIndex + 1).toString()).replace('{{total}}', totalQuestions.toString())}
            </div>
            <div className="hidden lg:block text-[14px] md:text-[16px] font-normal text-dark-gray font-roboto">
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
            <button className="hidden lg:block px-2 md:px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[12px] md:text-[14px] font-normal font-roboto hover:opacity-70">
              <span className="hidden sm:inline">{t('dashboard.questionSession.formulaSheet')}</span>
              <span className="sm:hidden">{t('dashboard.questionSession.formulaSheet')}</span>
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[12px] md:text-[14px] font-normal text-oxford-blue font-roboto">
                <span className="hidden sm:inline">{t('dashboard.questionSession.timeRemaining')} </span>
                {currentQuestion.timeRemaining || '--:--'}
              </span>
              <button className="text-oxford-blue hover:opacity-70">
                <img src={setting} alt="Settings" className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showQuestionNav && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onCloseQuestionNav} />
          <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-white overflow-y-auto z-50 lg:hidden shadow-lg">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-oxford-blue font-archivo">{t('dashboard.questionSession.questions')}</h3>
              <button onClick={onCloseQuestionNav} className="text-oxford-blue hover:opacity-70">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-3 gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onGoToIndex(index)}
                    className={`py-2 px-3 text-[14px] font-medium font-roboto transition-colors text-center border border-[#B9C9C5] rounded ${
                      index === currentIndex
                        ? 'bg-[#EF4444] text-white border-[#EF4444]'
                        : visitedIndices.has(index)
                        ? 'bg-[#C6D8D3] text-oxford-blue hover:opacity-80'
                        : 'bg-white text-oxford-blue hover:opacity-80'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-120px)] pb-[180px] md:pb-0">
        <div className="hidden lg:flex w-[110px] h-full bg-white overflow-y-auto flex-col border-r border-[#E5E7EB]">
          <div className="flex-1 py-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => onGoToIndex(index)}
                className={`w-full py-2 text-[14px] font-medium font-roboto transition-colors text-center border border-[#B9C9C5] ${
                  index === currentIndex
                    ? 'bg-[#EF4444] text-white border-[#EF4444]'
                    : visitedIndices.has(index)
                    ? 'bg-[#C6D8D3] text-oxford-blue hover:opacity-80'
                    : 'bg-white text-oxford-blue hover:opacity-80'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto lg:ml-5">
            <h2 className="text-[24px] md:text-[32px] lg:text-[36px] font-bold text-oxford-blue mb-6 md:mb-10 font-archivo leading-tight tracking-[0%]">
              {t('dashboard.questionSession.title')}
            </h2>

            <div className="mb-4 md:mb-6">
              <p className="text-[16px] md:text-[18px] font-normal text-oxford-blue font-roboto leading-[24px] tracking-[0%]">
                {currentQuestion.prompt}
              </p>
            </div>

            <div className="mb-4 md:mb-6">
              <div className="space-y-3 mb-6 md:mb-10 w-full min-h-[300px] md:min-h-[400px] flex flex-col items-start justify-center p-4 md:pl-8 bg-white shadow-content rounded-lg">
                {currentQuestion.options.map((option) => {
                  const isSelected = option.id === currentState?.selectedOption;

                  return (
                    <div
                      key={option.id}
                      className={`w-full min-h-[50px] rounded-lg border-2 flex items-center px-3 md:px-4 py-2 ${
                        isSelected ? 'border-[#ED4122] bg-white' : 'border-[#E5E7EB] bg-white'
                      }`}
                    >
                      <label className="flex items-center gap-2 md:gap-3 cursor-pointer w-full">
                        <input
                          type="radio"
                          name={`answer-${currentQuestion.id}`}
                          value={option.id}
                          checked={isSelected}
                          onChange={() => onOptionChange(option.id)}
                          className="w-4 h-4 md:w-5 md:h-5 text-[#EF4444] border-[#EF4444] focus:ring-[#EF4444] flex-shrink-0"
                        />
                        <span className="text-[14px] md:text-[16px] font-normal text-oxford-blue font-roboto flex-1">
                          <span className="font-medium">{option.id}.</span> {option.text}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center md:justify-start mb-10">
              <button
                onClick={onSubmit}
                disabled={!hasSelectedOption}
                className={`w-full md:w-[316px] h-[50px] md:h-[60px] rounded-[8px] text-[16px] md:text-[20px] font-bold font-archivo leading-[28px] tracking-[0%] transition ${
                  hasSelectedOption ? 'bg-[#ED4122] text-white hover:opacity-90' : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                }`}
              >
                {t('dashboard.questionSession.submitAnswer')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed md:relative bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4 z-30 shadow-[0_-2px_10px_0px_rgba(0,0,0,0.05)] md:shadow-none">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-10">
          <button
            onClick={onExit}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E5E7EB] text-oxford-blue rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
          >
            {t('dashboard.questionSession.actions.exitSession')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestModeLayout;


