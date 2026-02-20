import React from "react";
import { Loader } from "../../common/Loader";
import InfoIcon from "./InfoIcon";

const FocusAreasList = ({
  focusAreas = [],
  loading = false,
  title = "Focus Areas",
  onAreaClick,
}) => {
  return (
    <div
      className="bg-gradient-to-br from-[#032746] via-[#0A4B6E] to-[#173B50] border border-[#F5F5F5] shadow-md shadow=[#0000001A] rounded-[8px] py-8 px-10 w-full"
    >
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <h2 className="text-[18px] md:text-[20px] font-bold text-white font-archivo leading-[28px] tracking-[0%]">
          {title}
        </h2>
        <InfoIcon />
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[100px]">
          <Loader size="lg" />
        </div>
      ) : focusAreas.length > 0 ? (
        <div className="flex flex-wrap gap-3 md:gap-4">
          {focusAreas.map((area, index) => (
            <button
              key={index}
              onClick={() => onAreaClick && onAreaClick(area)}
              className="flex items-center justify-between gap-3 p-3 md:p-4 border border-[#E5E7EB] rounded-full hover:bg-gray-50 transition-colors text-left bg-white"
              style={{ borderWidth: "1px" }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Numbered badge */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#032746] flex items-center justify-center">
                  <span className="text-white text-[12px] md:text-[14px] font-medium font-archivo">
                    {index + 1}
                  </span>
                </div>
                
                {/* Topic name */}
                <span className="text-[14px] leading-[20px] font-normal text-oxford-blue font-roboto">
                  {area.name}
                </span>
                
                {/* Vertical separator */}
                <div className="h-4 w-px bg-[#E5E7EB] flex-shrink-0" />
                
                {/* Percentage */}
                <span className="text-[14px] leading-[20px] font-bold text-cinnebar-red font-archivo">
                  {area.accuracy}%
                </span>
              </div>
              
              {/* Chevron icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[100px]">
          <p className="text-dark-gray font-roboto">No focus areas available</p>
        </div>
      )}
    </div>
  );
};

export default FocusAreasList;
