import React from "react";
import { useLanguage } from "../../../context/LanguageContext";

const selectClasses =
  "h-[44px] w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[16px] font-archivo font-semibold leading-[16px] text-oxford-blue transition focus:border-[#032746] focus:outline-none focus:ring-2 focus:ring-[#032746]/10";

const inputClasses =
  "h-[50px] w-full rounded-[12px] border border-[#E5E7EB] bg-white pl-[52px] pr-[112px] text-[14px] font-roboto leading-[16px] text-oxford-blue transition placeholder:text-[#9CA3AF] focus:border-[#032746] focus:outline-none focus:ring-2 focus:ring-[#032746]/10 md:w-[537px]";

const QuestionBankFilters = ({
  searchValue,
  filters,
  onSearchChange,
  onFilterChange,
  onReset,
  examOptions,
  subjectOptions,
  topicOptions,
  levelOptions,
  statusOptions,
  children,
}) => {
  const { t } = useLanguage();
  
  return (
    <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-filter-lg md:gap-6 min-h-[326px]">
      <div className="relative flex justify-start">
        <span className="pointer-events-none absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-oxford-blue">
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.25 0.25C14.2131 0.25 18.25 4.28693 18.25 9.25C18.25 11.3719 17.5072 13.3207 16.2744 14.8604L19.957 18.543C20.3472 18.9332 20.3465 19.5651 19.9561 19.9551L19.957 19.9561C19.7619 20.1525 19.5053 20.25 19.25 20.25C18.9939 20.25 18.7374 20.1514 18.543 19.957L14.8604 16.2744C13.3207 17.5072 11.3719 18.25 9.25 18.25C4.28693 18.25 0.25 14.2131 0.25 9.25C0.25 4.28693 4.28693 0.25 9.25 0.25ZM9.25 2.25C5.39007 2.25 2.25 5.39007 2.25 9.25C2.25 13.1099 5.39007 16.25 9.25 16.25C13.1099 16.25 16.25 13.1099 16.25 9.25C16.25 5.39007 13.1099 2.25 9.25 2.25Z"
              fill="#032746"
              stroke="#032746"
              strokeWidth="0.5"
            />
          </svg>
        </span>
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={t('admin.questionBank.filters.searchPlaceholder')}
          className={inputClasses}
        />
        <button
          type="button"
          onClick={onReset}
          className="absolute right-3 top-1/2 hidden h-[30px] w-[120px] -translate-y-1/2 items-center justify-center rounded-full bg-[#FDF0D5] text-[14px] font-roboto font-medium leading-[16px] text-[#ED4122] transition md:flex"
        >
          {t('admin.questionBank.filters.resetFilter')}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 md:flex-nowrap">
        <div className="w-full md:w-[350px]">
          <select
            value={filters.exam}
            onChange={(event) => onFilterChange?.("exam", event.target.value)}
            className={`${selectClasses} h-[50px]`}
          >
            <option value="" >{t('admin.questionBank.filters.exam')}</option>
            {examOptions.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-[150px] ml-12">
          <select
            value={filters.subject}
            onChange={(event) => onFilterChange?.("subject", event.target.value)}
            className={`${selectClasses} h-[50px]`}
          >
            <option value="">{t('admin.questionBank.filters.subject')}</option>
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-[150px]">
          <select
            value={filters.topic}
            onChange={(event) => onFilterChange?.("topic", event.target.value)}
            className={`${selectClasses} h-[50px]`}
          >
            <option value="">{t('admin.questionBank.filters.topic')}</option>
            {topicOptions.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-[150px]">
          <select
            value={filters.level}
            onChange={(event) => onFilterChange?.("level", event.target.value)}
            className={`${selectClasses} h-[50px]`}
          >
            <option value="">{t('admin.questionBank.filters.cognitiveLevel')}</option>
            {levelOptions.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-[150px]">
          <select
            value={filters.status}
            onChange={(event) => onFilterChange?.("status", event.target.value)}
            className={`${selectClasses} h-[50px]`}
          >
            <option value="">{t('admin.questionBank.filters.status')}</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="flex h-[44px] items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6] md:hidden"
      >
        {t('admin.questionBank.filters.resetFilter')}
      </button>
      {children}
    </section>
  );
};

QuestionBankFilters.defaultProps = {
  filters: {
    exam: "",
    subject: "",
    topic: "",
    level: "",
    status: "",
  },
  examOptions: [],
  subjectOptions: [],
  topicOptions: [],
  levelOptions: [],
  statusOptions: [],
  children: null,
};

export default QuestionBankFilters;


