import React from "react";
import { checklist, calendar, bulb, flask, aim, statsicon } from "../../assets/svg/products";
import { useLanguage } from "../../context/LanguageContext";

const WhatYouGetSection = () => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  const features = [
    {
      icon: checklist,
      iconBg: "bg-[#0F2D46]",
      title: t("products.whatYouGet.features.practiceQuestions.title"),
      description: t("products.whatYouGet.features.practiceQuestions.description"),
    },
    {
      icon: bulb,
      iconBg: "bg-[#ED4122]",
      title: t("products.whatYouGet.features.explanations.title"),
      description: t("products.whatYouGet.features.explanations.description"),
    },
    {
      icon: statsicon,
      iconBg: "bg-[#6CA6C1]",
      title: t("products.whatYouGet.features.performanceTracking.title"),
      description: t("products.whatYouGet.features.performanceTracking.description"),
    },
    {
      icon: flask,
      iconBg: "bg-[#FF8B67]",
      title: t("products.whatYouGet.features.scienceBacked.title"),
      description: t("products.whatYouGet.features.scienceBacked.description"),
    },
    {
      icon: calendar,
      iconBg: "bg-[#0F2D46]",
      title: t("products.whatYouGet.features.studyPlanTools.title"),
      description: t("products.whatYouGet.features.studyPlanTools.description"),
    },
    {
      icon: aim,
      iconBg: "bg-[#ED4122]",
      title: t("products.whatYouGet.features.customizedExams.title"),
      description: t("products.whatYouGet.features.customizedExams.description"),
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-[96px]">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-10 md:mb-[66px]">
          <h2 className="font-archivo font-bold text-text-dark text-[32px] md:text-[48px] leading-[48px] tracking-[-0.96px]">
            {t("products.whatYouGet.title")}
          </h2>
          <p className="mt-3 md:mt-4 font-roboto font-normal text-text-gray text-[14px] md:text-[20px] leading-[28px]">
            {t("products.whatYouGet.subtitle")}
          </p>
        </div>

        {/* Features Grid - 2 columns, 3 rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border-[2px] border-[#F3F4F6] rounded-[16px] px-6 py-6 md:px-[34px] md:py-8 flex flex-col gap-3"
            >
              <div className={`flex items-start gap-6 ${isArabic ? "flex-row-reverse text-right" : ""}`}>
                {/* Icon */}
                <img
                  src={feature.icon}
                  alt=""
                  className="w-10 h-10 md:w-[64px] md:h-[64px] object-contain flex-shrink-0"
                />

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-archivo font-bold text-text-dark text-[16px] md:text-[24px] leading-[32px]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 font-roboto font-normal text-text-gray text-[13px] md:text-[16px] leading-[26px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
