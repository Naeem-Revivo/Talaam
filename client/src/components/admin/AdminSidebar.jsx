import React, { useState } from "react";
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

const UserManagementIcon = ({ active }) => {
  const fill = active ? "#032746" : "white";

  return (
    <svg
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M13.3054 18H6.69642C4.64535 18 3.51512 16.885 3.51512 14.8617C3.51512 12.6427 4.78025 10.0518 8.34753 10.0518H11.6543C15.2216 10.0518 16.4867 12.6427 16.4867 14.8617C16.4867 16.885 15.3565 18 13.3054 18ZM8.34753 11.4364C5.1579 11.4364 4.91041 14.0577 4.91041 14.8617C4.91041 16.1078 5.42857 16.6155 6.69642 16.6155H13.3054C14.5732 16.6155 15.0914 16.1068 15.0914 14.8617C15.0914 14.0577 14.843 11.4364 11.6543 11.4364H8.34753ZM10.0079 8.78074C8.08152 8.78074 6.51406 7.22545 6.51406 5.31385C6.51406 3.40225 8.08152 1.84696 10.0079 1.84696C11.9344 1.84696 13.5026 3.40225 13.5026 5.31385C13.5026 7.22545 11.9344 8.78074 10.0079 8.78074ZM10.0079 3.23151C8.85079 3.23151 7.90934 4.1656 7.90934 5.31385C7.90934 6.4621 8.85079 7.39619 10.0079 7.39619C11.1651 7.39619 12.1073 6.4621 12.1073 5.31385C12.1073 4.1656 11.1651 3.23151 10.0079 3.23151ZM20 9.60044C20 7.77653 18.8606 5.93604 16.3165 5.93604H15.4141C15.029 5.93604 14.7165 6.24618 14.7165 6.62831C14.7165 7.01045 15.029 7.32058 15.4141 7.32058H16.3165C18.3824 7.32058 18.6047 8.91463 18.6047 9.60044C18.6047 10.3979 18.3172 10.6803 17.507 10.6803H17.1722C16.7871 10.6803 16.4745 10.9905 16.4745 11.3726C16.4745 11.7547 16.7871 12.0649 17.1722 12.0649H17.507C19.0912 12.0649 20 11.1668 20 9.60044ZM15.6737 5.34067C16.9304 5.0896 17.842 3.97643 17.842 2.69619C17.842 1.21011 16.6234 0.000901397 15.1258 0.000901397C14.4179 0.000901397 13.7593 0.261167 13.2719 0.732836C12.9956 0.999592 12.9901 1.43806 13.259 1.7122C13.5269 1.98634 13.9705 1.99192 14.2458 1.72516C14.4718 1.5064 14.7844 1.38635 15.1258 1.38635C15.8542 1.38635 16.4467 1.97436 16.4467 2.69709C16.4467 3.32106 16.0048 3.8629 15.3974 3.98474C15.0198 4.06043 14.7751 4.42587 14.8514 4.80062C14.9183 5.12921 15.2095 5.35633 15.5341 5.35633C15.5806 5.35448 15.6272 5.3499 15.6737 5.34067ZM3.51706 11.3726C3.51706 10.9905 3.20451 10.6803 2.81941 10.6803H2.49285C1.68265 10.6803 1.39529 10.3979 1.39529 9.60044C1.39529 8.91463 1.61756 7.32058 3.68352 7.32058H4.6044C4.9895 7.32058 5.30204 7.01045 5.30204 6.62831C5.30204 6.24618 4.9895 5.93604 4.6044 5.93604H3.68352C0.964571 5.93604 0 7.91037 0 9.60044C0 11.1668 0.908732 12.0649 2.49285 12.0649H2.81941C3.20451 12.0649 3.51706 11.7547 3.51706 11.3726ZM5.16907 4.79881C5.24535 4.42406 5.00068 4.05851 4.62302 3.98282C4.00909 3.86006 3.5635 3.31915 3.5635 2.69518C3.5635 1.97244 4.16073 1.38455 4.89372 1.38455C5.22859 1.38455 5.54386 1.50731 5.78292 1.73068C6.06291 1.99375 6.50387 1.9808 6.76897 1.70296C7.03408 1.42513 7.02103 0.986751 6.74104 0.724611C6.24339 0.257557 5.58762 0 4.89463 0C3.39237 0 2.16923 1.2091 2.16923 2.69518C2.16923 3.9745 3.0854 5.08685 4.34766 5.33976C4.39417 5.34899 4.44073 5.35351 4.48631 5.35351C4.81094 5.35443 5.10117 5.12741 5.16907 4.79881Z"
        fill={fill}
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

const SubscriptionsIcon = ({ active }) => {
  const stroke = active ? "#032746" : "white";

  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8.04492 0.75L8.2666 0.984375L10.7109 3.5625H14.833C15.848 3.5625 16.745 3.8325 17.3779 4.5C18.0035 5.15999 18.25 6.08176 18.25 7.125V10.8281C18.25 11.2641 17.969 11.6773 17.5381 11.8125C17.969 11.9477 18.25 12.3609 18.25 12.7969V13.6875C18.25 14.7307 18.0035 15.6525 17.3779 16.3125C16.745 16.98 15.848 17.25 14.833 17.25H4.16699C3.152 17.25 2.25496 16.98 1.62207 16.3125C0.996543 15.6525 0.75 14.7307 0.75 13.6875V12.7969C0.75 12.3609 1.03102 11.9477 1.46191 11.8125C1.03102 11.6773 0.75 11.2641 0.75 10.8281V4.3125C0.75 3.26926 0.996543 2.34749 1.62207 1.6875C2.25496 1.02 3.152 0.75 4.16699 0.75H8.04492Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
    </svg>
  );
};

const ReportsIcon = ({ active }) => {
  const fill = active ? "#032746" : "white";
  const stroke = active ? "#032746" : "white";

  return (
    <svg
      width="17"
      height="15"
      viewBox="0 0 17 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M15.6346 14.25H8.86539H2.09615C0.940051 14.25 0.25 13.5772 0.25 12.45V0.85C0.25 0.5188 0.525692 0.25 0.865385 0.25C1.20508 0.25 1.48077 0.5188 1.48077 0.85V12.45C1.48077 12.9212 1.61287 13.05 2.09615 13.05H15.6346C15.9743 13.05 16.25 13.3188 16.25 13.65C16.25 13.9812 15.9743 14.25 15.6346 14.25ZM10.5064 3.25C10.5064 2.9188 10.2307 2.65 9.89103 2.65H4.14744C3.80774 2.65 3.53205 2.9188 3.53205 3.25C3.53205 3.5812 3.80774 3.85 4.14744 3.85H9.89103C10.2307 3.85 10.5064 3.5812 10.5064 3.25ZM8.86539 6.45C8.86539 6.1188 8.58969 5.85 8.25 5.85H4.14744C3.80774 5.85 3.53205 6.1188 3.53205 6.45C3.53205 6.7812 3.80774 7.05 4.14744 7.05H8.25C8.58969 7.05 8.86539 6.7812 8.86539 6.45ZM12.9679 9.65C12.9679 9.3188 12.6923 9.05 12.3526 9.05H4.14744C3.80774 9.05 3.53205 9.3188 3.53205 9.65C3.53205 9.9812 3.80774 10.25 4.14744 10.25H12.3526C12.6923 10.25 12.9679 9.9812 12.9679 9.65Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.5"
      />
    </svg>
  );
};

const ModerationIcon = ({ active }) => {
  const fill = active ? "#032746" : "white";

  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12.054 6.42409L15.8518 1.22409C16.0231 0.98974 16.0479 0.679321 15.9158 0.42133C15.7836 0.163339 15.5173 0 15.2262 0H3.87107C1.375 0 0 1.3691 0 3.85445V19.2291C0 19.6546 0.346848 20 0.774214 20C1.20158 20 1.54843 19.6546 1.54843 19.2291V12.8482H15.2262C15.5173 12.8482 15.7847 12.6859 15.9158 12.4269C16.0469 12.1678 16.0231 11.8584 15.8518 11.6241L12.054 6.42409ZM1.54843 11.3064V3.85445C1.54843 2.23353 2.24315 1.54178 3.87107 1.54178H13.7057L10.4705 5.97089C10.2733 6.24122 10.2733 6.60696 10.4705 6.87729L13.7057 11.3064H1.54843Z"
        fill={fill}
      />
    </svg>
  );
};

