import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const WhoWeAre = () => {
  const { t } = useLanguage();
  return (
    <section className="py-10 md:py-16 lg:py-20 bg-light-gradient h-auto lg:h-[426px]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-5">
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
          <h2 className="font-archivo font-bold text-[32px] md:text-[45px] lg:text-[60px] leading-[100%] tracking-[0] text-oxford-blue text-center px-4">
            {t('about.whoWeAre.title')}
          </h2>
          <div className="max-w-4xl mx-auto  md:px-6 laptop:px-0">
            <p className="font-roboto font-normal text-[16px] md:text-[18px] lg:text-[20px] leading-[140%] md:leading-[120%] lg:leading-[100%] tracking-[0] text-center text-black w-full lg:w-[985px] px-4 md:px-6 lg:px-0">
              {t('about.whoWeAre.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
