import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { user, notif } from '../../assets/svg/dashboard/header';
import { setting as settings, profile, logout } from '../../assets/svg/dashboard';
import { hamburger } from '../../assets/svg';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onToggleSidebar }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user: authUser, logout: doLogout, role } = useAuth();
  const location = useLocation();
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
    if (action === 'Logout') {
      doLogout();
      setIsUserMenuOpen(false);
      return;
    }
    setIsUserMenuOpen(false);
    // Add your navigation logic here
  };

  const getTitleByPath = (pathname) => {
    // Admin routes
    if (pathname.startsWith('/admin')) {
      if (pathname === '/admin') return 'Admin Dashboard';
      if (pathname.includes('add-announcements')) return 'New Announcements';
      if (pathname.includes('announcements')) return 'Site-wide Announcements';
      if (pathname.includes('language-management')) return 'Language Management';
      if (pathname.includes('email-template')) return 'Email Templates';
      if (pathname.includes('roles-permissions')) return 'Admin Roles & Permissions';
      if (pathname.startsWith('/admin/users')) return 'User Management';
      if (pathname.startsWith('/admin/question-bank')) return 'Question Bank';
      if (pathname.startsWith('/admin/question-management')) return 'Question Management';
      if (pathname.startsWith('/admin/add-question')) return 'Add New Question';
      if (pathname.startsWith('/admin/question-details')) return 'View Question Details';
      if (pathname.startsWith('/admin/create-variant')) return 'Create Variant';
      if (pathname.startsWith('/admin/classification')) return 'Classification Management';
      if (pathname.startsWith('/admin/subscriptions')) return 'Subscriptions & Billing';
      if (pathname.startsWith('/admin/reports')) return 'Reports & Analytics';
      if (pathname.startsWith('/admin/moderation')) return 'Content Moderation';
      if (pathname.startsWith('/admin/settings')) return 'System Settings';
      if (pathname.startsWith('/admin/security')) return 'Security & Permissions';
      return 'Admin';
    }
    // User dashboard routes
   if (pathname === "/dashboard")
    return t("dashboard.sidebar.dashboard");

  if (pathname.startsWith("/dashboard/practice"))
    return t("dashboard.sidebar.practiceSession");

  if (pathname.startsWith("/dashboard/analytics"))
    return t("dashboard.sidebar.performanceAnalytics");

  if (pathname.startsWith("/dashboard/review-incorrect"))
    return t("dashboard.sidebar.reviewIncorrect");

  if (pathname.startsWith("/dashboard/review-all"))
    return t("dashboard.sidebar.reviewAll");

  if (pathname.startsWith("/dashboard/review"))
    return t("dashboard.sidebar.reviewSessions");

  if (pathname.startsWith("/dashboard/session-summary"))
    return t("dashboard.sidebar.sessionSummary");

  if (pathname.startsWith("/dashboard/session"))
    return t("dashboard.sidebar.questionSession");

  return t("dashboard.header.title");
  };

  const headerTitle = getTitleByPath(location.pathname);

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
            {headerTitle}
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
              <p className="text-[14px] text-oxford-blue leading-[100%] tracking-[0px] font-archivo font-[700]">
                {authUser?.name || 'User'}
              </p>
              <p className="text-[12px] leading-[100%] tracking-[0px] text-left pt-1 pl-1 font-roboto font-[400] text-dark-gray">
                {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'}
              </p>
            </div>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-[192px] h-[154.4px] bg-white border border-[#E5E7EB] rounded-lg shadow-header-dropdown z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuItemClick('Settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <img src={settings} alt="Settings" className="w-5 h-5" />
                    <span className="text-[14px] text-gray-700 font-roboto font-[400]">Settings</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuItemClick('My Profile');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <img src={profile} alt="My Profile" className="w-5 h-5" />
                    <span className="text-[14px] text-gray-700 font-roboto font-[400]">My Profile</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuItemClick('Logout');
                    }}
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
