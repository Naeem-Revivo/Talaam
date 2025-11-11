import React from "react";

const statusBadgeStyles = {
  Active: "bg-[#FDF2EC] text-[#ED4122]",
  Suspended: "bg-[#F3F4F6] text-[#6B7280]",
};

const UserSummaryCards = ({ summaries }) => {
  if (!summaries?.length) {
    return null;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {summaries.map((item) => (
        <article
          key={item.label}
          className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_6px_54px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4 transition hover:shadow-[0_12px_34px_rgba(3,39,70,0.08)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-roboto text-sm text-[#6B7280]">
                {item.label}
              </p>
              <p className="font-archivo text-[32px] leading-[36px] text-[#032746]">
                {item.total}
              </p>
            </div>
            {item.icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF3ED]">
                <img src={item.icon} alt={item.label} className="h-6 w-6" />
              </div>
            )}
          </div>
          <footer className="flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusBadgeStyles[item.status] ?? "bg-[#F3F4F6] text-[#6B7280]"}`}
            >
              {item.status}
            </span>
            {item.subtext && (
              <p className="font-roboto text-xs text-[#6B7280]">{item.subtext}</p>
            )}
          </footer>
        </article>
      ))}
    </section>
  );
};

export default UserSummaryCards;


