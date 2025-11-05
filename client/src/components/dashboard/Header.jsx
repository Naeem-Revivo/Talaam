import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { user, notif } from '../../assets/svg/dashboard/header';
import { setting as settings, profile, logout } from '../../assets/svg/dashboard';
import { hamburger } from '../../assets/svg';

const Header = ({ onToggleSidebar }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = (action) => {
    console.log(`Clicked: ${action}`);
    setIsUserMenuOpen(false);
    // Add your navigation logic here
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-[70.8px]">
      <div className="flex items-center justify-between px-4 md:px-8 h-full">
        {/* Left Side - Hamburger Menu & Title */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Toggle sidebar"
          >
            <img src={hamburger} alt="Menu" className="w-6 h-6" />
          </button>
          
          {/* Title */}
          <h1 className="text-lg md:text-[20px] text-oxford-blue leading-[100%] tracking-[0%] font-archivo font-[600]">
            {t('dashboard.header.title')}
          </h1>
        </div>

        {/* Right Side - Language, Notifications, User */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="relative flex items-center bg-white rounded-full border border-gray-200 overflow-hidden w-[66px] h-[28px]"
          >
            <span
              className={`flex-1 flex items-center justify-center h-full transition-all duration-300 text-[10px] leading-[100%] font-dm-sans font-[500] ${
                language === 'en'
                  ? 'text-white bg-bluewhite-gradient'
                  : 'text-gray-700'
              }`}
            >
              EN
            </span>
            <span
              className={`flex-1 flex items-center justify-center h-full transition-all duration-300 text-[10px] leading-[100%] font-dm-sans font-[500] ${
                language === 'ar'
                  ? 'text-white bg-bluewhite-gradient'
                  : 'text-gray-700'
              }`}
            >
              عربي
            </span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-200 transition-colors">
            <img src={notif} alt="Notifications" className="" />
          </button>

          {/* User Info */}
          <div className="flex items-center relative" ref={menuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <img src={user} alt="User" className="" />
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-[14px] text-oxford-blue leading-[100%] tracking-[0px] font-archivo font-[700]">John Smith</p>
              <p className="text-[12px] leading-[100%] tracking-[0px] text-left pt-1 pl-1 font-roboto font-[400] text-[#6B7280]">User</p>
            </div>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-[192px] h-[154.4px] bg-white border border-[#E5E7EB] rounded-lg shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)] z-50">
                <div className="p-2">
                  <button
                    onClick={() => handleMenuItemClick('Settings')}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <img src={settings} alt="Settings" className="w-5 h-5" />
                    <span className="text-[14px] text-gray-700 font-roboto font-[400]">Settings</span>
                  </button>
                  <button
                    onClick={() => handleMenuItemClick('My Profile')}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <img src={profile} alt="My Profile" className="w-5 h-5" />
                    <span className="text-[14px] text-gray-700 font-roboto font-[400]">My Profile</span>
                  </button>
                  <button
                    onClick={() => handleMenuItemClick('Logout')}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <img src={logout} alt="Logout" className="w-5 h-5" />
                    <span className="text-[14px] text-[#EF4444] font-roboto font-[400]">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
