import React from "react";
import { email, whatsapp } from "../../assets/svg";
import { useLanguage } from "../../context/LanguageContext";

const ContactOptions = () => {
  const { t } = useLanguage();
  return (
    <section className="py-10 md:py-14 lg:py-16 bg-light-gradient h-auto lg:h-[435px] flex justify-center items-center">
      <div className="flex justify-center items-center w-full px-4 md:px-6 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-[120px] w-full lg:w-auto items-center lg:items-stretch">
          {/* Email Card */}
          <div className="bg-white flex flex-col items-center justify-center gap-3 shadow-[0px_2px_14px_0px_#FF8B6740] rounded-lg w-[289px] md:w-[450px] lg:w-[600px] h-[200px] md:h-auto lg:h-[235px] p-6 md:p-7 lg:p-8 text-center">
            <div className="">
              <img src={email} alt="" className="" />
            </div>
            <h3 className="font-archivo font-semibold text-[22px] md:text-[24px] lg:text-[26px] leading-[31.2px] tracking-[0] align-middle text-oxford-blue">{t('contact.contactOptions.email')}</h3>
            <p className="font-roboto font-semibold text-[16px] md:text-[17px] lg:text-[18px] leading-[25.6px] tracking-[0] align-middle text-oxford-blue">{t('contact.contactOptions.emailValue')}</p>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white flex flex-col items-center justify-center gap-3 shadow-[0px_2px_14px_0px_#FF8B6740] rounded-lg w-[289px] md:w-[450px] lg:w-[600px] h-[200px] md:h-auto lg:h-[235px] p-6 md:p-7 lg:p-8 text-center">
            <div className="">
              <img src={whatsapp} alt="" className="" />
            </div>
            <h3 className="font-archivo font-semibold text-[22px] md:text-[24px] lg:text-[26px] leading-[31.2px] tracking-[0] align-middle text-oxford-blue">{t('contact.contactOptions.whatsapp')}</h3>
            <p className="font-roboto font-semibold text-[16px] md:text-[17px] lg:text-[18px] leading-[25.6px] tracking-[0] align-middle text-oxford-blue">{t('contact.contactOptions.whatsappValue')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactOptions;
