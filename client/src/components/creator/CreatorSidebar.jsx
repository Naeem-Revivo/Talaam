import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { logodash } from "../../assets/svg/dashboard/sidebar";

const DashboardIcon = ({ active }) => {
  const stroke = active ? "#032746" : "white";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2.5 7.5013L10 1.66797L17.5 7.5013V16.668C17.5 17.11 17.3244 17.5339 17.0118 17.8465C16.6993 18.159 16.2754 18.3346 15.8333 18.3346H4.16667C3.72464 18.3346 3.30072 18.159 2.98816 17.8465C2.67559 17.5339 2.5 17.11 2.5 16.668V7.5013Z"
        stroke={stroke}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 18.3333V10H12.5V18.3333"
        stroke={stroke}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const QuestionBankIcon = ({ active }) => {
  const stroke = active ? "#032746" : "white";
  const fill = active ? "#032746" : "white";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10.0001 18.3346C14.6025 18.3346 18.3334 14.6037 18.3334 10.0013C18.3334 5.39893 14.6025 1.66797 10.0001 1.66797C5.39771 1.66797 1.66675 5.39893 1.66675 10.0013C1.66675 14.6037 5.39771 18.3346 10.0001 18.3346Z"
        stroke={stroke}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.88 11.876V11.204C9.88 10.892 9.928 10.632 10.024 10.424C10.12 10.216 10.244 10.036 10.396 9.884C10.556 9.732 10.72 9.592 10.888 9.464C11.064 9.328 11.228 9.192 11.38 9.056C11.54 8.912 11.668 8.748 11.764 8.564C11.86 8.372 11.908 8.144 11.908 7.88C11.908 7.776 11.892 7.652 11.86 7.508C11.836 7.356 11.772 7.212 11.668 7.076C11.572 6.932 11.424 6.812 11.224 6.716C11.024 6.62 10.76 6.572 10.432 6.572C10.064 6.572 9.772 6.632 9.556 6.752C9.34 6.864 9.176 7.008 9.064 7.184C8.96 7.36 8.888 7.532 8.848 7.7C8.816 7.868 8.8 8.008 8.8 8.12C8.8 8.176 8.8 8.232 8.8 8.288C8.8 8.336 8.804 8.392 8.812 8.456H7.744C7.736 8.424 7.728 8.376 7.72 8.312C7.712 8.24 7.708 8.152 7.708 8.048C7.708 7.864 7.736 7.664 7.792 7.448C7.848 7.232 7.94 7.016 8.068 6.8C8.196 6.584 8.368 6.388 8.584 6.212C8.8 6.036 9.064 5.896 9.376 5.792C9.696 5.68 10.072 5.624 10.504 5.624C10.896 5.624 11.236 5.672 11.524 5.768C11.812 5.856 12.052 5.98 12.244 6.14C12.444 6.292 12.6 6.464 12.712 6.656C12.832 6.84 12.916 7.028 12.964 7.22C13.02 7.412 13.048 7.592 13.048 7.76C13.048 8.144 12.996 8.468 12.892 8.732C12.788 8.996 12.652 9.22 12.484 9.404C12.324 9.58 12.152 9.736 11.968 9.872C11.792 10.008 11.62 10.144 11.452 10.28C11.284 10.408 11.148 10.556 11.044 10.724C10.94 10.884 10.888 11.084 10.888 11.324V11.876H9.88ZM9.796 14V12.74H10.972V14H9.796Z"
        fill={fill}
      />
    </svg>
  );
};

const ProfileIcon = ({ active }) => {
  const fill = active ? "#032746" : "white";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10 10C12.3012 10 14.1667 8.13452 14.1667 5.83333C14.1667 3.53215 12.3012 1.66667 10 1.66667C7.69882 1.66667 5.83334 3.53215 5.83334 5.83333C5.83334 8.13452 7.69882 10 10 10Z"
        stroke={fill}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.1583 18.3333C17.1583 15.1083 13.95 12.5 10 12.5C6.05001 12.5 2.84167 15.1083 2.84167 18.3333"
        stroke={fill}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CreatorSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const menuItems = [
    {
      path: "/creator",
      labelKey: "gatherer.sidebar.dashboard",
      icon: DashboardIcon,
    },
    {
      path: "/creator/question-bank",
      labelKey: "gatherer.sidebar.questionBank",
      icon: QuestionBankIcon,
    },
    {
      path: "/creator/profile",
      labelKey: "gatherer.sidebar.profile",
      icon: ProfileIcon,
    },
  ];

  const isActive = (path) => {
    if (path === "/creator") {
      return location.pathname === "/creator";
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-oxford-blue h-screen overflow-y-auto transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } w-64 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
    >
      <div className="mb-6 p-4 pt-4 border-b border-white/10 text-white flex flex-col items-start">
        <img src={logodash} alt="Talaam Gatherer" className="" />
      </div>
      <nav className="space-y-2 p-3">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`relative flex items-center text-nowrap gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full max-w-[256px] h-[44px] ${
                active
                  ? "bg-white text-oxford-blue"
                  : "text-white hover:bg-blue-900"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-0 h-full w-[5px] bg-orange-dark rounded-l-lg"></div>
              )}
              {Icon && <Icon active={active} />}
              <span className="font-medium">{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default CreatorSidebar;