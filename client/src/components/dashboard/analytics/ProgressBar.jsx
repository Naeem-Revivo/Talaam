import React from "react";

const ProgressBar = ({
  value,
  max = 100,
  className = "",
  barClassName = "bg-[#4ADE80]",
  bgClassName = "bg-[#F3F4F6]",
  height = "h-2",
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${bgClassName} rounded-full ${height} ${className}`}>
      <div
        className={`${barClassName} ${height} rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
