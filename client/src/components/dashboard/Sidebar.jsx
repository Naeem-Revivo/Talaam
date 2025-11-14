import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { logodash, dashboardicon, practice, analytics, review, dashboardiconblue, practiceblue, blueanalytics, bluereview } from '../../assets/svg/dashboard/sidebar';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useLanguage();

  console.log(location.pathname, "pathname")

  const menuItems = [
    {
      path: '/dashboard',
      icon: dashboardicon,
      iconBlue: dashboardiconblue,
      label: 'dashboard.sidebar.dashboard',
    },
    {
      path: '/dashboard/practice',
      icon: practice,
      iconBlue: practiceblue,
      label: 'dashboard.sidebar.practiceSession',
    },
    {
      path: '/dashboard/analytics',
      icon: analytics,
      iconBlue: blueanalytics,
      label: 'dashboard.sidebar.performanceAnalytics',
    },
    {
      path: '/dashboard/review',
      icon: review,
      iconBlue: bluereview,
      label: 'dashboard.sidebar.reviewSessions',
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar - Fixed on mobile, always visible on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-oxford-blue h-screen overflow-y-auto transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64`}
      >
        <div className="">
          {/* Logo */}
          <div className="mb-8 p-4 pt-4 flex justify-center flex-col items-start border-b border-white/10 pb-4">
            <img src={logodash} alt="Logo" className="" />
          </div>
          {/* Navigation Menu */}
          <nav className="space-y-2 p-3">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full max-w-[256px] h-[48px] ${
                    active
                      ? 'bg-white text-oxford-blue'
                      : 'text-white hover:bg-blue-900'
                  }`}
                >
                  {active && (
                    <div className="absolute left-0 top-0 h-full w-[5px] bg-orange-dark rounded-l-lg"></div>
                  )}
                  <img src={active ? item.iconBlue : item.icon} alt={t(item.label)} className="w-6 h-6" />
                  <span className="font-medium">{t(item.label)}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;