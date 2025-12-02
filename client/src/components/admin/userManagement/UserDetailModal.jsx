import React from "react";

const statusBadgeStyles = {
  Active: "bg-[#FDF2EC] text-[#ED4122]",
  Suspended: "bg-[#E5E7EB] text-[#4B5563]",
};

const DetailItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">{label}</p>
      <p className="text-sm font-medium text-oxford-blue">{value}</p>
    </div>
  );
};

const UserDetailModal = ({ isOpen, user, onClose, onEdit }) => {
  if (!isOpen || !user) return null;

  const badgeClass =
    statusBadgeStyles[user.status] ?? statusBadgeStyles.Active;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-oxford-blue/40 px-4 py-8 backdrop-blur-sm">
      <div className="flex w-full max-w-5xl flex-col gap-6 rounded-[16px] border border-[#E5E7EB] bg-white p-8 shadow-2xl">
        <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF2EC] text-[22px] font-semibold text-[#ED4122]">
                {user.name
                  ?.split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                {user.name && (
                  <h2 className="font-archivo text-[28px] leading-[32px] text-oxford-blue">
                    {user.name}
                  </h2>
                )}
                {user.status && (
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                  >
                    {user.status}
                  </span>
                )}
              </div>
              {user.workflowRole && (
                <p className="font-roboto text-sm text-dark-gray">
                  {user.workflowRole}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onEdit?.(user)}
              className="rounded-[10px] bg-[#ED4122] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d43a1f]"
            >
              Edit User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-oxford-blue transition hover:bg-[#F3F4F6]"
            >
              Close
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-oxford-blue">
                Personal Information
              </h3>
              {(user.name || user.email) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {user.name && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">
                        Full Name
                      </p>
                      <p className="text-sm font-medium text-oxford-blue">
                        {user.name}
                      </p>
                    </div>
                  )}
                  {user.email && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9CA3AF]">
                        Email
                      </p>
                      <p className="text-sm font-medium text-oxford-blue">
                        {user.email}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-oxford-blue">
                Account Details
              </h3>
              {(user.workflowRole || user.status || user.lastLogin || user.dateCreated) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailItem label="Workflow Role" value={user.workflowRole} />
                  <DetailItem label="Status" value={user.status} />
                  <DetailItem label="Last Login" value={user.lastLogin} />
                  <DetailItem label="Date Created" value={user.dateCreated} />
                </div>
              )}
            </div>
          </div>

          {user.notes ? (
            <aside className="space-y-6">
              <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-oxford-blue">
                  Notes
                </h3>
                <p className="text-sm text-[#4B5563] leading-6 whitespace-pre-line">
                  {user.notes}
                </p>
              </div>
            </aside>
          ) : null}
        </section>

        {user.activityLog && user.activityLog.length > 0 ? (
          <section className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-oxford-blue">
              Activity Log
            </h3>
            <div className="space-y-3">
              {user.activityLog.map((item, index) => (
                <div
                  key={`${item.description}-${index}`}
                  className="flex items-start gap-3 rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3"
                >
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ED4122]/10 text-[#ED4122]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-oxford-blue">
                      {item.description}
                    </p>
                    <p className="text-xs text-dark-gray">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default UserDetailModal;


