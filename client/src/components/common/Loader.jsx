import React from 'react';

export const Loader = ({ 
  size = 'md', 
  color = 'oxford-blue', 
  text = null,
  className = '',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  // SVG-based circular gradient loader
  const spinner = (
    <div className={`${sizeClasses[size]} relative`}>
      <svg 
        className="animate-spin" 
        viewBox="0 0 50 50" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="spinnerGradient" gradientUnits="userSpaceOnUse" x1="0" y1="25" x2="50" y2="25">
            <stop offset="0%" stopColor="#ED4122" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ED4122" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ED4122" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="url(#spinnerGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`min-h-screen bg-[#F5F7FB] px-4 py-6 sm:px-6 sm:py-8 2xl:px-16 flex items-center justify-center ${className}`}>
        <div className="text-center flex flex-col items-center justify-center">
          {spinner}
          {text && (
            <p className="mt-4 text-oxford-blue font-roboto">{text}</p>
          )}
        </div>
      </div>
    );
  }

  if (text) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        {spinner}
        <p className="mt-4 text-oxford-blue font-roboto">{text}</p>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {spinner}
    </div>
  );
};

export default Loader;