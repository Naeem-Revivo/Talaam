import React from "react";
import { trend, vedio, timer, tick } from "../../assets/svg/dashboard";
import { stats, streak, completed, question } from "../../assets/svg";

const MetricCards = ({ metrics, loading, t }) => {
  const metricItems = [
    {
      icon: stats,
      value: metrics?.scoreImprovement || 0,
      label: t("dashboard.metrics.scoreImprovement") || "Score Improvement",
      suffix: "%",
      color: "text-cinnebar-red",
    },
    {
      icon: question,
      value: metrics?.questionsSolved || 0,
      label: t("dashboard.metrics.questionsSolved") || "Questions Solved",
      color: "text-cinnebar-red",
    },
    {
      icon: streak,
      value: metrics?.studyStreak || 0,
      label: t("dashboard.metrics.studyStreak") || "Study Streak",
      suffix: " Days",
      color: "text-cinnebar-red",
      isFlame: true,
    },
    {
      icon: completed,
      value: metrics?.sessionsCompleted || 0,
      label: t("dashboard.metrics.sessionsCompleted") || "Sessions Completed",
      color: "text-cinnebar-red",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metricItems.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-[16px] border border-[#E5E5E5] shadow-dashboard p-4 md:p-6 flex flex-col items-start min-h-[120px] md:min-h-[174px]"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <>
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-12 h-12 mb-3 md:mb-4"
                />
              <p className={`font-archivo font-bold text-xl md:text-[30px] leading-[28px] md:leading-[45px] text-dashboard-dark`}>
                {item.value > 0 && item.suffix === "%" ? "+" : ""}
                {item.value}
                {item.suffix || ""}
              </p>
              <p className="font-roboto font-normal text-[14px] leading-[21px] text-dashboard-gray text-center">
                {item.label}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
