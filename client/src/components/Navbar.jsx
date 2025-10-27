import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  downarrow,
  fb,
  hamburger,
  instagram,
  linkedin,
  navlogo,
  youtube,
} from "../assets/svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md w-full">
      {/* Top Bar with Social Icons */}
      <div className="bg-oxford-blue w-full flex items-center justify-center h-[62px] px-4">
        <div className="space-x-4 w-[85%] items-center flex justify-end">
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

      {/* Main Navigation Bar */}
      <div className="bg-white h-[84px]">
        <div className="max-w-full px-4 laptop:px-24 tablet:px-16  pt-2">
          <div className="flex justify-between items-center py-[13.5px] h-full">
            {/* Logo Icon */}
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center">
                <img src={navlogo} alt="Taalam Logo" className="w-[86px] h-[43px]" />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden font-archivo lg:flex items-center space-x-8">
              <Link
                to="/how-it-works"
                className="text-oxford-blue font-medium text-[18px] leading-[100%] tracking-[0]"
              >
                How it works
              </Link>
              <div className="relative">
                <Link
                  to="/products"
                  className="text-oxford-blue flex items-center justify-center font-medium text-[18px] leading-[100%] tracking-[0]"
                >
                  Products
                  <img src={downarrow} alt="" className="" />
                </Link>
              </div>
              <Link
                to="/about"
                className="text-oxford-blue font-medium text-[18px] leading-[100%] tracking-[0]"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-oxford-blue font-medium text-[18px] leading-[100%] tracking-[0]"
              >
                Contact
              </Link>
            </div>

            {/* Right Side - Language Selector, Login, and Menu */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Language Selector */}
              <div className="flex items-center justify-around border-[#FF8B6736] rounded-xl border w-[66px] h-[28px]">
                <span className="bg-gradient-to-r from-orange-dark to-orange-light w-[35px] h-[24px] text-center items-center justify-center flex rounded-xl text-white text-[10px] font-medium">
                  EN
                </span>
                <span className="text-[#131313] text-[10px]">عربي</span>
              </div>

              {/* SIGN UP Button - Desktop only */}
              <button className="hidden lg:block bg-gradient-to-r from-orange-dark to-orange-light w-[105px] h-[40px] text-white py-2 rounded-md text-xs md:text-sm font-medium">
                SIGN UP
              </button>

              {/* Log In Button */}
              <button className="bg-gradient-to-r from-blue-dark to-blue-light w-[90px] md:w-[105px] h-[40px] text-white py-2 rounded-md text-xs md:text-sm font-medium">
                LOG IN
              </button>

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
          <div className="px-4 pt-4 pb-6 space-y-4">
            <Link
              to="/how-it-works"
              className="block px-3 py-2 text-lg font-archivo font-medium text-oxford-blue hover:bg-gray-50 rounded-md"
              onClick={toggleMenu}
            >
              How it works
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 text-lg font-archivo font-medium text-oxford-blue hover:bg-gray-50 rounded-md"
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-lg font-archivo font-medium text-oxford-blue hover:bg-gray-50 rounded-md"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-lg font-archivo font-medium text-oxford-blue hover:bg-gray-50 rounded-md"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            
            {/* Language Selector in Mobile Menu */}
            <div className="px-3 py-2">
              <div className="flex items-center justify-around border-[#FF8B6736] rounded-xl border w-[66px] h-[28px]">
                <span className="bg-gradient-to-r from-orange-dark to-orange-light w-[35px] h-[24px] text-center items-center justify-center flex rounded-xl text-white text-[10px] font-medium">
                  EN
                </span>
                <span className="text-[#131313] text-[10px]">عربي</span>
              </div>
            </div>

            {/* Buttons in Mobile Menu */}
            <div className="flex flex-col space-y-2 px-3">
              <button className="bg-gradient-to-r from-orange-dark to-orange-light text-white px-4 py-2 rounded-md text-sm font-medium">
                SIGN UP
              </button>
              <button className="bg-gradient-to-r from-blue-dark to-blue-light text-white px-4 py-2 rounded-md text-sm font-medium">
                LOG IN
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
