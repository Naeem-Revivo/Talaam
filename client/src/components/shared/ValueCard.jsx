import React from 'react';
import { rightarrow } from '../../assets/svg';
const ValueCard = ({ 
  title,
  description,
  actionText,
  iconBgColor,
  icon,
  gradientBg
}) => {
  return (
    <div className={`${gradientBg} border border-[#E0E0E1] rounded-[8px] mobile:p-4 desktop:p-6 tablet:p-5 laptop:p-6 mobile:w-full tablet:w-full laptop:w-[610px] laptop:h-[234px] desktop:w-[783px] desktop:h-[234px] shadow-md relative flex flex-col`}>
      {/* Icon */}
      <div className="flex justify-between">
      {/* Title */}
      <h3 className="font-archivo font-semibold desktop:text-[35px] desktop:leading-[40.6px] desktop:tracking-[-1.26px] mobile:text-[20px] mobile:leading-[28px] tablet:text-[24px] tablet:leading-[36px] laptop:text-[30px] laptop:leading-[40.6px] tracking-[-1.26px] text-oxford-blue mobile:pt-1 tablet:pt-2 laptop:pt-2 mobile:pr-8 tablet:pr-10 laptop:pr-0">
        {title}
      </h3>
      <div className={`mobile:w-6 mobile:h-6 tablet:w-7 desktop:w-10 desktop:h-10 tablet:h-7 laptop:w-8 laptop:h-8  ${iconBgColor} rounded-full flex items-center justify-center desktop:right-6 tablet:pt-5 tablet:right-7 laptop:pt-6 laptop:right-8`}>
        {icon}
      </div>
      
      </div>

      
      {/* Description */}
      <p className="font-roboto font-normal mobile:text-[14px] mobile:leading-[140%] tablet:text-[14.5px] tablet:leading-[150%] laptop:text-[18px] desktop:text-[20px] desktop:leading-[150%] tracking-[-0.3px] text-oxford-blue mobile:w-full tablet:w-full laptop:w-[500px] mobile:pt-2 tablet:pt-3 laptop:pt-3 flex-1">
        {description}
      </p>
      
      {/* Action Link */}
      <div className="flex justify-end gap-5 items-center mobile:mt-4 tablet:mt-4 laptop:mt-auto">
        <a href="#" className="font-inter font-medium mobile:text-[16px] mobile:leading-[140%] tablet:text-[17px] tablet:leading-[150%] laptop:text-[18px] laptop:leading-[150%] tracking-[-0.3px] align-middle">
          {actionText} 
        </a>
          <img src={rightarrow} alt="Right Arrow" className="mobile:pt-0 tablet:pt-1 laptop:pt-1 mobile:w-4 mobile:h-4 tablet:w-5 tablet:h-5 laptop:w-auto laptop:h-auto" />
      </div>
    </div>
  );
};

export default ValueCard;
