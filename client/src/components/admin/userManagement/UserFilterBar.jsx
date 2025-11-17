import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { dropdownArrow } from "../../../assets/svg";

const UserFilterBar = ({
  searchValue,
  statusValue,
  roleValue,
  onSearchChange,
  onStatusChange,
  onRoleChange,
}) => {
  const { t } = useLanguage();
  
  const statusOptions = [
    { value: "All", label: t('admin.userManagement.status.all') },
    { value: "Active", label: t('admin.userManagement.status.active') },
    { value: "Suspended", label: t('admin.userManagement.status.suspended') },
  ];
  
  const roleOptions = [
    { value: "All", label: t('admin.userManagement.status.all') },
    { value: "Question Gatherer", label: t('admin.userManagement.roles.questionGatherer') },
    { value: "Question Creator", label: t('admin.userManagement.roles.questionCreator') },
    { value: "Processor", label: t('admin.userManagement.roles.processor') },
    { value: "Question Explainer", label: t('admin.userManagement.roles.questionExplainer') },
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

  const handleStatusToggle = (value) => {
    if (value === "All") {
      onStatusChange?.("");
      return;
    }
    const newValue = statusValue === value ? "" : value;
    onStatusChange?.(newValue);
  };

  const handleRoleToggle = (value) => {
    if (value === "All") {
      onRoleChange?.("");
      return;
    }
    const newValue = roleValue === value ? "" : value;
    onRoleChange?.(newValue);
  };
  
  const getStatusLabel = (value) => {
    const option = statusOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };
  
  const getRoleLabel = (value) => {
    const option = roleOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const handleRefresh = () => {
    onSearchChange?.("");
    onStatusChange?.("");
    onRoleChange?.("");
    setIsMobileFiltersOpen(false);
  };

  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
      <label className="relative flex items-center">
        <span className="sr-only">Search users</span>
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={t('admin.userManagement.filters.searchPlaceholder')}
          className="h-[50px] w-full rounded-[14px] border border-transparent placeholder:text-dark-gray placeholder:text-sm bg-white pl-12 pr-4 text-base font-roboto text-oxford-blue shadow-filter focus:border-[#032746] focus:outline-none focus:ring-2 focus:ring-[#D6E3F0] md:w-[548px]"
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
            {t('admin.userManagement.filters.filter')}
          </span>
          <img src={dropdownArrow} alt="" />
        </button>

        {isMobileFiltersOpen ? (
          <div className="absolute right-0 top-full z-20 mt-3 w-[250px] rounded-[18px] border border-[#E5E7EB] bg-white p-4 shadow-dropdown">
            <div className="flex flex-col gap-4 text-oxford-blue">
              <section className="flex flex-col gap-2">
                <p className="text-[13px] font-archivo font-semibold uppercase tracking-[0.08em] text-dark-gray">
                  {t('admin.userManagement.filters.status')}
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
                            onChange={() => handleStatusToggle(option.value)}
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
                  {t('admin.userManagement.filters.role')}
                </p>
                <div className="flex flex-col gap-2">
                  {roleOptions
                    .filter((option) => option.value !== "All")
                    .map((option) => {
                      const isChecked = roleValue === option.value;
                      return (
                        <label key={option.value} className="flex items-center gap-2 text-[14px] font-roboto">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleRoleToggle(option.value)}
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
                {t('admin.userManagement.filters.refresh')}
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="h-[44px] rounded-[12px] bg-[#ED4122] text-[15px] font-archivo font-semibold text-white transition hover:bg-[#d43a1f]"
              >
                {t('admin.userManagement.filters.applyFilters')}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Desktop / tablet filters */}
      <div className="hidden flex-row items-center gap-5 lg:flex">
        <label className="relative flex w-[220px] items-center xl:w-[240px]">
          <span className="sr-only">Filter by status</span>
          <select
            value={statusValue}
            onChange={(event) => onStatusChange?.(event.target.value)}
            className="h-[50px] w-full appearance-none rounded-[14px] border border-transparent bg-white px-4 pr-10 text-[16px] font-archivo font-semibold text-oxford-blue shadow-filter-hover focus:border-[#032746] focus:outline-none focus:ring-2 focus:ring-[#D6E3F0]"
          >
            <option value="" disabled hidden>
              {t('admin.userManagement.filters.status')}
            </option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            width="15"
            height="9"
            viewBox="0 0 15 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          >
            <path d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562" stroke="#032746" strokeWidth="2" />
          </svg>
        </label>
        <label className="relative flex w-[220px] items-center xl:w-[240px]">
          <span className="sr-only">Filter by role</span>
          <select
            value={roleValue}
            onChange={(event) => onRoleChange?.(event.target.value)}
            className="h-[50px] w-full appearance-none rounded-[14px] border border-transparent bg-white px-4 pr-10 text-[16px] font-archivo font-semibold text-oxford-blue shadow-filter-hover focus:border-[#032746] focus:outline-none focus:ring-2 focus:ring-[#D6E3F0]"
          >
            <option value="" disabled hidden>
              {t('admin.userManagement.filters.role')}
            </option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            width="15"
            height="9"
            viewBox="0 0 15 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
          >
            <path d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562" stroke="#032746" strokeWidth="2" />
          </svg>
        </label>
      </div>
    </section>
  );
};

export default UserFilterBar;


