import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import studentQuestionsAPI from "../../api/studentQuestions";
import { Loader } from "../../components/common/Loader";
import WelcomeHeader from "../../components/dashboard/WelcomeHeader";
import MetricCards from "../../components/dashboard/MetricCards";
import PracticeAreas from "../../components/dashboard/PracticeAreas";
import QuickActions from "../../components/dashboard/QuickActions";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import { progress, statsprogress } from "../../assets/svg";

const DashboardPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [testSummary, setTestSummary] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // TODO: Replace with actual API call when available
        // For now, calculate practice areas from performance data
        calculatePracticeAreas(performanceResponse.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate practice areas from performance data
  const calculatePracticeAreas = (data) => {
    // TODO: Replace with actual API endpoint when available
    // Mock data for now based on image structure
    const mockPracticeAreas = [
      {
        topic: "Algebraic Equations",
        accuracy: 62,
        correct: 28,
        total: 45,
      },
      {
        topic: "Reading Comprehension",
        accuracy: 58,
        correct: 22,
        total: 38,
      },
      {
        topic: "Geometry Problems",
        accuracy: 71,
        correct: 37,
        total: 52,
      },
    ];
    setPracticeAreas(mockPracticeAreas);
  };

  // Calculate progress percentage based on test mode data
  const getProgressData = () => {
    if (!testSummary) {
      return { percentage: 0, completed: 0, total: 1000 }; // Default total to 1000 as per image
    }

    // Progress = (Total correct answers) / (Total questions attempted across all test sessions) * 100
    // In test mode, total includes all attempts (e.g., 3 tests × 10 questions = 30 total)
    const completed = testSummary.totalCorrectAnswers || 0;
    const total = testSummary.totalQuestionsAttempted || 1000; // Default to 1000 as per image
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
    return "#FF6B35"; // Default to orange as per image
  };

  // Calculate metrics from available data
  const metrics = useMemo(() => {
    const progressData = getProgressData();
    const accuracy = getAccuracy();
    
    // Calculate score improvement (compare current accuracy with previous)
    // TODO: Replace with actual API data when available
    const scoreImprovement = 4; // Mock data from image
    
    // Calculate study streak
    // TODO: Replace with actual API data when available
    const studyStreak = 5; // Mock data from image
    
    // Get sessions completed from performance data
    const sessionsCompleted = performanceData.length || 0;

    return {
      scoreImprovement,
      questionsSolved: progressData.completed,
      studyStreak,
      sessionsCompleted,
    };
  }, [testSummary, performanceData]);


  const startNewSession = () => {
    navigate("/dashboard/practice");
  };

  const handleAnalytics = () => {
    navigate("/dashboard/analytics");
  };

  const reviewSessions = () => {
    navigate("/dashboard/review");
  };

  const handlePracticeAreaClick = (area) => {
    // Navigate to practice page with the specific topic
    navigate("/dashboard/practice", { state: { topic: area.topic } });
  };

  return (
    <div className="px-8 pt-6 pb-[60px] min-h-screen space-y-6 sm:space-y-8 mx-auto">
      {/* Welcome Header */}
      <WelcomeHeader t={t} />

      {/* Overview Section - Progress and Accuracy */}
      <div className=" w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Progress Card */}
          <div className="bg-white rounded-[24px] border border-[#E5E5E5] shadow-dashboard p-4 md:p-8 w-full h-auto min-h-[200px] md:min-h-[304px] flex flex-col">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="font-archivo font-bold text-[18px] leading-[27px] text-dashboard-dark">
                {t("dashboard.overview.progress") || "Overall Progress"}
              </h3>
              <img src={progress} alt="progress" className="w-10 h-10" />
            </div>
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader size="lg" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center flex-1">
                  <div className="relative w-[128px] h-[128px]">
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
                        className="text-cinnebar-red"
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
                </div>
                <p className="text-center font-roboto font-normal text-base text-dashboard-gray mt-4 md:mt-6">
                  {`${getProgressData().completed}/${getProgressData().total} ${t("dashboard.overview.questionsCompleted") || "Questions Completed"}`}
                </p>
              </>
            )}
          </div>

          {/* Accuracy Card with Dark Blue Gradient */}
          <div className="bg-gradient-to-br from-[#032746] via-[#0A4B6E] to-[#173B50] rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full h-auto min-h-[200px] md:min-h-[251px] flex flex-col">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="font-archivo font-bold text-[18px] leading-[27px] text-white">
                {t("dashboard.overview.accuracy") || "Overall Accuracy"}
              </h3>
              <img src={statsprogress} alt="accuracy" className="w-10 h-10" />
            </div>
            {loading ? (
              <div className="flex-1 mb-6 flex items-center justify-center">
                <Loader size="lg" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center">
                  <p className="font-roboto font-[900] text-[72px] leading-[72px] text-white tracking-[0.12px]">
                    {getAccuracy().toFixed(0)}%
                  </p>
                </div>
                  <p className="font-roboto font-normal text-center text-base text-[#F5F5F5]">
                    {t("dashboard.overview.overall") || "Based on all answered questions"}
                  </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <MetricCards metrics={metrics} loading={loading} t={t} />

      {/* Performance Chart and Practice Areas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <PerformanceChart 
          performanceData={performanceData}
          loading={loading}
          t={t}
        />

        {/* Practice Areas */}
        <PracticeAreas
          practiceAreas={practiceAreas}
          loading={loading}
          onPracticeClick={handlePracticeAreaClick}
          t={t}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions
        onStartSession={startNewSession}
        onAnalytics={handleAnalytics}
        onReviewSessions={reviewSessions}
        t={t}
      />
    </div>
  );
};

export default DashboardPage;
