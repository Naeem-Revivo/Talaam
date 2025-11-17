import React from 'react';
import { buttonvedio } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const PageHeroSection = ({
  titleParts = [],
  subtitle = '',
  imageSrc = '',
  imageAlt = '',
  buttons = [],
  textWidth = 'lg:w-[656px]',
  paddingTop = 'lg:pt-8',
  imageClassName = '',
  titleLayout = 'default' // 'default' or 'flex'
}) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const renderTitle = () => {
    if (titleLayout === 'flex') {
      return (
        <h1 className="leading-tight font-archivo mb-2 md:mb-2 lg:mb-2 flex items-start gap-2 md:flex md:items-center md:gap-2 lg:block text-oxford-blue">
          {titleParts.map((part, index) => (
            <span
              key={index}
              className={`font-bold text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] lg:text-[60px] lg:leading-[80px] tracking-[0] inline-block ${part.colorClass || 'text-oxford-blue'} ${part.className || ''}`}
            >
              {part.text}
            </span>
          ))}
        </h1>
      );
    }

    // Default layout (for Products page with divs)
    if (titleParts.some(part => part.useDiv)) {
      return (
        <h1 className="leading-[0] md:leading-tight lg:leading-tight font-archivo mb-2 md:mb-2 lg:mb-2">
          {titleParts.map((part, index) => (
            <div
              key={index}
              className={`font-bold text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] lg:text-[55px] lg:leading-[70px] tracking-[0] ${part.colorClass || 'text-oxford-blue'} ${part.className || ''}`}
            >
              {part.text}
            </div>
          ))}
        </h1>
      );
    }

    // Default span layout
    return (
      <h1 className="leading-tight font-archivo mb-2 md:mb-2 lg:mb-2 text-oxford-blue">
        {titleParts.map((part, index) => (
          <span
            key={index}
            className={`font-bold text-[32px] leading-[40px] md:text-[48px] md:leading-[56px] lg:text-[60px] lg:leading-[80px] tracking-[0] ${part.colorClass || 'text-oxford-blue'} ${part.className || ''}`}
          >
            {part.text}
          </span>
        ))}
      </h1>
    );
  };

  const renderButton = (button, index) => {
    if (button.variant === 'secondary') {
      return (
        <button
          key={index}
          onClick={button.onClick}
          className="w-[156px] h-[44px] md:w-[156px] md:h-[44px] lg:w-[193px] lg:h-[54px] font-archivo font-semibold border border-oxford-blue rounded-[12px] text-[12px] leading-[14px] md:text-[12px] md:leading-[14px] lg:text-[14px] lg:leading-[14px] tracking-[0] align-middle uppercase text-oxford-blue"
        >
          <div className="flex items-center justify-center gap-1">
            <p className="">{button.text}</p>
            {button.icon && (
              <p className="">
                <img src={button.icon} alt="" className="w-[18px] h-[18px] md:w-[18px] md:h-[18px] lg:w-auto lg:h-auto" />
              </p>
            )}
          </div>
        </button>
      );
    }

    // Primary button
    return (
      <button
        key={index}
        onClick={button.onClick}
        className="w-[140px] h-[44px] md:w-[140px] md:h-[44px] lg:w-[164px] lg:h-[54px] bg-orange-gradient rounded-[12px] text-white font-archivo font-semibold text-[12px] leading-[14px] md:text-[12px] md:leading-[14px] lg:text-[14px] lg:leading-[14px] tracking-[0] align-middle uppercase"
      >
        {button.text}
      </button>
    );
  };

  return (
    <div className="max-w-full font-archivo bg-soft-orange-fade">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-col lg:flex-row pt-8 pb-4 px-4 md:py-12 md:px-8 lg:px-12 lg:justify-around lg:min-h-[603px]">
        {/* Text content */}
        <div className={`w-full md:w-full ${textWidth} flex flex-col gap-0 md:gap-6 lg:gap-3 pt-0 md:pt-0 ${paddingTop} items-start md:items-center lg:items-start ${isArabic ? 'md:text-center lg:text-right' : 'text-left md:text-center lg:text-left'} order-1 md:order-1 lg:order-1`}>
          {renderTitle()}
          
          {subtitle && (
            <p className={`font-roboto text-oxford-blue w-full md:w-[600px] lg:w-full font-normal text-[14px] leading-[22px] md:text-[16px] md:leading-[25.6px] lg:text-[16px] lg:leading-[25.6px] tracking-[0] mt-2 md:mt-2 lg:mt-0 ${isArabic ? 'md:text-center lg:text-right' : 'text-left md:text-center lg:text-left'}`}>
              {subtitle}
            </p>
          )}
          
          {buttons.length > 0 && (
            <div className="flex md:flex-row gap-5 w-full md:w-auto lg:w-auto items-start md:items-center lg:items-start mt-6 md:mt-6 lg:mt-10">
              {buttons.map((button, index) => renderButton(button, index))}
            </div>
          )}
        </div>

        {/* Image */}
        {imageSrc && (
          <div className="w-full md:w-auto lg:w-auto flex justify-center md:justify-center lg:justify-start lg:pt-8 mt-8 md:mt-8 lg:mt-0 order-2 md:order-2 lg:order-2 mb-4 md:mb-0">
            <img
              src={imageSrc}
              alt={imageAlt}
              className={imageClassName || "w-[352px] h-[231px] md:w-auto md:px-7 laptop:px-0 md:h-auto lg:w-[670px] lg:h-[403px] rounded-[12px]"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeroSection;

