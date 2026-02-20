import React, { useState } from "react";

const InfoIcon = ({ tooltip, className = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <circle cx="8" cy="8" r="7" stroke="#6697B7" strokeWidth="1.5" />
        <text
          x="8"
          y="11.5"
          textAnchor="middle"
          fill="#6697B7"
          fontSize="11"
          fontWeight="600"
          fontFamily="Arial"
        >
          i
        </text>
      </svg>
      {tooltip && showTooltip && (
        <div className="absolute left-0 top-6 z-10 bg-gray-800 text-white text-xs rounded w-[220px] h-[48px] px-3 py-2 shadow-lg">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default InfoIcon;
