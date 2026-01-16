import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const ReviewPageHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="mb-4 md:mb-6 lg:mb-8">
      <h1 className="font-archivo font-bold text-[32px] md:text-[36px] leading-[36px] md:leading-[40px] text-oxford-blue mb-2">
        {t('dashboard.review.hero.title')}
      </h1>
      <p className="font-roboto font-normal text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-dark-gray">
        {t('dashboard.review.hero.subtitle')}
      </p>
    </div>
  );
};

export default ReviewPageHeader;
