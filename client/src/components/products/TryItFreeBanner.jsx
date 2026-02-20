import React from "react";
import { tryfreeimage } from "../../assets/svg";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const TryItFreeBanner = () => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#F9FAFB] py-12 md:py-16 lg:py-[96px]">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        <div
          className={`flex flex-col md:flex-row items-center bg-white rounded-[24px] overflow-hidden border-[2px] border-[#F3F4F6] gap-8 md:gap-12 lg:gap-16 ${
            isArabic ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            <div className=" overflow-hidden">
              <img
                src={tryfreeimage}
                alt="Students studying"
                className="w-full h-[220px] sm:h-[260px] md:h-[378px] object-cover"
              />
            </div>
          </div>

          {/* Text + CTA */}
          <div
            className={`w-full md:w-1/2 flex flex-col items-center text-center gap-2 ${
              isArabic ? "md:items-center" : "md:items-center"
            }`}
          >
            <h3 className="font-archivo font-semibold text-text-dark text-[22px] md:text-[20px] leading-[28px] italic">
              {t("products.whatYouGet.tryItFree")}
            </h3>
            <p className="font-roboto font-normal text-text-dark text-[13px] md:text-[14px] leading-[21px] max-w-[360px]">
              {t("products.whatYouGet.tryItFreeDesc")}
            </p>
            <button
              onClick={() => navigate("/create-account")}
              className="mt-1 w-[411px] justify-center bg-gradient-to-b from-[#ED4122] to-[#FF6B47] hover:opacity-90 transition-opacity text-white rounded-[16px] h-[52px] md:h-[56px] px-10 md:px-12 font-archivo font-bold text-[15px] md:text-[18px] leading-[28px] tracking-[-0.44px] inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(237,65,34,0.25)]"
            >
              {t("products.whatYouGet.getStartedFree")}
              <svg
                width="24"
                height="24"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryItFreeBanner;
