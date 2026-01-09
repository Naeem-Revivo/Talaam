import React from 'react';
import { greaterthan, timinggraph } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const TimingMattersSection = () => {
  const { t, language } = useLanguage();
  return (
    <section className="bg-[#C6D8D329] w-full mobile:py-10 tablet:py-10 tablet:pb-12 h-auto tablet:h-[790px] lg:h-[590px] overflow-hidden md:overflow-visible">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className={`flex flex-col tablet:flex-col laptop:flex-row md:items-center lg:items-center lg:justify-between px-4 md:px-8 lg:px-12`}>
          {/* Left side - Text content */}
          <div className="flex flex-col gap-3 order-2 md:order-1 tablet:pr-12 laptop:pr-0">
            <h2 className="font-archivo font-bold text-[32px] md:text-[48px] lg:text-[60px] mobile:pt-8 leading-[100%] tracking-[0] text-oxford-blue">{t('howItWorks.timingMatters.title')}</h2>
            <h3 className="font-archivo font-semibold text-[22px] md:text-[24px] lg:text-[26px] leading-[100%] tracking-[0] text-oxford-blue pt-2 md:pt-4">{t('howItWorks.timingMatters.subtitle')}</h3>
            
            <div className="space-y-3 md:space-y-4">
              <p className="font-roboto font-normal text-[16px] md:text-[16px] leading-[22px] tracking-[0] text-oxford-blue">
                {t('howItWorks.timingMatters.description1')}
              </p>
              <p className="font-roboto font-normal text-[16px] md:text-[16px] leading-[22px] tracking-[0] text-oxford-blue md:w-[580px]">
                {t('howItWorks.timingMatters.description2')}
              </p>
            </div>

            {/* Legend and Learn More button */}
            <div className="flex flex-col tablet:flex-row gap-4 mt-3 font-roboto">
              {/* Legend Items */}
              <div className={`flex flex-row gap-6 text-oxford-blue items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center ${language === 'ar' ? 'flex-row-reverse gap-2' : 'space-x-2'}`}>
                  <span className="w-[17px] h-[17px] bg-orange-gradient rounded-sm"></span>
                  <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0] md:text-base">{t('howItWorks.timingMatters.legend1')}</span>
                </div>
                <div className={`flex items-center justify-normal ${language === 'ar' ? 'flex-row-reverse gap-2' : 'space-x-2'}`}>
                  <span className="w-[17px] h-[17px] bg-blue-gradient rounded-sm"></span>
                  <span className="font-roboto font-normal text-[12px] leading-[100%] tracking-[0] md:text-base">{t('howItWorks.timingMatters.legend2')}</span>
                </div>
              </div>
              
              {/* Button */}
              {/* <button className={`flex items-center gap-4 w-[164px] h-[38px] border text-oxford-blue border-oxford-blue font-archivo font-semibold text-[14px] rounded-[8px] leading-[14px] align-middle uppercase tracking-[0] ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
               <div className="pl-6">
                {t('howItWorks.timingMatters.learnMore')} 
                </div> 
                <img src={greaterthan} alt="" className="" />
              </button> */}
            </div>
          </div>

          {/* Right side - Graph */}
          <div className="order-1 md:order-2 pl-0 md:pl-10 mb-6 tablet:mb-8 laptop:mb-0">
            <div className="w-[352px] h-[275px] overflow-hidden flex-shrink-0 tablet:w-[500px] tablet:h-[390px] laptop:w-[599px] laptop:h-[466px] rounded-[12px]">
              <img src={timinggraph} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimingMattersSection;
