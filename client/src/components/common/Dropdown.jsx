import React from 'react'
import { useState, useRef, useEffect } from 'react';

const Dropdown = ({ label, value, options, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    // Show placeholder or value
    const displayValue = value && value.trim() !== "" ? value : (placeholder || (options && options.length > 0 ? options[0] : "Select..."));
  
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    return (
      <div className="w-full" ref={dropdownRef}>
        {/* Label */}
        {label && (
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-blue-dark mb-[14px]">
            {label}
          </label>
        )}
  
        {/* Dropdown Box */}
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex h-[50px] cursor-pointer items-center justify-between rounded-lg bg-white px-4 text-[16px] leading-[100%] font-normal text-oxford-blue border border-[#03274633]"
        >
          <span>{displayValue}</span>
          <svg
            width="15"
            height="9"
            viewBox="0 0 15 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562"
              stroke="#032746"
              strokeWidth="2"
            />
          </svg>
  
          {/* Dropdown Menu */}
          {isOpen && (
            <ul className="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-lg">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    displayValue === option ? "font-semibold text-oxford-blue" : "text-gray-700"
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

export default Dropdown