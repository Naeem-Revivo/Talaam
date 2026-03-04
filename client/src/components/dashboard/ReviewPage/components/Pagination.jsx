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
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Left Arrow Button */}
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={!hasPreviousPage}
        className={`w-10 h-10 rounded-[14px] border transition-colors flex items-center justify-center shadow-sm ${
          !hasPreviousPage
            ? 'bg-[#F3F4F6] border-none cursor-not-allowed'
            : 'bg-white border-[#E5E7EB] hover:bg-gray-50'
        }`}
        aria-label="Previous page"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke={!hasPreviousPage ? '#99A1AF' : '#364153'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Page Number Buttons */}
      {pagesToShow.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`w-10 h-10 rounded-[14px] border text-[14px] font-medium font-roboto leading-[20px] tracking-[0%] transition-colors flex items-center justify-center shadow-sm ${
            page === pageNum
              ? 'bg-gradient-to-r from-[#F54900] to-[#ED4122] shadow-sm shadow-[#ED412233]  text-white border-[#EF4444]'
              : 'bg-white border-[#E5E7EB] text-[#364153] hover:bg-gray-50'
          }`}
          aria-label={`Page ${pageNum}`}
        >
          {pageNum}
        </button>
      ))}

      {/* Right Arrow Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={!hasNextPage}
        className={`w-10 h-10 rounded-[14px] border transition-colors flex items-center justify-center shadow-sm ${
          !hasNextPage
            ? 'bg-[#F3F4F6] border-none cursor-not-allowed'
            : 'bg-white border-[#E5E7EB] hover:bg-gray-50'
        }`}
        aria-label="Next page"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke={!hasNextPage ? '#99A1AF' : '#364153'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
