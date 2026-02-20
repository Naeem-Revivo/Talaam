import React from "react";
import { heroimage } from "../../assets/svg";
import { useLanguage } from "../../context/LanguageContext";

const ContactHeroSection = () => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  // Spark/starburst icon
  const SparkIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M8 0L9.5 5.5L15 7L9.5 8.5L8 14L6.5 8.5L1 7L6.5 5.5L8 0Z"
        fill="#ED4122"
      />
    </svg>
  );

  return (
    <section className="w-full bg-gradient-to-b from-[#F0F9FF] to-[#FFFFFF] py-12 md:py-16 lg:py-20">
      <div
        className={`max-w-[1180px] mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-10 px-4 md:px-8 lg:px-12 2xl:px-0 ${isArabic ? "lg:flex-row-reverse" : ""
          }`}
      >
        {/* Left Content */}
        <div
          className={`w-full lg:max-w-[500px] flex flex-col gap-5 ${isArabic ? "text-right items-end" : "text-left items-start"
            }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2FE] w-fit">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_31_774)">
                <path d="M6.6243 10.3333C6.56478 10.1026 6.44453 9.89203 6.27605 9.72355C6.10757 9.55507 5.89702 9.43481 5.6663 9.3753L1.5763 8.32063C1.50652 8.30082 1.44511 8.2588 1.40138 8.20093C1.35765 8.14306 1.33398 8.0725 1.33398 7.99996C1.33398 7.92743 1.35765 7.85687 1.40138 7.799C1.44511 7.74113 1.50652 7.6991 1.5763 7.6793L5.6663 6.62396C5.89693 6.5645 6.10743 6.44435 6.2759 6.27599C6.44438 6.10763 6.56468 5.89722 6.6243 5.66663L7.67897 1.57663C7.69857 1.50657 7.74056 1.44486 7.79851 1.40089C7.85647 1.35693 7.92722 1.33313 7.99997 1.33313C8.07271 1.33313 8.14346 1.35693 8.20142 1.40089C8.25938 1.44486 8.30136 1.50657 8.32097 1.57663L9.37497 5.66663C9.43449 5.89734 9.55474 6.10789 9.72322 6.27637C9.8917 6.44486 10.1023 6.56511 10.333 6.62463L14.423 7.67863C14.4933 7.69803 14.5553 7.73997 14.5995 7.79801C14.6437 7.85606 14.6677 7.927 14.6677 7.99996C14.6677 8.07292 14.6437 8.14387 14.5995 8.20191C14.5553 8.25996 14.4933 8.3019 14.423 8.3213L10.333 9.3753C10.1023 9.43481 9.8917 9.55507 9.72322 9.72355C9.55474 9.89203 9.43449 10.1026 9.37497 10.3333L8.3203 14.4233C8.3007 14.4934 8.25871 14.5551 8.20075 14.599C8.1428 14.643 8.07205 14.6668 7.9993 14.6668C7.92656 14.6668 7.85581 14.643 7.79785 14.599C7.73989 14.5551 7.69791 14.4934 7.6783 14.4233L6.6243 10.3333Z" stroke="#0369A1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.333 2V4.66667" stroke="#0369A1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14.6667 3.33337H12" stroke="#0369A1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.66699 11.3334V12.6667" stroke="#0369A1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.33333 12H2" stroke="#0369A1" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_31_774">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <span className="font-roboto font-normal text-[12px] md:text-[14px] leading-[20px] text-[#0369A1]">
              {t("contact.hero.badge")}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-archivo font-bold text-[#0F172A] text-[44px] sm:text-[56px] lg:text-[72px] leading-[90px] tracking-[-2.96]">
            {t("contact.hero.title1")}{" "}
            <span className="text-[#ED4122] italic">
              {t("contact.hero.title2")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-roboto text-[#475569] font-normal text-[16px] md:text-[20px] leading-[32px] max-w-[516px]">
            {t("contact.hero.subtitle")}
          </p>
        </div>

        {/* Right Image */}
        <div className="w-full lg:max-w-[540px]">
          <div className="rounded-[24px] ">
            <img
              src={heroimage}
              alt="Contact us"
              className="w-full h-[220px] sm:h-[280px] md:h-[355px] object-cover rounded-[16px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection;
