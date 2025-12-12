import React from "react";
import AdminMetricCard from "../AdminMetricCard";

const StudentSummaryCards = ({ summaries }) => {
  if (!summaries?.length) {
    return null;
  }

  return (
    <section className="mt-4 flex flex-wrap gap-4 sm:mt-6 sm:gap-6 lg:gap-7 xl:w-full xl:justify-between w-full">
      {summaries.map((item, index) => (
        <AdminMetricCard
          key={index}
          title={item.label}
          value={item.value}
          subtext={item.subtext}
          icon={item.icon}
          iconWrapperClassName="flex h-10 w-10 items-center justify-center"
          className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(50%-12px)] xl:w-[262px] lg:h-[130px]"
        />
      ))}
    </section>
  );
};

export default StudentSummaryCards;

