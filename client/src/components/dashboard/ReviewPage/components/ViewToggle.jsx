import React from 'react';

const ViewToggle = ({ viewType, onViewChange }) => {
  const gridIconColor = viewType === 'grid' ? 'white' : '#737373';
  const listIconColor = viewType === 'list' ? 'white' : '#737373';

  return (
    <div className="flex gap-2 py-[6px] px-2  bg-white border border-[#E5E7EB] shadow-md shadow-[#0000001A] rounded-[14px]">
      {/* Grid View Icon */}
      <button
        onClick={() => onViewChange('grid')}
        className={`p-[6px] rounded transition-colors ${viewType === 'grid'
          ? 'bg-[#EF4444] text-white'
          : 'bg-white text-oxford-blue hover:bg-gray-50'
          }`}
        aria-label="Grid view"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V7.5C2.5 7.96024 2.8731 8.33333 3.33333 8.33333H7.5C7.96024 8.33333 8.33333 7.96024 8.33333 7.5V3.33333C8.33333 2.8731 7.96024 2.5 7.5 2.5Z" stroke={gridIconColor} />
          <path d="M16.6667 2.5H12.5001C12.0398 2.5 11.6667 2.8731 11.6667 3.33333V7.5C11.6667 7.96024 12.0398 8.33333 12.5001 8.33333H16.6667C17.127 8.33333 17.5001 7.96024 17.5001 7.5V3.33333C17.5001 2.8731 17.127 2.5 16.6667 2.5Z" stroke={gridIconColor} />
          <path d="M7.5 11.666H3.33333C2.8731 11.666 2.5 12.0391 2.5 12.4993V16.666C2.5 17.1263 2.8731 17.4993 3.33333 17.4993H7.5C7.96024 17.4993 8.33333 17.1263 8.33333 16.666V12.4993C8.33333 12.0391 7.96024 11.666 7.5 11.666Z" stroke={gridIconColor} />
          <path d="M16.6667 11.666H12.5001C12.0398 11.666 11.6667 12.0391 11.6667 12.4993V16.666C11.6667 17.1263 12.0398 17.4993 12.5001 17.4993H16.6667C17.127 17.4993 17.5001 17.1263 17.5001 16.666V12.4993C17.5001 12.0391 17.127 11.666 16.6667 11.666Z" stroke={gridIconColor} />
        </svg>
      </button>

      {/* List View Icon */}
      <button
        onClick={() => onViewChange('list')}
        className={`p-[6px] rounded transition-colors ${viewType === 'list'
          ? 'bg-[#EF4444] text-white'
          : 'bg-white text-oxford-blue hover:bg-gray-50'
          }`}
        aria-label="List view"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 2.5H17.5V17.5H2.5V2.5Z" stroke={listIconColor} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.5 7.5H17.5M2.5 12.5H17.5M7.5 2.5V17.5" stroke={listIconColor} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle;
