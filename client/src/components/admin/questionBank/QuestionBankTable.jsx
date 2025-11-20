import React from "react";
import { useLanguage } from "../../../context/LanguageContext";

const statusTone = {
  Active: {
    wrapper: "bg-[#FDF0D5]",
    text: "text-[#ED4122]",
  },
  Pending: {
    wrapper: "bg-[#ED4122]",
    text: "text-white",
  },
  Inactive: {
    wrapper: "bg-[#C6D8D3]",
    text: "text-oxford-blue",
  },
  Rejected: {
    wrapper: "bg-[#F4D7D7]",
    text: "text-[#B91C1C]",
  },
};

const getHeaderConfig = (t) => [
  { label: t('admin.questionBank.table.headers.question'), widthClass: "min-w-[67px]" },
  { label: t('admin.questionBank.table.headers.subject'), widthClass: "min-w-[75px]" },
  { label: t('admin.questionBank.table.headers.topic'), widthClass: "min-w-[49px]" },
  { label: t('admin.questionBank.table.headers.level'), widthClass: "min-w-[50px]" },
  { label: t('admin.questionBank.table.headers.createdBy'), widthClass: "min-w-[101px]" },
  { label: t('admin.questionBank.table.headers.status'), widthClass: "min-w-[62px]" },
  { label: t('admin.questionBank.table.headers.actions'), widthClass: "min-w-[72px]" },
];

