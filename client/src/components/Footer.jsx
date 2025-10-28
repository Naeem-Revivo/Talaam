import React, { useState } from "react";
import { fb, instagram, linkedin, youtube, logofooter } from "../assets/svg";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <footer className="bg-[#0A2342] text-white">
      <div className="flex flex-col justify-between min-h-[483px] py-5 md:py-10 laptop:pt-14">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-start justify-between px-4 md:px-8 lg:px-12 pt-5 md:pt-10 gap-8 lg:gap-0">
          {/* Logo and Mission Statement */}
          <div className="flex flex-col pb-6 md:pb-8 lg:pb-0">
            <img
              src={logofooter}
              alt="Taalam Logo"
              className="w-[100px] h-[50px] md:w-[114px] md:h-[57px]"
            />

            <p className="font-roboto pt-3 md:pt-4 font-normal text-[12px] md:text-[14px] w-full max-w-[257px] leading-[18px] md:leading-[20px] tracking-[0] text-white">
              {t('footer.mission')}
            </p>
          </div>

          {/* Middle Section - Navigation Links */}
          <div className="w-full lg:w-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Company */}
            <div className="mb-6 md:mb-8 lg:mb-0">
              <h4 className="text-white font-archivo font-bold text-[16px] md:text-[20px] leading-[100%] tracking-[0] mb-3 md:mb-4">{t('footer.company.title')}</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/about"
                    className="font-roboto font-normal text-[14px] md:text-[16px] leading-[100%] tracking-[0] text-white hover:text-orange-light transition"
                  >
                    {t('footer.company.about')}
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="font-roboto font-normal text-[14px] md:text-[16px] leading-[100%] tracking-[0] text-white hover:text-orange-light transition"
                  >
                    {t('footer.company.contact')}
                  </a>
                </li>
                <li>
                  <a
                    href="/how-it-works"
                    className="font-roboto font-normal text-[14px] md:text-[16px] leading-[100%] tracking-[0] text-white hover:text-orange-light transition"
                  >
                    {t('footer.company.howItWorks')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-archivo font-bold text-[16px] md:text-[20px] leading-[100%] tracking-[0] mb-3 md:mb-4">{t('footer.product.title')}</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/products"
                    className="font-roboto font-normal text-[14px] md:text-[16px] leading-[100%] tracking-[0] text-white hover:text-orange-light transition"
                  >
                    {t('footer.product.qudurat')}
                  </a>
                </li>
                <li>
                  <a
                    href="/products"
                    className="font-roboto font-normal text-[14px] md:text-[16px] leading-[100%] tracking-[0] text-white hover:text-orange-light transition"
                  >
                    {t('footer.product.tahseely')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Support - comes first on mobile */}
            <div className="order-3 md:order-none">
              <h4 className="text-white font-archivo font-bold text-[16px] md:text-[20px] leading-[100%] tracking-[0] mb-3 md:mb-4">{t('footer.support.title')}</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-roboto font-normal text-[14px] md:text-[16px] leading-[100%] tracking-[0] text-white hover:text-orange-light transition"
                  >
                    {t('footer.support.helpCenter')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-roboto font-normal text-[14px] md:text-[16px] leading-[100%] tracking-[0] text-white hover:text-orange-light transition"
                  >
                    {t('footer.support.privacyPolicy')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Social - shown on mobile/tablet in grid, hidden on desktop */}
            <div className="order-4 md:order-none lg:hidden">
              <h4 className="text-white font-archivo font-bold text-[16px] md:text-[20px] leading-[100%] tracking-[0] mb-3 md:mb-4">{t('footer.social')}</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-white hover:opacity-70 transition"
                >
                  <img src={fb} alt="Facebook" className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="#"
                  className="font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-white hover:opacity-70 transition"
                >
                  <img src={instagram} alt="Instagram" className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="#"
                  className="font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-white hover:opacity-70 transition"
                >
                  <img src={linkedin} alt="LinkedIn" className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="#"
                  className="font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-white hover:opacity-70 transition"
                >
                  <img src={youtube} alt="YouTube" className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Section - Subscribe and Social (stacked on desktop) */}
          <div className="w-full lg:w-auto flex flex-col gap-6">
            {/* Subscribe */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h4 className="text-white font-archivo font-bold text-[16px] md:text-[20px] leading-[100%] tracking-[0]">{t('footer.subscribe.title')}</h4>
              <p className="font-roboto font-normal text-[14px] md:text-[16px] leading-[100%] tracking-[0] text-white">
                {t('footer.subscribe.description')}
              </p>
              <form onSubmit={handleSubmit} className="">
                <div className="flex flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.subscribe.placeholder')}
                    className="flex-1 px-4 py-2 rounded-lg text-gray-900 text-[14px] md:text-[16px] leading-[100%] tracking-[0] outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-dark to-orange-light text-white px-6 py-2 rounded-lg uppercase text-sm font-semibold whitespace-nowrap hover:opacity-90 transition"
                  >
                    {t('footer.subscribe.button')}
                  </button>
                </div>
              </form>
              <p className="font-roboto font-normal text-[11px] md:text-[12px] leading-[100%] tracking-[0] text-white">
                {t('footer.subscribe.consent')}
              </p>
            </div>

            {/* Social - shown on desktop only, below subscribe */}
            <div className="hidden lg:block">
              <h4 className="text-white font-archivo font-bold text-[16px] md:text-[20px] leading-[100%] tracking-[0] mb-3 md:mb-4">{t('footer.social')}</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-white hover:opacity-70 transition"
                >
                  <img src={fb} alt="Facebook" className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="#"
                  className="font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-white hover:opacity-70 transition"
                >
                  <img src={instagram} alt="Instagram" className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="#"
                  className="font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-white hover:opacity-70 transition"
                >
                  <img src={linkedin} alt="LinkedIn" className="w-5 h-5 md:w-6 md:h-6" />
                </a>
                <a
                  href="#"
                  className="font-roboto font-normal text-[16px] leading-[100%] tracking-[0] text-white hover:opacity-70 transition"
                >
                  <img src={youtube} alt="YouTube" className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-[1400px] mx-auto w-full border-t border-[#333333] pt-6 md:pt-8 mt-6 md:mt-8 px-4">
          <p className="font-roboto font-normal text-[12px] md:text-[16px] leading-[100%] tracking-[0] text-white text-center pt-3">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
