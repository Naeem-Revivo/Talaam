import React from 'react';
import { rightarrow } from '../../assets/svg';
import { useLanguage } from '../../context/LanguageContext';

const HomepageValueCard = ({
  pillText,
  pillClassName,
  iconSrc,
  title,
  description,
  actionText,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div
      className="bg-white rounded-2xl border border-black/5 shadow-[0_12px_28px_rgba(16,24,40,0.08)]
        px-[42px] py-9 w-full h-[230px]"
    >
      <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
        <div
          className={`flex items-center justify-center flex-shrink-0 h-12 w-12`}
        >
          <img src={iconSrc} alt="" className="w-12 h-12" />
        </div>

        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <span
              className={`inline-flex items-center px-3 py-[6px] rounded-full text-[12px] leading-none font-roboto font-medium ${pillClassName}`}
            >
              {pillText}
            </span>
          </div>

          <h3 className="mt-4 font-archivo font-bold text-text-dark text-[24px] leading-[32px]">
            {title}
          </h3>

          <p className="mt-1 font-roboto text-text-gray text-[16px] leading-[21px]">
            {description}
          </p>

          <button
            type="button"
            className={`mt-4 inline-flex items-center gap-2 font-archivo font-semibold text-text-dark text-[14px] leading-[20px]
              hover:opacity-80 transition ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <span>{actionText}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.33334 8H12.6667" stroke="#0F172A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8 3.33325L12.6667 7.99992L8 12.6666" stroke="#0F172A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </button>
        </div>
      </div>
    </div>
  );
};

export default HomepageValueCard;

