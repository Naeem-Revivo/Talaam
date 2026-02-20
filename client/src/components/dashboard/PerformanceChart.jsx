import React, { useState, useMemo } from "react";
import { Loader } from "../common/Loader";

const PerformanceChart = ({ performanceData = [], loading = false, t }) => {
  const [hoveredSession, setHoveredSession] = useState(null);

  // Prepare performance data for chart (ensure we have 10 items)
  const chartPerformanceData = () => {
    const data = performanceData || [];
    // If we have less than 10 sessions, pad with empty data
    const paddedData = [...data];
    while (paddedData.length < 10) {
      paddedData.push({
        session: `S${paddedData.length + 1}`,
        accuracy: 0,
        mode: null,
        questionsAnswered: 0,
        date: null,
      });
    }
    return paddedData.slice(0, 10).map((item, index) => ({
      ...item,
      sessionLabel: `S${index + 1}`,
      accuracy: item.accuracy || 0,
      questionsAnswered: item.questionsAnswered || 0,
      date: item.date || null,
    }));
  };

  // Format date for tooltip (e.g., "2 weeks ago")
  const formatDateAgo = (date) => {
    if (!date) return "N/A";
    const now = new Date();
    const sessionDate = new Date(date);
    const diffTime = Math.abs(now - sessionDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 21) return "2 weeks ago";
    if (diffDays < 30) return "3 weeks ago";
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} weeks ago`;
  };

  // Calculate total answered questions for performance section
  const totalAnsweredQuestions = useMemo(() => {
    if (!performanceData || performanceData.length === 0) return 0;
    return performanceData.reduce((sum, session) => sum + (session.questionsAnswered || 0), 0);
  }, [performanceData]);

  return (
    <div className="bg-white border border-[#E5E5E5] shadow-sm shadow-[#0000000D] w-full h-auto rounded-[12px] overflow-x-hidden overflow-y-visible p-8">
      
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-roboto font-bold text-[16px] leading-[24px] text-oxford-blue mb-2">
              {t("dashboard.performance.title") || "Performance"}
            </h2>
            <p className="font-roboto font-normal text-[14px] leading-[21px] text-[#A3A3A3]">
              {t("dashboard.performance.subtitle") || "Last 10 Sessions"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-roboto font-normal flex flex-col items-end text-xs text-[#A3A3A3]">
              {t("dashboard.performance.totalAnswered") || "Total Answered Questions"} <span className="font-semibold font-archivo text-[20px] leading-[28px] text-oxford-blue">{totalAnsweredQuestions || 0} questions</span>
            </p>
          </div>
        </div>
      
      <div className="flex flex-col items-center justify-center overflow-x-auto md:overflow-x-visible scroll-smooth">
        {loading ? (
          <div className="w-full h-[320px] flex items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="w-full min-w-[650px] md:min-w-0 md:w-full">
            {/* Custom Bar Chart */}
            <div className="flex items-start justify-between gap-2 md:gap-4">
              {chartPerformanceData().map((data, index) => {
                const accuracy = data.accuracy || 0;
                const isHovered = hoveredSession === index;
                
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center relative group"
                    onMouseEnter={() => setHoveredSession(index)}
                    onMouseLeave={() => setHoveredSession(null)}
                  >
                    {/* Session Label - Above bar */}
                    <div className="mb-2">
                      <p className="font-roboto text-xs md:text-sm text-gray-600 text-center">
                        {data.sessionLabel}
                      </p>
                    </div>
                    
                    {/* Bar Container */}
                    <div className="w-[16px] flex flex-col justify-center relative" style={{ height: '350px' }}>
                      {/* Tooltip - positioned above the bar */}
                      {isHovered && (
                        <div className="absolute bottom-full mb-2 bg-[#032746] text-white px-4 py-2.5 rounded shadow-lg z-20 min-w-[120px] left-1/2 transform -translate-x-1/2">
                          <div className="text-xs font-roboto font-normal text-white text-center space-y-0.5">
                            <div>{formatDateAgo(data.date)}</div>
                            <div>{data.questionsAnswered || 0} questions</div>
                            <div>{accuracy}%</div>
                          </div>
                          {/* Tooltip arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="w-2 h-2 bg-[#032746] transform rotate-45"></div>
                          </div>
                        </div>
                      )}
                      {/* Bar - Always visible with gray background */}
                      <div 
                        className="w-[16px] relative rounded overflow-hidden bg-[#E5E7EB]"
                        style={{ 
                          height: '350px',
                        }}
                      >
                        {/* Orange Progress (accuracy percentage) - overlay on top when there's progress */}
                        {accuracy > 0 && (
                          <div 
                            className="w-full bg-[#FF6B35] absolute bottom-0 left-0 right-0"
                            style={{ 
                              height: `${accuracy}%`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Percentage Label - Below bar */}
                    <div className="mt-2">
                      <p className="font-roboto text-xs md:text-sm text-gray-600 text-center">
                        {accuracy > 0 ? `${accuracy}%` : "0%"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
