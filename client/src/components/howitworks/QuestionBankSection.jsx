import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const QuestionBankSection = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const features = [
    {
      title: t('howItWorks.questionBank.features.activeRecall.title'),
      description: t('howItWorks.questionBank.features.activeRecall.description'),
    },
    {
      title: t('howItWorks.questionBank.features.immediateFeedback.title'),
      description: t('howItWorks.questionBank.features.immediateFeedback.description'),
    },
    {
      title: t('howItWorks.questionBank.features.interleaving.title'),
      description: t('howItWorks.questionBank.features.interleaving.description'),
    },
    {
      title: t('howItWorks.questionBank.features.adaptiveDifficulty.title'),
      description: t('howItWorks.questionBank.features.adaptiveDifficulty.description'),
    },
    {
      title: t('howItWorks.questionBank.features.spacedRepetition.title'),
      description: t('howItWorks.questionBank.features.spacedRepetition.description'),
    },
    {
      title: t('howItWorks.questionBank.features.desirableDifficulty.title'),
      description: t('howItWorks.questionBank.features.desirableDifficulty.description'),
    },
  ];

  // Split into two columns: left = 0,2,4  right = 1,3,5
  const leftFeatures = features.filter((_, i) => i % 2 === 0);
  const rightFeatures = features.filter((_, i) => i % 2 === 1);

  // Checkmark icon
  const CheckIcon = ({ bg }) => (
    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.6667 3.5L5.25 9.91667L2.33337 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );

  const FeatureItem = ({ feature, iconBg }) => (
    <div className={`flex items-start gap-3 ${isArabic ? 'flex-row-reverse text-right' : ''}`}>
      <CheckIcon bg={iconBg} />
      <div className="flex-1 min-w-0">
        <h3 className="font-archivo font-bold text-text-dark text-[15px] md:text-[20px] leading-[28px] tracking-[0]">
          {feature.title}
        </h3>
        <p className="mt-1 font-roboto font-normal text-text-gray text-[12px] md:text-[16px] leading-[26px] tracking-[0]">
          {feature.description}
        </p>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-[#F9FAFB] py-12 md:py-16 lg:py-20">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-archivo font-bold text-text-dark text-[32px] md:text-[48px] leading-[48px] tracking-[-0.96px]">
            {t('howItWorks.questionBank.title')}
          </h2>
          <p className="mt-3 md:mt-4 font-roboto font-normal text-text-gray text-[14px] md:text-[18px] leading-[22px] tracking-[0]">
            {t('howItWorks.questionBank.subtitle')}
          </p>
        </div>

        {/* Features Grid - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-7 md:gap-y-8">
          {/* Left column - orange-dark icons */}
          <div className="flex flex-col gap-7 md:gap-8">
            {leftFeatures.map((feature, index) => (
              <FeatureItem key={index} feature={feature} iconBg="bg-[#ED4122]" />
            ))}
          </div>
          {/* Right column - blue-dark icons */}
          <div className="flex flex-col gap-7 md:gap-8">
            {rightFeatures.map((feature, index) => (
              <FeatureItem key={index} feature={feature} iconBg="bg-[#0F2D46]" />
            ))}
          </div>
        </div>

        {/* Conclusion banner */}
        <div className="mt-10 md:mt-14 w-full mx-auto">
          <div className="border-l-4 border-[#ED4122] rounded-[24px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] px-6 py-5 md:px-8 md:py-6">
            <p className={`font-archivo font-semibold text-text-dark text-[14px] md:text-[20px] leading-[28px] tracking-[0] ${isArabic ? 'text-right' : 'text-center'}`}>
              {t('howItWorks.questionBank.conclusion')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionBankSection;
