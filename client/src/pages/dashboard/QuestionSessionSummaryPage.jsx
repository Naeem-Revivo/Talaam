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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
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
        <div className="space-y-6">
          <section>
            <h2 className="font-archivo text-[32px] leading-[45px] font-bold text-oxford-blue">{t('dashboard.sessionSummary.hero.title')}</h2>
            <p className="font-roboto text-base font-normal text-[#737373]">{t('dashboard.sessionSummary.hero.subtitle')}</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#0A3A5A] to-[#0B577F] rounded-[24px] p-8 text-white shadow-sm">
              <p className="text-[12px] leading-4 uppercase tracking-[0.6] text-white/70 font-roboto">Your score</p>
              <div className="font-archivo font-bold text-[62px] leading-[87px]">{summary.accuracyPercent}%</div>
              <p className="text-sm font-medium text-white font-roboto">Accuracy Rate</p>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-[#DCFCE7] shadow-sm min-h-[178px]">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-[16px] bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.3899 7.4099C23.6523 7.67244 23.7998 8.02847 23.7998 8.3997C23.7998 8.77093 23.6523 9.12696 23.3899 9.3895L12.1899 20.5895C11.9273 20.852 11.5713 20.9994 11.2001 20.9994C10.8289 20.9994 10.4728 20.852 10.2103 20.5895L4.61028 14.9895C4.35526 14.7255 4.21415 14.3718 4.21734 14.0047C4.22053 13.6377 4.36776 13.2865 4.62734 13.027C4.88691 12.7674 5.23804 12.6201 5.60512 12.617C5.9722 12.6138 6.32584 12.7549 6.58988 13.0099L11.2001 17.6201L21.4103 7.4099C21.6728 7.14744 22.0289 7 22.4001 7C22.7713 7 23.1273 7.14744 23.3899 7.4099Z" fill="#00A63E" />
                  </svg>
                </div>
                <span className="bg-[#F0FDF4] text-[#008236] text-xs font-semibold px-3 py-1 rounded-full">{summary.accuracyPercent}%</span>
              </div>
              <p className="text-[#6A7282] font-normal font-roboto text-sm mt-2">Correct Answers</p>
              <p className="font-archivo text-[40px] leading-[56px] font-bold text-oxford-blue mt-2">{summary.correctCount}</p>
              <p className="text-[#99A1AF] text-sm font-medium font-roboto">{`out of ${summary.questionsAnswered} questions`}</p>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-[#FEE2E2] shadow-sm min-h-[178px]">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-[16px] bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.01 6.00943C6.27254 5.74698 6.62857 5.59953 6.9998 5.59953C7.37103 5.59953 7.72706 5.74698 7.9896 6.00943L13.9998 12.0196L20.01 6.00943C20.1391 5.87572 20.2936 5.76907 20.4644 5.69569C20.6352 5.62232 20.8189 5.5837 21.0048 5.58208C21.1907 5.58047 21.3751 5.61589 21.5471 5.68628C21.7192 5.75668 21.8755 5.86063 22.007 5.99208C22.1384 6.12353 22.2424 6.27984 22.3127 6.4519C22.3831 6.62395 22.4186 6.80831 22.417 6.9942C22.4153 7.18009 22.3767 7.3638 22.3033 7.5346C22.23 7.70541 22.1233 7.85989 21.9896 7.98903L15.9794 13.9992L21.9896 20.0094C22.2446 20.2735 22.3857 20.6271 22.3825 20.9942C22.3794 21.3613 22.2321 21.7124 21.9725 21.972C21.713 22.2316 21.3618 22.3788 20.9948 22.382C20.6277 22.3852 20.274 22.2441 20.01 21.989L13.9998 15.9788L7.9896 21.989C7.72556 22.2441 7.37191 22.3852 7.00484 22.382C6.63776 22.3788 6.28662 22.2316 6.02705 21.972C5.76748 21.7124 5.62024 21.3613 5.61705 20.9942C5.61386 20.6271 5.75498 20.2735 6.01 20.0094L12.0202 13.9992L6.01 7.98903C5.74754 7.7265 5.6001 7.37046 5.6001 6.99923C5.6001 6.628 5.74754 6.27197 6.01 6.00943Z" fill="#ED4122" />
                  </svg>

                </div>
                <span className="bg-[#FEF2F2] text-[#ED4122] text-xs font-semibold px-3 py-1 rounded-full">{reviewPercent}%</span>
              </div>
              <p className="text-[#6A7282] font-normal font-roboto text-sm mt-2">Need Review</p>
              <p className="font-archivo text-[40px] leading-[56px] font-bold text-oxford-blue mt-2">{summary.incorrectCount}</p>
              <p className="text-[#99A1AF] text-sm font-medium font-roboto mt-2">questions to improve</p>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-[#E5E7EB] shadow-sm min-h-[178px]">
              <div className="w-12 h-12 rounded-[16px] bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 24.5C19.799 24.5 24.5 19.799 24.5 14C24.5 8.20101 19.799 3.5 14 3.5C8.20101 3.5 3.5 8.20101 3.5 14C3.5 19.799 8.20101 24.5 14 24.5Z" stroke="#6CA6C1" stroke-width="2.33333" />
                  <path d="M14 7V14L18.6667 16.3333" stroke="#6CA6C1" stroke-width="2.33333" stroke-linecap="round" />
                </svg>

              </div>
              <p className="text-[#6A7282] font-normal font-roboto text-sm mt-2">Total Time</p>
              <p className="font-archivo text-[40px] leading-[56px] font-bold text-oxford-blue mt-2">{summary.timeTaken}</p>
              <p className="text-[#99A1AF] text-sm font-medium font-roboto mt-2">{avgPerQuestionLabel}</p>
            </div>
          </section>

          <section className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm p-8">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-archivo text-[24px] leading-[32px] font-bold text-oxford-blue">Session Details</h3>
                <p className="text-[#6A7282] text-sm font-normal font-roboto mt-2">Complete overview of your practice session</p>
              </div>
              <div className="text-right flex gap-2">
                <div className="flex flex-col gap-1 border-r border-[#E5E7EB] pr-4">
                  <p className="text-[#9CA3AF] text-xs font-normal font-roboto">Date</p>
                  <p className="font-archivo text-[18px] leading-[28px] font-bold text-oxford-blue">{dateLabel}</p>
                </div>
                <span className="h-[36px] flex items-center justify-center mt-1 px-3 py-1 rounded-full text-sm font-semibold font-roboto bg-[#FDF0D5] text-[#ED4122]">
                  {summary.testMode ? 'Test Mode' : 'Study Mode'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium font-roboto text-[#364153]">Correct Responses</span>
                  <span className="text-sm text-[#00A63E] font-bold font-archivo">{`${summary.correctCount}/${summary.questionsAnswered}`}</span>
                </div>
                <div className="h-[12px] rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#22C55E]"
                    style={{ width: `${summary.questionsAnswered ? (summary.correctCount / summary.questionsAnswered) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium font-roboto text-[#364153]">Incorrect Responses</span>
                  <span className="text-sm text-[#ED4122] font-bold font-archivo">{`${summary.incorrectCount}/${summary.questionsAnswered}`}</span>
                </div>
                <div className="h-[12px] rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#EF4444]"
                    style={{ width: `${summary.questionsAnswered ? (summary.incorrectCount / summary.questionsAnswered) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm p-8">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h3 className="font-archivo text-[24px] leading-[32px] font-bold text-oxford-blue">Question Map</h3>
                <p className="text-[#6A7282] text-sm font-normal font-roboto mt-2">Click any question to review your answer</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-normal text-[#4A5565] font-roboto">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#22C55E]" />
                  Correct
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#EF4444]" />
                  Incorrect
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {questionTiles.map((question, index) => (
                <div
                  key={question.id || index}
                  className={`w-[74px] h-[74px] rounded-[10px] flex flex-col items-center justify-center text-white shadow-sm ${question.status === 'correct' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                    }`}
                >
                  <span className="font-bold text-[18px] leading-[28px] font-archivo text-white">{index + 1}</span>
                  <span className="text-[10px] leading-[16px] font-bold font-roboto text-white">{question.timeLabel}</span>
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] border border-[#D1D5DB] text-[#374151] text-base font-medium font-roboto hover:bg-[#F9FAFB]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="#032746" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            {t('dashboard.sessionSummary.actions.goToDashboard')}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleReviewIncorrect}
              className="flex-1 sm:flex-none min-w-[180px] px-5 py-2.5 rounded-[14px] bg-gradient-to-r from-[#032746] to-[#173B50] text-white text-sm font-medium font-roboto hover:opacity-90"
            >
              {t('dashboard.review.table.actions.reviewIncorrect') || 'Review Incorrect'}
            </button>
            <button
              onClick={handleReviewAll}
              className="flex-1 sm:flex-none min-w-[160px] px-5 py-2.5 rounded-[14px] border border-[#EF4444] text-[#EF4444] text-sm font-medium font-roboto hover:bg-[#FEF2F2]"
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


