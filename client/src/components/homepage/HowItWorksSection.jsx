import React from 'react';
import HomepageStepCard from './HomepageStepCard';
import { teamicon, bookicon, progressicon } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const HowItWorksSection = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-[#F9FAFB] w-full mobile:py-12 tablet:py-16 laptop:py-[96px]">
      <div className="max-w-[1180px] mx-auto w-full flex flex-col items-center mobile:gap-12 tablet:gap-16 laptop:gap-16 px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-archivo font-bold text-text-dark mobile:text-[32px] mobile:leading-[110%] tablet:text-[40px] tablet:leading-[110%] laptop:text-[48px] laptop:leading-[48PX] tracking-[-0.96PX]">
            {t('homepage.howItWorks.title')}
          </h2>
          <p className="font-roboto text-text-gray font-normal mobile:text-[15px] mobile:leading-[160%] tablet:text-[18px] tablet:leading-[150%] laptop:text-[18px] laptop:leading-[28px] tracking-[0] max-w-[720px]">
            {t('homepage.howItWorks.subtitle')}
          </p>
        </div>
        
        {/* Steps Cards */}
        <div className="w-full flex flex-col laptop:flex-row items-center justify-center gap-8">
          <HomepageStepCard
            stepNumber={t('homepage.howItWorks.step1.number')}
            title={t('homepage.howItWorks.step1.title')}
            description={t('homepage.howItWorks.step1.description')}
            iconBgColor="bg-oxford-blue"
            icon={<img src={teamicon} alt="Create your account" className="w-7 h-7" />}
          />

          <HomepageStepCard
            stepNumber={t('homepage.howItWorks.step2.number')}
            title={t('homepage.howItWorks.step2.title')}
            description={t('homepage.howItWorks.step2.description')}
            iconBgColor="bg-oxford-blue"
            icon={<img src={bookicon} alt="Solve questions" className="w-7 h-7" />}
            className="shadow-[0px_2px_7px_-3px_rgba(255,165,134,0.25)]
            shadow-[0px_2px_6px_-4px_rgba(255,165,134,0.03)]"
          />

          <HomepageStepCard
            stepNumber={t('homepage.howItWorks.step3.number')}
            title={t('homepage.howItWorks.step3.title')}
            description={t('homepage.howItWorks.step3.description')}
            iconBgColor="bg-oxford-blue"
            icon={<img src={progressicon} alt="Track your progress" className="w-7 h-7" />}
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
