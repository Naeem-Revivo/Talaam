import React from "react";

const statusTone = {
  Active: {
    wrapper: "bg-[#FDF2EC]",
    text: "text-[#ED4122]",
  },
  Suspended: {
    wrapper: "bg-[#E5E7EB]",
    text: "text-[#4B5563]",
  },
};

const TableHeader = () => (
  <thead>
    <tr className="bg-[#032746] text-left">
      {["User Name", "Email", "Workflow Role", "System Role", "Status", "Actions"].map(
        (column) => (
          <th
            key={column}
            className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-white"
          >
            {column}
          </th>
        )
      )}
    </tr>
  </thead>
);

const TableRow = ({ user, onView, onEdit }) => {
  const tone = statusTone[user.status] ?? statusTone.Active;

  return (
    <tr className="border-b border-[#E5E7EB] bg-white text-[#032746] last:border-none">
      <td className="px-6 py-4 text-sm font-medium capitalize">{user.name}</td>
      <td className="px-6 py-4 text-sm text-[#6B7280]">{user.email}</td>
      <td className="px-6 py-4 text-sm text-[#032746]">{user.workflowRole}</td>
      <td className="px-6 py-4 text-sm text-[#032746]">{user.systemRole}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone.wrapper} ${tone.text}`}
        >
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onView?.(user)}
            className="rounded-full p-2 text-[#032746] transition hover:bg-[#F3F4F6]"
            aria-label={`View ${user.name}`}
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
            onClick={() => onEdit?.(user)}
            className="rounded-full p-2 text-[#032746] transition hover:bg-[#F3F4F6]"
            aria-label={`Edit ${user.name}`}
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
                d="m16.862 4.487 1.651-1.65a1.875 1.875 0 1 1 2.652 2.651L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 7.125 16.862 4.487M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

const Pagination = ({ page, pageSize, total, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange?.(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange?.(page + 1);
  };

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-[#032746] px-6 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-roboto opacity-80">
        Showing {(page - 1) * pageSize + 1} to{" "}
        {Math.min(page * pageSize, total)} of {total} results
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={page === 1}
          className="rounded border border-white/40 px-3 py-1 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/10"
        >
          Previous
        </button>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange?.(pageNumber)}
            className={`flex h-9 w-9 items-center justify-center rounded border text-sm font-semibold transition ${
              pageNumber === page
                ? "border-[#ED4122] bg-[#ED4122] text-white"
                : "border-white/20 text-white hover:bg-white/10"
            }`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          type="button"
          onClick={handleNext}
          disabled={page === totalPages}
          className="rounded border border-white/40 px-3 py-1 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/10"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const UserTable = ({
  users,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
}) => {
  return (
    <section className="overflow-hidden rounded-[12px] border border-[#E5E7EB] shadow-[0_6px_54px_rgba(0,0,0,0.05)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <TableHeader />
          <tbody>
            {users.length ? (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  user={user}
                  onView={onView}
                  onEdit={onEdit}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-[#6B7280]"
                >
                  No users match the current filters.
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

UserTable.defaultProps = {
  users: [],
  page: 1,
  pageSize: 10,
  total: 0,
};

export default UserTable;


