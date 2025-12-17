import React, { useMemo } from "react";
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
  Approved: {
    wrapper: "bg-[#E8F7F0]",
    text: "text-[#10B981]",
  },
  Rejected: {
    wrapper: "bg-[#F4D7D7]",
    text: "text-[#B91C1C]",
  },
  "Sent Back": {
    wrapper: "bg-[#FEF3C7]",
    text: "text-[#D97706]",
  },
};

// Fixed: Memoize the header config to prevent recreation on every render
const useHeaderConfig = (t) => {
  return useMemo(() => [
    { label: t('admin.questionBank.table.headers.question'), widthClass: "min-w-[67px]", key: "question" },
    { label: t('admin.questionBank.table.headers.subject'), widthClass: "min-w-[75px]", key: "subject" },
    { label: t('admin.questionBank.table.headers.topic'), widthClass: "min-w-[49px]", key: "topic" },
    { label: t('admin.questionBank.table.headers.createdBy'), widthClass: "min-w-[101px]", key: "createdBy" },
    { label: t('admin.questionBank.table.headers.flags') || "Flags", widthClass: "min-w-[60px]", key: "flags" },
    { label: t('admin.questionBank.table.headers.lastAction') || "Last Action", widthClass: "min-w-[150px]", key: "lastAction" },
    { label: t('admin.questionBank.table.headers.status'), widthClass: "min-w-[62px]", key: "status" },
    { label: t('admin.questionBank.table.headers.actions'), widthClass: "min-w-[72px]", key: "actions" },
  ], [t]);
};

