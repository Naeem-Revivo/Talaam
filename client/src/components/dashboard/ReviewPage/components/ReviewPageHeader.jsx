import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import FilterButtons from './FilterButtons';
import ViewToggle from './ViewToggle';

const ReviewPageHeader = ({
  activeFilter,
  onFilterChange,
  viewType,
  onViewChange,
  pagination,
  searchQuery,
  onSearchChange,
  onFilterClick
}) => {
  const { t } = useLanguage();
  const { totalItems, page, limit } = pagination || { totalItems: 0, page: 1, limit: 6 };
  const from = totalItems > 0 ? (page - 1) * limit + 1 : 0;
  const to = Math.min(page * limit, totalItems);

  return (
    <div className="mb-4">
      <p className="font-roboto font-normal text-base text-dashboard-gray mb-8">
        {t('dashboard.review.hero.subtitle') || 'Revisit any past practice set to reinforce your learning.'}
      </p>

      {/* Filter Buttons Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <FilterButtons activeFilter={activeFilter} onFilterChange={onFilterChange} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
          {/* Results Count */}
          {totalItems > 0 && (
            <div className="text-xs font-roboto font-normal text-dashboard-gray whitespace-nowrap">
              Showing {from} to {to} of {totalItems} results
            </div>
          )}

          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial min-w-[200px]">
            <input
              type="text"
              placeholder="Search by mode, or date..."
              value={searchQuery || ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full px-4 py-2 pl-10 border h-[45px] border-[#D4D4D4] rounded-[12px] text-[14px] font-roboto text-dashboard-gray placeholder:text-dashboard-gray focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 14L11.1333 11.1333M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z" stroke="#737373" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </div>

          {/* Filter Button */}
          <button
            onClick={onFilterClick}
            className="px-4 py-2 border border-[#D4D4D4] rounded-[10px] bg-white text-orange-dark text-[14px] font-roboto font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.66659 13.3333C6.66653 13.4572 6.701 13.5787 6.76612 13.6841C6.83124 13.7895 6.92443 13.8746 7.03526 13.93L8.36859 14.5967C8.47025 14.6475 8.58322 14.6714 8.69675 14.6663C8.81029 14.6612 8.92062 14.6271 9.01728 14.5673C9.11393 14.5075 9.1937 14.424 9.249 14.3247C9.30431 14.2254 9.33331 14.1137 9.33326 14V9.33333C9.33341 9.00292 9.45623 8.68433 9.67792 8.43933L14.4933 3.11333C14.5796 3.01771 14.6363 2.89912 14.6567 2.77192C14.677 2.64472 14.66 2.51435 14.6079 2.39658C14.5557 2.27881 14.4705 2.17868 14.3626 2.1083C14.2547 2.03792 14.1287 2.0003 13.9999 2H1.99992C1.87099 2.00005 1.74484 2.03748 1.63676 2.10776C1.52867 2.17804 1.44328 2.27815 1.39093 2.39598C1.33858 2.5138 1.32151 2.64427 1.34181 2.77159C1.3621 2.89892 1.41887 3.01762 1.50526 3.11333L6.32192 8.43933C6.54361 8.68433 6.66644 9.00292 6.66659 9.33333V13.3333Z" stroke="#ED4122" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            Filter
          </button>

          {/* View Toggle */}
          <ViewToggle viewType={viewType} onViewChange={onViewChange} />
        </div>
      </div>
    </div>
  );
};

export default ReviewPageHeader;
