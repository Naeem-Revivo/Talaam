import React from "react";

const statusOptions = ["All", "Active", "Suspended"];
const roleOptions = [
  "All",
  "Question Gatherer",
  "Question Creator",
  "Processor",
  "Question Explainer",
];

const UserFilterBar = ({
  searchValue,
  statusValue,
  roleValue,
  onSearchChange,
  onStatusChange,
  onRoleChange,
}) => {
  return (
    <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
      <label className="relative flex items-center">
        <span className="sr-only">Search users</span>
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-roboto text-[#032746] placeholder:text-[#9CA3AF] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#FED7CC]"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={1.8}
          stroke="currentColor"
          className="pointer-events-none absolute right-4 h-5 w-5 text-[#9CA3AF]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-4.35-4.35M18.25 10.5a7.75 7.75 0 1 1-15.5 0 7.75 7.75 0 0 1 15.5 0Z"
          />
        </svg>
      </label>
      <label className="relative">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#6B7280]">
          Status
        </span>
        <select
          value={statusValue}
          onChange={(event) => onStatusChange?.(event.target.value)}
          className="w-full appearance-none rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-roboto text-[#032746] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#FED7CC]"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#9CA3AF]">
          ▼
        </span>
      </label>
      <label className="relative">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#6B7280]">
          Role
        </span>
        <select
          value={roleValue}
          onChange={(event) => onRoleChange?.(event.target.value)}
          className="w-full appearance-none rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-roboto text-[#032746] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#FED7CC]"
        >
          {roleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#9CA3AF]">
          ▼
        </span>
      </label>
    </section>
  );
};

export default UserFilterBar;


