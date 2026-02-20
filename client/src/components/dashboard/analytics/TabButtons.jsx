import React from "react";

const TabButtons = ({ tabs, activeTab, onChange, className = "" }) => {
  return (
    <div className={`inline-flex gap-2 w-full rounded-[14px] bg-[#F3F4F6]  mb-4 md:mb-6 ${className}`}>
      {tabs.map((tab, index) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`w-full h-[45px] pt-3 pr-[66px] pb-3 pl-[66px] rounded-[14px] text-[14px] md:text-[16px] font-medium font-archivo leading-[20px] md:leading-[24px] tracking-[0%] transition-colors whitespace-nowrap ${
            activeTab === tab.value
              ? "text-white bg-gradient-to-b from-[#032746] to-[#173B50] shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]"
              : "text-[#6B7280] bg-transparent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
