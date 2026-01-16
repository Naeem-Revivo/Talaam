import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2 mb-4 md:mb-6 lg:mb-8 pt-2 md:pt-4">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-4 md:px-6 py-2 rounded-full font-roboto font-normal text-[16px] leading-[24px] transition-colors text-center flex items-center justify-center ${
          activeFilter === 'all'
            ? 'bg-[#EF4444] text-white'
            : 'bg-white border border-[#E5E7EB] text-blue-dark'
        }`}
      >
        {t('dashboard.review.filters.all')}
      </button>
      <button
        onClick={() => onFilterChange('test')}
        className={`px-4 md:px-6 py-2 rounded-full font-roboto font-normal text-[16px] leading-[24px] transition-colors text-center flex items-center justify-center ${
          activeFilter === 'test'
            ? 'bg-[#EF4444] text-white'
            : 'bg-white border border-[#E5E7EB] text-blue-dark'
        }`}
      >
        {t('dashboard.review.filters.testMode')}
      </button>
      <button
        onClick={() => onFilterChange('study')}
        className={`px-4 md:px-6 py-2 rounded-full font-roboto font-normal text-[16px] leading-[24px] transition-colors text-center flex items-center justify-center ${
          activeFilter === 'study'
            ? 'bg-[#EF4444] text-white'
            : 'bg-white border border-[#E5E7EB] text-blue-dark'
        }`}
      >
        {t('dashboard.review.filters.studyMode')}
      </button>
    </div>
  );
};

export default FilterButtons;
