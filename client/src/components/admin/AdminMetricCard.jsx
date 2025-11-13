import React from "react";

const AdminMetricCard = ({
  title,
  value,
  subtext,
  subtextClassName = "text-[#6B7280]",
  icon,
  iconWrapperClassName = "",
  badgeText,
  badgeClassName = "bg-[#FDF0D5] text-[#ED4122]",
  className = "",
}) => {
  const hasValue = value !== undefined && value !== null && value !== "";

  return (
    <article
      className={`rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_6px_54px_0_rgba(0,0,0,0.05)] p-5 flex flex-col gap-3 transition hover:shadow-[0_12px_34px_rgba(3,39,70,0.08)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1.5 px-2">
          {title && (
            <p className="font-roboto text-[16px] text-[#6B7280]">{title}</p>
          )}
          {hasValue && (
            <p className="font-archivo text-[30px] leading-[28px] font-semibold text-[#032746]">
              {value}
            </p>
          )}
          {subtext !== undefined && subtext !== null && subtext !== "" && (
            <p className={`font-roboto text-[16px] leading-[20px] ${subtextClassName}`}>
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div className={`flex items-center justify-center rounded-full ${iconWrapperClassName}`}>
            <img src={icon} alt={title} />
          </div>
        )}
      </div>

      {badgeText && (
        <footer className="">
          <span
            className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-normal ${badgeClassName}`}
          >
            {badgeText}
          </span>
        </footer>
      )}
    </article>
  );
};

export default AdminMetricCard;


