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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_31_1064)">
        <path d="M6.62479 10.3333C6.56527 10.1026 6.44502 9.89203 6.27653 9.72355C6.10805 9.55507 5.8975 9.43481 5.66679 9.3753L1.57679 8.32063C1.50701 8.30082 1.4456 8.2588 1.40186 8.20093C1.35813 8.14306 1.33447 8.0725 1.33447 7.99996C1.33447 7.92743 1.35813 7.85687 1.40186 7.799C1.4456 7.74113 1.50701 7.6991 1.57679 7.6793L5.66679 6.62396C5.89742 6.5645 6.10792 6.44435 6.27639 6.27599C6.44486 6.10763 6.56517 5.89722 6.62479 5.66663L7.67946 1.57663C7.69906 1.50657 7.74105 1.44486 7.799 1.40089C7.85696 1.35693 7.92771 1.33313 8.00046 1.33313C8.0732 1.33313 8.14395 1.35693 8.20191 1.40089C8.25987 1.44486 8.30185 1.50657 8.32146 1.57663L9.37546 5.66663C9.43497 5.89734 9.55523 6.10789 9.72371 6.27637C9.89219 6.44486 10.1027 6.56511 10.3335 6.62463L14.4235 7.67863C14.4938 7.69803 14.5558 7.73997 14.6 7.79801C14.6442 7.85606 14.6682 7.927 14.6682 7.99996C14.6682 8.07292 14.6442 8.14387 14.6 8.20191C14.5558 8.25996 14.4938 8.3019 14.4235 8.3213L10.3335 9.3753C10.1027 9.43481 9.89219 9.55507 9.72371 9.72355C9.55523 9.89203 9.43497 10.1026 9.37546 10.3333L8.32079 14.4233C8.30118 14.4934 8.2592 14.5551 8.20124 14.599C8.14328 14.643 8.07254 14.6668 7.99979 14.6668C7.92704 14.6668 7.85629 14.643 7.79834 14.599C7.74038 14.5551 7.69839 14.4934 7.67879 14.4233L6.62479 10.3333Z" stroke="#0369A1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M13.3335 2V4.66667" stroke="#0369A1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M14.6667 3.33337H12" stroke="#0369A1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M2.6665 11.3334V12.6667" stroke="#0369A1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3.33333 12H2" stroke="#0369A1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_31_1064">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>

  );

  return (
    <section className="w-full bg-[#FDF8F6] py-12 md:py-16 lg:py-20">
      <div
        className={`max-w-[1180px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-10 px-4 md:px-8 lg:px-12 2xl:px-0 ${isArabic ? 'lg:flex-row-reverse' : ''
          }`}
      >
        {/* Left Content */}
        <div
          className={`w-full lg:max-w-[500px] flex flex-col gap-5 ${isArabic ? 'text-right items-end' : 'text-left items-start'
            }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] w-fit">
            <SparkIcon />
            <span className="font-roboto font-semibold text-[12px] md:text-[14px] leading-[20px] text-[#0369A1]">
              {t('about.hero.badge')}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-archivo font-bold text-[#0F172A] text-[44px] sm:text-[56px] lg:text-[72px] leading-[90px] tracking-[-2.16px]">
            {t('about.hero.title1')}{' '}
            <span className="text-[#ED4122]">{t('about.hero.title2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="font-roboto text-[#475569] font-normal text-[16px] md:text-[20px] leading-[32px] max-w-[420px]">
            {t('about.hero.subtitle')}
          </p>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 ${isArabic ? 'items-end sm:flex-row-reverse' : 'items-start'
              }`}
          >
            <button
              onClick={() => navigate('/create-account')}
              className="bg-gradient-to-b from-[#ED4122] to-[#FF8B67] hover:opacity-90 transition-opacity text-white rounded-[16px] h-[48px] md:h-[52px] px-8 md:px-10 font-archivo font-bold text-[15px] md:text-[20px] leading-[28px] tracking-[-0.44px] shadow-[0_8px_24px_rgba(237,65,34,0.25)]"
            >
              {t('about.hero.getStarted')}
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              className="bg-white border-2 border-[#032746] hover:border-[#CBD5E1] transition-colors flex items-center justify-center gap-2 text-[#0F172A] rounded-[16px] h-[48px] md:h-[52px] px-8 md:px-10 font-archivo font-bold text-[15px] md:text-[18px] leading-[28px] tracking-[-0.44px]"
            >
              {t('about.hero.exploreMore')}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.1665 10H15.8332" stroke="#032746" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10 4.16663L15.8333 9.99996L10 15.8333" stroke="#032746" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
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
