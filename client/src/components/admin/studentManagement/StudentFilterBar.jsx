import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { dropdownArrow } from "../../../assets/svg";
import Dropdown from "../../shared/Dropdown";
import plansAPI from "../../../api/plans";

const StudentFilterBar = ({
  searchValue,
  planValue,
  statusValue,
  dateValue,
  onSearchChange,
  onPlanChange,
  onStatusChange,
  onDateChange,
}) => {
  const { t } = useLanguage();
  const [planOptions, setPlanOptions] = useState([
    { value: "All", label: t('admin.studentManagement.filters.all') },
    { value: "Free", label: t('admin.studentManagement.filters.plans.free') },
  ]);
  
  // Fetch available plans on component mount and when language changes
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await plansAPI.getAllPlans({ status: 'active' });
        if (response.success && response.data?.plans) {
          // Start with "All" and "Free" options
          const options = [
            { value: "All", label: t('admin.studentManagement.filters.all') },
            { value: "Free", label: t('admin.studentManagement.filters.plans.free') },
          ];
          
          // Add all active plans from the database
          response.data.plans.forEach((plan) => {
            options.push({
              value: plan.name,
              label: plan.name, // Use plan name as-is (e.g., "Tahseely")
            });
          });
          
          setPlanOptions(options);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        // Keep default options on error
        setPlanOptions([
          { value: "All", label: t('admin.studentManagement.filters.all') },
          { value: "Free", label: t('admin.studentManagement.filters.plans.free') },
        ]);
      }
    };
    
    fetchPlans();
  }, [t]);
  
  const statusOptions = [
    { value: "All", label: t('admin.studentManagement.filters.all') },
    { value: "Active", label: t('admin.studentManagement.status.active') },
    { value: "Suspended", label: t('admin.studentManagement.status.suspended') },
  ];
  
  const dateOptions = [
    { value: "All", label: t('admin.studentManagement.filters.all') },
    { value: "Today", label: t('admin.studentManagement.filters.dateOptions.today') },
    { value: "This Week", label: t('admin.studentManagement.filters.dateOptions.thisWeek') },
    { value: "This Month", label: t('admin.studentManagement.filters.dateOptions.thisMonth') },
    { value: "This Year", label: t('admin.studentManagement.filters.dateOptions.thisYear') },
  ];

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const mobileFilterRef = useRef(null);

  useEffect(() => {
    if (!isMobileFiltersOpen) return undefined;

    const handleClickOutside = (event) => {
      if (mobileFilterRef.current && !mobileFilterRef.current.contains(event.target)) {
        setIsMobileFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileFiltersOpen]);

  const handleRefresh = () => {
    onSearchChange?.("");
    onPlanChange?.("");
    onStatusChange?.("");
    onDateChange?.("");
    setIsMobileFiltersOpen(false);
  };

  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 xl:gap-12">
      <label className="relative flex items-center w-full">
        <span className="sr-only">Search students</span>
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={t('admin.studentManagement.filters.searchPlaceholder')}
          className="h-[50px] w-full rounded-[14px] border border-transparent placeholder:text-dark-gray placeholder:text-sm bg-white pl-12 pr-4 text-base font-roboto text-oxford-blue shadow-filter focus:border-[#032746] focus:outline-none focus:ring-2 focus:ring-[#D6E3F0]"
        />
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
        >
          <path
            d="M9.42969 0.25C14.4866 0.25024 18.6084 4.28232 18.6084 9.25C18.6084 11.3724 17.8507 13.3211 16.5938 14.8604L20.3496 18.541C20.7482 18.9316 20.7483 19.5667 20.3496 19.957C20.1511 20.1529 19.8915 20.25 19.6338 20.25C19.3755 20.2499 19.1156 20.1526 18.918 19.959L15.1562 16.2715C13.5849 17.5066 11.5952 18.2499 9.42969 18.25C4.37258 18.25 0.25 14.2178 0.25 9.25C0.25 4.28217 4.37258 0.25 9.42969 0.25ZM9.42969 2.25C5.48306 2.25 2.28027 5.39483 2.28027 9.25C2.28027 13.1052 5.48306 16.25 9.42969 16.25C13.3761 16.2498 16.5781 13.105 16.5781 9.25C16.5781 5.39497 13.3761 2.25024 9.42969 2.25Z"
            fill="#032746"
            stroke="#032746"
            strokeWidth="0.5"
          />
        </svg>
      </label>

      {/* Mobile filter trigger */}
      <div className="relative flex justify-start lg:hidden" ref={mobileFilterRef}>
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
          className="flex h-[48px] min-w-[150px] items-center justify-between rounded-[14px] border border-transparent bg-white px-4 text-[16px] font-archivo font-semibold text-oxford-blue shadow-filter-hover focus:border-[#032746] focus:outline-none focus:ring-2 focus:ring-[#D6E3F0]"
          aria-expanded={isMobileFiltersOpen}
        >
          <span className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.33329 15.8332V11.6665H11.6666V15.8332C11.6666 16.2915 12.0416 16.6665 12.4999 16.6665H14.1666C14.6249 16.6665 14.9999 16.2915 14.9999 15.8332V10.7498H16.2083C16.9583 10.7498 17.3333 9.8248 16.7916 9.28314L11.2916 3.78314C10.9166 3.3998 10.2916 3.3998 9.91662 3.78314L4.41662 9.28314C3.87495 9.8248 4.24995 10.7498 4.99995 10.7498H6.20829V15.8332C6.20829 16.2915 6.58329 16.6665 7.04162 16.6665H8.70829C9.16662 16.6665 9.54162 16.2915 9.54162 15.8332H8.33329Z"
                fill="#032746"
              />
            </svg>
            {t('admin.studentManagement.filters.filter')}
          </span>
          <img src={dropdownArrow} alt="" />
        </button>

        {isMobileFiltersOpen ? (
          <div className="absolute right-0 top-full z-20 mt-3 w-[250px] rounded-[18px] border border-[#E5E7EB] bg-white p-4 shadow-dropdown">
            <div className="flex flex-col gap-4 text-oxford-blue">
              <section className="flex flex-col gap-2">
                <p className="text-[13px] font-archivo font-semibold uppercase tracking-[0.08em] text-dark-gray">
                  {t('admin.studentManagement.filters.plan')}
                </p>
                <div className="flex flex-col gap-2">
                  {planOptions
                    .filter((option) => option.value !== "All")
                    .map((option) => {
                      const isChecked = planValue === option.value;
                      return (
                        <label key={option.value} className="flex items-center gap-2 text-[14px] font-roboto">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onPlanChange?.(isChecked ? "" : option.value)}
                            className="h-4 w-4 rounded border border-[#9CA3AF] text-[#ED4122] focus:ring-[#ED4122]"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                </div>
              </section>

              <section className="flex flex-col gap-2">
                <p className="text-[13px] font-archivo font-semibold uppercase tracking-[0.08em] text-dark-gray">
                  {t('admin.studentManagement.filters.status')}
                </p>
                <div className="flex flex-col gap-2">
                  {statusOptions
                    .filter((option) => option.value !== "All")
                    .map((option) => {
                      const isChecked = statusValue === option.value;
                      return (
                        <label key={option.value} className="flex items-center gap-2 text-[14px] font-roboto">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onStatusChange?.(isChecked ? "" : option.value)}
                            className="h-4 w-4 rounded border border-[#9CA3AF] text-[#ED4122] focus:ring-[#ED4122]"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                </div>
              </section>

              <section className="flex flex-col gap-2">
                <p className="text-[13px] font-archivo font-semibold uppercase tracking-[0.08em] text-dark-gray">
                  {t('admin.studentManagement.filters.date')}
                </p>
                <div className="flex flex-col gap-2">
                  {dateOptions
                    .filter((option) => option.value !== "All")
                    .map((option) => {
                      const isChecked = dateValue === option.value;
                      return (
                        <label key={option.value} className="flex items-center gap-2 text-[14px] font-roboto">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onDateChange?.(isChecked ? "" : option.value)}
                            className="h-4 w-4 rounded border border-[#9CA3AF] text-[#ED4122] focus:ring-[#ED4122]"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                </div>
              </section>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleRefresh}
                className="h-[44px] rounded-[12px] border border-[#032746] bg-white text-[15px] font-archivo font-semibold text-oxford-blue transition hover:bg-[#F2F5FA]"
              >
                {t('admin.studentManagement.filters.refresh')}
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="h-[44px] rounded-[12px] bg-[#ED4122] text-[15px] font-archivo font-semibold text-white transition hover:bg-[#d43a1f]"
              >
                {t('admin.studentManagement.filters.applyFilters')}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Desktop / tablet filters */}
      <div className="hidden lg:flex lg:flex-row lg:items-center lg:gap-3 xl:gap-5 lg:flex-wrap 2xl:flex-nowrap lg:flex-shrink">
        <div className="flex-shrink-0 w-[180px]">
          <Dropdown
            label={t('admin.studentManagement.filters.plan')}
            value={planValue || ""}
            options={planOptions}
            onChange={(value) => {
              if (value === "All") {
                onPlanChange?.("");
              } else {
                onPlanChange?.(value);
              }
            }}
            placeholder={t('admin.studentManagement.filters.plan')}
            showDefaultOnEmpty={false}
            className="!w-full"
            height="h-[50px]"
          />
        </div>
        <div className="flex-shrink-0 w-[180px]">
          <Dropdown
            label={t('admin.studentManagement.filters.status')}
            value={statusValue || ""}
            options={statusOptions}
            onChange={(value) => {
              if (value === "All") {
                onStatusChange?.("");
              } else {
                onStatusChange?.(value);
              }
            }}
            placeholder={t('admin.studentManagement.filters.status')}
            showDefaultOnEmpty={false}
            className="!w-full"
            height="h-[50px]"
          />
        </div>
        <div className="flex-shrink-0 w-[180px]">
          <Dropdown
            label={t('admin.studentManagement.filters.date')}
            value={dateValue || ""}
            options={dateOptions}
            onChange={(value) => {
              if (value === "All") {
                onDateChange?.("");
              } else {
                onDateChange?.(value);
              }
            }}
            placeholder={t('admin.studentManagement.filters.date')}
            showDefaultOnEmpty={false}
            className="!w-full"
            height="h-[50px]"
          />
        </div>
      </div>
    </section>
  );
};

export default StudentFilterBar;

