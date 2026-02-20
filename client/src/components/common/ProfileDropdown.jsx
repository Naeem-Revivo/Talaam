import { useEffect, useRef, useState } from "react";

/**
 * Profile Dropdown Component - Matches input field styling
 * 
 * @param {string|number} value - Selected value
 * @param {Array<string|{value: string, label: string}>} options - Array of options (strings or objects with value/label)
 * @param {function} onChange - Callback function when selection changes
 * @param {string} className - Additional CSS classes for the dropdown container
 * @param {string} placeholder - Placeholder text when no value is selected
 * @param {string} icon - Icon type: 'location', 'clock', 'globe' (optional)
 */
const ProfileDropdown = ({
  value,
  options = [],
  onChange,
  className = "",
  placeholder = "",
  icon = null
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

  // Render icon based on type
  const renderIcon = () => {
    if (!icon) return null;

    const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400";

    switch (icon) {
      case 'location':
        return (
          <div className={iconClass}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7.5C15 11.2448 10.8457 15.1447 9.45075 16.3492C9.32079 16.447 9.1626 16.4998 9 16.4998C8.8374 16.4998 8.67921 16.447 8.54925 16.3492C7.15425 15.1447 3 11.2448 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </div>
        );
      case 'clock':
        return (
          <div className={iconClass}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_33_3632)">
                <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9 4.5V9L12 10.5" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_33_3632">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </div>
        );
      case 'globe':
        return (
          <div className={iconClass}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_33_3642)">
                <path d="M16.155 11.25H12.75C12.3522 11.25 11.9706 11.408 11.6893 11.6893C11.408 11.9706 11.25 12.3522 11.25 12.75V16.155" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M5.25 2.50488V3.74988C5.25 4.34662 5.48705 4.91892 5.90901 5.34087C6.33097 5.76283 6.90326 5.99988 7.5 5.99988C7.89782 5.99988 8.27936 6.15792 8.56066 6.43922C8.84196 6.72053 9 7.10206 9 7.49988C9 8.32488 9.675 8.99988 10.5 8.99988C10.8978 8.99988 11.2794 8.84185 11.5607 8.56054C11.842 8.27924 12 7.89771 12 7.49988C12 6.67488 12.675 5.99988 13.5 5.99988H15.8775" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.2501 16.4625V13.5C8.2501 13.1022 8.09206 12.7206 7.81076 12.4393C7.52945 12.158 7.14792 12 6.7501 12C6.35227 12 5.97074 11.842 5.68944 11.5607C5.40813 11.2794 5.2501 10.8978 5.2501 10.5V9.75C5.2501 9.35218 5.09206 8.97064 4.81076 8.68934C4.52945 8.40804 4.14792 8.25 3.7501 8.25H1.5376" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_33_3642">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </div>
        );
      default:
        return null;
    }
  };

  const hasIcon = !!icon;
  const paddingLeft = hasIcon ? 'pl-12' : 'pl-4';

  return (
    <div className={`relative w-full ${className || 'lg:w-[423px]'}`} ref={dropdownRef}>
      {/* Dropdown Box - Matches input field styling */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative flex h-[56px] cursor-pointer items-center justify-between rounded-[14px] border-2 ${selectedValue ? 'border-[#E5E7EB]' : 'border-[#E5E7EB]'} bg-white py-3 ${paddingLeft} pr-4 font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue outline-none focus-within:border-[#6CA6C1] transition-colors`}
      >
        {renderIcon()}
        <span className={`flex-1 ${!displayValue ? "text-dark-gray" : ""}`}>
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
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 font-roboto ${selectedValue === option.value
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

