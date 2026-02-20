import React from "react";
import { logoimg } from "../../assets/svg/howitworks";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const ProductsHeroSection = () => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-b from-[#F0F9FF] to-[#FFFFFF]">
      <div
        className={`max-w-[1180px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 px-4 md:px-8 lg:px-12 2xl:px-0 py-[96px] ${isArabic ? "lg:flex-row-reverse" : ""
          }`}
      >
        {/* Left - Text Content */}
        <div
          className={`w-full lg:max-w-[520px] flex flex-col gap-6 ${isArabic ? "text-right items-end" : "text-left items-start"
            }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FEE2E2] text-[#DC2626] px-4 py-2 rounded-full w-fit">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_30_3027)">
                <path d="M6.62479 10.3333C6.56527 10.1026 6.44502 9.89203 6.27653 9.72355C6.10805 9.55507 5.8975 9.43481 5.66679 9.3753L1.57679 8.32063C1.50701 8.30082 1.4456 8.2588 1.40186 8.20093C1.35813 8.14306 1.33447 8.0725 1.33447 7.99996C1.33447 7.92743 1.35813 7.85687 1.40186 7.799C1.4456 7.74113 1.50701 7.6991 1.57679 7.6793L5.66679 6.62396C5.89742 6.5645 6.10792 6.44435 6.27639 6.27599C6.44486 6.10763 6.56517 5.89722 6.62479 5.66663L7.67946 1.57663C7.69906 1.50657 7.74105 1.44486 7.799 1.40089C7.85696 1.35693 7.92771 1.33313 8.00046 1.33313C8.0732 1.33313 8.14395 1.35693 8.20191 1.40089C8.25987 1.44486 8.30185 1.50657 8.32146 1.57663L9.37546 5.66663C9.43497 5.89734 9.55523 6.10789 9.72371 6.27637C9.89219 6.44486 10.1027 6.56511 10.3335 6.62463L14.4235 7.67863C14.4938 7.69803 14.5558 7.73997 14.6 7.79801C14.6442 7.85606 14.6682 7.927 14.6682 7.99996C14.6682 8.07292 14.6442 8.14387 14.6 8.20191C14.5558 8.25996 14.4938 8.3019 14.4235 8.3213L10.3335 9.3753C10.1027 9.43481 9.89219 9.55507 9.72371 9.72355C9.55523 9.89203 9.43497 10.1026 9.37546 10.3333L8.32079 14.4233C8.30118 14.4934 8.2592 14.5551 8.20124 14.599C8.14328 14.643 8.07254 14.6668 7.99979 14.6668C7.92704 14.6668 7.85629 14.643 7.79834 14.599C7.74038 14.5551 7.69839 14.4934 7.67879 14.4233L6.62479 10.3333Z" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.3335 2V4.66667" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.6667 3.33337H12" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.6665 11.3334V12.6667" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.33333 12H2" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_30_3027">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span className="font-archivo font-semibold text-[14px] leading-5">
              {t("products.hero.badge")}
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-archivo font-bold text-text-dark tracking-[-2.62px] leading-[90px] text-[36px] sm:text-[44px] lg:text-[72px]">
            {t("products.hero.title1")}{" "}
            <br className="hidden sm:block" />
            <span className="text-[#ED4122]">
              {t("products.hero.titleHighlight")}
            </span>{" "}
            <br className="hidden sm:block" />
            {t("products.hero.title2")}
          </h1>

          {/* Subtitle */}
          <p className="font-roboto font-normal text-[#475569] text-[20px] leading-[32px] mt-3 max-w-[516px]">
            {t("products.hero.subtitle")}
          </p>

          {/* Buttons */}
          <div
            className={`flex flex-col sm:flex-row mt-3 gap-4 ${isArabic ? "items-end sm:flex-row-reverse" : "items-start"
              }`}
          >
            <button
              onClick={() => navigate("/create-account")}
              className="bg-gradient-to-b from-[#ED4122] to-[#FF8B67] hover:opacity-90 transition-opacity text-white rounded-[14px] h-[64px] px-7 font-archivo font-semibold text-[18px] leading-[28px] tracking-[-0.44px] inline-flex items-center gap-2"
            >
              {t("products.hero.startFree")}
              <svg
                width="22"
                height="22"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.16699 10H15.8337"
                  stroke="white"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.60938 4L15.4427 9.83333L9.60938 15.6667"
                  stroke="white"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => navigate("/how-it-works")}
              className="bg-white border-2 border-[#525252] hover:border-[#CBD5E1] transition-colors text-[#525252] rounded-[14px] h-[64px] px-7 font-archivo font-medium text-[18px] leading-[28px] tracking-[-0.44px] inline-flex items-center gap-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3L20 12L6 21V3Z" stroke="#525252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              {t("products.hero.seeHowItWorks")}
            </button>
          </div>
        </div>

        {/* Right - Image Card with Stats */}
        <div className="w-full lg:max-w-[536px]">
          <div className="relative bg-white rounded-[20px] px-[33px] pt-[33px] overflow-hidden shadow-[0_18px_45px_rgba(15,23,42,0.12)] border border-[#E5E7EB]">
            {/* Main Image */}
            <div className="w-full h-[265px] overflow-hidden rounded-[16px]">
              <img
                src={logoimg}
                alt="Students studying"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-around pb-[33px] pt-6 bg-white">
              <div className="text-center">
                <div className="font-archivo font-bold text-[22px] sm:text-[30px] leading-[36px] text-[#032746]">
                  {t("products.hero.stats.questions.value")}
                </div>
                <div className="font-roboto font-normal tracking-[-0.15px] text-[11px] sm:text-sm text-[#6CA6C1] mt-1">
                  {t("products.hero.stats.questions.label")}
                </div>
              </div>
              <div className="w-px h-10 bg-[#E5E7EB]" />
              <div className="text-center">
                <div className="font-archivo font-bold text-[22px] sm:text-[30px] leading-[36px] text-[#032746]">
                  {t("products.hero.stats.successRate.value")}
                </div>
                <div className="font-roboto font-normal tracking-[-0.15px] text-[11px] sm:text-sm text-[#6CA6C1] mt-1">
                  {t("products.hero.stats.successRate.label")}
                </div>
              </div>
              <div className="w-px h-10 bg-[#E5E7EB]" />
              <div className="text-center">
                <div className="font-archivo font-bold text-[22px] sm:text-[30px] leading-[36px] text-[#032746]">
                  {t("products.hero.stats.students.value")}
                </div>
                <div className="font-roboto font-normal tracking-[-0.15px] text-[11px] sm:text-sm text-[#6CA6C1] mt-1">
                  {t("products.hero.stats.students.label")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsHeroSection;
