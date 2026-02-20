import React from "react";
import { Loader } from "../../common/Loader";

const MetricCard = ({
  icon,
  iconAlt,
  label,
  value,
  trend,
  trendColor = "text-green-600",
  loading = false,
  children,
  className = "",
}) => {
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
          <p className="text-base font-normal text-dashboard-gray font-roboto leading-[20px]">
            {label}
          </p>
          </div>
          {trend && (
            <p className={`text-[12px] md:text-[14px] font-normal ${trendColor} font-roboto leading-[18px] md:leading-[20px] pt-1 md:pt-2 flex items-center gap-1`}>
              {trend}
            </p>
          )}
          {children}
        </>
      )}
    </div>
  );
};

export default MetricCard;
