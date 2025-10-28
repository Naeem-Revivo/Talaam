import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const OurPhilosophySection = () => {
  const { t } = useLanguage();
  
  const philosophyPoints = [
    {
      id: 1,
      text: t('products.philosophy.point1'),
    },
    {
      id: 2,
      text: t('products.philosophy.point2'),
    },
    {
      id: 3,
      text: t('products.philosophy.point3'),
    },
  ];

  return (
    <section className="h-auto md:h-[506px] bg-[#C6D8D329] flex items-center justify-center py-12 md:py-0">

      <div className="flex flex-col gap-8 md:gap-16  items-center justify-center px-5 md:px-16 laptop:px-24 w-full max-w-[352px] md:max-w-none">
        <h2 className="font-archivo font-bold text-[36px] md:text-[60px] leading-[100%] tracking-[0] text-center md:text-start">
          {t('products.philosophy.title')}
        </h2>

        <div className="space-y-6 md:space-y-8 w-[352px] md:w-full">
          {philosophyPoints.map((point) => (
            <div key={point.id} className="flex items-start space-x-3 md:space-x-4">
              <div className="flex-shrink-0 mt-1">
                <span className="block w-3 h-3 bg-[#E43F21] rounded-full"></span>
              </div>
              <p className="font-roboto font-normal text-[14px] md:text-[18px] leading-[21px] md:leading-[100%] tracking-[0] text-black">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPhilosophySection;
