import { useEffect, useRef, useState } from "react";

/**
 * Profile Dropdown Component - Matches input field styling
 * 
 * @param {string|number} value - Selected value
 * @param {Array<string|{value: string, label: string}>} options - Array of options (strings or objects with value/label)
 * @param {function} onChange - Callback function when selection changes
 * @param {string} className - Additional CSS classes for the dropdown container
 * @param {string} placeholder - Placeholder text when no value is selected
 */
const ProfileDropdown = ({ 
  value, 
  options = [], 
  onChange,
  className = "",
  placeholder = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options to always have value and label
  const normalizedOptions = options.map(option => {
    if (typeof option === 'string' || typeof option === 'number') {
      return { value: option, label: String(option) };
    }
    return { value: option.value, label: option.label || option.value };
  });

  // Get display value
  const getDisplayValue = () => {
    if (value && value.toString().trim() !== "") {
      const selectedOption = normalizedOptions.find(opt => opt.value === value);
      return selectedOption ? selectedOption.label : value;
    }
    
    return placeholder || "";
  };

  const displayValue = getDisplayValue();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option, e) => {
    e?.stopPropagation();
    onChange?.(option.value);
    setIsOpen(false);
  };

  // Get selected option value for highlighting
  const selectedValue = value && value.toString().trim() !== "" ? value : null;

  return (
    <div className={`relative w-full ${className || 'lg:w-[423px]'}`} ref={dropdownRef}>
      {/* Dropdown Box - Matches input field styling */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-[59px] cursor-pointer items-center justify-between rounded-[12px] border border-[#032746]/20 bg-white px-4 py-3 font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue shadow-input outline-none"
      >
        <span className={!displayValue ? "text-dark-gray" : ""}>
          {displayValue || placeholder}
        </span>
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
        {isOpen && normalizedOptions.length > 0 && (
          <ul 
            className="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-lg max-h-[300px] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {normalizedOptions.map((option) => (
              <li
                key={option.value}
                onClick={(e) => handleOptionClick(option, e)}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 font-roboto ${
                  selectedValue === option.value 
                    ? "font-semibold text-oxford-blue" 
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;

