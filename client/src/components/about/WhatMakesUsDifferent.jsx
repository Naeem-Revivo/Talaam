import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const WhatMakesUsDifferent = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const features = [
    t('about.whatMakesUsDifferent.features.feature1'),
    t('about.whatMakesUsDifferent.features.feature2'),
    t('about.whatMakesUsDifferent.features.feature3'),
    t('about.whatMakesUsDifferent.features.feature4')
  ];

  return (
    <section className="py-10 md:py-16 lg:py-20 bg-light-gradient h-auto lg:h-[497px]">
      <div className="max-w-[1400px] pt-5 mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8">
          <h2 className="font-archivo font-bold text-[28px] md:text-[40px] lg:text-[60px] leading-[110%] md:leading-[100%] lg:leading-[62.4px] tracking-[0] align-middle text-oxford-blue text-center px-4">
            {t('about.whatMakesUsDifferent.title')}
          </h2>
          <div className={`w-full lg:w-auto ${isRTL ? 'lg:pl-16' : 'lg:pr-48'}`}>
            <ul
              className={`space-y-4 md:space-y-6 lg:space-y-8 laptop:px-0 ${
                isRTL
                  ? 'text-right pr-4 md:pr-10'
                  : 'text-left pl-4 md:pl-10'
              }`}
            >
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div
                    className={`w-[12px] md:w-[14px] lg:w-[15.28px] h-[12px] md:h-[14px] lg:h-[15.28px] bg-orange-dark-2 rounded-full flex-shrink-0 mt-1 md:mt-1.5 lg:mt-1 flex items-center justify-center ${
                      isRTL
                        ? 'ml-3 md:ml-3.5 lg:ml-4'
                        : 'mr-3 md:mr-3.5 lg:mr-4'
                    }`}
                  >
                  </div>
                  <span
                    className={`font-roboto font-normal pt-0.5 text-[16px] md:text-[18px] lg:text-[20px] leading-[140%] md:leading-[130%] lg:leading-[100%] tracking-[0] align-middle text-oxford-blue ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatMakesUsDifferent;
