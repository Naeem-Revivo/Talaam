import React from "react";
import { notice } from "../../assets/svg";

const PracticeAreas = ({ practiceAreas, loading, onPracticeClick, t }) => {
  const getRecommendation = (score) => {
    if (score < 65) {
      return t("dashboard.practiceAreas.needsSignificantImprovement") || "Needs significant improvement";
    }
    return t("dashboard.practiceAreas.couldUseMorePractice") || "Could use more practice";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!practiceAreas || practiceAreas.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm shadow-[#0000000D] p-4 md:p-6 w-full">
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div>
          <h3 className="font-archivo font-semibold text-base text-oxford-blue mb-2">
            {t("dashboard.practiceAreas.title") || "Areas That Need Practice"}
          </h3>
          <p className="font-roboto font-normal text-sm text-[#A3A3A3]">
            {t("dashboard.practiceAreas.subtitle") || "Focus on these topics to improve your score"}
          </p>
        </div>
          <img src={notice} alt="notice" className="w-10 h-10" />
      </div>

      <div className="space-y-3 md:space-y-4">
        {practiceAreas.map((area, index) => (
          <div
            key={index}
            className="bg-[#E6EEF338] rounded-[16px] px-5 border border-[#E5E5E5]"
          >
            <div className="flex justify-between h-[126px] items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-roboto font-bold text-base text-dashboard-dark">
                    {area.topic || area.subject}
                  </h4>
                  <span className="font-archivo font-bold text-lg md:text-xl text-cinnebar-red ml-4">
                    {area.accuracy || area.score}%
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-oxford-blue rounded-full transition-all"
                      style={{ width: `${area.accuracy || area.score}%` }}
                    />
                  </div>
                  <span className="font-roboto font-normal text-xs text-[#737373] whitespace-nowrap">
                    {area.correct || 0}/{area.total || 0} correct
                  </span>
                </div>
                <p className="font-roboto font-normal text-xs text-[#737373]">
                  {getRecommendation(area.accuracy || area.score)}
                </p>
              </div>
              <button
                onClick={() => onPracticeClick && onPracticeClick(area)}
                className="ml-4 px-6 py-3 bg-white border border-[#E5E5E5] rounded-[14px] hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0"
              >
                <span className="font-roboto font-medium text-[14px] leading-[21px] text-[#475569]">
                  {t("dashboard.practiceAreas.practiceNow") || "Practice Now"}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeAreas;
