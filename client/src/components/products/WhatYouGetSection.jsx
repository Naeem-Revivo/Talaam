import React from "react";
import { computer } from "../../assets/svg";
import { useLanguage } from "../../context/LanguageContext";

const WhatYouGetSection = () => {
  const { t, language } = useLanguage();
  
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: t('products.whatYouGet.features.practiceQuestions.title'),
      description: t('products.whatYouGet.features.practiceQuestions.description'),
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: t('products.whatYouGet.features.performanceTracking.title'),
      description: t('products.whatYouGet.features.performanceTracking.description'),
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: t('products.whatYouGet.features.studyPlanTools.title'),
      description: t('products.whatYouGet.features.studyPlanTools.description'),
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
        </svg>
      ),
      title: t('products.whatYouGet.features.explanations.title'),
      description: t('products.whatYouGet.features.explanations.description'),
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
          />
        </svg>
      ),
      title: t('products.whatYouGet.features.scienceBacked.title'),
      description: t('products.whatYouGet.features.scienceBacked.description'),
    },
  ];

  return (
    <section className="py-12 md:py-24 h-auto laptop:h-[813px] tablet:h-[1300px] bg-light-gradient">
      <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 lg:px-12">
        {/* Desktop Heading */}
        <h2 className="hidden md:block font-archivo font-bold text-[30px] md:text-[60px] leading-[100%] tracking-[0] text-oxford-blue mb-7">
          {t('products.whatYouGet.title')}
        </h2>
        <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 laptop:gap-24 items-center w-full">
          {/* Product Visual and CTA - Shows first on mobile */}
          <div className="bg-white   md:w-[587px] lg:w-[587px] xl:w-[587px] h-auto min-h-[436px] md:h-[436px] laptop:h-[511px] pt-6 px-4 pb-6 sm:pt-8 sm:px-6 md:p-8 rounded-xl shadow-lg mx-auto md:mx-0 order-1 md:order-2 lg:order-2">
            <div className="flex items-center justify-center h-[200px] sm:h-[220px] md:h-[280px] laptop:h-[280px]">
              <img src={computer} alt="" className="w-full h-full object-contain" />
            </div>

            {/* CTA Content */}
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-3 laptop:gap-4 items-center justify-center mt-4 sm:mt-6">
              <h3 className="font-archivo font-semibold text-[16px] sm:text-[18px] md:text-[22px] leading-[120%] tracking-[0] text-oxford-blue text-center">
                {t('products.whatYouGet.tryItFree')}
              </h3>
              <p className="font-roboto font-normal text-[13px] sm:text-[14px] md:text-[16px] leading-[140%] tracking-[0] text-center text-oxford-blue px-2">
                {t('products.whatYouGet.tryItFreeDesc')}
              </p>
              <button className="w-full max-w-[280px] sm:max-w-[320px] md:w-[498px] h-[48px] sm:h-[50px] md:h-[54px] bg-orange-gradient rounded-[12px] font-archivo font-semibold text-[13px] sm:text-[14px] leading-[14px] tracking-[0] align-middle uppercase text-white hover:opacity-90 transition-opacity">
                {t('products.whatYouGet.getStartedFree')}
              </button>
            </div>
          </div>

          {/* Heading - Shows after image on mobile */}
          <h2 className="md:hidden font-archivo font-bold text-[30px] leading-[100%] tracking-[0] text-oxford-blue mb-7 order-2">
            {t('products.whatYouGet.title')}
          </h2>

          {/* What You Get Content - Shows third on mobile */}
          <div className="w-full order-3 md:order-1 lg:order-1">
            <div className="space-y-8 md:space-y-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 md:space-x-4">
                  <div className="flex-shrink-0 bg-red-500  p-2 md:p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className={`font-archivo font-semibold ${language === 'ar' ? 'pr-4' : 'pr-0'} text-[18px] md:text-[22px] leading-[100%] tracking-[0] text-start text-oxford-blue`}>
                      {feature.title}
                    </h3>
                    <p className={`font-roboto font-normal text-[15px] ${language === 'ar' ? 'pr-4' : 'pr-0'} md:text-[18px] leading-[100%] tracking-[0] align-middle text-black`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
