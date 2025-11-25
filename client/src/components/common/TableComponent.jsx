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
          return (
            <td key={column.key} className="px-6 py-8 text-center">
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
                    ? "bg-[#C6D8D3] text-blue-dark"
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
                      ? "bg-[#C6D8D3] text-blue-dark"
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
