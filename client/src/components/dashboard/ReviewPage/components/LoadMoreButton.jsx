import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const LoadMoreButton = ({ hasNextPage, onClick, className = '' }) => {
  const { t } = useLanguage();

  if (!hasNextPage) return null;

  return (
    <div className={`lg:hidden mb-4 ${className}`}>
      <button
        onClick={onClick}
        className="w-full px-4 py-3 bg-[#EF4444] text-white rounded-lg text-[16px] font-normal font-roboto leading-[24px] tracking-[0%] text-center hover:opacity-90 transition-opacity"
      >
        {t('dashboard.review.pagination.loadMore')}
      </button>
    </div>
  );
};

export default LoadMoreButton;
