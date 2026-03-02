import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const HowItWorksHeroSection = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  // Spark/starburst icon SVG
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
    <div className="w-full bg-gradient-to-b from-[#ED41220A] to-[#FFFFFF03] py-12 md:py-16 lg:py-[96px]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FEE2E2] mb-6">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_30_442)">
                <path d="M6.6243 10.3334C6.56478 10.1027 6.44453 9.89215 6.27605 9.72367C6.10757 9.55519 5.89702 9.43494 5.6663 9.37542L1.5763 8.32075C1.50652 8.30095 1.44511 8.25892 1.40138 8.20105C1.35765 8.14318 1.33398 8.07262 1.33398 8.00008C1.33398 7.92755 1.35765 7.85699 1.40138 7.79912C1.44511 7.74125 1.50652 7.69922 1.5763 7.67942L5.6663 6.62408C5.89693 6.56462 6.10743 6.44447 6.2759 6.27611C6.44438 6.10775 6.56468 5.89734 6.6243 5.66675L7.67897 1.57675C7.69857 1.5067 7.74056 1.44498 7.79851 1.40101C7.85647 1.35705 7.92722 1.33325 7.99997 1.33325C8.07271 1.33325 8.14346 1.35705 8.20142 1.40101C8.25938 1.44498 8.30136 1.5067 8.32097 1.57675L9.37497 5.66675C9.43449 5.89747 9.55474 6.10802 9.72322 6.2765C9.8917 6.44498 10.1023 6.56523 10.333 6.62475L14.423 7.67875C14.4933 7.69815 14.5553 7.74009 14.5995 7.79814C14.6437 7.85618 14.6677 7.92713 14.6677 8.00008C14.6677 8.07304 14.6437 8.14399 14.5995 8.20203C14.5553 8.26008 14.4933 8.30202 14.423 8.32142L10.333 9.37542C10.1023 9.43494 9.8917 9.55519 9.72322 9.72367C9.55474 9.89215 9.43449 10.1027 9.37497 10.3334L8.3203 14.4234C8.3007 14.4935 8.25871 14.5552 8.20075 14.5992C8.1428 14.6431 8.07205 14.6669 7.9993 14.6669C7.92656 14.6669 7.85581 14.6431 7.79785 14.5992C7.73989 14.5552 7.69791 14.4935 7.6783 14.4234L6.6243 10.3334Z" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.333 2V4.66667" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.6667 3.33325H12" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.66699 11.3333V12.6666" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.33333 12H2" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_30_442">
                  <rect width="16" height="16" fill="#DC2626" />
                </clipPath>
              </defs>
            </svg>

            <span className="font-archivo text-[12px] md:text-[14px] leading-[20px] font-semibold text-[#DC2626]">
              {t('howItWorks.hero.badge')}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-archivo font-[800] text-[32px] leading-[120%] md:text-[48px] md:leading-[110%] lg:text-[72px] lg:leading-[leading-[92px]] tracking-[-2.16px] text-[#0F172A] mb-4 md:mb-6">
            {t('howItWorks.hero.title')} {t('howItWorks.hero.titleHighlight')}
          </h1>

          {/* Descriptive Paragraph */}
          <p className="font-roboto text-[14px] leading-[140%] md:text-[16px] md:leading-[140%] lg:text-[24px] lg:leading-[39px] font-normal tracking-[0] text-[#475569] max-w-[800px] mx-auto">
            {t('howItWorks.hero.subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksHeroSection;
