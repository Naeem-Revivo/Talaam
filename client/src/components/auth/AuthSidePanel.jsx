import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { logofooter } from '../../assets/svg';

const AuthSidePanel = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div
      className="hidden  fixed top-0 left-0 lg:flex lg:w-[50%] xl:w-[45%] overflow-hidden flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#032746] via-[#0A4B6E] to-[#173B50]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background gradient */}
      {/* <div className="absolute inset-0 " /> */}

      {/* Decorative floating shapes */}

      <div className='absolute bottom-16 -right-20 w-[450px] h-[450px] rounded-full  bg-[radial-gradient(120%_100%_at_80%_80%,#ED4122_0%,transparent_60%)]
  mix-blend-screen opacity-70 blur-3xl' />
      <div className='absolute bottom-24 -left-20 w-[450px] h-[450px] rounded-full bg-[radial-gradient(100%_85%_at_20%_50%,#6CA6C1_0%,transparent_60%)]
  mix-blend-screen opacity-70 blur-3xl' />

      <div className="relative z-10 flex flex-col h-full max-w-[450px] mx-auto py-10">
      <div className="absolute -top-16 -left-16 w-20 h-20 opacity-20">
        <div className="w-[150px] h-[150px] bg-[#FDF0D5]/10 rounded-xl rotate-12 backdrop-blur-sm" />
        {/* <div className="w-12 h-12 bg-white/10 rounded-xl -rotate-6 -mt-6 ml-8 backdrop-blur-sm border border-white/10" /> */}
      </div>
        {/* Top Section - Logo */}
        <div>
          <button onClick={() => navigate('/')} className='cursor-pointer z-50 relative'>
          <img
            src={logofooter}
            alt="Taalam Logo"
            className="w-[120px] h-[72px] mb-10"
          />
          </button>

          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FDF0D526] rounded-full px-4 pt-3 pb-2 mb-6 border border-[#FDF0D533]">
            {/* <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> */}
            <span className="font-roboto text-[12px] font-medium tracking-wider text-white/90 uppercase">
              {t('authSidePanel.welcomeBack')}
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-archivo font-bold text-[32px] xl:text-[48px] leading-[60px] tracking-[-1.44px] text-white mb-4">
            {t('authSidePanel.title')}
          </h1>

          {/* Subtitle */}
          <p className="font-roboto text-[14px] xl:text-[18px] leading-[30px] text-white font-normal mb-10">
            {t('authSidePanel.subtitle')}
          </p>

          {/* Feature Cards */}
          <div className="flex flex-col gap-4">
            {/* Track Progress Card */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3V21H21" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 16L12 11L15 14L21 8" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-archivo font-bold text-base text-white">
                  {t('authSidePanel.trackProgress')}
                </h3>
                <p className="font-roboto text-sm text-white">
                  {t('authSidePanel.trackProgressDesc')}
                </p>
              </div>
            </div>

            {/* Earn Achievements Card */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
              <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-archivo font-bold text-base text-white">
                  {t('authSidePanel.earnAchievements')}
                </h3>
                <p className="font-roboto text-sm text-white">
                  {t('authSidePanel.earnAchievementsDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="flex items-center justify-between gap-6 xl:gap-8 mt-10">
          <div className="flex flex-col">
            <span className="ont-archivo font-bold text-[36px] leading-10 text-white">
              10K+
            </span>
            <span className="font-roboto text-sm text-white tracking-[-0.15px]">
              {t('authSidePanel.activeStudents')}
            </span>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="flex flex-col">
            <span className="font-archivo font-bold text-[36px] leading-10 text-white">
              98%
            </span>
            <span className="font-roboto text-sm text-white tracking-[-0.15px]">
              {t('authSidePanel.courseRate')}
            </span>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="flex flex-col">
            <span className="font-archivo font-bold text-[36px] leading-10 text-white">
              4.9★
            </span>
            <span className="font-roboto text-sm text-white tracking-[-0.15px]">
              {t('authSidePanel.userRating')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidePanel;
