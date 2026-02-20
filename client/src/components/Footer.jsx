import React, { useState } from "react";
import { Link } from "react-router-dom";
import { fb, instagram, linkedin, youtube, logofooter } from "../assets/svg";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const isRTL = language === 'ar';
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-b from-[#0F2D46] to-[#173B50] text-white">
      <div className="py-8 md:py-12 laptop:pt-20 laptop:pb-12">
        <div className="max-w-[1180px] mx-auto w-full px-4 md:px-8 lg:px-12 2xl:px-0">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-10">
            {/* Left Section - Logo, Tagline, and Newsletter */}
            <div className="flex flex-col gap-6 w-full lg:w-auto lg:max-w-[543px]">
              <div className="flex items-center gap-3">
              {/* Logo */}
              <Link to="/" className="self-start">
                <img
                  src={logofooter}
                  alt="Taalam Logo"
                  className="w-[100px] h-[50px] md:w-[80px] md:h-[48px] cursor-pointer hover:opacity-80 transition"
                />
              </Link>

              {/* Tagline */}
              <p className="font-roboto font-normal text-[14px] leading-[22px] tracking-[-0.44px] text-[#FFFFFFB2] max-w-[433px]">
                {t('footer.mission')}
              </p>
              </div>

              {/* Stay Updated Section */}
              <div className="flex flex-col gap-3">
                <h4 className="text-white font-roboto font-bold text-[18px] leading-[28px] tracking-[-0.44px]">
                  {t('footer.subscribe.title')}
                </h4>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('footer.subscribe.placeholder')}
                      className="flex-1 px-4 py-3 h-[50px] rounded-[14px] bg-[#34495E] text-white text-[14px] md:text-[16px] leading-[100%] tracking-[0] outline-none placeholder:text-gray-400 border border-[#4A5F7A]"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-l from-[#DC2626] to-[#ED4122] text-white px-6 py-3 rounded-[10px] font-bold font-archivo text-[12px] leading-[100%] whitespace-nowrap hover:opacity-90 transition shrink-0"
                    >
                      {t('footer.subscribe.button')}
                    </button>
                  </div>
                  <p className="font-roboto font-normal text-[12px] leading-[16px] tracking-[0] text-[#FFFFFF80">
                    {t('footer.subscribe.description')}
                  </p>
                </form>
              </div>
            </div>

            {/* Right Section - Navigation Links */}
            <div className="w-full lg:w-auto flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Product */}
              <div>
                <h4 className="text-white font-roboto font-bold text-[16px] md:text-[18px] leading-[28px] tracking-[-0.44px] mb-4">{t('footer.product.title')}</h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/products"
                      className="font-roboto font-normal text-[14px] md:text-[14px] leading-[20px] tracking-[-0.15] text-[#FFFFFFB2] hover:text-white transition"
                    >
                      {t('footer.product.qudurat')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      className="font-roboto font-normal text-[14px] md:text-[14px] leading-[20px] tracking-[-0.15] text-[#FFFFFFB2] hover:text-white transition"
                    >
                      {t('footer.product.tahseely')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white font-roboto font-bold text-[16px] md:text-[18px] leading-[28px] tracking-[-0.44px] mb-4">{t('footer.company.title')}</h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/about"
                      className="font-roboto font-normal text-[14px] md:text-[14px] leading-[20px] tracking-[-0.15] text-[#FFFFFFB2] hover:text-white transition"
                    >
                      {t('footer.company.about')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/how-it-works"
                      className="font-roboto font-normal text-[14px] md:text-[14px] leading-[20px] tracking-[-0.15] text-[#FFFFFFB2] hover:text-white transition"
                    >
                      {t('footer.company.howItWorks')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="font-roboto font-normal text-[14px] md:text-[14px] leading-[20px] tracking-[-0.15] text-[#FFFFFFB2] hover:text-white transition"
                    >
                      {t('footer.company.contact')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white font-roboto font-bold text-[16px] md:text-[18px] leading-[28px] tracking-[-0.44px] mb-4">{t('footer.support.title')}</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="font-roboto font-normal text-[14px] md:text-[14px] leading-[20px] tracking-[-0.15] text-[#FFFFFFB2] hover:text-white transition"
                    >
                      {t('footer.support.helpCenter')}
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="font-roboto font-normal text-[14px] md:text-[14px] leading-[20px] tracking-[-0.15] text-[#FFFFFFB2] hover:text-white transition"
                    >
                      {t('footer.support.privacyPolicy')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright, Social, Language */}
        <div className="max-w-[1180px] mx-auto w-full border-t border-[#34495E] mt-12 pt-6 md:pt-8 px-4 md:px-8 lg:px-12 2xl:px-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="font-roboto font-normal text-[12px] md:text-[14px] leading-[10px] tracking-[-0.15px] text-[#FFFFFF99]">
              {t('footer.copyright')}
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-[14px] bg-[#FFFFFF1A] flex items-center justify-center hover:opacity-70 transition"
                aria-label="Facebook"
              >
                <img src={fb} alt="Facebook" className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-[14px] bg-[#FFFFFF1A] flex items-center justify-center hover:opacity-70 transition"
                aria-label="Instagram"
              >
                <img src={instagram} alt="Instagram" className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-[14px] bg-[#FFFFFF1A] flex items-center justify-center hover:opacity-70 transition"
                aria-label="LinkedIn"
              >
                <img src={linkedin} alt="LinkedIn" className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-[14px] bg-[#FFFFFF1A] flex items-center justify-center hover:opacity-70 transition"
                aria-label="YouTube"
              >
                <img src={youtube} alt="YouTube" className="w-4 h-4" />
              </a>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-3">
              {language === 'en' ? (
                <>
                  <button
                    onClick={toggleLanguage}
                    className="px-4 py-2 rounded-[10px] bg-[#FFFFFF1A] text-white font-roboto font-medium text-base tracking-[-0.31px] transition hover:opacity-80"
                  >
                    EN
                  </button>
                  <span className="text-[#FFFFFFB2] font-roboto font-medium text-base tracking-[-0.31px]">
                    عربي
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#FFFFFFB2] font-roboto font-medium text-base tracking-[-0.31px]">
                    EN
                  </span>
                  <button
                    onClick={toggleLanguage}
                    className="px-4 py-2 rounded-[10px] bg-[#FFFFFF1A] text-white font-roboto font-normal text-[14px] leading-[100%] transition hover:opacity-80"
                  >
                    عربي
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
