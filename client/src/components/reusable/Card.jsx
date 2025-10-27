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
    <div className={`bg-white rounded-lg mobile:p-5 mobile:mx-4 flex flex-col gap-1 tablet:p-5 laptop:p-6 mobile:w-[352px] mobile:h-[270px] tablet:max-w-[350px] laptop:max-w-[430px] desktop:max-w-[513px] desktop:p-8 tablet:h-auto laptop:h-[248px] laptop:w-[400px] ${className}`}>
      {/* Icon */}
      <div className={`mobile:w-[74px] mobile:h-[74px] tablet:w-[67px] tablet:h-[67px] laptop:w-[74px] laptop:h-[74px] flex items-center justify-center mobile:mb-3 tablet:mb-3  ${iconClassName}`}>
        <img src={iconSrc} alt={title} className=" " />
      </div>
      
      {/* Title */}
      <h3 className={`mobile:text-[26px] mobile:font-semibold mobile:leading-[31.2px] mobile:font-archivo mobile:text-oxford-blue tablet:text-xl tablet:font-bold laptop:text-xl desktop:text-2xl desktop:font-bold laptop:font-bold text-gray-900 mobile:mb-2 tablet:mb-3 laptop:mb-3 tablet:font-roboto laptop:font-roboto ${titleClassName}`}>
        {title}
      </h3>
      
      {/* Description */}
      <p className={`text-oxford-blue mobile:text-[18px] mobile:font-normal mobile:leading-[150%] mobile:tracking-[-0.3px] mobile:font-roboto tablet:text-sm tablet:leading-relaxed tablet:font-roboto laptop:text-sm desktop:text-base desktop:leading-relaxed font-roboto ${descriptionClassName}`}>
        {description}
      </p>
    </div>
  );
};

export default Card;