import React from 'react';

const Card = ({ 
  iconSrc, 
  title, 
  description, 
  className = '',
  iconClassName = '',
  titleClassName = '',
  descriptionClassName = ''
}) => {
  return (
    <div className={`bg-white rounded-lg mobile:p-5 flex flex-col gap-1 tablet:p-5 laptop:p-6 mobile:w-full mobile:max-w-[352px] mobile:h-[270px] tablet:max-w-[350px] laptop:max-w-[430px] desktop:max-w-[513px] desktop:p-8 tablet:h-auto laptop:h-[248px] laptop:w-[400px] ${className}`}>
      {/* Icon */}
      <div className={`mobile:w-[74px] mobile:h-[74px] tablet:w-[67px] tablet:h-[67px] laptop:w-[74px] laptop:h-[74px] flex items-center justify-center mobile:mb-3 tablet:mb-3  ${iconClassName}`}>
        <img src={iconSrc} alt={title} className=" " />
      </div>
      
      {/* Title */}
      <h3 className={`text-[26px] font-semibold leading-[31.2px] font-archivo text-oxford-blue mb-2 ${titleClassName}`}>
        {title}
      </h3>
      
      {/* Description */}
      <p className={`text-oxford-blue text-[16px] font-normal leading-[25.6px] font-roboto ${descriptionClassName}`}>
        {description}
      </p>
    </div>
  );
};

export default Card;