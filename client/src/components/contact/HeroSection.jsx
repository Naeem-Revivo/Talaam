import React from 'react';
import { contactherologo } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const HeroSection = () => {
  const { t, language } = useLanguage();
  return (
    <div className="max-w-full font-archivo bg-soft-orange-fade">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-col lg:flex-row pt-8 pb-4 px-4 md:py-12 md:px-8 lg:px-12 lg:justify-around lg:min-h-[603px]">
        {/* Text content */}
        <div className={`w-full md:w-full lg:w-[656px] flex flex-col gap-0 md:gap-6 lg:gap-3 pt-0 md:pt-0 lg:pt-40 items-start md:items-center lg:items-start ${language === 'ar' ? 'md:text-center lg:text-right' : 'text-left md:text-center lg:text-left'} order-1 md:order-1 lg:order-1`}>
          <h1 className="leading-tight font-archivo mb-2 md:mb-2 lg:mb-2 flex items-start gap-2 md:flex md:items-center md:gap-2 lg:block text-oxford-blue">
            <span className="font-bold text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] lg:text-[60px] lg:leading-[80px] tracking-[0] inline-block">{t('contact.hero.title1')}</span>
            <span className="font-bold text-cinnebar-red text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] lg:text-[60px] laptop:pl-3 lg:leading-[80px] tracking-[0] inline-block">{t('contact.hero.title2')}</span>
          </h1>
          
          <p className={`font-roboto text-oxford-blue w-full md:w-[600px] lg:w-[567px] font-normal text-[14px] leading-[22px] md:text-[16px] md:leading-[25.6px] lg:text-[16px] lg:leading-[25.6px] tracking-[0] mt-2 md:mt-2 lg:mt-0 ${language === 'ar' ? 'md:text-center lg:text-right' : 'text-left md:text-center lg:text-left'} laptop:pl-2`}>
            {t('contact.hero.subtitle')}
          </p>
        </div>

        {/* Image */}
        <div className="w-full md:w-auto lg:w-auto flex justify-center md:justify-center lg:justify-start lg:pt-8 mt-8 md:mt-8 lg:mt-0 order-2 md:order-2 lg:order-2 mb-4 md:mb-0">
          <img
            src={contactherologo}
            alt=""
            className="w-[352px] h-[231px] md:w-auto md:px-7 laptop:px-0 md:h-auto lg:w-[670px] lg:h-[403px] rounded-[12px]"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
