import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const WhatMakesUsDifferent = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const features = [
    t('about.whatMakesUsDifferent.features.feature1'),
    t('about.whatMakesUsDifferent.features.feature2'),
    t('about.whatMakesUsDifferent.features.feature3'),
    t('about.whatMakesUsDifferent.features.feature4')
  ];

  // Split into two columns: left = 0,2  right = 1,3
  const leftFeatures = features.filter((_, i) => i % 2 === 0);
  const rightFeatures = features.filter((_, i) => i % 2 === 1);

  const CheckIcon = () => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.1673 8.33332C18.5479 10.2011 18.2767 12.1428 17.3989 13.8348C16.5211 15.5268 15.0897 16.8667 13.3436 17.6311C11.5975 18.3955 9.64203 18.5381 7.80342 18.0353C5.96482 17.5325 4.35417 16.4145 3.24007 14.8678C2.12597 13.3212 1.57577 11.4394 1.68123 9.53615C1.78668 7.63294 2.5414 5.8234 3.81955 4.4093C5.09769 2.9952 6.82199 2.06202 8.70489 1.76537C10.5878 1.46872 12.5155 1.82654 14.1665 2.77916" stroke="#ED4122" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.5 9.16659L10 11.6666L18.3333 3.33325" stroke="#ED4122" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  const FeatureItem = ({ text }) => (
    <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse text-right' : ''}`}>
      <CheckIcon />
      <span className="font-roboto font-normal text-[#64748B] text-[13px] md:text-[15px] leading-[150%]">
        {text}
      </span>
    </div>
  );

  return (
    <section className="w-full bg-[#F9FAFB] py-12 md:py-16 lg:py-20">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Title */}
        <h2 className="font-archivo font-bold text-[#0F172A] text-[32px] md:text-[44px] lg:text-[52px] leading-[110%] tracking-[0] text-center mb-8 md:mb-12">
          {t('about.whatMakesUsDifferent.title')}
        </h2>

        {/* Features - 2 columns, 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-5 md:gap-y-6 max-w-[900px] mx-auto">
          {/* Left column */}
          <div className="flex flex-col gap-5 md:gap-6">
            {leftFeatures.map((feature, index) => (
              <FeatureItem key={index} text={feature} />
            ))}
          </div>
          {/* Right column */}
          <div className="flex flex-col gap-5 md:gap-6">
            {rightFeatures.map((feature, index) => (
              <FeatureItem key={index} text={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatMakesUsDifferent;
