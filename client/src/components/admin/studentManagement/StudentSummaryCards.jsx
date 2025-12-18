import React from "react";
import AdminMetricCard from "../AdminMetricCard";

const StudentSummaryCards = ({ summaries }) => {
  if (!summaries?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {summaries.map((item, index) => (
        <AdminMetricCard
          key={index}
          title={item.label}
          value={item.value}
          subtext={item.subtext}
          icon={item.icon}
          className="w-full h-[107px]"
        />
      ))}
    </div>
  );
};

export default StudentSummaryCards;

