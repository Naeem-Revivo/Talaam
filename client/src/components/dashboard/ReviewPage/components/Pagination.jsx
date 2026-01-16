import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const Pagination = ({ pagination, onPageChange, className = '' }) => {
  const { t } = useLanguage();
  const { totalPages, page, limit, totalItems, hasNextPage, hasPreviousPage } = pagination;

  if (totalPages === 0) return null;

  // Calculate which page numbers to show
  const pagesToShow = [];
  const maxPagesToShow = 5;
  
  if (totalPages <= maxPagesToShow) {
    // Show all pages if total is less than max
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
  } else {
    // Show pages around current page
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }
  }

  return (
    <div className={`flex bg-oxford-blue text-white rounded-lg ${className} px-4 md:px-6 items-center justify-between gap-2 md:gap-4 w-full max-w-[1120px] min-h-[46.8px] flex-col md:flex-row py-3 md:py-0`}>
      <div className="text-[12px] font-medium font-roboto text-white leading-[18px] tracking-[3%] whitespace-nowrap mb-2 md:mb-0">
        {t('dashboard.review.pagination.showing')
          .replace('{{from}}', ((page - 1) * limit + 1).toString())
          .replace('{{to}}', Math.min(page * limit, totalItems).toString())
          .replace('{{total}}', totalItems.toString())}
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={!hasPreviousPage}
          className={`w-[78px] h-[27.16px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
            !hasPreviousPage
              ? 'bg-white/20 text-white/70 cursor-not-allowed border-transparent'
              : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
          }`}
        >
          {t('dashboard.review.pagination.previous')}
        </button>
        {pagesToShow.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-[32px] h-[32px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
              page === pageNum
                ? 'bg-[#EF4444] text-white border-[#EF4444]'
                : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
            }`}
          >
            {pageNum}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={!hasNextPage}
          className={`w-[78px] h-[27.16px] rounded text-[14px] font-medium font-roboto leading-[16px] tracking-[0%] transition-colors border flex items-center justify-center ${
            !hasNextPage
              ? 'bg-white/20 text-white/70 cursor-not-allowed border-transparent'
              : 'bg-white text-oxford-blue border-[#032746] hover:opacity-90'
          }`}
        >
          {t('dashboard.review.pagination.next')}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
