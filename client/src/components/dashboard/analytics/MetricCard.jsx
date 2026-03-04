import React from "react";
import { Loader } from "../../common/Loader";

const MetricCard = ({
  icon,
  iconAlt,
  label,
  value,
  trend,
  trendColor = "text-green-600",
  trendBgColor = "bg-green-50",
  loading = false,
  children,
  className = "",
}) => {
  // Parse trend to separate icon+value from description
  const parseTrend = (trendText) => {
    if (!trendText) return { badge: '', description: '' };
    
    // Match pattern like "↑ 5%" or "↓ 8s" followed by text
    const match = trendText.match(/^([↑↓]\s*[\d.]+[%s]?)\s*(.*)$/);
    if (match) {
      return {
        badge: match[1], // "↑ 5%" or "↓ 8s"
        description: match[2] // "vs last month" or "improvement"
      };
    }
    return { badge: trendText, description: '' };
  };

  const { badge, description } = parseTrend(trend);
  return (
    <div
      className={`bg-white border border-[#CCDCE7] rounded-[24px] p-4 md:p-6 relative w-full min-h-[120px] md:min-h-[180px] flex flex-col gap-4 ${className}`}
      style={{ borderWidth: "1px" }}
    >
      {icon && (
        <div className="">
          <img
            src={icon}
            alt={iconAlt || label}
            className="w-10 h-10"
          />
        </div>
      )}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader size="md" />
        </div>
      ) : (
        <>
        <div className="flex items-center gap-2">
          {value && (
            <p className="text-[24px] leading-[36px] font-bold text-dashboard-dark font-archivo">
              {value}
            </p>
          )}
          <p className="text-[12px] font-normal text-dashboard-gray font-roboto leading-[16px]">
            {label}
          </p>
          </div>
          {trend && (
            <div className="flex items-center gap-2 pt-1 md:pt-2">
              {badge && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-[10px] ${trendBgColor} ${trendColor} text-[12px] leading-[16px] font-medium font-roboto`}>
                  {badge}
                </span>
              )}
              {description && (
                <span className="text-[12px] font-normal text-[#6697B7] font-roboto leading-[18px]">
                  {description}
                </span>
              )}
            </div>
          )}
          {children}
        </>
      )}
    </div>
  );
};

export default MetricCard;
