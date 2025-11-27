import React from "react";

// ============= REUSABLE TABLE COMPONENTS =============

const TableHeader = ({ columns }) => (
  <thead className="hidden md:table-header-group">
    <tr className="bg-oxford-blue text-center">
      {columns.map((column) => (
        <th
          key={column.key}
          className="px-6 py-4 text-[16px] font-medium leading-[16px] font-archivo text-white uppercase"
        >
          {column.label}
        </th>
      ))}
    </tr>
  </thead>
);

const TableRow = ({ item, columns, onView, onEdit, onCustomAction }) => {
  const getFieldKey = (columnName) => {
    return columnName.toLowerCase().replace(/ /g, "");
  };

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row">
      {columns.slice(0, -1).map((column) => {
        let value = item[column.key] || "—";

        // Special rendering for status
        if (column.key === "status") {
          const isApproved = value.toLowerCase() === "approved";
          const isPending = value.toLowerCase() === "pending";
          const isSentBack = value.toLowerCase() === "sent back";
          const isReject = value.toLowerCase() === "reject";
          const isaccept = value.toLowerCase() === "accepted";
          const isfixrequest = value.toLowerCase() === "fix request";
          const isRevision = value.toLowerCase() === "revision";
          const isDraft = value.toLowerCase() === "draft";
          const isPaid = value.toLowerCase() === "paid";
          const isFailed = value.toLowerCase() === "failed";
          return (
            <td key={column.key} className="px-6 py-8 text-center">
              <span
                className={`inline-block px-[12px] py-[5px] rounded-md text-[12px] leading-[100%] font-normal ${
                  isApproved
                    ? "bg-[#FDF0D5] text-[#ED4122]"
                    : isPaid
                    ? "bg-[#FDF0D5] text-[#ED4122]"
                    : isFailed
                    ? "bg-[#ED4122] text-white"
                    : isaccept
                    ? "bg-[#FDF0D5] text-[#ED4122]"
                    : isDraft
                    ? "bg-[#FDF0D5] text-[#ED4122]"
                    : isSentBack
                    ? "bg-[#ED4122] text-white"
                    : isRevision
                    ? "bg-[#ED4122] text-white"
                    : isfixrequest
                    ? "bg-[#ED4122] text-white"
                    : isReject
                    ? "bg-[#C6D8D3] text-blue-dark"
                    : isPending
                    ? "bg-[#FDF0D5] text-[#ED4122]"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {value}
              </span>
            </td>
          );
        }

        return (
          <td
            key={column.key}
            className="px-6 py-8 font-normal font-roboto text-center text-[14px] leading-[16px] text-blue-dark"
          >
            {value}
          </td>
        );
      })}
      <td className="px-6 py-8">
        <div className="flex items-center justify-center gap-2">
          {item.actionType === "review" && (
            <button
              type="button"
              onClick={() => onView?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Review
            </button>
          )}
          {item.actionType === "download" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] flex items-center gap-3 font-normal leading-[16px] font-roboto hover:underline transition"
            >
              <svg width="14" height="14" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.21997 10.28C0.926971 9.98703 0.926971 9.51199 1.21997 9.21899C1.51297 8.92599 1.98801 8.92599 2.28101 9.21899L6.00098 12.939V0.75C6.00098 0.336 6.33698 0 6.75098 0C7.16498 0 7.50098 0.336 7.50098 0.75V12.939L11.2209 9.21899C11.5139 8.92599 11.989 8.92599 12.282 9.21899C12.575 9.51199 12.575 9.98703 12.282 10.28L7.28198 15.28C7.21298 15.349 7.13006 15.4039 7.03906 15.4419C6.94806 15.4799 6.84995 15.5 6.75195 15.5C6.65395 15.5 6.55709 15.4799 6.46509 15.4419C6.37309 15.4039 6.29092 15.349 6.22192 15.28L1.21997 10.28ZM12.75 18H0.75C0.336 18 0 18.336 0 18.75C0 19.164 0.336 19.5 0.75 19.5H12.75C13.164 19.5 13.5 19.164 13.5 18.75C13.5 18.336 13.164 18 12.75 18Z" fill="#ED4122"/>
</svg>

              Download
            </button>
          )}
          {/* Custom action buttons based on action type */}
          {item.actionType === "view" && (
            <button
              type="button"
              onClick={() => onView?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              View
            </button>
          )}
          {item.actionType === "update" && (
            <button
              type="button"
              onClick={() => onEdit?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Update
            </button>
          )}
          {item.actionType === "fix" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Fix
            </button>
          )}
          {!item.actionType && (
            <button
              type="button"
              onClick={() => onView?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              View
            </button>
          )}
          {item.actionType === "open" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Open
            </button>
          )}
          {item.actionType === "createVariant" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Create Variant
            </button>
          )}
          {item.actionType === "addExplanation" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
            >
              Add Explanation
            </button>
          )}
          {item.actionType === "continue" && (
            <button
              type="button"
              onClick={() => onCustomAction?.(item)}
              className="text-orange-dark text-[14px] font-medium leading-[100%] hover:underline transition"
            >
              Continue
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const MobileCard = ({ item, columns, onView, onEdit, onCustomAction }) => {
  const displayColumns = columns.slice(0, -1);

  return (
    <article className="flex flex-col rounded-[8px] border border-[#E5E7EB] bg-white shadow-sm md:hidden overflow-hidden">
      <div className="flex flex-col gap-2 px-4 py-3 text-oxford-blue">
        {displayColumns.map((column) => {
          let value = item[column.key] || "—";

          // Special rendering for status
          if (column.key === "status") {
            const isApproved = value.toLowerCase() === "approved";
            const isPending = value.toLowerCase() === "pending";
            const isSentBack = value.toLowerCase() === "sent back";
            const isReject = value.toLowerCase() === "reject";
            const isaccept = value.toLowerCase() === "accepted";
            const isfixrequest = value.toLowerCase() === "fix request";
            const isRevision = value.toLowerCase() === "revision";
            const isDraft = value.toLowerCase() === "draft";
            return (
              <div key={column.key} className="flex items-center gap-2">
                <span className="text-[14px] font-normal text-oxford-blue">
                  {column.label}:
                </span>
                <span
                  className={`inline-block px-[12px] py-[5px] rounded-md text-[12px] leading-[100%] font-normal ${
                    isApproved
                      ? "bg-[#FDF0D5] text-[#ED4122]"
                      : isaccept
                      ? "bg-[#FDF0D5] text-[#ED4122]"
                      : isDraft
                      ? "bg-[#FDF0D5] text-[#ED4122]"
                      : isSentBack
                      ? "bg-[#ED4122] text-white"
                      : isRevision
                      ? "bg-[#ED4122] text-white"
                      : isfixrequest
                      ? "bg-[#ED4122] text-white"
                      : isReject
                      ? "bg-[#C6D8D3] text-blue-dark"
                      : isPending
                      ? "bg-[#FDF0D5] text-[#ED4122]"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {value}
                </span>
              </div>
            );
          }

          return (
            <div key={column.key} className="flex items-center gap-2">
              <span className="text-[14px] font-normal text-oxford-blue">
                {column.label}:
              </span>
              <span className="text-[14px] font-normal text-dark-gray">
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom section with action button */}
      <div className="flex items-center justify-end border-t border-[#E5E7EB] px-4 py-2.5">
        {/* Action button */}
        {item.actionType === "review" && (
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Review
          </button>
        )}
        {item.actionType === "download" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] flex items-center gap-3 font-normal leading-[16px] font-roboto hover:underline transition"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.21997 10.28C0.926971 9.98703 0.926971 9.51199 1.21997 9.21899C1.51297 8.92599 1.98801 8.92599 2.28101 9.21899L6.00098 12.939V0.75C6.00098 0.336 6.33698 0 6.75098 0C7.16498 0 7.50098 0.336 7.50098 0.75V12.939L11.2209 9.21899C11.5139 8.92599 11.989 8.92599 12.282 9.21899C12.575 9.51199 12.575 9.98703 12.282 10.28L7.28198 15.28C7.21298 15.349 7.13006 15.4039 7.03906 15.4419C6.94806 15.4799 6.84995 15.5 6.75195 15.5C6.65395 15.5 6.55709 15.4799 6.46509 15.4419C6.37309 15.4039 6.29092 15.349 6.22192 15.28L1.21997 10.28ZM12.75 18H0.75C0.336 18 0 18.336 0 18.75C0 19.164 0.336 19.5 0.75 19.5H12.75C13.164 19.5 13.5 19.164 13.5 18.75C13.5 18.336 13.164 18 12.75 18Z"
                fill="#ED4122"
              />
            </svg>
            Download
          </button>
        )}
        {item.actionType === "view" && (
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            View
          </button>
        )}
        {item.actionType === "update" && (
          <button
            type="button"
            onClick={() => onEdit?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Update
          </button>
        )}
        {item.actionType === "fix" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Fix
          </button>
        )}
        {!item.actionType && (
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            View
          </button>
        )}
        {item.actionType === "open" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Open
          </button>
        )}
        {item.actionType === "createVariant" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Create Variant
          </button>
        )}
        {item.actionType === "addExplanation" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Add Explanation
          </button>
        )}
        {item.actionType === "continue" && (
          <button
            type="button"
            onClick={() => onCustomAction?.(item)}
            className="text-orange-dark text-[14px] font-normal leading-[16px] font-roboto hover:underline transition"
          >
            Continue
          </button>
        )}
      </div>
    </article>
  );
};

