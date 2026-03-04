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

          {/* View Toggle */}
          <ViewToggle viewType={viewType} onViewChange={onViewChange} />
        </div>
      </div>
    </div>
  );
};

export default ReviewPageHeader;
