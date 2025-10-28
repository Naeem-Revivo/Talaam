import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const StepCard = ({ 
  stepNumber,
  stepText,
  title,
  description,
  iconBgColor,
  icon
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className={`bg-white rounded-lg flex flex-row items-center justify-start shadow-lg 
      p-4 gap-4 w-full max-w-[342px] h-[151px]
      md:max-w-[610px] md:w-[610px] md:h-[200px] md:p-6 md:gap-6
      lg:max-w-[610px] lg:w-[610px] lg:h-[200px] lg:p-6 lg:gap-6
      ${isRTL ? 'text-right' : 'text-left'}`}>
      
      <div className={`flex-shrink-0 ${iconBgColor} rounded-full flex items-center justify-center 
        w-[70px] h-[70px]
        md:w-[80px] md:h-[80px]
        lg:w-[80px] lg:h-[80px]`}>
        {icon}
      </div>
      
      <div className="flex flex-col gap-2 md:gap-2 lg:gap-2 flex-1 min-w-0">
        <div className={`font-archivo font-semibold tracking-[0] ${stepText}
          text-[24px] leading-[100%]
          md:text-[22px] md:leading-[100%]
          lg:text-[22px] lg:leading-[100%]`}>
          {stepNumber}
        </div>
        <h3 className="font-archivo font-semibold tracking-[0] text-oxford-blue mb-1
          text-[20px] leading-[100%]
          md:text-[24px] md:leading-[100%]
          lg:text-[24px] lg:leading-[100%]">
          {title}
        </h3>
        <p className="font-roboto font-normal tracking-[0] text-oxford-blue
          text-[15px] leading-[100%]
          md:text-[17px] md:leading-[100%]
          lg:text-[17px] lg:leading-[100%]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default StepCard;