const ClassificationIcon = ({ active }) => {
  const fill = active ? "#032746" : "white";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.24999 0.75H2.25C1.42157 0.75 0.75 1.42162 0.75 2.2501V5.25029C0.75 6.07877 1.42157 6.75039 2.25 6.75039H5.24999C6.07842 6.75039 6.74999 6.07877 6.74999 5.25029V2.2501C6.74999 1.42162 6.07842 0.75 5.24999 0.75Z"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.25 0.75H14.25C13.4216 0.75 12.75 1.42162 12.75 2.2501V5.25029C12.75 6.07877 13.4216 6.75039 14.25 6.75039H17.25C18.0784 6.75039 18.75 6.07877 18.75 5.25029V2.2501C18.75 1.42162 18.0784 0.75 17.25 0.75Z"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2499 12.75H8.24994C7.42151 12.75 6.74994 13.4216 6.74994 14.2501V17.2503C6.74994 18.0788 7.42151 18.7504 8.24994 18.7504H11.2499C12.0784 18.7504 12.7499 18.0788 12.7499 17.2503V14.2501C12.7499 13.4216 12.0784 12.75 11.2499 12.75Z"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 6.75V9.7502M15.75 6.75V9.7502M9.74999 12.7504V6.75"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ChevronIcon = ({ isOpen }) => {
  return (
    <svg
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-200 ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      <path
        d="M1 1L6 6L11 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SettingsIcon = ({ active }) => {
  const fill = active ? "#032746" : "white";

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8.999 5.53725C7.08986 5.53725 5.53708 7.08978 5.53708 8.99861C5.53708 10.9074 7.08986 12.46 8.999 12.46C10.9081 12.46 12.4609 10.9074 12.4609 8.99861C12.4609 7.08978 10.9081 5.53725 8.999 5.53725ZM8.999 11.0754C7.85333 11.0754 6.92185 10.1441 6.92185 8.99861C6.92185 7.85313 7.85333 6.92179 8.999 6.92179C10.1447 6.92179 11.0761 7.85313 11.0761 8.99861C11.0761 10.1441 10.1447 11.0754 8.999 11.0754ZM17.4996 10.8013C16.8589 10.4302 16.4601 9.7398 16.4592 8.99861C16.4583 8.25926 16.8543 7.56977 17.5033 7.1941C17.9787 6.91811 18.1412 6.30612 17.8661 5.82983L16.3226 3.16598C16.0475 2.69062 15.4354 2.52726 14.959 2.8014C14.3137 3.17338 13.5115 3.17338 12.8644 2.79771C12.2264 2.42757 11.8295 1.73991 11.8295 1.00241C11.8295 0.449514 11.379 0 10.826 0H7.17478C6.62088 0 6.17131 0.449514 6.17131 1.00241C6.17131 1.73991 5.77433 2.42756 5.13457 2.79954C4.48927 3.17336 3.68796 3.17428 3.04266 2.8023C2.56537 2.52724 1.95424 2.69155 1.67913 3.16691L0.133724 5.83355C-0.141383 6.30891 0.0220069 6.91993 0.502059 7.19869C1.14182 7.56882 1.54065 8.25833 1.54249 8.99768C1.54434 9.73795 1.14737 10.4293 0.499298 10.805C0.268504 10.9388 0.102334 11.1539 0.0340188 11.4123C-0.0342964 11.6698 0.000792507 11.9385 0.134653 12.1701L1.67727 14.8322C1.95238 15.3084 2.56445 15.4737 3.04266 15.1977C3.68796 14.8257 4.48836 14.8266 5.12443 15.1949L5.12626 15.1958C5.12903 15.1977 5.13181 15.1995 5.1355 15.2014C5.77341 15.5715 6.16945 16.2591 6.16852 16.9976C6.16852 17.5505 6.61811 18 7.17109 18H10.826C11.379 18 11.8285 17.5505 11.8285 16.9985C11.8285 16.2601 12.2255 15.5724 12.8662 15.2004C13.5106 14.8266 14.3119 14.8248 14.9581 15.1977C15.4345 15.4727 16.0456 15.3093 16.3216 14.834L17.867 12.1674C18.1412 11.6902 17.9778 11.0782 17.4996 10.8013ZM15.3052 13.8233C14.299 13.3848 13.1311 13.4448 12.1692 14.0014C11.2155 14.5543 10.5859 15.5318 10.4641 16.6136H7.53115C7.41113 15.5318 6.77966 14.5525 5.82602 14.0005C4.86592 13.4439 3.69627 13.3848 2.69277 13.8233L1.5148 11.7898C2.39643 11.1409 2.92909 10.0998 2.9254 8.99216C2.92263 7.8919 2.39089 6.8581 1.51387 6.20921L2.69277 4.17484C3.69719 4.61236 4.86686 4.55328 5.82881 3.99577C6.78153 3.4438 7.41112 2.46541 7.53298 1.38454H10.4641C10.585 2.46633 11.2155 3.44382 12.171 3.99763C13.1302 4.55422 14.2999 4.61329 15.3052 4.17577L16.4841 6.20921C15.6043 6.85717 15.0726 7.89651 15.0744 9.0023C15.0753 10.1044 15.6071 11.14 16.4851 11.7908L15.3052 13.8233Z"
        fill={fill}
      />
    </svg>
  );
};

const SecurityIcon = ({ active }) => {
  const fill = active ? "#032746" : "white";

  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12.9032 6.20919V4.8718C12.9032 2.18564 10.7035 0 8 0C5.29652 0 3.09677 2.18564 3.09677 4.8718V6.20919C1.09626 6.47277 0 7.79077 0 10V16.1538C0 18.6338 1.37497 20 3.87097 20H12.129C14.625 20 16 18.6338 16 16.1538V10C16 7.7918 14.9037 6.4738 12.9032 6.20919ZM8 1.53846C9.84981 1.53846 11.3548 3.03385 11.3548 4.8718V6.15385H4.64516V4.8718C4.64516 3.03385 6.15019 1.53846 8 1.53846ZM14.4516 16.1538C14.4516 17.7713 13.7569 18.4615 12.129 18.4615H3.87097C2.2431 18.4615 1.54839 17.7713 1.54839 16.1538V10C1.54839 8.38256 2.2431 7.69231 3.87097 7.69231H12.129C13.7569 7.69231 14.4516 8.38256 14.4516 10V16.1538ZM9.31099 12.0513C9.31099 12.4738 9.09213 12.8308 8.77419 13.0637V15.1282C8.77419 15.5528 8 15.8974 8 15.8974C7.57264 15.8974 7.22581 15.5528 7.22581 15.1282V13.0379C6.92852 12.803 6.72505 12.4564 6.72505 12.0513C6.72505 11.3436 7.29807 10.7692 8.01033 10.7692H8.02067C8.73292 10.7692 9.31099 11.3436 9.31099 12.0513Z"
        fill={fill}
      />
    </svg>
  );
};

