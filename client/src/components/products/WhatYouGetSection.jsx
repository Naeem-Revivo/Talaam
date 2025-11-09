import React from "react";
import { computer } from "../../assets/svg";
import { study, performance, minding, teach, science } from "../../assets/svg/products";
import { useLanguage } from "../../context/LanguageContext";

const WhatYouGetSection = () => {
  const { t, language } = useLanguage();
  
  const features = [
    {
      icon: study,
      title: t('products.whatYouGet.features.practiceQuestions.title'),
      description: t('products.whatYouGet.features.practiceQuestions.description'),
    },
    {
      icon: performance,
      title: t('products.whatYouGet.features.performanceTracking.title'),
      description: t('products.whatYouGet.features.performanceTracking.description'),
    },
    {
      icon: minding,
      title: t('products.whatYouGet.features.studyPlanTools.title'),
      description: t('products.whatYouGet.features.studyPlanTools.description'),
    },
    {
      icon: teach,
      title: t('products.whatYouGet.features.explanations.title'),
      description: t('products.whatYouGet.features.explanations.description'),
    },
    {
      icon: science,
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
                <div
                  key={index}
                  className={`flex items-start space-x-3 md:space-x-4 ${
                    language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <img src={feature.icon} alt="" className="h-[60px] w-[60px]" />
                  </div>
                  <div className={`flex flex-col gap-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-archivo font-semibold text-[18px] md:text-[22px] leading-[100%] tracking-[0] text-oxford-blue">
                      {feature.title}
                    </h3>
                    <p className="font-roboto font-normal text-[15px] md:text-[18px] leading-[100%] tracking-[0] text-black">
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
