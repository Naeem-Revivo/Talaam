import React from 'react';

const StepCard = ({ 
  stepNumber,
  stepText,
  title,
  description,
  iconBgColor,
  icon
}) => {
  return (
    <div className="bg-white rounded-lg mobile:p-4 tablet:p-5 laptop:p-6 flex flex-row items-center justify-start mobile:gap-4 tablet:gap-6 laptop:gap-6 shadow-lg mobile:w-[342px] mobile:h-[151px] tablet:w-full laptop:w-[610px] desktop:w-[783px] desktop:p-10 tablet:h-auto laptop:h-[200px] desktop:h-[248px] mobile:text-left tablet:text-left laptop:text-left">
      
      {/* Icon */}
      <div className={`mobile:w-[70px] mobile:h-[70px] tablet:w-[80px] tablet:h-[80px] laptop:w-[87px] laptop:h-[87px] desktop:w-[100px] desktop:h-[100px] ${iconBgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      
      <div className="flex flex-col gap-2">
        {/* Step Number */}
        <div className={`font-archivo font-semibold mobile:text-[24px] mobile:leading-[100%] tablet:text-[22px] tablet:leading-[100%] laptop:text-[24px] laptop:leading-[100%] desktop:text-[28px] desktop:leading-[100%] tracking-[0] ${stepText}`}>
          {stepNumber}
        </div>
        {/* Title */}
        <h3 className="font-archivo font-semibold mobile:text-[22px] mobile:leading-[100%] tablet:text-[24px] tablet:leading-[100%] laptop:text-[26px] laptop:leading-[100%] desktop:text-[30px] desktop:leading-[100%] tracking-[0] text-oxford-blue mobile:mb-1">
          {title}
        </h3>
        
        {/* Description */}
        <p className="font-roboto font-normal mobile:text-[16px] mobile:leading-[140%] tablet:text-[17px] tablet:leading-[100%] laptop:text-[18px] laptop:leading-[100%] desktop:text-[20px] desktop:leading-[100%] tracking-[0] text-oxford-blue">
          {description}
        </p>
      </div>
    </div>
  );
};

export default StepCard;