const TableHeader = ({ t, dir }) => {
  const headerConfig = useHeaderConfig(t);
  const textAlign = dir === 'rtl' ? 'text-right' : 'text-left';
  
  return (
    <thead className="hidden md:table-header-group">
      <tr className="bg-oxford-blue">
        {headerConfig.map((column) => (
          <th
            key={column.key}
            className={`px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white ${column.widthClass} ${textAlign}`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableRow = ({ question, onView, t, dir }) => {
  const tone = statusTone[question.status] ?? statusTone.Pending;
  const headerConfig = useHeaderConfig(t);
  const textAlign = dir === 'rtl' ? 'text-right' : 'text-left';

  // Format last action
  const formatLastAction = () => {
    if (!question.lastAction) return "—";
    const { action, by, when } = question.lastAction;
    const actionText = action || "N/A";
    return `${actionText} by ${by} on ${when}`;
  };

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row">
      <td className={`px-6 py-4 align-top ${headerConfig[0].widthClass} ${textAlign}`}>
        <div className={`w-[218px] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <p 
            className="text-[12px] font-roboto leading-[16px] text-oxford-blue break-words"
            dir="ltr"
            style={{ wordBreak: 'break-word', lineHeight: '1.4' }}
          >
            {question.prompt}
          </p>
          {question.type && (
            <p 
              className="pt-1 text-[10px] font-roboto leading-[16px] text-dark-gray"
              dir={dir}
            >
              {t('admin.questionBank.table.type')}: {question.type}
            </p>
          )}
        </div>
      </td>
      <td className={`px-6 py-4 text-[14px] font-roboto leading-[16px] text-oxford-blue ${headerConfig[1].widthClass} whitespace-nowrap ${textAlign}`}>
        {question.subject}
      </td>
      <td className={`px-6 py-4 text-[14px] font-roboto leading-[16px] text-oxford-blue ${headerConfig[2].widthClass} whitespace-nowrap ${textAlign}`}>
        {question.topic}
      </td>
      <td className={`px-6 py-4 text-[14px] font-roboto leading-[16px] text-oxford-blue ${headerConfig[3].widthClass} whitespace-nowrap ${textAlign}`}>
        {question.createdBy}
      </td>
      <td className={`px-6 py-4 text-center ${headerConfig[4].widthClass}`}>
        {question.isFlagged ? (
          <span className="text-[18px]" title={question.flagReason || "Flagged"}>🚩</span>
        ) : (
          <span className="text-[14px] text-gray-400">—</span>
        )}
      </td>
      <td className={`px-6 py-4 text-[12px] font-roboto leading-[16px] text-oxford-blue ${headerConfig[5].widthClass} ${textAlign}`}>
        <div className="max-w-[200px]">
          {question.lastAction ? (
            <div className="space-y-1">
              <p className="text-oxford-blue">
                {question.lastAction.action || "N/A"}
              </p>
              <p className="text-dark-gray text-[11px]">
                by {question.lastAction.by || "N/A"} on {question.lastAction.when || "N/A"}
              </p>
            </div>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </div>
      </td>
      <td className={`px-6 py-4 ${headerConfig[6].widthClass} ${textAlign}`}>
        <span
          className={`inline-flex h-[22px] items-center justify-center rounded-[6px] px-2.5 text-[12px] font-roboto font-normal uppercase tracking-[0%] ${tone.wrapper} ${tone.text}`}
        >
          {question.status}
        </span>
      </td>
      <td className={`px-6 py-4 ${headerConfig[7].widthClass} ${textAlign}`}>
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

const MobileQuestionCard = ({ question, onView, t, dir }) => {
  const tone = statusTone[question.status] ?? statusTone.Pending;
  const textAlign = dir === 'rtl' ? 'text-right' : 'text-left';

  return (
    <article 
      className="flex flex-col gap-4 rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 text-oxford-blue shadow-empty md:hidden"
      dir={dir}
    >
      <div className={`space-y-2 ${textAlign}`}>
        <p 
          className="text-[16px] font-archivo font-semibold leading-[20px] break-words"
          style={{ wordBreak: 'break-word', lineHeight: '1.4' }}
        >
          {question.prompt}
        </p>
        {question.type && (
          <p className="text-[12px] font-roboto leading-[16px] text-dark-gray">
            {t('admin.questionBank.table.type')}: {question.type}
          </p>
        )}
      </div>
      <div className={`grid grid-cols-2 gap-3 text-[14px] font-roboto leading-[18px] text-[#1F2937] ${textAlign}`}>
        <div>
          <p className="text-dark-gray">{t('admin.questionBank.table.headers.subject')}</p>
          <p>{question.subject}</p>
        </div>
        <div>
          <p className="text-dark-gray">{t('admin.questionBank.table.headers.topic')}</p>
          <p>{question.topic}</p>
        </div>
        <div>
          <p className="text-dark-gray">{t('admin.questionBank.table.headers.createdBy')}</p>
          <p>{question.createdBy}</p>
        </div>
        <div>
          <p className="text-dark-gray">{t('admin.questionBank.table.headers.flags') || "Flags"}</p>
          <p>{question.isFlagged ? "🚩 Flagged" : "—"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-dark-gray">{t('admin.questionBank.table.headers.lastAction') || "Last Action"}</p>
          {question.lastAction ? (
            <div className="space-y-1">
              <p className="text-[12px] text-oxford-blue">
                {question.lastAction.action || "N/A"}
              </p>
              <p className="text-[11px] text-dark-gray">
                by {question.lastAction.by || "N/A"} on {question.lastAction.when || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-[12px] text-gray-400">—</p>
          )}
        </div>
      </div>
      <div className={`flex items-center justify-between pt-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
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

const Pagination = ({ page, pageSize, total, onPageChange, t, dir }) => {
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
    <div 
      className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 text-oxford-blue md:flex-row md:items-center md:justify-between md:bg-oxford-blue md:px-6 md:text-white"
      dir={dir}
    >
      <p className="text-[12px] font-roboto font-medium leading-[18px] tracking-[3%]">
        {t('admin.questionBank.table.pagination.showing')
          .replace('{{first}}', firstItem)
          .replace('{{last}}', lastItem)
          .replace('{{total}}', total)}
      </p>
      <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
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
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <section 
      className="w-full overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard h-auto"
      dir={dir}
    >
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse">
          <TableHeader t={t} dir={dir} />
          <tbody>
            {questions.length ? (
              questions.map((question) => (
                <TableRow key={question.id} question={question} onView={onView} t={t} dir={dir} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
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
              dir={dir}
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
        dir={dir}
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