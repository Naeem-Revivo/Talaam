import React from "react";
import { dashboardplayicon, dashboardstatsicon, dashboardhistoryicon } from "../../assets/svg/dashboard";

const QuickActions = ({ onStartSession, onAnalytics, onReviewSessions, t }) => {
  return (
    <div className="">
      <h2 className="font-archivo font-[800] text-[26px] leading-[36px] text-dashboard-dark mb-1">
        {t("dashboard.quickActions.title") || "What Would You Like to Do?"}
      </h2>
      <p className="font-roboto font-normal text-base text-[#737373] mb-4 md:mb-6">
        {t("dashboard.quickActions.subtitle") || "Smart recommendations based on your performance"}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onStartSession}
          className="flex items-center justify-between gap-3 bg-gradient-to-r from-[#173B50] to-[#032746] text-white w-full sm:flex-1 max-w-full lg:max-w-[548px] h-[60px] md:h-[80px] rounded-[16px] transition-all shadow-lg hover:opacity-90 p-4"
        >
          <div className="flex items-center gap-3">
            <img
              src={dashboardplayicon}
              alt="play icon"
              className="w-8 h-8 md:w-12 md:h-12"
            />
            <span className="font-roboto font-bold text-base text-white">
              {t("dashboard.quickActions.startNewSession") || "Start New Practice Session"}
            </span>
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={onAnalytics}
          className="flex items-center justify-between gap-3 bg-white hover:bg-gray-50 text-oxford-blue border border-oxford-blue w-full sm:flex-1 max-w-full lg:max-w-[548px] h-[60px] md:h-[80px] rounded-[16px] transition-colors shadow-sm p-4"
        >
            <div className="flex items-center gap-3">
                <img
                src={dashboardstatsicon}
                alt="analytics icon"
                className="w-8 h-8 md:w-12 md:h-12"
              />
            <span className="font-roboto font-bold text-base text-oxford-blue">
              {t("dashboard.quickActions.performanceAnalytics") || "Performance Analytics"}
            </span>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="#A3A3A3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={onReviewSessions}
          className="flex items-center justify-between gap-3 bg-white hover:bg-gray-50 text-oxford-blue border border-oxford-blue w-full sm:flex-1 max-w-full lg:max-w-[548px] h-[60px] md:h-[80px] rounded-[16px] transition-colors shadow-sm p-4"
        >
          <div className="flex items-center gap-3">
              <img
                src={dashboardhistoryicon}
                alt="review icon"
                className="w-8 h-8 md:w-12 md:h-12"
              />  
            <span className="font-roboto font-bold text-base text-oxford-blue">
              {t("dashboard.quickActions.reviewSessions") || "Review Previous Sessions"}
            </span>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="#A3A3A3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