const TableHeader = ({ t }) => {
  const headerConfig = getHeaderConfig(t);
  return (
    <thead className="hidden md:table-header-group">
      <tr className="bg-oxford-blue text-left">
        {headerConfig.map((column) => (
          <th
            key={column.label}
            className={`px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white ${column.widthClass}`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableRow = ({ question, onView, t }) => {
  const tone = statusTone[question.status] ?? statusTone.Active;
  const headerConfig = getHeaderConfig(t);

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row">
      <td className={`px-6 py-4 text-left align-top ${headerConfig[0].widthClass}`}>
        <div className="w-[218px]">
          <p className="text-[12px] font-roboto leading-[16px] text-oxford-blue break-words">
          {question.prompt}
        </p>
        {question.type && (
          <p className="pt-1 text-[10px] font-roboto leading-[16px] text-dark-gray">
            {t('admin.questionBank.table.type')}: {question.type}
          </p>
        )}
        </div>
      </td>
      <td className={`px-6 py-4 text-[14px] font-roboto leading-[16px] text-oxford-blue ${headerConfig[1].widthClass} whitespace-nowrap`}>
        {question.subject}
      </td>
      <td className={`px-6 py-4 text-[14px] font-roboto leading-[16px] text-oxford-blue ${headerConfig[2].widthClass} whitespace-nowrap`}>
        {question.topic}
      </td>
      <td className={`px-6 py-4 text-[14px] font-roboto leading-[16px] text-oxford-blue ${headerConfig[3].widthClass} whitespace-nowrap`}>
        {question.level}
      </td>
      <td className={`px-6 py-4 text-[14px] font-roboto leading-[16px] text-oxford-blue ${headerConfig[4].widthClass} whitespace-nowrap`}>
        {question.createdBy}
      </td>
      <td className={`px-6 py-4 ${headerConfig[5].widthClass}`}>
        <span
          className={`inline-flex h-[22px] items-center justify-center rounded-[6px] px-2.5 text-[12px] font-roboto font-normal uppercase tracking-[0%] ${tone.wrapper} ${tone.text}`}
        >
          {question.status}
        </span>
      </td>
      <td className={`px-6 py-4 ${headerConfig[6].widthClass}`}>
        <button
          type="button"
          onClick={() => onView?.(question)}
          className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
          aria-label={t('admin.questionBank.table.ariaLabels.view').replace('{{prompt}}', question.prompt)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1 1 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5s8.577 3.01 9.964 7.178a1 1 0 0 1 0 .644C20.577 16.49 16.64 19.5 12 19.5s-8.577-3.01-9.964-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

const MobileQuestionCard = ({ question, onView, t }) => {
  const tone = statusTone[question.status] ?? statusTone.Active;

  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 text-oxford-blue shadow-empty md:hidden">
      <div className="space-y-2">
        <p className="text-[16px] font-archivo font-semibold leading-[20px]">
          {question.prompt}
        </p>
        {question.type && (
          <p className="text-[12px] font-roboto leading-[16px] text-dark-gray">
            {t('admin.questionBank.table.type')}: {question.type}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 text-[14px] font-roboto leading-[18px] text-[#1F2937]">
        <div>
          <p className="text-dark-gray">{t('admin.questionBank.table.headers.subject')}</p>
          <p>{question.subject}</p>
        </div>
        <div>
          <p className="text-dark-gray">{t('admin.questionBank.table.headers.topic')}</p>
          <p>{question.topic}</p>
        </div>
        <div>
          <p className="text-dark-gray">{t('admin.questionBank.table.headers.level')}</p>
          <p>{question.level}</p>
        </div>
        <div>
          <p className="text-dark-gray">{t('admin.questionBank.table.headers.createdBy')}</p>
          <p>{question.createdBy}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span
          className={`inline-flex h-[28px] min-w-[62px] items-center justify-center rounded-md px-3 text-xs font-semibold ${tone.wrapper} ${tone.text}`}
        >
          {question.status}
        </span>
        <button
          type="button"
          onClick={() => onView?.(question)}
          className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
          aria-label={t('admin.questionBank.table.ariaLabels.view').replace('{{prompt}}', question.prompt)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1 1 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5s8.577 3.01 9.964 7.178a1 1 0 0 1 0 .644C20.577 16.49 16.64 19.5 12 19.5s-8.577-3.01-9.964-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            />
          </svg>
        </button>
      </div>
    </article>
  );
};

const Pagination = ({ page, pageSize, total, onPageChange, t }) => {
  const totalPages = Math.ceil(total / pageSize);
  const safeTotalPages = Math.max(totalPages, 1);
  const firstItem = total ? (page - 1) * pageSize + 1 : 0;
  const lastItem = total ? Math.min(page * pageSize, total) : 0;

  const handlePrev = () => {
    if (page > 1) onPageChange?.(page - 1);
  };

  const handleNext = () => {
    if (page < safeTotalPages) onPageChange?.(page + 1);
  };

  const pages = Array.from({ length: safeTotalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 text-oxford-blue md:flex-row md:items-center md:justify-between md:bg-oxford-blue md:px-6 md:text-white">
      <p className="text-[12px] font-roboto font-medium leading-[18px] tracking-[3%]">
        {t('admin.questionBank.table.pagination.showing')
          .replace('{{first}}', firstItem)
          .replace('{{last}}', lastItem)
          .replace('{{total}}', total)}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page === 1}
          className={`flex h-[30px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-medium leading-[16px] transition-colors ${
            page === 1
              ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
              : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
          }`}
        >
          {t('admin.questionBank.table.pagination.previous')}
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange?.(pageNumber)}
            className={`flex h-[30px] w-8 items-center justify-center rounded border text-[14px] font-archivo font-medium leading-[16px] transition-colors ${
              pageNumber === page
                ? "border-[#ED4122] bg-[#ED4122] text-white"
                : "border-[#E5E7EB] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-[#032746]"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          onClick={handleNext}
          disabled={page === safeTotalPages}
          className={`flex h-[30px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-medium leading-[16px] transition-colors ${
            page === safeTotalPages
              ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
              : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
          }`}
        >
          {t('admin.questionBank.table.pagination.next')}
        </button>
      </div>
    </div>
  );
};

const QuestionBankTable = ({
  questions,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
}) => {
  const { t } = useLanguage();
  
  return (
    <section className="w-full overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard md:min-h-[348px]">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse">
          <TableHeader t={t} />
          <tbody>
            {questions.length ? (
              questions.map((question) => (
                <TableRow key={question.id} question={question} onView={onView} t={t} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-dark-gray"
                >
                  {t('admin.questionBank.table.emptyState')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 p-2 md:hidden">
        {questions.length ? (
          questions.map((question) => (
            <MobileQuestionCard
              key={question.id}
              question={question}
              onView={onView}
              t={t}
            />
          ))
        ) : (
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-dark-gray shadow-empty">
            {t('admin.questionBank.table.emptyState')}
          </div>
        )}
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        t={t}
      />
    </section>
  );
};

QuestionBankTable.defaultProps = {
  questions: [],
  page: 1,
  pageSize: 10,
  total: 0,
};

export default QuestionBankTable;


