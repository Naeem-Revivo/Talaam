import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { BarChart } from "@mui/x-charts/BarChart";
import { vedio, timer } from "../../assets/svg/dashboard";
import { useNavigate } from "react-router-dom";
import studentQuestionsAPI from "../../api/studentQuestions";

const DashboardPage = () => {
  const { t } = useLanguage();
  const [chartWidth, setChartWidth] = useState(1070);
  const navigate = useNavigate();
  const [testSummary, setTestSummary] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateChartWidth = () => {
      if (window.innerWidth < 768) {
        setChartWidth(650); // Minimum width for mobile scrolling to show all labels
      } else {
        setChartWidth(1070); // Desktop width
      }
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);
    return () => window.removeEventListener("resize", updateChartWidth);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryResponse, performanceResponse] = await Promise.all([
          studentQuestionsAPI.getTestSummary(),
          studentQuestionsAPI.getPerformanceData(),
        ]);

        if (summaryResponse.success) {
          setTestSummary(summaryResponse.data);
        }

        if (performanceResponse.success) {
          setPerformanceData(performanceResponse.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate progress percentage based on test mode data
  const getProgressData = () => {
    if (!testSummary) {
      return { percentage: 0, completed: 0, total: 0 };
    }

    // Progress = (Total correct answers) / (Total questions attempted across all test sessions) * 100
    // In test mode, total includes all attempts (e.g., 3 tests × 10 questions = 30 total)
    const completed = testSummary.totalCorrectAnswers || 0;
    const total = testSummary.totalQuestionsAttempted || 0; // Total questions attempted across all test sessions
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return {
      percentage: Math.min(percentage, 100), // Cap at 100%
      completed,
      total,
    };
  };

  // Get accuracy for test mode
  const getAccuracy = () => {
    if (!testSummary) {
      return 0;
    }
    return testSummary.accuracy || 0;
  };

  // Get bar color based on mode (orange for test, teal for study)
  const getBarColor = (mode) => {
    if (mode === "test") {
      return "#FF6B35"; // Orange color for test mode
    } else if (mode === "study") {
      return "#20B2AA"; // Milestone/teal color for study mode
    }
    return "#6CA6C1"; // Default fallback
  };

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
      });
    }
    return paddedData.slice(0, 10); // Ensure exactly 10 items
  };

  const startNewSession = () => {
      navigate("/dashboard/practice")
  }

  const reviewSessions = () => {
      navigate("/dashboard/review")
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen 2xl:px-6 max-w-[1200px] mx-auto">
      {/* Overview Section */}
      <div className="mb-8 md:mb-12 w-full">
        <h2 className="font-archivo font-bold text-2xl md:text-3xl lg:text-[36px] leading-tight md:leading-[40px] text-oxford-blue mb-2">
          {t("dashboard.overview.title")}
        </h2>
        <p className="font-roboto font-normal text-base md:text-[18px] leading-6 md:leading-7 text-gray-500 mb-4 md:mb-6">
          {t("dashboard.overview.subtitle")}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pt-4">
          {/* Progress Card */}
          <div className="rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full h-auto min-h-[200px] md:min-h-[251px]">
            <h3 className="font-archivo font-semibold text-[18px] leading-[28px] text-oxford-blue mb-3 md:mb-4">
              {t("dashboard.overview.progress")}
            </h3>
            <div className="flex items-center justify-center">
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : (
                <div className="relative w-[90px] h-[90px] md:w-[115px] md:h-[115px]">
                  <svg
                    className="transform -rotate-90 w-full h-full"
                    viewBox="0 0 192 192"
                  >
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 84 * (getProgressData().percentage / 100)} ${
                        2 * Math.PI * 84
                      }`}
                      className="text-moonstone-blue"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-archivo font-bold text-[24px] leading-[32px] text-oxford-blue">
                        {getProgressData().percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-center font-roboto font-normal text-sm md:text-[16px] leading-5 md:leading-6 text-gray-500 mt-3 md:mt-4">
              {loading
                ? "Loading..."
                : `${getProgressData().completed}/${getProgressData().total} ${t("dashboard.overview.questionsCompleted")}`}
            </p>
          </div>

          {/* Accuracy Card */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full h-auto min-h-[200px] md:min-h-[251px]">
            <h3 className="font-archivo font-semibold text-[18px] leading-[28px] text-oxford-blue mb-3 md:mb-10">
              {t("dashboard.overview.accuracy")}
            </h3>
            <div className="flex items-start justify-center h-full">
              <div className="text-center">
                {loading ? (
                  <p className="font-roboto font-normal text-sm md:text-base text-gray-400">
                    Loading...
                  </p>
                ) : (
                  <>
                    <p className="font-archivo font-bold text-[36px] leading-[40px] text-cinnebar-red">
                      {getAccuracy().toFixed(0)}%
                    </p>
                    <p className="font-roboto font-normal text-sm md:text-base leading-5 md:leading-6 tracking-normal text-center align-middle text-gray-500">
                      {t("dashboard.overview.overall")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white my-20 border border-[#E5E7EB] shadow-dashboard w-full h-auto md:h-auto rounded-[12px] overflow-x-hidden overflow-y-visible pb-8">
        <h2 className="font-archivo font-semibold pl-4 md:pl-6 lg:pl-10 pb-4 md:pb-5 pt-6 md:pt-10 text-[20px] leading-[28px] text-oxford-blue">
          {t("dashboard.performance.title")}
        </h2>
        <div className="rounded-xl flex flex-col items-center justify-center p-3 md:p-6 overflow-x-auto md:overflow-x-visible scroll-smooth">
          <div className="min-w-[650px] md:min-w-0 w-full md:w-[1070px] h-[320px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Loading performance data...</p>
              </div>
            ) : (
              <BarChart
                width={chartWidth}
                height={320}
                margin={{ left: 70, right: 30, top: 30, bottom: 80 }}
                series={[
                  {
                    data: chartPerformanceData().map((data) => data.accuracy),
                    borderRadius: 4,
                  },
                ]}
                xAxis={[
                  {
                    id: "sessions",
                    data: chartPerformanceData().map((data) => data.session),
                    scaleType: "band",
                    label: "Sessions",
                    labelStyle: {
                      fontFamily: "Roboto",
                      fontSize: 12,
                      fill: "#6B7280",
                    },
                    tickLabelStyle: {
                      fontFamily: "Roboto",
                      fontSize: 12,
                      fill: "#6B7280",
                    },
                    colorMap: {
                      type: "ordinal",
                      values: chartPerformanceData().map((data) => data.session),
                      colors: chartPerformanceData().map((data) =>
                        getBarColor(data.mode)
                      ),
                    },
                  },
                ]}
              yAxis={[
                {
                  id: "accuracy",
                  min: 0,
                  max: 100,
                  label: "Accuracy (%)",
                  labelStyle: {
                    fontFamily: "Roboto",
                    fontSize: 12,
                    fill: "#6B7280",
                  },
                  tickLabelStyle: {
                    fontFamily: "Roboto",
                    fontSize: 12,
                    fill: "#6B7280",
                  },
                  tickNumber: 6,
                },
              ]}
              grid={{ horizontal: true }}
              sx={{
                "& .MuiChartsAxis-directionY .MuiChartsAxis-line": {
                  stroke: "transparent",
                },
                "& .MuiChartsGrid-horizontal .MuiChartsGrid-line": {
                  strokeDasharray: "4 4",
                  stroke: "#E5E7EB",
                },
                "& .MuiChartsAxis-tickLabel": {
                  fill: "#6B7280 !important",
                  fontFamily: "Roboto !important",
                  fontSize: "12px !important",
                },
                "& .MuiChartsAxis-label": {
                  fill: "#6B7280 !important",
                  fontFamily: "Roboto !important",
                  fontSize: "12px !important",
                },
                "& .MuiChartsAxis-root": {
                  overflow: "visible",
                },
                "& .MuiChartsAxisBottom .MuiChartsAxis-tickLabel": {
                  fill: "#6B7280 !important",
                  fontFamily: "Roboto !important",
                  fontSize: "12px !important",
                },
                "& .MuiChartsAxisBottom .MuiChartsAxis-label": {
                  fill: "#6B7280 !important",
                  fontFamily: "Roboto !important",
                  fontSize: "12px !important",
                },
                "& .MuiChartsAxisLeft .MuiChartsAxis-tickLabel": {
                  fill: "#6B7280 !important",
                  fontFamily: "Roboto !important",
                  fontSize: "12px !important",
                },
                "& .MuiChartsAxisLeft .MuiChartsAxis-label": {
                  fill: "#6B7280 !important",
                  fontFamily: "Roboto !important",
                  fontSize: "12px !important",
                },
              }}
              slotProps={{
                legend: {
                  hidden: true,
                },
                bar: {
                  width: 35,
                },
              }}
              />
            )}
          </div>

          {/* Footer with legend */}
          <div className="flex items-center justify-center mt-1 flex-wrap gap-3 md:gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "#FF6B35" }}
                />
                <span className="font-roboto text-[14px] leading-[20px] font-normal text-[#6B7280]">
                  Test Mode
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: "#20B2AA" }}
                />
                <span className="font-roboto text-[14px] leading-[20px] font-normal text-[#6B7280]">
                  Study Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-archivo font-bold text-[24px] leading-[32px] text-oxford-blue mb-4 md:mb-6">
          {t("dashboard.quickActions.title")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 lg:gap-16">
          <button onClick={startNewSession} className="flex items-center justify-center gap-3 bg-cinnebar-red text-white w-full sm:w-auto sm:flex-1 max-w-full lg:max-w-[548px] h-[60px] md:h-[79.2px] rounded-lg transition-colors shadow-lg hover:opacity-90">
            <img
              src={vedio}
              alt="video icon"
              className="w-5 h-5 md:w-6 md:h-6"
            />
            <span className="font-archivo font-semibold text-[18px] leading-[28px] text-white">
              {t("dashboard.quickActions.startNewSession")}
            </span>
          </button>
          <button onClick={reviewSessions} className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-oxford-blue border border-gray-300 w-full sm:w-auto sm:flex-1 max-w-full lg:max-w-[548px] h-[60px] md:h-[79.2px] rounded-lg transition-colors shadow-sm">
            <img
              src={timer}
              alt="timer icon"
              className="w-5 h-5 md:w-6 md:h-6"
            />
            <span className="font-archivo font-semibold text-[18px] leading-[28px] text-oxford-blue">
              {t("dashboard.quickActions.reviewSessions")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
