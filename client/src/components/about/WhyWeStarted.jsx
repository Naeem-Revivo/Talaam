import React from "react";
import { whywestartedimage } from "../../assets/svg";
import { useLanguage } from "../../context/LanguageContext";

const WhyWeStarted = () => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Title */}
        <h2 className="font-archivo font-bold text-text-dark text-[32px] md:text-[44px] lg:text-[48px] leading-[48px] tracking-[-0.96px] text-center mb-10 md:mb-14">
          {t("about.whyWeStarted.title")}
        </h2>

        {/* Two-column layout: image left, text right */}
        <div
          className={`flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 ${
            isArabic ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Left - Image */}
          <div className="w-full lg:w-[45%] mt-10 flex-shrink-0">
            <img
              src={whywestartedimage}
              alt="Our Story"
              className="w-[536px] h-[280px] sm:h-[357px] object-cover rounded-2xl"
            />
          </div>

          {/* Right - Text content */}
          <div
            className={`w-full lg:w-[55%] flex flex-col gap-5 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            {/* Subtitle */}
            <h3 className="font-archivo font-bold text-text-dark text-[22px] md:text-[30px] leading-[36px]">
              {t("about.whyWeStarted.subtitle")}
            </h3>

            {/* Paragraphs */}
            <p className="font-roboto font-normal mb-14 text-text-gray text-[13px] md:text-[18px] leading-[28px]">
              {t("about.whyWeStarted.paragraph1")}
            </p>
            <p className="font-roboto font-normal mb-6 text-text-gray text-[13px] md:text-[18px] leading-[28px]">
              {t("about.whyWeStarted.paragraph2")}
            </p>
            <p className="font-roboto font-normal text-text-gray text-[13px] md:text-[18px] leading-[28px]">
              {t("about.whyWeStarted.paragraph3")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyWeStarted;
