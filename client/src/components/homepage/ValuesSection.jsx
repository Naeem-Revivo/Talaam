import React from 'react';
import ValueCard from '../reusable/ValueCard';
import { starvalue } from '../../assets/svg';
import { boxcard } from '../../assets/svg';
import { applecard } from '../../assets/svg';
import { applecards2 } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const ValuesSection = () => {
  const { t } = useLanguage();
  return (
    <div className="bg-soft-gradient flex items-center justify-center w-full mobile:h-auto tablet:h-auto laptop:h-[816px] mobile:py-12 tablet:py-16 laptop:py-0">
      <div className="max-w-[1400px] mx-auto w-full mobile:h-auto tablet:h-auto laptop:h-[616px] flex flex-col items-center mobile:gap-8 tablet:gap-12 laptop:gap-16 px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-archivo font-bold mobile:text-[32px] mobile:leading-[40px] tablet:text-[48px] tablet:leading-[56px] laptop:text-[60px] laptop:leading-[62.4px] tracking-[0] align-middle text-oxford-blue">
            {t('homepage.values.title')}
          </h2>
          <p className="font-roboto font-normal mobile:text-[14px] mobile:leading-[22px] tablet:text-[16px] tablet:leading-[25.6px] laptop:text-[16px] laptop:leading-[25.6px] tracking-[0] text-center text-oxford-blue">
            {t('homepage.values.subtitle')}
          </p>
        </div>
        
        {/* Values Grid */}
        <div className="w-full">
          <div className="flex flex-col gap-6 md:gap-8 w-full">
            <div className="flex flex-col gap-6 md:gap-6 tablet:flex-row laptop:flex-row laptop:gap-[90px] w-full">
              <ValueCard
                title={t('homepage.values.evidenceBasedLearning.title')}
                description={t('homepage.values.evidenceBasedLearning.description')}
                actionText={t('homepage.values.evidenceBasedLearning.action')}
                iconBgColor=""
                gradientBg="bg-[linear-gradient(122.42deg,#FFFFFF_0%,#E5FFF5_98.81%)]"
                icon={
                 <img src={starvalue} alt="Star Value" />
                }
              />
              
              <ValueCard
                title={t('homepage.values.effortOverHacks.title')}
                description={t('homepage.values.effortOverHacks.description')}
                actionText={t('homepage.values.effortOverHacks.action')}
                iconBgColor=""
                gradientBg="bg-[linear-gradient(122.42deg,#FFFFFF_0%,#E5F4FF_98.81%)]"
                icon={
                  <img src={boxcard} alt="Box Card" />
                }
              />
            </div>
            
            <div className="flex flex-col gap-6 md:gap-6 tablet:flex-row laptop:flex-row laptop:gap-[90px] w-full">
              <ValueCard
                title={t('homepage.values.learnHowToLearn.title')}
                description={t('homepage.values.learnHowToLearn.description')}
                actionText={t('homepage.values.learnHowToLearn.action')}
                iconBgColor=""
                gradientBg="bg-[linear-gradient(122.42deg,#FFFFFF_0%,#FFF4E5_98.81%)]"
                icon={
                  <img src={applecard} alt="Apple Card" />
                }
              />
              
              <ValueCard
                title={t('homepage.values.valueFirstAlways.title')}
                description={t('homepage.values.valueFirstAlways.description')}
                actionText={t('homepage.values.valueFirstAlways.action')}
                iconBgColor=""
                gradientBg="bg-[linear-gradient(122.42deg,#FFFFFF_0%,#FDF3FF_98.81%)]"
                icon={
                  <img src={applecards2} alt="Apple Card 2" />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuesSection;