import React, { useState } from 'react';
import { eye, openeye } from '../../assets/svg/signup';

/**
 * Reusable Input Component
 * 
 * @param {string} type - Input type: 'text', 'email', 'password', 'date', etc.
 * @param {string} name - Input name attribute
 * @param {string} value - Input value
 * @param {function} onChange - Change handler function
 * @param {function} onBlur - Blur handler function (optional)
 * @param {string} placeholder - Placeholder text
 * @param {string} label - Label text
 * @param {boolean} required - Whether field is required
 * @param {string} error - Error message to display
 * @param {string} hint - Hint text to display below input
 * @param {string} icon - Icon type: 'email', 'password', 'person', 'calendar', 'location', 'clock', 'globe'
 * @param {number} maxLength - Maximum length
 * @param {string} className - Additional CSS classes
 * @param {boolean} showPasswordToggle - Show password toggle button (for password type)
 * @param {object} ...props - Other input props
 */
const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder = '',
  label = '',
  required = false,
  error = '',
  hint = '',
  icon,
  maxLength,
  className = '',
  showPasswordToggle = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  // Icon components
  const renderIcon = () => {
    if (!icon) return null;

    const iconClass = 'absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400';

    switch (icon) {
      case 'email':
        return (
          <div className={iconClass}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.667 3.33301H3.33366C2.41318 3.33301 1.66699 4.0792 1.66699 4.99967V14.9997C1.66699 15.9201 2.41318 16.6663 3.33366 16.6663H16.667C17.5875 16.6663 18.3337 15.9201 18.3337 14.9997V4.99967C18.3337 4.0792 17.5875 3.33301 16.667 3.33301Z" stroke="#6CA6C1" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M18.3337 5.83301L10.8587 10.583C10.6014 10.7442 10.3039 10.8297 10.0003 10.8297C9.69673 10.8297 9.39927 10.7442 9.14199 10.583L1.66699 5.83301" stroke="#6CA6C1" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        );
      case 'password':
        return (
          <div className={iconClass}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8333 9.16699H4.16667C3.24619 9.16699 2.5 9.91318 2.5 10.8337V16.667C2.5 17.5875 3.24619 18.3337 4.16667 18.3337H15.8333C16.7538 18.3337 17.5 17.5875 17.5 16.667V10.8337C17.5 9.91318 16.7538 9.16699 15.8333 9.16699Z" stroke="#6CA6C1" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M5.83301 9.16699V5.83366C5.83301 4.72859 6.27199 3.66878 7.0534 2.88738C7.8348 2.10598 8.89461 1.66699 9.99967 1.66699C11.1047 1.66699 12.1646 2.10598 12.946 2.88738C13.7274 3.66878 14.1663 4.72859 14.1663 5.83366V9.16699" stroke="#6CA6C1" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        );
      case 'person':
        return (
          <div className={iconClass}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.25 15.75V14.25C14.25 13.4544 13.9339 12.6913 13.3713 12.1287C12.8087 11.5661 12.0456 11.25 11.25 11.25H6.75C5.95435 11.25 5.19129 11.5661 4.62868 12.1287C4.06607 12.6913 3.75 13.4544 3.75 14.25V15.75" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9 8.25C10.6569 8.25 12 6.90685 12 5.25C12 3.59315 10.6569 2.25 9 2.25C7.34315 2.25 6 3.59315 6 5.25C6 6.90685 7.34315 8.25 9 8.25Z" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </div>
        );
      case 'calendar':
        return (
          <div className={iconClass}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1.5V4.5" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 1.5V4.5" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M14.25 3H3.75C2.92157 3 2.25 3.67157 2.25 4.5V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V4.5C15.75 3.67157 15.0784 3 14.25 3Z" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M2.25 7.5H15.75" stroke="#6CA6C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </div>
        );
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
  const hasPasswordToggle = isPassword && showPasswordToggle;
  const paddingLeft = hasIcon ? 'pl-12' : 'pl-4';
  const paddingRight = hasPasswordToggle ? 'pr-12' : 'pr-4';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="block font-roboto font-medium text-[14px] leading-[21px] text-text-dark mb-2">
          {label} {required && <span className="text-cinnebar-red">*</span>}
        </label>
      )}
      <div className="relative">
        {renderIcon()}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`px-4 py-3 ${paddingLeft} ${paddingRight} border ${error ? 'border-[red-500]' : 'border-[#E5E7EB]'
            } rounded-[14px] border-2 outline-none w-full h-[56px] font-roboto text-[14px] leading-[100%] tracking-[0] text-oxford-blue placeholder:text-[14px] placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-dark-gray focus:border-[#6CA6C1] transition-colors`}
          {...props}
        />
        {hasPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            tabIndex={-1}
          >
            <img
              src={showPassword ? openeye : eye}
              alt={showPassword ? 'Hide password' : 'Show password'}
              className="w-5 h-5"
            />
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs font-normal text-[#6CA6C1] font-roboto">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-xs font-normal text-[#6CA6C1] font-roboto">{hint}</p>
      )}
    </div>
  );
};

export default Input;
