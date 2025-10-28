import React from "react";
import { ideas } from "../../assets/svg";
import { useLanguage } from "../../context/LanguageContext";

const WhyWeStarted = () => {
  const { t, language } = useLanguage();
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-soft-gradient h-auto lg:h-[741px]">
      <div className="">
        <h2 className="font-archivo text-center pb-8 md:pb-12 lg:pb-20 pt-4 md:pt-6 lg:pt-8 font-bold text-[28px] md:text-[40px] lg:text-[60px] leading-[110%] md:leading-[100%] lg:leading-[100%] tracking-[0] text-oxford-blue px-4">
          {t('about.whyWeStarted.title')}
        </h2>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-32 px-4 md:px-8 lg:px-0">
          <div className="flex justify-center w-full lg:w-auto">
            <div className="relative">
              <img src={ideas} alt="ideas" className="w-[352px] h-[252px] md:w-auto md:h-auto md:max-w-[350px] lg:max-w-none object-contain" />
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 w-full lg:w-auto">
            <h3 className={`font-archivo md:px-8 laptop:px-0 font-semibold text-[22px] md:text-[24px] lg:text-[26px] leading-[100%] tracking-[0] text-oxford-blue ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t('about.whyWeStarted.subtitle')}
            </h3>
            <div className={`font-roboto font-normal text-[16px] md:text-[18px] lg:text-[20px] leading-[140%] md:leading-[130%] lg:leading-[100%] tracking-[0] w-full lg:w-[607px] text-oxford-blue ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <p className="md:px-8 laptop:px-0">
                {t('about.whyWeStarted.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeStarted;
