import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const PracticePageHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h1 className="font-archivo font-bold text-[32px] md:text-[36px] leading-[36px] md:leading-[40px] text-oxford-blue mb-1 md:mb-2">
        {t('dashboard.practice.hero.title')}
      </h1>
      <p className="font-roboto font-normal text-[18px] leading-[28px] tracking-[0%] text-dark-gray">
        {t('dashboard.practice.hero.subtitle')}
      </p>
    </div>
  );
};

export default PracticePageHeader;
