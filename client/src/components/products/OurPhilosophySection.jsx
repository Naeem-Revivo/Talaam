import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const OurPhilosophySection = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const philosophyCards = [
    {
      id: 1,
      emoji: '🔁',
      text: t('products.philosophy.point1'),
    },
    {
      id: 2,
      emoji: '🎯',
      text: t('products.philosophy.point2'),
    },
    {
      id: 3,
      emoji: '🧠',
      text: t('products.philosophy.point3'),
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-[96px]">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-10 md:mb-[64px]">
          <h2 className="font-archivo font-bold text-text-dark text-[32px] md:text-[48px] leading-[48px] tracking-[-0.96px]">
            {t('products.philosophy.title')}
          </h2>
          <p className="mt-3 md:mt-4 font-roboto font-normal text-text-gray text-[14px] md:text-[20px] leading-[28px]">
            {t('products.philosophy.subtitle')}
          </p>
        </div>

        {/* Cards Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {philosophyCards.map((card) => (
            <div
              key={card.id}
              className="bg-white border-[2px] border-[#F3F4F6] rounded-[16px] px-4 py-8 md:px-7 md:pt-10 md:pb-6 flex flex-col items-center text-center gap-5"
            >
              {/* Emoji Icon */}
              <span className="text-[36px] md:text-[26px] leading-[40px] font-normal text-text-dark">{card.emoji}</span>

              {/* Text */}
              <p className={`font-roboto font-normal text-text-dark text-[13px] md:text-[14px] leading-[21px] ${isArabic ? 'text-center' : 'text-center'}`}>
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPhilosophySection;
