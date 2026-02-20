import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const HomepageStepCard = ({
  stepNumber,
  title,
  description,
  iconBgColor,
  icon,
  className,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div
      className={` bg-white rounded-[24px]
        w-full max-w-[360px] px-10 h-[264px] flex flex-col items-center justify-center
         text-center gap-[18px] ${className}
        ${isRTL ? 'rtl' : ''}`}
    >
      <div className="relative">
        <div
          className={`${iconBgColor} rounded-full w-[64px] h-[64px] flex items-center justify-center`}
        >
          {icon}
        </div>

        <div
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-cinnebar-red text-white
            flex items-center justify-center text-[12px] leading-none font-archivo font-bold"
          aria-label={`Step ${stepNumber}`}
        >
          {stepNumber}
        </div>
      </div>

      <h3 className="font-archivo font-bold text-text-dark text-[24px] leading-[32px]">
        {title}
      </h3>

      <p className="font-roboto text-text-gray font-normal text-[16px] leading-[26px] max-w-[280px]">
        {description}
      </p>
    </div>
  );
};

export default HomepageStepCard;

