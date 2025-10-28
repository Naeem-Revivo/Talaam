import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const CallToActionSection = () => {
  const { t } = useLanguage();
  return (
    <div className="w-full mobile:h-auto tablet:h-auto laptop:h-[366px] bg-soft-blue-green flex items-center justify-center mobile:py-12 tablet:py-16 laptop:py-0">
      <div className="text-center max-w-4xl mx-auto mobile:px-4 tablet:px-8 laptop:px-8">
        {/* Headline */}
        <h2 className="font-archivo font-bold mobile:text-[32px] mobile:leading-[120%] tablet:text-[42px] tablet:leading-[110%] laptop:text-[54px] laptop:leading-[100%] tracking-[0] text-oxford-blue mobile:mb-4 tablet:mb-6 laptop:mb-6">
         <div className="md:flex gap-4">
         <p className="">{t('homepage.cta.title')}</p>
         </div>
        </h2>

        {/* Subtitle */}
        <p className="font-roboto font-normal laptop:w-[533px] mobile:text-[16px] mobile:leading-[140%] tablet:text-[18px] tablet:leading-[120%] laptop:text-[20px] laptop:leading-[140%] tracking-[0] text-center md:pl-9 text-oxford-blue mobile:mb-8 tablet:mb-10 laptop:mb-12">
          {t('homepage.cta.subtitle')}
        </p>

        {/* Call-to-Action Button */}
        <button className="bg-white shadow-lg font-roboto font-bold mobile:text-[14px] mobile:leading-[18px] tablet:text-[16px] tablet:leading-[20px] laptop:text-[16px] laptop:leading-[20px] tracking-[0] uppercase mobile:px-8 mobile:py-3 tablet:px-10 tablet:py-4 laptop:w-[230px] rounded-lg mobile:w-auto tablet:w-auto laptop:-[62px] text-oxford-blue">
          {t('homepage.cta.button')}
        </button>
      </div>
    </div>
  );
};

export default CallToActionSection;
