import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  downarrow,
  fb,
  hamburger,
  instagram,
  linkedin,
  navlogo,
  youtube,
} from "../assets/svg";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const getLinkClasses = (path) =>
    `text-oxford-blue font-medium text-[18px] leading-[100%] tracking-[0] ${
      isActive(path) ? "text-orange-light border-b-2 border-orange-light pb-1" : ""
    }`;
  const getMobileLinkClasses = (path) =>
    `block px-3 py-2 text-lg font-archivo font-medium rounded-md ${
      isActive(path) ? "text-orange-light bg-orange-light/10" : "text-oxford-blue hover:bg-gray-50"
    }`;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md w-full">
      {/* Top Bar with Social Icons */}
      <div className="bg-oxford-blue w-full h-[62px]">
        <div className="max-w-[1400px] mx-auto w-full h-full px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-end h-full gap-4">
          {/* Facebook */}
          <img src={fb} alt="" className="" />
          {/* Instagram */}
          <img src={instagram} alt="" className="" />
          {/* LinkedIn */}
          <img src={linkedin} alt="" className="" />
          {/* YouTube */}
          <img src={youtube} alt="" className="" />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white h-[84px]">
        <div className="max-w-[1400px] mx-auto w-full h-full px-4 md:px-8 lg:px-12 pt-2">
          <div className="flex justify-between items-center py-[13.5px] h-full">
            {/* Logo Icon */}
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center">
                <img src={navlogo} alt="Taalam Logo" className="w-[114px] h-[57px]" />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className={`hidden font-archivo lg:flex items-center ${language === 'ar' ? 'gap-8' : 'space-x-8'}`}>
              <Link
                to="/how-it-works"
                className={getLinkClasses("/how-it-works")}
              >
                {t('navbar.howItWorks')}
              </Link>
              <div className="relative">
                <Link
                  to="/products"
                  className={`${getLinkClasses("/products")} flex items-center ${language === 'ar' ? 'flex-row-reverse gap-1' : 'justify-center'}`}
                >
                  {t('navbar.products')}
                  <img src={downarrow} alt="" className="" />
                </Link>
              </div>
              <Link
                to="/about"
                className={getLinkClasses("/about")}
              >
                {t('navbar.about')}
              </Link>
              <Link
                to="/contact"
                className={getLinkClasses("/contact")}
              >
                {t('navbar.contact')}
              </Link>
            </div>

            {/* Right Side - Language Selector, Login, and Menu */}
            <div className={`flex items-center ${language === 'ar' ? 'gap-1 md:gap-3' : 'space-x-2 md:space-x-6'}`}>
              {/* Language Selector */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center justify-around border-[#FF8B6736] rounded-xl border w-[66px] h-[28px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className={`${language === 'en' ? 'bg-gradient-to-r from-orange-dark to-orange-light text-white' : 'text-[#131313]'} w-[35px] h-[24px] text-center items-center justify-center flex rounded-xl text-[10px] font-medium transition-all`}>
                  EN
                </span>
                <span className={`${language === 'ar' ? 'bg-gradient-to-r from-orange-dark to-orange-light text-white' : 'text-[#131313]'} w-[35px] h-[24px] text-center items-center justify-center flex rounded-xl text-[10px] font-medium transition-all`}>
                  عربي
                </span>
              </button>

              {/* SIGN UP Button - Desktop only */}
              <Link 
                to="/signupfree"
                className="hidden lg:flex bg-gradient-to-r from-orange-dark to-orange-light w-[105px] h-[40px] text-white  py-2.5 rounded-md text-xs md:text-sm font-medium text-center items-center justify-center"
              >
                {t('navbar.signUp')}
              </Link>

              {/* Log In Button */}
              <Link 
                to="/login"
                className="bg-gradient-to-r from-blue-dark to-moonstone-blue w-[90px] md:w-[105px] h-[40px] text-white py-2 rounded-md text-xs md:text-sm font-medium text-center flex items-center justify-center"
              >
                {t('navbar.logIn')}
              </Link>

              {/* Hamburger Menu button */}
              <button
                onClick={toggleMenu}
                className="flex items-center lg:hidden"
              >
                <img src={hamburger} alt="Menu" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-4 pb-6 space-y-4">
            <Link
              to="/how-it-works"
              className={getMobileLinkClasses("/how-it-works")}
              onClick={toggleMenu}
            >
              {t('navbar.howItWorks')}
            </Link>
            <Link
              to="/products"
              className={getMobileLinkClasses("/products")}
              onClick={toggleMenu}
            >
              {t('navbar.products')}
            </Link>
            <Link
              to="/about"
              className={getMobileLinkClasses("/about")}
              onClick={toggleMenu}
            >
              {t('navbar.about')}
            </Link>
            <Link
              to="/contact"
              className={getMobileLinkClasses("/contact")}
              onClick={toggleMenu}
            >
              {t('navbar.contact')}
            </Link>
            
            {/* Language Selector in Mobile Menu */}
            <div className="px-3 py-2">
              <button 
                onClick={toggleLanguage}
                className="flex items-center justify-around border-[#FF8B6736] rounded-xl border w-[66px] h-[28px] cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span className={`${language === 'en' ? 'bg-gradient-to-r from-orange-dark to-orange-light text-white' : 'text-[#131313]'} w-[35px] h-[24px] text-center items-center justify-center flex rounded-xl text-[10px] font-medium transition-all`}>
                  EN
                </span>
                <span className={`${language === 'ar' ? 'bg-gradient-to-r from-orange-dark to-orange-light text-white' : 'text-[#131313]'} w-[35px] h-[24px] text-center items-center justify-center flex rounded-xl text-[10px] font-medium transition-all`}>
                  عربي
                </span>
              </button>
            </div>

            {/* Buttons in Mobile Menu */}
            <div className="flex flex-col space-y-2 px-3">
              <Link 
                to="/signupfree"
                className="bg-gradient-to-r from-orange-dark to-orange-light text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                onClick={toggleMenu}
              >
                {t('navbar.signUp')}
              </Link>
              <button className="bg-gradient-to-r from-blue-dark to-moonstone-blue text-white px-4 py-2 rounded-md text-sm font-medium">
                {t('navbar.logIn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
