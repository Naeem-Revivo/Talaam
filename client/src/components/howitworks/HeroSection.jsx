import React from 'react';
import { logoimg } from '../../assets/svg/howitworks';
import { useLanguage } from '../../context/LanguageContext';

const HeroSection = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className={`max-w-full font-archivo bg-soft-orange-fade`}>
      <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-col lg:flex-row pt-8 pb-4 px-4 md:py-12 md:px-8 lg:px-12 lg:justify-around lg:min-h-[603px]">
        {/* Text content */}
        <div className={`w-full md:w-full lg:w-[507px] flex flex-col gap-0 md:gap-6 lg:gap-1 pt-0 md:pt-0 lg:pt-20 lg:pl-3 items-start md:items-center lg:items-start ${isArabic ? 'md:text-center lg:text-right' : 'text-left md:text-center lg:text-left'} order-1 md:order-1 lg:order-1`}>
          <h1 className="leading-tight font-archivo mb-2 md:mb-2 lg:mb-2 text-oxford-blue">
            <span className="font-bold text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] lg:text-[60px] lg:leading-[80px] tracking-[0]">{t('howItWorks.hero.title')}</span>
            <span className="font-bold text-cinnebar-red text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] lg:text-[60px] lg:leading-[80px] tracking-[0]">{t('howItWorks.hero.titleHighlight')}</span>
          </h1>
          
          <p className={`font-roboto text-oxford-blue w-full md:w-[600px] lg:w-full font-normal text-[14px] leading-[22px] md:text-[16px] md:leading-[25.6px] lg:text-[16px] lg:leading-[25.6px] tracking-[0] mt-2 md:mt-2 lg:mt-0 ${isArabic ? 'md:text-center lg:text-right' : 'text-left md:text-center lg:text-left'}`}>
            {t('howItWorks.hero.subtitle')}
          </p>
          
          <div className="flex md:flex-row gap-5 w-full md:w-auto lg:w-auto items-start md:items-center lg:items-start mt-6 md:mt-6 lg:mt-10">
            <button className="w-[140px] h-[44px] md:w-[140px] md:h-[44px] lg:w-[164px] lg:h-[54px] bg-orange-gradient rounded-[12px] text-white font-archivo font-semibold text-[12px] leading-[14px] md:text-[12px] md:leading-[14px] lg:text-[14px] lg:leading-[14px] tracking-[0] align-middle uppercase">
              {t('howItWorks.hero.getStarted')}
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center md:justify-center lg:justify-start lg:pt-8 mt-8 md:mt-8 lg:mt-0 order-2 md:order-2 lg:order-2 mb-4 md:mb-0">
          <img
            src={logoimg}
            alt=""
            className=" w-[382px] h-[231px] tablet:w-[650px] md:h-[403px] lg:w-[670px] lg:h-[403px] rounded-[12px]"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
