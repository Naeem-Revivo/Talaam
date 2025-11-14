import React from 'react';
import StepCard from '../shared/StepCard';
import { addperson, bookcard } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const HowItWorksSection = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-light-gradient w-full mobile:h-auto tablet:h-auto laptop:h-[558px] mobile:py-12 tablet:py-16 laptop:py-0">
      <div className="max-w-[1400px] mx-auto w-full mobile:h-auto tablet:h-auto laptop:h-full flex flex-col items-center mobile:gap-12 tablet:gap-16 laptop:gap-20 px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 pt-20 text-center">
          <h2 className="font-archivo font-bold text-oxford-blue mobile:text-[28px] mobile:leading-[100%] tablet:text-[48px] tablet:leading-[110%] laptop:text-[60px] laptop:leading-[100%] tracking-[0]">
            {t('homepage.howItWorks.title')}
          </h2>
          <p className="font-roboto text-oxford-blue font-normal mobile:text-[16px] mobile:leading-[140%] tablet:text-[18px] tablet:leading-[120%] laptop:text-[20px] laptop:leading-[100%] tracking-[0]">
            {t('homepage.howItWorks.subtitle')}
          </p>
        </div>
        
        {/* Steps Cards */}
        <div className="flex mobile:flex-col tablet:flex-col laptop:flex-row gap-8 md:gap-12 lg:gap-[70px]">
          <StepCard
            stepNumber={t('homepage.howItWorks.step1.number')}
            stepText="text-orange-dark"
            title={t('homepage.howItWorks.step1.title')}
            description={t('homepage.howItWorks.step1.description')}
            iconBgColor="bg-orange-dark"
            icon={
              <img src={addperson} alt="Add Person" />
            }
          />
          
          <StepCard
            stepNumber={t('homepage.howItWorks.step2.number')}
            stepText="text-moonstone-blue"
            title={t('homepage.howItWorks.step2.title')}
            description={t('homepage.howItWorks.step2.description')}
            iconBgColor="bg-moonstone-blue"
            icon={
              <img src={bookcard} alt="Solve Questions" />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
