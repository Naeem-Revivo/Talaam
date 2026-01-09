import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { flag, setting } from '../../assets/svg/dashboard';
import { useLanguage } from '../../context/LanguageContext';

const QuestionSessionSummaryPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Get session data from navigation state or use defaults
  const sessionData = location.state?.sessionData;

  const summary = useMemo(
    () => ({
      questionsAnswered: sessionData?.questionsAnswered || 0,
      averagePace: sessionData?.averagePace || '0m 0s',
      accuracyPercent: sessionData?.accuracyPercent || 0,
      correctCount: sessionData?.correctCount || 0,
      incorrectCount: sessionData?.incorrectCount || 0,
      timeTaken: sessionData?.timeTaken || '0m 0s',
      testMode: sessionData?.mode === 'test',
    }),
    [sessionData]
  );

  const questions = useMemo(
    () => {
      if (sessionData?.questions) {
        return sessionData.questions;
      }
      // Fallback to generated questions if no data
      return Array.from({ length: summary.questionsAnswered }, (_, index) => ({
        id: index + 1,
        status: index < summary.correctCount ? 'correct' : 'incorrect',
      }));
    },
    [sessionData?.questions, summary.correctCount, summary.questionsAnswered]
  );

  const accuracyCircumference = 2 * Math.PI * 50;

  const handleGoToDashboard = () => {
    navigate('/dashboard/practice');
  };

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
      <header className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4 sticky top-0 z-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
            <div className="text-[20px] font-bold text-oxford-blue font-archivo leading-[28px] tracking-[0%]">
              {t('dashboard.sessionSummary.item').replace('{{current}}', '3').replace('{{total}}', '20')}
            </div>
            {/* <div className="hidden lg:block text-[14px] md:text-[16px] font-normal text-dark-gray font-roboto">
              {t('dashboard.sessionSummary.questionId')} icl-02
            </div> */}
            {/* <button className="hidden lg:block text-oxford-blue hover:opacity-70">
              <img src={flag} alt="Flag" />
            </button> */}
            <button className="lg:hidden text-oxford-blue hover:opacity-70">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2 w-full justify-between">
            <button className="px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[14px] font-normal font-roboto hover:opacity-70 flex items-center gap-2">
              <img src={flag} alt="Mark" />
            </button>
            {/* <button className="px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[14px] font-normal font-roboto hover:opacity-70">
              {t('dashboard.sessionSummary.formulaSheet')}
            </button> */}
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-normal text-oxford-blue font-roboto">
                {t('dashboard.sessionSummary.timeRemaining')} <span className="font-bold">12:45</span>
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 md:gap-4 w-full lg:w-auto justify-between lg:justify-end">
            {/* <button className="hidden lg:block px-2 md:px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[12px] md:text-[14px] font-normal font-roboto hover:opacity-70">
              <span className="hidden sm:inline">{t('dashboard.sessionSummary.formulaSheet')}</span>
              <span className="sm:hidden">{t('dashboard.sessionSummary.formulaSheet')}</span>
            </button> */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[12px] md:text-[14px] font-normal text-oxford-blue font-roboto">
                <span className="hidden sm:inline">{t('dashboard.sessionSummary.timeRemaining')} </span>12:45
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden lg:flex w-[110px] h-full bg-white border-r border-[#E5E7EB]">
          <div className="flex flex-col w-full h-full overflow-y-auto py-2">
            {questions.map((question, index) => {
              const questionNumber = index + 1;
              return (
                <div
                  key={question.id || index}
                  className={`h-[44px] flex items-center justify-center text-[16px] font-roboto border border-[#B9C9C5] ${
                    question.status === 'correct'
                      ? 'bg-[#C6D8D3] text-oxford-blue'
                      : 'bg-[#FDF0D5] text-[#B91C1C] border-[#F5C19B]'
                  }`}
                >
                  {questionNumber}
                </div>
              );
            })}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-1">
              <h1 className="font-archivo text-[28px] sm:text-[32px] lg:text-[36px] leading-[32px] sm:leading-[36px] lg:leading-[40px] font-bold text-oxford-blue flex-1">
                {t('dashboard.sessionSummary.hero.title')}
              </h1>
              <button
                onClick={handleGoToDashboard}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#E5E7EB] text-oxford-blue rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
              >
                {t('dashboard.sessionSummary.actions.goToDashboard')}
              </button>
            </div>
            <p className="font-roboto text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] text-dark-gray mb-6 sm:mb-8">
              {t('dashboard.sessionSummary.hero.subtitle')}
            </p>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <div className="bg-white rounded-2xl shadow-summary border border-[#E5E7EB] w-full md:w-[548px] md:h-[251px] p-4 sm:p-6 flex flex-col">
                <h2 className="font-archivo text-[16px] sm:text-[18px] font-semibold leading-[24px] sm:leading-[28px] text-oxford-blue mb-3 sm:mb-4">{t('dashboard.sessionSummary.accuracySnapshot.title')}</h2>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 flex-1">
                  <div className="flex flex-col gap-1 md:max-w-[160px]">
                    <div className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[25px] text-dark-gray">
                      {t('dashboard.sessionSummary.accuracySnapshot.description')}
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] mx-auto md:mx-0 flex-shrink-0">
                    <svg className="w-full h-full">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#E5E7EB"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#EF4444"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={`${(summary.accuracyPercent / 100) * accuracyCircumference}, ${accuracyCircumference}`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="absolute text-[20px] sm:text-[24px] font-bold text-oxford-blue font-archivo">
                      {summary.accuracyPercent}%
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 min-w-[150px] md:items-start">
                    <div className="flex flex-col">
                      <span className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-normal text-[#ED4122]">
                        {t('dashboard.sessionSummary.accuracySnapshot.correct')}
                      </span>
                      <span className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-normal text-oxford-blue">
                        {summary.correctCount} {t('dashboard.sessionSummary.accuracySnapshot.questions')}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-normal text-dark-gray">
                        {t('dashboard.sessionSummary.accuracySnapshot.incorrect')}
                      </span>
                      <span className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-normal text-oxford-blue">
                        {summary.incorrectCount} {t('dashboard.sessionSummary.accuracySnapshot.questions')}
                      </span>
                    </div>
                  </div>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 pt-2 sm:pt-1 gap-2 sm:gap-3 text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-roboto text-oxford-blue">
                  <span>{t('dashboard.sessionSummary.accuracySnapshot.questionsAnswered')} {summary.questionsAnswered}</span>
                  <span className="sm:text-right">{t('dashboard.sessionSummary.accuracySnapshot.averagePace')} {summary.averagePace}</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-summary border border-[#E5E7EB] w-full md:w-[548px] md:h-[251px] p-4 sm:p-6 flex flex-col">
                <span className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-dark-gray mb-1">
                  {summary.testMode ? t('dashboard.sessionSummary.sessionOverview.testMode') : t('dashboard.sessionSummary.sessionOverview.studyMode')}
                </span>
                <h3 className="font-archivo text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] font-semibold text-oxford-blue mb-1">
                  {t('dashboard.sessionSummary.sessionOverview.title')}
                </h3>
                <p className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[25px] text-dark-gray mb-2 sm:mb-3">
                  {t('dashboard.sessionSummary.sessionOverview.description')}
                </p>
                <div className="bg-[#EF4444] rounded-2xl w-full md:w-[499px] h-auto min-h-[90px] py-3 sm:py-4 px-3 sm:px-4 flex items-center gap-3 sm:gap-4 justify-center text-white">
                  <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-full bg-white text-[#EF4444] flex items-center justify-center text-[18px] sm:text-[20px] font-archivo font-bold flex-shrink-0">
                    {summary.questionsAnswered}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] sm:text-[16px] font-archivo font-bold">
                      {t('dashboard.sessionSummary.sessionOverview.questionsCompleted')}
                    </div>
                    <div className="text-[12px] sm:text-[13px] font-roboto text-white/80 break-words">
                      {summary.questionsAnswered} {t('dashboard.sessionSummary.sessionOverview.total')}, {summary.timeTaken} {t('dashboard.sessionSummary.sessionOverview.overall')}, {summary.averagePace} {t('dashboard.sessionSummary.sessionOverview.average')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6 mt-4 sm:mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-2xl shadow-summary border border-[#E5E7EB] p-4 sm:p-6">
                <h4 className="font-archivo text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] font-semibold text-oxford-blue mb-2">{t('dashboard.sessionSummary.metrics.accuracy.title')}</h4>
                <div className="font-archivo text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] font-bold text-oxford-blue mb-2">
                  {summary.accuracyPercent}%
                </div>
                <div className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[25px] text-dark-gray">
                  {t('dashboard.sessionSummary.metrics.accuracy.description')}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-summary border border-[#E5E7EB] p-4 sm:p-6">
                <h4 className="font-archivo text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] font-semibold text-oxford-blue mb-2">{t('dashboard.sessionSummary.metrics.questionOutcome.title')}</h4>
                <div className="font-archivo text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] font-bold text-oxford-blue mb-2">
                  {summary.correctCount} {t('dashboard.sessionSummary.accuracySnapshot.correct')} / {summary.incorrectCount} {t('dashboard.sessionSummary.accuracySnapshot.incorrect')}
                </div>
                <div className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[25px] text-dark-gray">
                  {summary.questionsAnswered} {t('dashboard.sessionSummary.metrics.questionOutcome.description')}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-summary border border-[#E5E7EB] p-4 sm:p-6">
                <h4 className="font-archivo text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] font-semibold text-oxford-blue mb-2">{t('dashboard.sessionSummary.metrics.timeTaken.title')}</h4>
                <div className="font-archivo text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] font-bold text-oxford-blue mb-2">
                  {summary.timeTaken}
                </div>
                <div className="font-roboto text-[14px] sm:text-[16px] leading-[20px] sm:leading-[25px] text-dark-gray">
                  {t('dashboard.sessionSummary.metrics.timeTaken.description').replace('{{pace}}', summary.averagePace)}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

    </div>
  );
};

export default QuestionSessionSummaryPage;


