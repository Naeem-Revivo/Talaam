import React from 'react';
import { aboutheroimage } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const AboutHeroSection = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isArabic = language === 'ar';

  // Spark/starburst icon
  const SparkIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M8 0L9.5 5.5L15 7L9.5 8.5L8 14L6.5 8.5L1 7L6.5 5.5L8 0Z"
        fill="#ED4122"
      />
    </svg>
  );

  return (
    <section className="w-full bg-[#FDF8F6] py-12 md:py-16 lg:py-20">
      <div
        className={`max-w-[1180px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-10 px-4 md:px-8 lg:px-12 2xl:px-0 ${
          isArabic ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* Left Content */}
        <div
          className={`w-full lg:max-w-[500px] flex flex-col gap-5 ${
            isArabic ? 'text-right items-end' : 'text-left items-start'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FDF2F8] border border-[#ED4122] w-fit">
            <SparkIcon />
            <span className="font-roboto font-normal text-[12px] md:text-[14px] text-[#ED4122]">
              {t('about.hero.badge')}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-archivo font-bold text-[#0F172A] text-[44px] sm:text-[56px] lg:text-[72px] leading-[110%] tracking-[0]">
            {t('about.hero.title1')}{' '}
            <span className="text-[#ED4122]">{t('about.hero.title2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="font-roboto text-[#475569] font-normal text-[16px] md:text-[18px] leading-[155%] max-w-[420px]">
            {t('about.hero.subtitle')}
          </p>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 ${
              isArabic ? 'items-end sm:flex-row-reverse' : 'items-start'
            }`}
          >
            <button
              onClick={() => navigate('/create-account')}
              className="bg-gradient-to-r from-[#ED4122] to-[#FF8B67] hover:opacity-90 transition-opacity text-white rounded-[16px] h-[48px] md:h-[52px] px-8 md:px-10 font-archivo font-bold text-[15px] md:text-[16px] tracking-[-0.2px] shadow-[0_8px_24px_rgba(237,65,34,0.25)]"
            >
              {t('about.hero.getStarted')}
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              className="bg-white border-2 border-[#E5E7EB] hover:border-[#CBD5E1] transition-colors flex items-center justify-center gap-2 text-[#0F172A] rounded-[16px] h-[48px] md:h-[52px] px-8 md:px-10 font-archivo font-semibold text-[15px] md:text-[16px] tracking-[-0.2px]"
            >
              {t('about.hero.exploreMore')}
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.16699 10H15.8337"
                  stroke="#0F172A"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.60938 4L15.4427 9.83333L9.60938 15.6667"
                  stroke="#0F172A"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:max-w-[540px]">
          <div className="bg-white rounded-[24px] p-3 md:p-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] border border-[#F1F5F9]">
            <img
              src={aboutheroimage}
              alt="About us"
              className="w-full h-[220px] sm:h-[280px] md:h-[320px] object-cover rounded-[16px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
