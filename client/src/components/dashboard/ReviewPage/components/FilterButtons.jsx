import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const { t } = useLanguage();

  const options = [
    { value: 'all', label: t('dashboard.review.filters.all') },
    { value: 'test', label: t('dashboard.review.filters.testMode') },
    { value: 'study', label: t('dashboard.review.filters.studyMode') },
  ];

  return (
    <div className="flex gap-2 py-[6px] px-2  bg-white border border-[#E5E7EB] shadow-md shadow-[#0000001A] rounded-[14px]">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`px-[30px] py-[10px] rounded-[10px] text-[14px] font-medium transition-colors font-roboto leading-[21px] tracking-[0%] text-center ${
            activeFilter === option.value
              ? 'bg-gradient-to-b from-[#032746] to-[#173B50] text-white'
              : 'text-[#6A7282]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
