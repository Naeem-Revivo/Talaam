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

  const colorClasses = {
    'oxford-blue': 'border-oxford-blue',
    'cinnebar-red': 'border-cinnebar-red',
    'red': 'border-[#ED4122]',
    'moonstone-blue': 'border-moonstone-blue',
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color] || colorClasses['oxford-blue']}`}></div>
  );

  if (fullScreen) {
    return (
      <div className={`min-h-screen bg-[#F5F7FB] px-4 py-6 sm:px-6 sm:py-8 2xl:px-16 flex items-center justify-center ${className}`}>
        <div className="text-center">
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

