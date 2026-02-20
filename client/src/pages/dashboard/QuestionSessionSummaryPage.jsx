import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setting } from '../../assets/svg/dashboard';
import { useLanguage } from '../../context/LanguageContext';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12H10C9.73478 12 9.48043 12.1054 9.29289 12.2929C9.10536 12.4804 9 12.7348 9 13V21" stroke="#525252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 9.99948C2.99993 9.70855 3.06333 9.4211 3.18579 9.1572C3.30824 8.89329 3.4868 8.65928 3.709 8.47148L10.709 2.47248C11.07 2.16739 11.5274 2 12 2C12.4726 2 12.93 2.16739 13.291 2.47248L20.291 8.47148C20.5132 8.65928 20.6918 8.89329 20.8142 9.1572C20.9367 9.4211 21.0001 9.70855 21 9.99948V18.9995C21 19.5299 20.7893 20.0386 20.4142 20.4137C20.0391 20.7888 19.5304 20.9995 19 20.9995H5C4.46957 20.9995 3.96086 20.7888 3.58579 20.4137C3.21071 20.0386 3 19.5299 3 18.9995V9.99948Z" stroke="#525252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.9999 1.66602H4.99992C4.07944 1.66602 3.33325 2.41221 3.33325 3.33268V16.666C3.33325 17.5865 4.07944 18.3327 4.99992 18.3327H14.9999C15.9204 18.3327 16.6666 17.5865 16.6666 16.666V3.33268C16.6666 2.41221 15.9204 1.66602 14.9999 1.66602Z" stroke="#525252" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66675 5H13.3334" stroke="#525252" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.9531 12V15.3333" stroke="#525252" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.3333 8.33398H13.3416" stroke="#525252" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 8.33398H10.0083" stroke="#525252" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66675 8.33398H6.67508" stroke="#525252" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11.666H10.0083" stroke="#525252" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66675 11.666H6.67508" stroke="#525252" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 15H10.0083" stroke="#525252" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66675 15H6.67508" stroke="#525252" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QuestionSessionSummaryPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const getSecondsFromPace = (pace = '0m 0s') => {
    const match = `${pace}`.match(/(\d+)m\s*(\d+)s/i);
    if (!match) return 0;
    return Number(match[1]) * 60 + Number(match[2]);
  };

  const formatTimeLabel = (seconds) => `${Math.max(1, seconds)}s`;
  const dateLabel = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const sessionData = location.state?.sessionData;
  const incorrectQuestionsFromState = location.state?.incorrectQuestions || [];
  const sessionId = location.state?.sessionId || sessionData?.sessionId;

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

  const questions = useMemo(() => {
    if (sessionData?.questions) {
      return sessionData.questions;
    }
    return Array.from({ length: summary.questionsAnswered }, (_, index) => ({
      id: index + 1,
      status: index < summary.correctCount ? 'correct' : 'incorrect',
    }));
  }, [sessionData?.questions, summary.correctCount, summary.questionsAnswered]);

  const questionTiles = useMemo(() => {
    const baseSeconds = getSecondsFromPace(summary.averagePace) || 60;
    return questions.map((question, index) => {
      const variance = ((index % 4) - 1) * 8;
      return {
        ...question,
        timeLabel: formatTimeLabel(baseSeconds + variance),
      };
    });
  }, [questions, summary.averagePace]);

  const reviewPercent = Math.max(0, 100 - summary.accuracyPercent);
  const avgPerQuestionLabel =
    summary.questionsAnswered > 0 ? `${summary.averagePace} per question` : '0m 0s per question';

  const handleGoToDashboard = () => {
    navigate('/dashboard/practice');
  };

  const handleReviewIncorrect = () => {
    if (incorrectQuestionsFromState.length > 0) {
      navigate('/dashboard/review-incorrect', {
        state: {
          incorrectQuestions: incorrectQuestionsFromState,
          fromCurrentSession: true,
        },
      });
      return;
    }
    if (sessionId) {
      navigate(`/dashboard/review-incorrect?sessionId=${sessionId}`);
      return;
    }
    navigate('/dashboard/review');
  };

  const handleReviewAll = () => {
    if (sessionId) {
      navigate(`/dashboard/review-all?sessionId=${sessionId}`);
      return;
    }
    navigate('/dashboard/review');
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7] flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-[#D4D4D4] px-4 md:px-[89px] py-3 md:py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center min-w-0">
            <button
              onClick={handleGoToDashboard}
              className="text-oxford-blue hover:opacity-70 transition-opacity pr-6 border-r border-[#D4D4D4]"
              aria-label="Home"
            >
              <HomeIcon />
            </button>
            <div className="pl-6 min-w-0">
              <h1 className="text-[20px] font-bold text-[#171717] font-archivo leading-[28px] tracking-[-0.45%]">
                {t('dashboard.sessionSummary.hero.title')}
              </h1>
              <p className="text-[14px] leading-[20px] font-normal text-[#525252] font-roboto tracking-[-0.15%]">
                Question 3 of 3
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-5 py-2 bg-white border border-[#D4D4D4] text-[#525252] rounded-[14px] text-[14px] font-medium font-roboto hover:bg-[#F3F4F6] transition-colors">
              <DocumentIcon />
              {t('dashboard.sessionSummary.formulaSheet')}
            </button>
            <button className="text-oxford-blue hover:opacity-70 transition-opacity" aria-label="Settings">
              <img src={setting} alt="settings" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-[89px] py-6 md:py-7 pb-36 md:pb-40">
        <div className="space-y-5">
          <section>
            <h2 className="font-archivo text-[23px] leading-[44px] font-bold text-oxford-blue">{t('dashboard.sessionSummary.hero.title')}</h2>
            <p className="font-roboto text-base font-normal text-[#737373] mt-1">{t('dashboard.sessionSummary.hero.subtitle')}</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#0A3A5A] to-[#0B577F] rounded-[16px] p-8 text-white shadow-sm">
              <p className="text-[12px] uppercase tracking-wide text-white/70 font-roboto">Your score</p>
              <div className="font-archivo font-bold text-[52px] leading-[58px] mt-2">{summary.accuracyPercent}%</div>
              <p className="text-[14px] text-white/90 font-roboto mt-2">Accuracy Rate</p>
            </div>

            <div className="bg-white rounded-[16px] p-5 border border-[#E5E7EB] shadow-sm min-h-[178px]">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="bg-[#DCFCE7] text-[#16A34A] text-[11px] px-2 py-0.5 rounded-full">{summary.accuracyPercent}%</span>
              </div>
              <p className="text-[#6B7280] text-[14px] mt-3">Correct Answers</p>
              <p className="font-archivo text-[40px] leading-[44px] font-bold text-oxford-blue mt-1">{summary.correctCount}</p>
              <p className="text-[#9CA3AF] text-[13px]">{`out of ${summary.questionsAnswered} questions`}</p>
            </div>

            <div className="bg-white rounded-[16px] p-5 border border-[#FECACA] shadow-sm min-h-[178px]">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 rounded-full bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="bg-[#FEE2E2] text-[#EF4444] text-[11px] px-2 py-0.5 rounded-full">{reviewPercent}%</span>
              </div>
              <p className="text-[#6B7280] text-[14px] mt-3">Need Review</p>
              <p className="font-archivo text-[40px] leading-[44px] font-bold text-oxford-blue mt-1">{summary.incorrectCount}</p>
              <p className="text-[#9CA3AF] text-[13px]">questions to improve</p>
            </div>

            <div className="bg-white rounded-[16px] p-5 border border-[#E5E7EB] shadow-sm min-h-[178px]">
              <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[#6B7280] text-[14px] mt-3">Total Time</p>
              <p className="font-archivo text-[40px] leading-[44px] font-bold text-oxford-blue mt-1">{summary.timeTaken}</p>
              <p className="text-[#9CA3AF] text-[13px]">{avgPerQuestionLabel}</p>
            </div>
          </section>

          <section className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm p-6">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-archivo text-[33px] leading-[38px] font-semibold text-oxford-blue">Session Details</h3>
                <p className="text-[#6B7280] text-[14px] mt-1">Complete overview of your practice session</p>
              </div>
              <div className="text-right">
                <p className="text-[#9CA3AF] text-[12px]">Date</p>
                <p className="font-archivo text-[18px] text-oxford-blue">{dateLabel}</p>
                <span className="inline-flex mt-1 px-3 py-1 rounded-full text-[12px] bg-[#FEF3C7] text-[#B45309]">
                  {summary.testMode ? 'Test Mode' : 'Study Mode'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] text-[#374151]">Correct Responses</span>
                  <span className="text-[14px] text-[#16A34A] font-medium">{`${summary.correctCount}/${summary.questionsAnswered}`}</span>
                </div>
                <div className="h-[8px] rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#22C55E]"
                    style={{ width: `${summary.questionsAnswered ? (summary.correctCount / summary.questionsAnswered) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] text-[#374151]">Incorrect Responses</span>
                  <span className="text-[14px] text-[#EF4444] font-medium">{`${summary.incorrectCount}/${summary.questionsAnswered}`}</span>
                </div>
                <div className="h-[8px] rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#EF4444]"
                    style={{ width: `${summary.questionsAnswered ? (summary.incorrectCount / summary.questionsAnswered) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-archivo text-[33px] leading-[38px] font-semibold text-oxford-blue">Question Map</h3>
                <p className="text-[#6B7280] text-[14px] mt-1">Click any question to review your answer</p>
              </div>
              <div className="flex items-center gap-4 text-[13px] text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                  Correct
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  Incorrect
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {questionTiles.map((question, index) => (
                <div
                  key={question.id || index}
                  className={`w-[74px] h-[74px] rounded-[10px] flex flex-col items-center justify-center text-white shadow-sm ${
                    question.status === 'correct' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                  }`}
                >
                  <span className="font-semibold text-[14px] leading-[15px]">{index + 1}</span>
                  <span className="text-[10px] opacity-90 leading-[12px]">{question.timeLabel}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 md:px-[89px] py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#D1D5DB] text-[#374151] text-sm hover:bg-[#F9FAFB]"
          >
            {t('dashboard.sessionSummary.actions.goToDashboard')}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleReviewIncorrect}
              className="flex-1 sm:flex-none min-w-[180px] px-5 py-2.5 rounded-lg bg-[#0E3B5A] text-white text-sm hover:opacity-90"
            >
              {t('dashboard.review.table.actions.reviewIncorrect') || 'Review Incorrect'}
            </button>
            <button
              onClick={handleReviewAll}
              className="flex-1 sm:flex-none min-w-[160px] px-5 py-2.5 rounded-lg border border-[#EF4444] text-[#EF4444] text-sm hover:bg-[#FEF2F2]"
            >
              {t('dashboard.review.table.actions.reviewAll') || 'Review All'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuestionSessionSummaryPage;


