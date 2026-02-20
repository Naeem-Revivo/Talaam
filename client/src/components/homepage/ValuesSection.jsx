import React from 'react';
import HomepageValueCard from './HomepageValueCard';
  import { flaskicon, bookicon2, brainicon, hearticon } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const ValuesSection = () => {
  const { t } = useLanguage();
    return (
      <div className="bg-white flex items-center justify-center w-full py-[64px] laptop:py-[96px]">
      <div className="max-w-[1180px] mx-auto w-full flex flex-col items-center justify-center gap-[64px] px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-archivo font-bold text-text-dark text-[48px] leading-[48px] tracking-[-0.96px]">
            {t('homepage.values.title')}
          </h2>
          <p className="font-roboto font-normal text-text-gray text-[18px] leading-[28px] tracking-[0] text-center">
            {t('homepage.values.subtitle')}
          </p>
        </div>
        
        {/* Values Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <HomepageValueCard
            pillText={t('homepage.values.evidenceBasedLearning.pill')}
            pillClassName="bg-[#FEE2E2] text-[#DC2626]"
            iconBgClassName="bg-oxford-blue"
            iconSrc={flaskicon}
            title={t('homepage.values.evidenceBasedLearning.title')}
            description={t('homepage.values.evidenceBasedLearning.description')}
            actionText={t('homepage.values.evidenceBasedLearning.action')}
          />

          <HomepageValueCard
            pillText={t('homepage.values.effortOverHacks.pill')}
            pillClassName="bg-[#DCFCE7] text-[#22C55E]"
            iconBgClassName="bg-cinnebar-red"
            iconSrc={bookicon2}
            title={t('homepage.values.effortOverHacks.title')}
            description={t('homepage.values.effortOverHacks.description')}
            actionText={t('homepage.values.effortOverHacks.action')}
          />

          <HomepageValueCard
            pillText={t('homepage.values.learnHowToLearn.pill')}
            pillClassName="bg-[#DBEAFE] text-[#2563EB]"
            iconBgClassName="bg-cinnebar-red"
            iconSrc={brainicon}
            title={t('homepage.values.learnHowToLearn.title')}
            description={t('homepage.values.learnHowToLearn.description')}
            actionText={t('homepage.values.learnHowToLearn.action')}
          />

          <HomepageValueCard
            pillText={t('homepage.values.valueFirstAlways.pill')}
            pillClassName="bg-[#FEF3C7] text-[#D97706]"
            iconBgClassName="bg-oxford-blue"
            iconSrc={hearticon}
            title={t('homepage.values.valueFirstAlways.title')}
            description={t('homepage.values.valueFirstAlways.description')}
            actionText={t('homepage.values.valueFirstAlways.action')}
          />
        </div>
      </div>
    </div>
  );
};

export default ValuesSection;