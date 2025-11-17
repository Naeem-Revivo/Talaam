import React from "react";
import AdminMetricCard from "../AdminMetricCard";

const statusBadgeStyles = {
  active: "bg-[#FDF0D5] text-[#ED4122]",
  suspended: "bg-[#F3F4F6] text-dark-gray",
};

const UserSummaryCards = ({ summaries }) => {
  if (!summaries?.length) {
    return null;
  }

  return (
    <section className="mt-4 flex flex-wrap gap-4 sm:mt-6 sm:gap-6 lg:gap-7 xl:w-full xl:justify-between">
      {summaries.map((item) => (
        <AdminMetricCard
          key={item.label}
          title={item.label}
          value={item.value}
          subtext={item.subtext}
          icon={item.icon}
          iconWrapperClassName="flex h-10 w-10 items-center justify-center"
          badgeText={item.badgeText}
          badgeClassName={statusBadgeStyles[item.badgeTone] ?? "bg-[#F3F4F6] text-dark-gray"}
          className="w-full sm:w-[calc(50%-12px)] lg:w-[262px] lg:h-[130px]"
        />
      ))}
    </section>
  );
};

export default UserSummaryCards;


