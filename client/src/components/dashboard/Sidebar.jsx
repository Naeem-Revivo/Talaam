import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { logodash, dashboardicon, practice, analytics, review, dashboardiconblue, practiceblue, blueanalytics, bluereview } from '../../assets/svg/dashboard/sidebar';
import { notif } from '../../assets/svg/dashboard/header';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useLanguage();

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
    {
      path: '/dashboard/subscription-billings',
      icon: review,
      iconBlue: bluereview,
      label: 'dashboard.sidebar.subscriptionsBilling',
    },
    {
      path: '/dashboard/announcements',
      icon: notif,
      iconBlue: notif,
      label: 'dashboard.sidebar.announcements',
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
        className={`fixed inset-y-0 left-0 z-50 bg-oxford-blue rounded-r-[14px] h-screen overflow-y-auto transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-[312px]`}
      >
        <div className="">
          {/* Logo */}
          <div className="p-4 flex justify-center flex-col items-start border-b h-[96px] border-white/10">
            <img src={logodash} alt="Logo" className="h-[60px] w-[100px]" />
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
                  className={`relative flex items-center justify-between gap-3 px-4 py-3 rounded-[14px] transition-all duration-200 w-full max-w-[280px] h-[56px] ${
                    active
                      ? 'bg-white text-oxford-blue'
                      : 'text-white hover:bg-blue-900'
                  }`}
                >
                  {/* {active && (
                    <div className="absolute left-0 top-0 h-full w-[5px] bg-orange-dark rounded-l-lg"></div>
                  )} */}
                  <div className="flex items-center gap-3">
                  {item.path === '/dashboard/announcements' ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                    >
                      <path
                        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                        stroke={active ? '#032746' : '#FFFFFF'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.73 21a2 2 0 0 1-3.46 0"
                        stroke={active ? '#032746' : '#FFFFFF'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <img 
                      src={active ? item.iconBlue : item.icon} 
                      alt={t(item.label)} 
                      className="w-4 h-4" 
                    />
                  )}
                  <span className="text-base font-normal font-roboto">{t(item.label)}</span>
                  </div>
                  {
                    active && (
                      <div className="h-full w-[6px] bg-[#032746] rounded-full"></div>
                    )
                  }
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