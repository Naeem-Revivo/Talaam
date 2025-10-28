import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const OurMission = () => {
  const { t } = useLanguage();
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-[#C6D8D329] h-auto lg:h-[344px]">
      <div className="max-w-7xl mx-auto pt-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
          <h2 className="font-archivo font-bold text-[32px] md:text-[45px] lg:text-[60px] leading-[100%] tracking-[0] text-oxford-blue text-center px-4">
            {t('about.ourMission.title')}
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="font-roboto font-normal text-[16px] md:text-[18px] lg:text-[20px] leading-[140%] md:leading-[120%] lg:leading-[100%] tracking-[0] text-center text-black w-full lg:w-[947px] px-4 md:px-6 lg:px-0">
              {t('about.ourMission.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