const Pagination = ({ page, pageSize, total, onPageChange }) => {
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
      <p className="text-[12px] font-medium leading-[18px] font-roboto">
        Showing {firstItem} to {lastItem} of {total} results
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page === 1}
          className={`flex h-[27px] w-[78px] items-center justify-center rounded border text-[14px] font-medium leading-[16px] transition-colors ${
            page === 1
              ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
              : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
          }`}
        >
          Previous
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange?.(pageNumber)}
            className={`flex h-[27px] w-8 items-center justify-center rounded border text-[14px] font-medium leading-[16px] transition-colors ${
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
          className={`flex h-[27px] w-[78px] items-center justify-center rounded border text-[14px] font-medium leading-[16px] transition-colors ${
            page === safeTotalPages
              ? "cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] md:border-transparent md:bg-white/20 md:text-white/70"
              : "border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Table = ({
  items,
  columns,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
  onCustomAction,
  emptyMessage,
  showPagination = true,
}) => {
  return (
    <section
      className={`w-full flex flex-col justify-between overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard  ${
        showPagination ? "md:min-h-[348px]" : "md:min-h-auto"
      }`}
    >
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse">
          <TableHeader columns={columns} />
          <tbody>
            {items.length ? (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  item={item}
                  columns={columns}
                  onView={onView}
                  onEdit={onEdit}
                  onCustomAction={onCustomAction}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-10 text-center text-sm text-dark-gray"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-4 p-2 md:hidden">
        {items.length ? (
          items.map((item) => (
            <MobileCard
              key={item.id}
              item={item}
              columns={columns}
              onView={onView}
              onEdit={onEdit}
              onCustomAction={onCustomAction}
            />
          ))
        ) : (
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-dark-gray shadow-empty">
            {emptyMessage}
          </div>
        )}
      </div>
      {showPagination && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
};
