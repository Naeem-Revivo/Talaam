import React from "react";

const FilterButtons = ({ options, selectedValue, onChange, className = "" }) => {
  return (
    <div className={`flex gap-2 p-1 bg-[#F9FAFB] rounded-[14px] flex-wrap ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-5 py-2 rounded-[10px] text-[14px] font-normal transition-colors font-roboto leading-[20px] tracking-[0%] text-center ${
            selectedValue === option.value
              ? "bg-oxford-blue text-white"
              : " text-[#6A7282]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
