import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import adminAPI from "../../api/admin";

// Reusable KPI Card Component
const KPICard = ({
  title,
  value,
  subtitle,
  icon,
  valueWeight = "font-semibold",
  subtitlecolor,
}) => {
  const { isRTL } = useLanguage();

  return (
    <div
      className="rounded-[12px] border border-[#03274633] bg-white pb-6 px-5 pt-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] w-full flex items-center justify-between gap-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-col justify-between flex-1 h-full min-h-[66px]">
        <h3 className="font-roboto text-[14px] md:text-[16px] font-normal leading-[18px] md:leading-[20px] text-dark-gray">
          {title}
        </h3>
        <p
          className={`font-archivo text-[24px] md:text-[30px] ${valueWeight} leading-[32px] md:leading-[40px] text-oxford-blue`}
        >
          {value}
        </p>
        {subtitle && (
          <p
            className={`font-roboto text-[12px] md:text-[16px] font-normal leading-[16px] md:leading-[20px] ${subtitlecolor}`}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">{icon}</div>
    </div>
  );
};

const ReportsAndAnalyticsPage = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [heroData, growthData, practiceData, performanceData] = await Promise.all([
          adminAPI.getUserAnalyticsHero(),
          adminAPI.getUserGrowthChart(),
          adminAPI.getPracticeDistribution(),
          adminAPI.getTopPerformanceUsers({ page: currentPage, limit: 5 }),
        ]);

        setAnalyticsData({
          hero: heroData.data,
          growth: growthData.data,
          practice: practiceData.data,
          performance: performanceData.data,
        });
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [currentPage]);

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  // Format percentage change
  const formatChange = (change, changeType) => {
    if (change === null || change === undefined) return '';
    const sign = change >= 0 ? '+' : '';
    const color = changeType === 'increase' ? 'text-[#ED4122]' : 'text-dark-gray';
    return { text: `${sign}${change}%`, color };
  };

  // Prepare KPI Cards from API data
  const kpiCards = analyticsData?.hero ? [
    {
      id: 1,
      title: t("admin.reportsAndAnalytics.kpi.newSignups"),
      value: formatNumber(analyticsData.hero.newSignUps?.value || 0),
      subtitle: analyticsData.hero.newSignUps?.change !== undefined 
        ? `${analyticsData.hero.newSignUps.change >= 0 ? '+' : ''}${analyticsData.hero.newSignUps.change}% from last month`
        : '',
      subtitlecolor: analyticsData.hero.newSignUps?.changeType === 'increase' ? "text-[#ED4122]" : "text-dark-gray",
      valueWeight: "font-semibold",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="6" fill="#ED4122" />
          <path
            d="M29.25 18.528C29.25 18.942 28.914 19.278 28.5 19.278H26.75V21.028C26.75 21.442 26.414 21.778 26 21.778C25.586 21.778 25.25 21.442 25.25 21.028V19.278H23.5C23.086 19.278 22.75 18.942 22.75 18.528C22.75 18.114 23.086 17.778 23.5 17.778H25.25V16.028C25.25 15.614 25.586 15.278 26 15.278C26.414 15.278 26.75 15.614 26.75 16.028V17.778H28.5C28.914 17.778 29.25 18.114 29.25 18.528ZM17.509 19C19.715 19 21.509 17.206 21.509 15C21.509 12.794 19.715 11 17.509 11C15.303 11 13.509 12.794 13.509 15C13.509 17.206 15.303 19 17.509 19ZM19.5 21H15.5C11.44 21 10 23.973 10 26.519C10 28.796 11.2111 30 13.5031 30H21.4969C23.7889 30 25 28.796 25 26.519C25 23.973 23.56 21 19.5 21Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: t("admin.reportsAndAnalytics.kpi.activeUsers"),
      value: formatNumber(analyticsData.hero.activeUsers?.value || 0),
      subtitle: analyticsData.hero.activeUsers?.change !== undefined
        ? `${analyticsData.hero.activeUsers.change >= 0 ? '+' : ''}${analyticsData.hero.activeUsers.change}% vs last month`
        : '',
      subtitlecolor: analyticsData.hero.activeUsers?.changeType === 'increase' ? "text-[#ED4122]" : "text-dark-gray",
      valueWeight: "font-semibold",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="6" fill="#ED4122" />
          <path
            d="M26.8929 27.5186C26.8929 29.7644 25.6542 31 23.4067 31H15.5933C13.3458 31 12.1071 29.7632 12.1071 27.5186C12.1071 24.9899 13.5309 22.0368 17.545 22.0368H21.454C25.4691 22.0357 26.8929 24.9899 26.8929 27.5186ZM19.5088 19.9612C21.6358 19.9612 23.3652 18.2227 23.3652 16.0863C23.3652 13.9489 21.6347 12.2115 19.5088 12.2115C17.383 12.2115 15.6536 13.95 15.6536 16.0863C15.6536 18.2227 17.3819 19.9612 19.5088 19.9612ZM26.9367 17.1076H25.1734C25.0201 17.1076 24.8886 17.2181 24.8557 17.3618C24.6148 18.4117 24.0671 19.3511 23.3114 20.0695C23.1252 20.2463 23.2348 20.5558 23.4867 20.6221C25.4253 21.0863 26.7724 22.2357 27.5719 23.6946C27.6267 23.8162 27.7362 23.8935 27.8786 23.8935H28.3385C30.058 23.8935 31 22.9431 31 21.219C31 19.329 29.9377 17.1076 26.9367 17.1076ZM25.5348 10.0011C24.4417 10.0011 23.4877 10.6056 22.9872 11.4997C22.9467 11.5726 22.9489 11.6533 22.9642 11.723C22.9806 11.7959 23.0125 11.8347 23.0804 11.8922C24.1526 12.8039 24.8678 14.1246 24.985 15.6178C24.9916 15.7018 25.0201 15.7537 25.0704 15.8079C25.1208 15.862 25.1963 15.8951 25.296 15.9039C25.3738 15.9106 25.4537 15.915 25.5348 15.915C27.1448 15.915 28.4591 14.5888 28.4591 12.9531C28.4591 11.3273 27.1448 10.0011 25.5348 10.0011ZM8 21.219C8 22.9431 8.94196 23.8935 10.6615 23.8935H11.1214C11.2638 23.8935 11.3733 23.8162 11.4281 23.6946C12.2276 22.2357 13.5747 21.0863 15.5133 20.6221C15.7652 20.5558 15.8748 20.2463 15.6886 20.0695C14.9329 19.3511 14.3852 18.4117 14.1443 17.3618C14.1114 17.2181 13.9799 17.1076 13.8266 17.1076H12.0633C9.06234 17.1076 8 19.329 8 21.219ZM10.5409 12.952C10.5409 14.5877 11.8552 15.9139 13.4652 15.9139C13.5463 15.9139 13.6262 15.9095 13.704 15.9028C13.8048 15.894 13.8792 15.8609 13.9296 15.8068C13.9799 15.7526 14.0084 15.7007 14.015 15.6167C14.1322 14.1236 14.8474 12.8027 15.9196 11.8909C15.9864 11.8335 17.0194 11.7948 17.0358 11.7219C17.0511 11.6523 17.0533 11.5727 17.0128 11.4986C16.5112 10.6045 15.5583 10 14.4652 10C12.8552 10.0011 11.5409 11.3274 11.5409 12.952Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: t("admin.reportsAndAnalytics.kpi.mostAttemptedSubject"),
      value: analyticsData.hero.mostAttemptedSubject || "N/A",
      valueWeight: "font-semibold",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="6" fill="#ED4122" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20 16C16.41 16 13.5 18.91 13.5 22.5C13.5 26.09 16.41 29 20 29C23.59 29 26.5 26.09 26.5 22.5C26.5 18.91 23.59 16 20 16ZM22.9 22.14L21.8199 23.19C21.7399 23.26 21.7 23.37 21.72 23.48L21.97 24.92C22.02 25.21 21.71 25.43 21.45 25.29L20.16 24.61C20.06 24.56 19.94 24.56 19.84 24.61L18.55 25.29C18.29 25.43 17.98 25.21 18.03 24.91L18.28 23.48C18.3 23.37 18.2601 23.26 18.1801 23.19L17.1 22.14C16.9 21.95 17.01 21.61 17.29 21.57L18.78 21.35C18.89 21.34 18.98 21.27 19.03 21.17L19.6801 19.87C19.8101 19.6 20.1899 19.6 20.3199 19.87L20.97 21.17C21.02 21.27 21.11 21.34 21.22 21.35L22.71 21.57C22.99 21.61 23.1 21.95 22.9 22.14ZM25.163 16.4C24.279 15.645 23.226 15.081 22.069 14.767C21.873 14.714 21.781 14.495 21.889 14.324L24 11H29L25.605 16.339C25.507 16.493 25.301 16.519 25.163 16.4ZM14.395 16.339L11 11H16L18.11 14.324C18.219 14.495 18.1261 14.714 17.9301 14.767C16.7741 15.081 15.7201 15.646 14.8361 16.4C14.6991 16.519 14.493 16.493 14.395 16.339Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      id: 4,
      title: t("admin.reportsAndAnalytics.kpi.averageTimePerQuestion"),
      value: analyticsData.hero.averageTimePerQuestion || "45s",
      valueWeight: "font-semibold",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="6" fill="#ED4122" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM23.53 23.53C23.384 23.676 23.192 23.75 23 23.75C22.808 23.75 22.616 23.677 22.47 23.53L19.47 20.53C19.329 20.389 19.25 20.198 19.25 20V15C19.25 14.586 19.586 14.25 20 14.25C20.414 14.25 20.75 14.586 20.75 15V19.689L23.53 22.469C23.823 23.763 23.823 23.237 23.53 23.53Z"
            fill="white"
          />
        </svg>
      ),
    },
  ] : [];

  // Prepare practice distribution from API
  const practiceDistribution = analyticsData?.practice || [];

  // Prepare user growth data from API
  const userGrowthData = analyticsData?.growth?.weeks?.map(week => ({
    week: week.label || `Week ${week.week}`,
    users: week.newUsers || 0,
  })) || [];

  // Prepare top users from API
  const topUsers = analyticsData?.performance?.users?.map((user, index) => ({
    id: String(user.rank || index + 1).padStart(3, '0'),
    name: user.user?.name || 'N/A',
    email: user.user?.email || 'N/A',
    attempts: user.attempts || 0,
    accuracy: user.accuracy || 0,
    avgTime: user.averageTimePerQuestion || 45,
    lastActive: user.lastActive || 'N/A',
  })) || [];

  // Calculate donut chart path
  const getDonutPath = (percentage, startAngle, radius, innerRadius) => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = 100 + radius * Math.cos(startAngleRad);
    const y1 = 100 + radius * Math.sin(startAngleRad);
    const x2 = 100 + radius * Math.cos(endAngleRad);
    const y2 = 100 + radius * Math.sin(endAngleRad);

    const x3 = 100 + innerRadius * Math.cos(endAngleRad);
    const y3 = 100 + innerRadius * Math.sin(endAngleRad);
    const x4 = 100 + innerRadius * Math.cos(startAngleRad);
    const y4 = 100 + innerRadius * Math.sin(startAngleRad);

    const largeArc = angle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  let currentAngle = -90;
  const donutPaths = practiceDistribution.length > 0 ? practiceDistribution.map((item) => {
    const path = getDonutPath(item.percentage, currentAngle, 60, 35);
    currentAngle += (item.percentage / 100) * 360;
    return { ...item, path };
  }) : [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 2xl:px-0 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-oxford-blue"></div>
          <p className="mt-4 text-oxford-blue font-roboto">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 2xl:px-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#EF4444] font-roboto text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-oxford-blue text-white rounded-lg hover:bg-opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 2xl:px-0">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
              {t("admin.reportsAndAnalytics.hero.title")}
            </h1>
            <p className="mt-2 font-roboto text-[14px] md:text-[18px] font-normal leading-[20px] md:leading-[24px] text-dark-gray">
              {t("admin.reportsAndAnalytics.hero.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto py-8">
            <button
              type="button"
              onClick={() => navigate("/admin/reports/export")}
              className="flex h-[36px] items-center justify-center gap-2 rounded-[8px] bg-[#ED4122] px-3 md:px-5 text-[14px] md:text-[16px] font-roboto font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
            >
              <svg
                width="14"
                height="12"
                viewBox="0 0 14 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2427 7.57819V9.02679C11.2427 9.6613 11.0173 10.212 10.5664 10.6609C10.1214 11.1219 9.57559 11.3493 8.94671 11.3493H2.30194C1.67306 11.3493 1.12724 11.1219 0.67041 10.6609C0.225448 10.212 0 9.6613 0 9.02679V2.32254C0 1.68803 0.225448 1.13733 0.67041 0.688382C1.12724 0.227466 1.67306 0 2.30194 0H7.92626C8.06272 0 8.17544 0.107747 8.17544 0.257395V0.772185C8.17544 0.92782 8.06272 1.02958 7.92626 1.02958H2.30194C1.9519 1.02958 1.64339 1.16127 1.40015 1.40669C1.15097 1.6581 1.02638 1.96339 1.02638 2.31656V9.02679C1.02638 9.37996 1.1569 9.69123 1.40015 9.93665C1.64933 10.1881 1.9519 10.3138 2.30194 10.3138H8.94078C9.29082 10.3138 9.59932 10.1821 9.84257 9.93665C10.0858 9.69123 10.2163 9.37996 10.2163 9.02679V7.58418C10.2163 7.42854 10.3231 7.33277 10.4714 7.33277H10.9817C11.1419 7.33277 11.2427 7.42854 11.2427 7.57819ZM13.9066 3.51973L11.2961 6.14755C11.0885 6.37502 10.7503 6.19544 10.7503 5.92009V4.60318H9.59932C9.26115 4.60318 8.82212 4.62114 8.27037 4.64509C7.71861 4.66903 7.17873 4.7648 6.63291 4.92642C6.09895 5.08804 5.66585 5.27361 5.33955 5.48312C5.01918 5.69262 4.79373 5.90213 4.66321 6.11164C4.53268 6.31516 4.42589 6.58453 4.3191 6.92573C4.21231 7.26692 4.16485 7.60214 4.16485 7.94932C4.16485 8.13488 4.17078 8.35038 4.18858 8.58383C4.18858 8.62573 4.21231 8.77538 4.21231 8.84122C4.21231 8.937 4.14705 9.0208 4.05212 9.0208C3.98686 9.0208 3.9394 8.99087 3.90974 8.93101C3.85634 8.85918 3.76735 8.63172 3.71989 8.54193C3.28679 7.56622 3.15033 6.56657 3.32239 5.54896C3.41138 4.84861 3.76735 4.1722 4.40809 3.52572C5.44634 2.48416 7.17873 1.96339 9.59932 1.96339H10.7503V0.646481C10.7503 0.365142 11.0885 0.203522 11.2961 0.413029L13.9066 3.04684C14.0311 3.18452 14.0311 3.38804 13.9066 3.51973Z"
                  fill="white"
                />
              </svg>
              {t("admin.reportsAndAnalytics.actions.exportReport")}
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <h2 className="font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue pt-4">
          {t("admin.reportsAndAnalytics.charts.kpiSummary")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6">
          {kpiCards.map((card) => (
            <KPICard
              key={card.id}
              title={card.title}
              value={card.value}
              icon={card.icon}
              subtitle={card?.subtitle}
              subtitlecolor={card?.subtitlecolor}
              valueWeight={card.valueWeight}
              marginBottom={card.marginBottom}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall User Growth Chart */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="pt-3 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t("admin.reportsAndAnalytics.charts.performanceTrend")}
            </h2>
            <p className="mt-1 font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
              New users over the last 30 days
            </p>
            <div className="h-[300px] relative mt-6">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 600 300"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient
                    id="userGrowthGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ED4122" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ED4122" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Y-axis labels */}
                {[0, 100, 200, 300].map((val) => (
                  <g key={val}>
                    <line
                      x1="50"
                      y1={280 - (val / 300) * 240}
                      x2="550"
                      y2={280 - (val / 300) * 240}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={isRTL ? "555" : "45"}
                      y={280 - (val / 300) * 240 + 5}
                      textAnchor={isRTL ? "start" : "end"}
                      className="font-roboto text-[12px] fill-[#6B7280]"
                    >
                      {val}
                    </text>
                  </g>
                ))}
                {/* X-axis labels */}
                {userGrowthData.length > 0 && userGrowthData.map((data, index) => (
                  <text
                    key={`${data.week}-${index}`}
                    x={100 + (index * 450) / Math.max(userGrowthData.length - 1, 1)}
                    y="295"
                    textAnchor="middle"
                    className="font-roboto text-[12px] fill-[#6B7280]"
                  >
                    {data.week}
                  </text>
                ))}
                {/* Area chart */}
                {userGrowthData.length > 0 && (
                  <>
                    <path
                      d={`M${100 + (0 * 450) / Math.max(userGrowthData.length - 1, 1)},${
                        280 - (userGrowthData[0].users / Math.max(...userGrowthData.map(d => d.users), 300)) * 240
                      } ${userGrowthData
                        .map(
                          (data, index) =>
                            `L${100 + (index * 450) / Math.max(userGrowthData.length - 1, 1)},${
                              280 - (data.users / Math.max(...userGrowthData.map(d => d.users), 300)) * 240
                            }`
                        )
                        .join(" ")} L${
                        100 + ((userGrowthData.length - 1) * 450) / Math.max(userGrowthData.length - 1, 1)
                      },280 L100,280 Z`}
                      fill="url(#userGrowthGradient)"
                    />
                    {/* Line chart */}
                    <polyline
                      points={userGrowthData
                        .map(
                          (data, index) =>
                            `${100 + (index * 450) / Math.max(userGrowthData.length - 1, 1)},${
                              280 - (data.users / Math.max(...userGrowthData.map(d => d.users), 300)) * 240
                            }`
                        )
                        .join(" ")}
                      fill="none"
                      stroke="#ED4122"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Data points */}
                    {userGrowthData.map((data, index) => (
                      <circle
                        key={`${data.week}-${index}`}
                        cx={100 + (index * 450) / Math.max(userGrowthData.length - 1, 1)}
                        cy={280 - (data.users / Math.max(...userGrowthData.map(d => d.users), 300)) * 240}
                        r="4"
                        fill="#ED4122"
                      />
                    ))}
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Practice Distribution Chart */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="pt-3 font-archivo text-[20px] font-semibold leading-[28px] text-oxford-blue">
              {t("admin.reportsAndAnalytics.charts.practiceDistribution")}
            </h2>
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative">
                {donutPaths.length > 0 ? (
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    {donutPaths.map((item, index) => (
                      <path key={index} d={item.path} fill={item.color} />
                    ))}
                  </svg>
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center text-dark-gray">
                    No data
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full max-w-[300px] mx-auto">
                {practiceDistribution.length > 0 ? practiceDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue">
                      {item.subject}
                    </span>
                  </div>
                )) : (
                  <p className="col-span-2 text-center text-dark-gray">No data available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performance User Table */}
        <h2 className="font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue pt-6">
          {t("admin.reportsAndAnalytics.table.topPerformanceUser")}
        </h2>
        <div className="rounded-[12px] border border-[#03274633] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-oxford-blue">
                  <th className="text-left py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t("admin.reportsAndAnalytics.table.columns.number")}
                  </th>
                  <th className="text-left py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t("admin.reportsAndAnalytics.table.columns.user")}
                  </th>
                  <th className="text-left py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t("admin.reportsAndAnalytics.table.columns.email")}
                  </th>
                  <th className="text-center py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t("admin.reportsAndAnalytics.table.columns.attempts")}
                  </th>
                  <th className="text-center py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t("admin.reportsAndAnalytics.table.columns.accuracy")}
                  </th>
                  <th className="text-center py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t("admin.reportsAndAnalytics.table.columns.averageTime")}
                  </th>
                  <th className="text-left py-3 px-3 md:px-6 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t("admin.reportsAndAnalytics.table.columns.lastActive")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {topUsers.length > 0 ? topUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <td className="py-4 px-3 md:px-4 font-roboto text-[12px] md:text-[14px] font-normal leading-[20px] text-oxford-blue whitespace-nowrap">
                      {user.id}
                    </td>
                    <td className="py-4 px-3 md:px-4 font-roboto text-[12px] md:text-[14px] font-normal leading-[20px] text-oxford-blue whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="py-4 px-3 md:px-4 font-roboto text-[12px] md:text-[14px] font-normal leading-[20px] text-oxford-blue break-words max-w-[150px] md:max-w-none">
                      {user.email}
                    </td>
                    <td className="py-4 px-3 md:px-4 text-center font-roboto text-[12px] md:text-[14px] font-normal leading-[20px] text-oxford-blue whitespace-nowrap">
                      {user.attempts}
                    </td>
                    <td className="py-4 px-3 md:px-4 text-center font-roboto text-[12px] md:text-[14px] font-normal leading-[20px] text-oxford-blue whitespace-nowrap">
                      {typeof user.accuracy === 'string' ? user.accuracy : `${user.accuracy}%`}
                    </td>
                    <td className="py-4 px-3 md:px-4 text-center font-roboto text-[12px] md:text-[14px] font-normal leading-[20px] text-oxford-blue whitespace-nowrap">
                      {typeof user.avgTime === 'string' ? user.avgTime : `${user.avgTime}s`}
                    </td>
                    <td className="py-4 px-3 md:px-4 font-roboto text-[12px] md:text-[14px] font-normal leading-[20px] text-oxford-blue whitespace-nowrap">
                      {user.lastActive}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-dark-gray">
                      No performance data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAndAnalyticsPage;
