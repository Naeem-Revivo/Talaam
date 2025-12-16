import React from "react";
import { useLanguage } from "../../../context/LanguageContext";

const statusTone = {
  Active: {
    wrapper: "bg-[#FDF0D5]",
    text: "text-[#ED4122]",
  },
  Suspended: {
    wrapper: "bg-orange-dark",
    text: "text-white",
  },
};

const subscriptionTone = {
  Free: {
    wrapper: "bg-[#C6D8D3]",
    text: "text-oxford-blue",
  },
  Trial: {
    wrapper: "bg-[#FDF0D5]",
    text: "text-oxford-blue",
  },
  Premium: {
    wrapper: "bg-[#FDF0D5]",
    text: "text-[#ED4122]",
  },
};

const TableHeader = () => {
  const { t } = useLanguage();
  const columns = [
    t('admin.studentManagement.table.headers.name'),
    t('admin.studentManagement.table.headers.email'),
    t('admin.studentManagement.table.headers.subscription'),
    t('admin.studentManagement.table.headers.progress'),
    t('admin.studentManagement.table.headers.signUpDate'),
    t('admin.studentManagement.table.headers.status'),
    t('admin.studentManagement.table.headers.actions'),
  ];
  
  return (
    <thead className="hidden md:table-header-group">
      <tr className="bg-oxford-blue text-center">
        {columns.map((column) => (
          <th
            key={column}
            className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableRow = ({ student, onView, onSuspend }) => {
  const { t } = useLanguage();
  const statusToneStyle = statusTone[student.status] ?? statusTone.Active;
  const subscriptionToneStyle = subscriptionTone[student.subscription] ?? subscriptionTone.Free;
  
  const getStatusLabel = (status) => {
    if (status === "Active") return t('admin.studentManagement.status.active');
    if (status === "Suspended") return t('admin.studentManagement.status.suspended');
    return status;
  };
  
  const getSubscriptionLabel = (subscription) => {
    const subscriptionMap = {
      "Free": t('admin.studentManagement.subscription.free'),
      "Trial": t('admin.studentManagement.subscription.trial'),
      "Premium": t('admin.studentManagement.subscription.premium'),
    };
    return subscriptionMap[subscription] || subscription;
  };

  const isSuspended = student.status === "Suspended";

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row">
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] capitalize text-center">
        {student.name}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
        {student.email}
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex h-[26px] min-w-[59px] font-roboto items-center justify-center rounded-[6px] px-3 text-sm font-normal ${subscriptionToneStyle.wrapper} ${subscriptionToneStyle.text}`}
        >
          {getSubscriptionLabel(student.subscription)}
        </span>
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
        <span className={student.progress === "No activity" ? "text-dark-gray" : "text-[#EF4444]"}>
          {student.progress}
        </span>
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
        {student.signUpDate}
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex h-[26px] min-w-[59px] font-roboto items-center justify-center rounded-md px-3 text-sm font-normal ${statusToneStyle.wrapper} ${statusToneStyle.text}`}
        >
          {getStatusLabel(student.status)}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onView?.(student)}
            className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
            aria-label={t('admin.studentManagement.table.ariaLabels.view').replace('{{name}}', student.name)}
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
          <button
            type="button"
            onClick={() => onSuspend?.(student)}
            className={`rounded-full p-2 transition ${
              isSuspended 
                ? "text-[#10B981] hover:bg-[#D1FAE5]" 
                : "text-[#EF4444] hover:bg-[#FEE2E2]"
            }`}
            aria-label={
              isSuspended 
                ? t('admin.studentManagement.table.ariaLabels.activate').replace('{{name}}', student.name)
                : t('admin.studentManagement.table.ariaLabels.suspend').replace('{{name}}', student.name)
            }
            title={isSuspended ? t('admin.studentManagement.table.actions.activate') : t('admin.studentManagement.table.actions.suspend')}
          >
            {isSuspended ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8C14 11.31 11.31 14 8 14ZM11 7H5V9H11V7Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 0C3.14045 0 0 3.14045 0 7C0 10.8595 3.14045 14 7 14C10.8595 14 14 10.8595 14 7C14 3.14045 10.8595 0 7 0ZM1.27273 7C1.27273 3.84236 3.84173 1.27273 7 1.27273C8.35036 1.27273 9.59069 1.74497 10.5707 2.52961L2.52961 10.5707C1.74497 9.59069 1.27273 8.35036 1.27273 7ZM7 12.7273C5.64964 12.7273 4.40931 12.255 3.42931 11.4704L11.4704 3.42931C12.255 4.40995 12.7273 5.65027 12.7273 7C12.7273 10.1576 10.1583 12.7273 7 12.7273Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

const Pagination = ({ page, pageSize, total, onPageChange }) => {
  const { t } = useLanguage();
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
        {t('admin.studentManagement.table.pagination.showing')
          .replace('{{first}}', firstItem)
          .replace('{{last}}', lastItem)
          .replace('{{total}}', total)}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handlePrev();
          }}
          disabled={page === 1}
          className={`flex h-[27.16px] w-[78px] items-center justify-center font-medium rounded border text-[14px] font-archivo leading-[16px] transition-colors ${
            page === 1
              ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
              : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
          }`}
        >
          {t('admin.studentManagement.table.pagination.previous')}
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onPageChange?.(pageNumber);
            }}
            className={`flex h-8 w-8 items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${
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
          onClick={(e) => {
            e.preventDefault();
            handleNext();
          }}
          disabled={page === safeTotalPages}
          className={`flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-normal leading-[16px] transition-colors ${
            page === safeTotalPages
              ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
              : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
          }`}
        >
          {t('admin.studentManagement.table.pagination.next')}
        </button>
      </div>
    </div>
  );
};

const StudentTable = ({
  students,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onSuspend,
}) => {
  const { t } = useLanguage();
  return (
    <section className={`w-full overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard ${students.length === 0 ? "md:min-h-[280px]" : ""}`}>
      <div className="hidden overflow-x-auto md:block max-w-full">
        <table className="min-w-full border-collapse w-full">
          <TableHeader />
          <tbody>
            {students.length ? (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  student={student}
                  onView={onView}
                  onSuspend={onSuspend}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="p-4 text-center text-sm text-dark-gray"
                >
                  <div className="flex items-center justify-center min-h-[180px]">
                    {t('admin.studentManagement.table.emptyState')}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </section>
  );
};

StudentTable.defaultProps = {
  students: [],
  page: 1,
  pageSize: 10,
  total: 0,
};

export default StudentTable;