const ApprovedQuestionsIcon = ({ active }) => {
  const fill = active ? "#032746" : "white";

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.99935 18.3346C14.6017 18.3346 18.3327 14.6037 18.3327 10.0013C18.3327 5.39893 14.6017 1.66797 9.99935 1.66797C5.39698 1.66797 1.66602 5.39893 1.66602 10.0013C1.66602 14.6037 5.39698 18.3346 9.99935 18.3346Z"
        stroke={fill}
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

const StudentManagementIcon = ({ active }) => {
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
        d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
        fill={fill}
      />
      <path
        d="M10.0002 12.5C4.99016 12.5 0.910156 15.86 0.910156 20C0.910156 20.28 1.13016 20.5 1.41016 20.5H18.5902C18.8702 20.5 19.0902 20.28 19.0902 20C19.0902 15.86 15.0102 12.5 10.0002 12.5Z"
        fill={fill}
      />
    </svg>
  );
};

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const submenuItems = {
    reports: [
      {
        path: "/admin/reports",
        labelKey: "admin.sidebar.reports",
        isMain: true,
      },
      {
        path: "/admin/reports/subscription-trends",
        labelKey: "admin.sidebar.subscriptionTrends",
      },
      {
        path: "/admin/reports/export",
        labelKey: "admin.sidebar.exportReports",
      },
    ],
    subscriptions: [
      {
        path: "/admin/subscriptions",
        labelKey: "admin.sidebar.subscriptions",
        isMain: true,
      },
      {
        path: "/admin/subscriptions/manage-users",
        labelKey: "admin.sidebar.manageUserSubscription",
      },
      {
        path: "/admin/subscriptions/payment-history",
        labelKey: "admin.sidebar.paymentHistory",
      },
    ],
  };

  const menuItems = [
    {
      path: "/admin",
      labelKey: "admin.sidebar.dashboard",
      icon: DashboardIcon,
    },
    {
      path: "/admin/users",
      labelKey: "admin.sidebar.userManagement",
      icon: UserManagementIcon,
    },
    {
      path: "/admin/students",
      labelKey: "admin.sidebar.studentManagement",
      icon: StudentManagementIcon,
    },
    {
      path: "/admin/classification",
      labelKey: "admin.sidebar.classification",
      icon: ClassificationIcon,
    },
    {
      path: "/admin/question-bank",
      labelKey: "admin.sidebar.questionBank",
      icon: QuestionBankIcon,
    },
    {
      path: "/admin/approved-questions",
      labelKey: "admin.approvedQuestion.title",
      icon: ApprovedQuestionsIcon,
    },
    {
      path: "/admin/reports",
      labelKey: "admin.sidebar.reports",
      icon: ReportsIcon,
      submenuKey: "reports",
    },
    {
      path: "/admin/moderation",
      labelKey: "admin.sidebar.moderation",
      icon: ModerationIcon,
    },
    {
      path: "/admin/subscriptions",
      labelKey: "admin.sidebar.subscriptions",
      icon: SubscriptionsIcon,
      submenuKey: "subscriptions",
    },
    {
      path: "/admin/settings",
      labelKey: "admin.sidebar.settings",
      icon: SettingsIcon,
    },
    {
      path: "/admin/security",
      labelKey: "admin.sidebar.security",
      icon: SecurityIcon,
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const isSubmenuActive = (submenuKey) => {
    const subItems = submenuItems[submenuKey];
    return subItems ? subItems.some((item) => isActive(item.path)) : false;
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  const handleMainItemClick = (item) => {
    if (item.submenuKey) {
      // For items with submenu, navigate to main page and toggle submenu
      const mainPage = submenuItems[item.submenuKey]?.find(
        (subItem) => subItem.isMain
      );
      if (mainPage) {
        navigate(mainPage.path);
      }
      toggleSubmenu(item.submenuKey);
    } else {
      // Regular navigation for items without submenu
      navigate(item.path);
      handleLinkClick();
    }
  };

  const toggleSubmenu = (submenuKey) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [submenuKey]: !prev[submenuKey],
    }));
  };

  const renderSubmenu = (submenuKey) => {
    const items = submenuItems[submenuKey];
    if (!items) return null;

    // Filter out the main page from submenu items (it's already handled by the main button)
    const subItems = items.filter((item) => !item.isMain);

    return (
      <div className="ml-8 mt-2 space-y-1">
        {subItems.map((subItem) => {
          const subActive = isActive(subItem.path);
          return (
            <NavLink
              key={subItem.path}
              to={subItem.path}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                subActive
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-sm font-medium">{t(subItem.labelKey)}</span>
            </NavLink>
          );
        })}
      </div>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-oxford-blue h-screen overflow-y-auto transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } w-64 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
    >
      <div className="mb-6 p-4 pt-4 border-b border-white/10 text-white flex flex-col items-start">
        <img src={logodash} alt="Talaam Admin" className="" />
      </div>
      <nav className="space-y-2 p-3">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          const hasSubmenu = !!item.submenuKey;
          const submenuActive = hasSubmenu
            ? isSubmenuActive(item.submenuKey)
            : false;
          const isSubmenuOpen = openSubmenus[item.submenuKey];

          if (hasSubmenu) {
            return (
              <div key={item.path} className="relative">
                <button
                  onClick={() => handleMainItemClick(item)}
                  className={`relative flex items-center justify-between text-nowrap gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full max-w-[256px] h-[44px] ${
                    submenuActive
                      ? "bg-white text-oxford-blue"
                      : "text-white hover:bg-blue-900"
                  }`}
                >
                  {active && (
                    <div className="absolute left-0 top-0 h-full w-[5px] bg-orange-dark rounded-l-lg"></div>
                  )}
                  <div className="flex items-center gap-3 text-nowrap">
                    {Icon && <Icon active={submenuActive} />}
                    <span className="font-medium">{t(item.labelKey)}</span>
                  </div>
                  <ChevronIcon isOpen={isSubmenuOpen} />
                </button>

                {isSubmenuOpen && renderSubmenu(item.submenuKey)}
              </div>
            );
          }

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

export default AdminSidebar;
