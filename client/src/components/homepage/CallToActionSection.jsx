import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const CallToActionSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  return (
    <div className="w-full mobile:h-auto tablet:h-auto laptop:h-[366px] bg-soft-blue-green flex items-center justify-center mobile:py-12 tablet:py-16 laptop:py-0">
      <div className="max-w-[1400px] mx-auto w-full text-center px-4 md:px-8 lg:px-12">
        {/* Headline */}
        <h2 className="font-archivo font-bold mobile:text-[32px] mobile:leading-[120%] tablet:text-[42px] tablet:leading-[110%] laptop:text-[54px] laptop:leading-[100%] tracking-[0] text-oxford-blue mobile:mb-4 tablet:mb-6 laptop:mb-6">
          {t('homepage.cta.title')}
        </h2>

        {/* Subtitle */}
        <p className="font-roboto font-normal laptop:w-[533px] mx-auto mobile:text-[16px] mobile:leading-[140%] tablet:text-[18px] tablet:leading-[120%] laptop:text-[20px] laptop:leading-[140%] tracking-[0] text-oxford-blue mobile:mb-8 tablet:mb-10 laptop:mb-12">
          {t('homepage.cta.subtitle')}
        </p>

        {/* Call-to-Action Button */}
        <button onClick={() => navigate("/question-banks")} className="bg-white shadow-lg font-roboto font-semibold text-[20px] leading-[100%] tracking-[0] uppercase mobile:px-8 mobile:py-3 tablet:px-10 tablet:py-4 laptop:w-[250px] rounded-lg mobile:w-auto tablet:w-auto laptop:h-[62px] text-oxford-blue">
          {t('homepage.cta.button')}
        </button>
      </div>
    </div>
  );
};

export default CallToActionSection;
