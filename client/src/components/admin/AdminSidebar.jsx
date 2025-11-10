import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { logodash } from '../../assets/svg/dashboard/sidebar';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/users', label: 'User Management' },
    { path: '/admin/question-bank', label: 'Question Bank' },
    { path: '/admin/subscriptions', label: 'Subscriptions & Billing' },
    { path: '/admin/reports', label: 'Reports & Analytics' },
    { path: '/admin/moderation', label: 'Content Moderation' },
    { path: '/admin/settings', label: 'System Settings' },
    { path: '/admin/security', label: 'Security & Permissions' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-oxford-blue h-screen overflow-y-auto transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } w-64`}
    >
      <div className="mb-6 p-4 pt-4 border-b border-white/10 text-white flex flex-col items-start">
        <img src={logodash} alt="Talaam Admin" className="" />
      </div>
      <nav className="space-y-2 p-3">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full max-w-[256px] h-[44px] ${
                active ? 'bg-white text-oxford-blue' : 'text-white hover:bg-blue-900'
              }`}
            >
              {active && (
                <div className="absolute left-0 top-0 h-full w-[5px] bg-orange-dark rounded-l-lg"></div>
              )}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;


