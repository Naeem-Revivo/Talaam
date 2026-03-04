import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const ContactOptions = () => {
  const { t, language } = useLanguage();
  const isArabic = language === "ar";

  const options = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 6L12 13L2 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      iconBg: "bg-[#ED4122]",
      title: t("contact.contactOptions.email"),
      description: t("contact.contactOptions.emailDescription"),
      value: t("contact.contactOptions.emailValue"),
      valueColor: "text-[#ED4122]",
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      iconBg: "bg-[#059669]",
      title: t("contact.contactOptions.whatsapp"),
      description: t("contact.contactOptions.whatsappDescription"),
      value: t("contact.contactOptions.whatsappValue"),
      valueColor: "text-[#059669]",
    },
  ];

  return (
    <section className="w-full bg-[#F9FAFB] py-12 md:py-16 lg:py-[96px]">
      <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-archivo font-bold text-[#0F172A] text-[28px] md:text-[36px] lg:text-[48px] leading-[48px] tracking-[-0.96px]">
            {t("contact.contactOptions.title")}
          </h2>
          <p className="mt-3 font-roboto font-normal text-text-gray text-[14px] md:text-[20px] leading-[28px]">
            {t("contact.contactOptions.subtitle")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-[700px] mx-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-[#F3F4F6] px-14 py-8 flex flex-col items-center text-center gap-5"
            >
              {/* Icon */}
              <div
                className={`w-[80px] h-[80px] rounded-[16px] ${option.iconBg} flex items-center justify-center`}
              >
                {option.icon}
              </div>

              {/* Title */}
              <h3 className="font-archivo font-bold text-text-dark text-[18px] md:text-[24px] leading-[32px]">
                {option.title}
              </h3>

              {/* Description */}
              <p className="font-roboto font-normal text-[#6CA6C1] text-[13px] md:text-base">
                {option.description}
              </p>

              {/* Value */}
              <p className={`font-archivo font-semibold text-[18px] leading-[28px] ${option.valueColor}`}>
                {option.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactOptions;
