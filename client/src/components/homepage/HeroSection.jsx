import React from "react";
import {
  heropagelogo,
  orangebook,
  orangeaim,
  orangesmart,
} from "../../assets/svg";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
      <div className="max-w-full font-archivo bg-white">
        <div className={`max-w-[1180px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-10 px-4 md:px-8 lg:px-12 2xl:px-0 pt-10 pb-12 lg:pt-[60px] lg:pb-[60px] ${language === "ar" ? "lg:flex-row-reverse" : ""}`}>
          {/* Left */}
          <div className={`w-full lg:max-w-[547px] flex flex-col gap-6 ${language === "ar" ? "text-right items-end" : "text-left items-start"}`}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F2D46] to-[#173B50] text-white pl-[22px] pr-[32px] py-3 rounded-full w-fit shadow-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4.66663V14" stroke="#E5F5FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M1.99967 12C1.82286 12 1.65329 11.9298 1.52827 11.8047C1.40325 11.6797 1.33301 11.5101 1.33301 11.3333V2.66667C1.33301 2.48986 1.40325 2.32029 1.52827 2.19526C1.65329 2.07024 1.82286 2 1.99967 2H5.33301C6.04025 2 6.71853 2.28095 7.21863 2.78105C7.71872 3.28115 7.99967 3.95942 7.99967 4.66667C7.99967 3.95942 8.28063 3.28115 8.78072 2.78105C9.28082 2.28095 9.9591 2 10.6663 2H13.9997C14.1765 2 14.3461 2.07024 14.4711 2.19526C14.5961 2.32029 14.6663 2.48986 14.6663 2.66667V11.3333C14.6663 11.5101 14.5961 11.6797 14.4711 11.8047C14.3461 11.9298 14.1765 12 13.9997 12H9.99967C9.46924 12 8.96053 12.2107 8.58546 12.5858C8.21039 12.9609 7.99967 13.4696 7.99967 14C7.99967 13.4696 7.78896 12.9609 7.41389 12.5858C7.03882 12.2107 6.53011 12 5.99967 12H1.99967Z" stroke="#E5F5FF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span className="text-[14px] leading-5 font-bold font-roboto tracking-[-0.2px]">
                {t("homepage.hero.badge")}
              </span>
            </div>

            <h1 className="font-roboto font-bold text-[#0F172A] tracking-[0px] leading-[83.6px] text-[44px] sm:text-[56px] lg:text-[80px]">
              {t("homepage.hero.headline.line1")}
              <br />
              <span className="text-[#ED4122]">
                {t("homepage.hero.headline.highlightLine1").replace(/\s*&\s*$/, '')}
              </span>
              {' '}
              <span className="bg-gradient-to-r from-[#032746] to-[#173B50] bg-clip-text text-transparent">
                &amp;
              </span>
              <br />
              <span className="text-[#ED4122]">
                {t("homepage.hero.headline.highlightLine2")}
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#032746] to-[#173B50] bg-clip-text text-transparent">
                {t("homepage.hero.headline.line2")}
              </span>
            </h1>

            <p className="font-roboto text-[#475569] tracking-[-0.45px] font-normal text-[20px] leading-[24px] max-w-[547px]">
              {t("homepage.hero.subtitle")}
            </p>

            <div className={`flex flex-col sm:flex-row gap-4 ${language === "ar" ? "items-end sm:flex-row-reverse" : "items-start"}`}>
              <button
                onClick={() => navigate("/create-account")}
                className="bg-gradient-to-r from-[#0F2D46] to-[#173B50] hover:bg-[#0c2236] flex items-center justify-center gap-2 transition-colors text-white rounded-[16px] h-[64px] px-10 font-archivo font-bold text-[18px] leading-[28px] tracking-[-0.44px] box-shadow-[0px_4px_6px_-4px_#E5F5FF40] box-shadow-[0px_10px_15px_-3px_#E5F5FF40]"
              >
                {t("homepage.hero.primaryCta")}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.16699 10H15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M9.60938 4L15.4427 9.83333L9.60938 15.6667" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              </button>
              <button
                onClick={() => navigate("/products")}
                className="bg-white border-2 border-[#E5E7EB] hover:border-[#CBD5E1] transition-colors text-[#0F172A] rounded-[16px] h-[64px] px-9 font-archivo font-medium text-[18px] leading-[28px] tracking-[-0.44px]"
              >
                {t("homepage.hero.secondaryCta")}
              </button>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-8 pt-2 ${language === "ar" ? "sm:flex-row-reverse" : ""}`}>
              {["feature1", "feature2", "feature3"].map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.1675 8.33332C18.548 10.2011 18.2768 12.1428 17.399 13.8348C16.5212 15.5268 15.0899 16.8667 13.3437 17.6311C11.5976 18.3955 9.64215 18.5381 7.80354 18.0353C5.96494 17.5325 4.35429 16.4145 3.24019 14.8678C2.12609 13.3212 1.5759 11.4394 1.68135 9.53615C1.7868 7.63294 2.54153 5.8234 3.81967 4.4093C5.09781 2.9952 6.82211 2.06202 8.70502 1.76537C10.5879 1.46872 12.5156 1.82654 14.1666 2.77916" stroke="#ED4122" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.5 9.16671L10 11.6667L18.3333 3.33337" stroke="#ED4122" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  <span className="font-roboto text-[14px] leading-5 font-normal tracking-[-0.15px] text-[#475569]">
                    {t(`homepage.hero.features.${k}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="w-full">
            <div className="w-full rounded-[21px] h-[332px] overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.12)] border border-[#E5F5FF]">
              <img
                src={heropagelogo}
                alt={t("homepage.hero.rightImages.mainAlt")}
                className="w-full h-auto block"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1 - Dark */}
              <div className="bg-[#0F2D46] text-white rounded-[21px] p-[21px] shadow-[0_14px_35px_rgba(15,23,42,0.12)] flex flex-col justify-between min-h-[197px]">
                <div className="w-11 h-11 rounded-[12px] bg-white/10 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.62695 2.62744V16.6399C2.62695 17.1044 2.81149 17.5499 3.13997 17.8784C3.46845 18.2069 3.91397 18.3914 4.37851 18.3914H18.3909" stroke="white" stroke-width="2.18944" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M15.7636 14.8884V7.8822" stroke="white" stroke-width="2.18944" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M11.3847 14.8883V4.37903" stroke="white" stroke-width="2.18944" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.00586 14.8883V12.261" stroke="white" stroke-width="2.18944" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                </div>
                <div className="mt-4">
                  <div className="text-[31px] leading-[35px] font-bold font-roboto tracking-[0.32px]">
                    {t("homepage.hero.rightImages.card1.value")}
                  </div>
                  <div className="text-[12px] leading-[17px] tracking-[-0.18px] font-medium text-white/95 font-roboto mt-1">
                    {t("homepage.hero.rightImages.card1.label")}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] leading-[14px] tracking-[0px] font-medium text-white/90 font-roboto">
                      {t("homepage.hero.rightImages.card1.footer")}
                    </span>
                    <span className="text-[10px] leading-[14px] tracking-[0px] font-medium text-white/90 font-roboto">78%</span>
                  </div>
                  <div className="h-[9px] rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full w-[78%] bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Card 2 - White */}
              <div className="bg-white rounded-[16px] p-6 border border-[#E2E8F0] shadow-[0_14px_35px_rgba(15,23,42,0.10)] flex flex-col justify-between min-h-[180px]">
                <div className="w-11 h-11 rounded-[12px] bg-gradient-to-r from-[#0F2D46] to-[#173B50] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_30_273)">
                      <path d="M14.0128 18.3913V16.6397C14.0128 15.7106 13.6437 14.8196 12.9868 14.1626C12.3298 13.5057 11.4388 13.1366 10.5097 13.1366H5.25506C4.32598 13.1366 3.43495 13.5057 2.77799 14.1626C2.12103 14.8196 1.75195 15.7106 1.75195 16.6397V18.3913" stroke="white" stroke-width="2.18944" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M7.88201 9.63365C9.81672 9.63365 11.3851 8.06526 11.3851 6.13055C11.3851 4.19584 9.81672 2.62744 7.88201 2.62744C5.9473 2.62744 4.37891 4.19584 4.37891 6.13055C4.37891 8.06526 5.9473 9.63365 7.88201 9.63365Z" stroke="white" stroke-width="2.18944" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M19.267 18.3913V16.6397C19.2664 15.8636 19.0081 15.1096 18.5325 14.4961C18.057 13.8827 17.3912 13.4445 16.6396 13.2505" stroke="white" stroke-width="2.18944" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M14.0128 2.74109C14.7663 2.93402 15.4342 3.37226 15.9112 3.98671C16.3881 4.60117 16.647 5.35688 16.647 6.13472C16.647 6.91256 16.3881 7.66828 15.9112 8.28273C15.4342 8.89718 14.7663 9.33542 14.0128 9.52836" stroke="white" stroke-width="2.18944" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_30_273">
                        <rect width="21.0186" height="21.0186" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                </div>
                <div className="mt-4">
                  <div className="text-[31px] leading-[35px] font-bold font-roboto tracking-[0.32px] text-[#0F172A]">
                    {t("homepage.hero.rightImages.card2.value")}
                  </div>
                  <div className="text-[12px] leading-[17px] tracking-[-0.18px] font-medium text-[#475569] font-roboto mt-1">
                    {t("homepage.hero.rightImages.card2.label")}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6366F1] ring-2 ring-white z-[1]" />
                  <span className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0F2D46] to-[#173B50] ring-2 ring-white -ml-2 z-[2]" />
                  <span className="w-7 h-7 rounded-full bg-gradient-to-r from-[#0F2D46] to-[#173B50] ring-2 ring-white -ml-2 z-[3]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Cards Section (under hero) */}
        <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0 py-[80px]">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${language === "ar" ? "text-right" : "text-left"}`}>
            {[
              {
                icon: orangebook,
                titleKey: "homepage.hero.featuresSection.cards.evidence.title",
                descKey: "homepage.hero.featuresSection.cards.evidence.description",
              },
              {
                icon: orangeaim,
                titleKey: "homepage.hero.featuresSection.cards.laser.title",
                descKey: "homepage.hero.featuresSection.cards.laser.description",
              },
              {
                icon: orangesmart,
                titleKey: "homepage.hero.featuresSection.cards.learn.title",
                descKey: "homepage.hero.featuresSection.cards.learn.description",
              },
            ].map((card) => (
              <div
                key={card.titleKey}
                className="bg-white flex flex-col gap-[21px] rounded-[16px] border-2 border-[#F3F4F6] shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-[34px]"
              >
                <div className="w-14 h-14 rounded-[14px] flex items-center justify-center">
                  <img src={card.icon} alt="" className="w-full h-full" />
                </div>

                <h3 className="font-archivo font-bold text-[24px] leading-[32px] tracking-[-0.24px] text-text-dark">
                  {t(card.titleKey)}
                </h3>

                <p className="font-roboto font-normal text-[16px] leading-[25px] text-text-gray max-w-[282px]">
                  {t(card.descKey)}
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/how-it-works")}
                  className="inline-flex items-center gap-2 font-roboto font-semibold text-[14px] leading-[20px] text-text-dark hover:text-[#ED4122] transition-colors"
                >
                  {t("homepage.hero.featuresSection.learnMore")}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.33334 8H12.6667" stroke="#0F172A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8 3.33325L12.6667 7.99992L8 12.6666" stroke="#0F172A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
