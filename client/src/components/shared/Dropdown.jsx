import { useEffect, useRef, useState } from "react";

/**
 * Reusable Dropdown Component
 * 
 * @param {string} label - Label text (shown on mobile screens only)
 * @param {string|number} value - Selected value
 * @param {Array<string|{value: string, label: string}>} options - Array of options (strings or objects with value/label)
 * @param {function} onChange - Callback function when selection changes
 * @param {string} className - Additional CSS classes for the dropdown container
 * @param {string} placeholder - Placeholder text when no value is selected
 * @param {boolean} showDefaultOnEmpty - If true, shows first option when value is empty (default: true)
 * @param {string} height - Custom height class (e.g., 'h-[50px]', default: 'h-[48px]')
 */
const Dropdown = ({ 
  label, 
  value, 
  options = [], 
  onChange,
  className = "",
  placeholder = "",
  showDefaultOnEmpty = true,
  height = "h-[48px]"
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
    
    if (showDefaultOnEmpty && normalizedOptions.length > 0) {
      return normalizedOptions[0].label;
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
  const selectedValue = value && value.toString().trim() !== "" 
    ? value 
    : (showDefaultOnEmpty && normalizedOptions.length > 0 ? normalizedOptions[0].value : null);

  return (
    <div className={`w-full lg:w-[180px] ${className}`} ref={dropdownRef}>
      {/* Label only on small screens */}
      {label && (
        <p className="text-[16px] leading-[100%] font-semibold text-oxford-blue mb-3 block lg:hidden">
          {label}
        </p>
      )}

      {/* Dropdown Box */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative flex ${height} cursor-pointer items-center justify-between rounded-lg border border-transparent bg-white px-4 text-sm font-semibold text-oxford-blue shadow-filter-hover`}
      >
        <span className={!displayValue ? "text-gray-400" : ""}>
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
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
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

export default Dropdown;

