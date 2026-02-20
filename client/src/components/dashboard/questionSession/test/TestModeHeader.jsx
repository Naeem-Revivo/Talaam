import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { setting } from '../../../../assets/svg/dashboard';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12H10C9.73478 12 9.48043 12.1054 9.29289 12.2929C9.10536 12.4804 9 12.7348 9 13V21" stroke="#525252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 9.99948C2.99993 9.70855 3.06333 9.4211 3.18579 9.1572C3.30824 8.89329 3.4868 8.65928 3.709 8.47148L10.709 2.47248C11.07 2.16739 11.5274 2 12 2C12.4726 2 12.93 2.16739 13.291 2.47248L20.291 8.47148C20.5132 8.65928 20.6918 8.89329 20.8142 9.1572C20.9367 9.4211 21.0001 9.70855 21 9.99948V18.9995C21 19.5299 20.7893 20.0386 20.4142 20.4137C20.0391 20.7888 19.5304 20.9995 19 20.9995H5C4.46957 20.9995 3.96086 20.7888 3.58579 20.4137C3.21071 20.0386 3 19.5299 3 18.9995V9.99948Z" stroke="#525252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FlagIcon = ({ isMarked = false }) => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.44434 0.5L6.86719 1.29395L5.59863 3.03613L6.86719 4.7793L7.44434 5.57422H2.05566V7.65137C2.05566 8.07935 1.70533 8.42969 1.27734 8.42969C0.849549 8.42946 0.5 8.07921 0.5 7.65137V2.11133C0.5 1.6639 0.611812 1.23584 0.923828 0.923828C1.23584 0.611812 1.6639 0.5 2.11133 0.5H7.44434Z"
      stroke={isMarked ? '#ED4122' : 'currentColor'}
      fill={isMarked ? '#ED4122' : 'none'}
    />
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

const ClockIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TestModeHeader = ({
  currentIndex,
  totalQuestions,
  onToggleQuestionNav,
  sessionStartTime,
  timeRemaining,
  onToggleMark,
  isMarked = false,
  onExit,
}) => {
  const { t } = useLanguage();
  const [timeDisplay, setTimeDisplay] = useState('00:00:00');

  // Format time as HH:MM:SS
  const formatTime = (milliseconds) => {
    if (milliseconds === null || milliseconds === undefined) return '00:00:00';
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Update time display
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining !== undefined) {
      // Show countdown timer (time remaining)
      setTimeDisplay(formatTime(timeRemaining));
    } else if (sessionStartTime) {
      // Fallback to elapsed time if timer not available
      const updateTime = () => {
        const elapsed = Date.now() - sessionStartTime;
        setTimeDisplay(formatTime(elapsed));
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [timeRemaining, sessionStartTime]);


  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#D4D4D4] px-4 md:px-[89px] py-3 md:py-2.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center min-w-0">
          <button
            onClick={onExit}
            className="text-oxford-blue hover:opacity-70 transition-opacity pr-6 border-r border-[#D4D4D4]"
            aria-label="Home"
          >
            <HomeIcon />
          </button>
          <div className="min-w-0 pl-6">
            <div className="text-[20px] font-bold text-[#171717] font-archivo leading-[28px] tracking-[-0.45%]">
              {t('dashboard.questionSession.testMode') || 'Test Mode'}
            </div>
            <div className="text-[14px] leading-[20px] font-normal text-[#525252] font-roboto tracking-[-0.15%]">
              {t('dashboard.questionSession.questionProgress')
                .replace('{{current}}', (currentIndex + 1).toString())
                .replace('{{total}}', totalQuestions.toString())}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => onToggleMark && onToggleMark(currentIndex)}
            className={`flex items-center gap-2 px-5 py-2 bg-white border border-[#D4D4D4] text-[#525252] rounded-[14px] text-[14px] font-medium font-roboto hover:bg-[#F3F4F6] transition-colors ${
              isMarked ? 'border-[#ED4122] bg-[#FEF2F2] text-[#ED4122]' : ''
            }`}
          >
            <FlagIcon isMarked={isMarked} />
            <span>{t('dashboard.questionSession.markForReview')}</span>
          </button>

          <button className="flex items-center gap-2 px-5 py-2 bg-white border border-[#D4D4D4] text-[#525252] rounded-[14px] text-[14px] font-medium font-roboto hover:bg-[#F3F4F6] transition-colors">
            <DocumentIcon />
            <span>{t('dashboard.questionSession.formulaSheet')}</span>
          </button>

          <div className="flex items-center gap-2.5 px-4 h-[64px] bg-gradient-to-r from-[#032746] to-[#173B50] text-white rounded-[14px] shadow-sm shadow-[#0000000D]">
            <ClockIcon className="w-6 h-6" />
            <div className="flex flex-col leading-none">
              <span className="text-xs font-normal font-roboto text-white">
                {t('dashboard.questionSession.timeRemaining')}
              </span>
              <span className="text-[24px] font-bold font-roboto leading-[32px] tracking-[0.07px]">
                {timeDisplay}
              </span>
            </div>
          </div>

          <button
            onClick={onToggleQuestionNav}
            className="text-oxford-blue hover:opacity-70 transition-opacity"
            aria-label="Settings"
          >
            <img src={setting} alt="Settings" className="w-5 h-5" />
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => onToggleMark && onToggleMark(currentIndex)}
            className={`flex items-center gap-2 px-5 py-2 bg-white border border-[#D4D4D4] text-[#525252] rounded-[14px] text-[14px] font-medium font-roboto hover:bg-[#F3F4F6] transition-colors ${
              isMarked ? 'border-[#ED4122] bg-[#FEF2F2] text-[#ED4122]' : ''
            }`}
          >
            <FlagIcon isMarked={isMarked} />
            <span>{t('dashboard.questionSession.markForReview')}</span>
          </button>
          <button
            onClick={onToggleQuestionNav}
            className="text-oxford-blue hover:opacity-70 transition-opacity"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="md:hidden mt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#032746] to-[#173B50] text-white rounded-[12px]">
          <ClockIcon className="w-4 h-4" />
          <span className="text-[12px] font-bold font-roboto">{timeDisplay}</span>
        </div>
      </div>
    </header>
  );
};

export default TestModeHeader;