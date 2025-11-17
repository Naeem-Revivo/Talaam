import React, { useState } from "react";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import { useLanguage } from "../../context/LanguageContext";
import Dropdown from "../../components/shared/Dropdown";

const PerformanceAnalyticsPage = () => {
  const { t } = useLanguage();
  const [exam, setExam] = useState("");
  const [subject, setSubject] = useState("");
  const [cognitiveLevel, setCognitiveLevel] = useState("");
  const [dateRange, setDateRange] = useState("");

  // Performance Analytics KPI Cards
  const performanceKPICards = [
    {
      id: 1,
      title: t('admin.performanceAnalytics.kpi.averageAccuracy'),
      value: "78%",
      subtext: "",
      subtextClassName: "text-dark-gray",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M19 25.5004C16.243 25.5004 14 23.2574 14 20.5004C14 18.2124 15.544 16.2233 17.754 15.6613C18.281 15.5273 18.833 15.8484 18.969 16.3844C19.106 16.9204 18.781 17.4645 18.246 17.6005C16.924 17.9365 16 19.1294 16 20.5014C16 22.1554 17.346 23.5014 19 23.5014C20.371 23.5014 21.564 22.5773 21.901 21.2543C22.037 20.7183 22.582 20.3944 23.117 20.5314C23.652 20.6674 23.975 21.2125 23.839 21.7475C23.276 23.9575 21.287 25.5004 19 25.5004ZM28 20.5004C28 20.2824 27.988 20.0653 27.963 19.8473C27.901 19.2993 27.423 18.8994 26.857 18.9674C26.308 19.0294 25.915 19.5254 25.977 20.0744C25.993 20.2164 26 20.3584 26 20.5014C26 24.3614 22.859 27.5014 19 27.5014C15.141 27.5014 12 24.3614 12 20.5014C12 16.6414 15.141 13.5014 19 13.5014C19.143 13.5014 19.286 13.5093 19.43 13.5243C19.973 13.5923 20.473 13.1915 20.534 12.6415C20.595 12.0925 20.199 11.5985 19.65 11.5375C19.434 11.5135 19.216 11.5014 19 11.5014C14.037 11.5014 10 15.5394 10 20.5014C10 25.4634 14.037 29.5014 19 29.5014C23.963 29.5014 28 25.4624 28 20.5004ZM29.462 14.3095C29.385 14.1225 29.202 14.0004 29 14.0004H25.5V10.5004C25.5 10.2984 25.378 10.1155 25.191 10.0385C25.005 9.96047 24.79 10.0034 24.646 10.1464L22.085 12.7074C21.713 13.0794 21.499 13.5955 21.499 14.1215V16.5863L18.292 19.7934C17.901 20.1844 17.901 20.8164 18.292 21.2074C18.487 21.4024 18.743 21.5004 18.999 21.5004C19.255 21.5004 19.511 21.4024 19.706 21.2074L22.913 18.0004H25.378C25.904 18.0004 26.42 17.7874 26.792 17.4144L29.353 14.8534C29.496 14.7104 29.539 14.4965 29.462 14.3095Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 2,
      title: t('admin.performanceAnalytics.kpi.averageTimePerQuestion'),
      value: "45s",
      subtext: "",
      subtextClassName: "text-dark-gray",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM23.53 23.53C23.384 23.676 23.192 23.75 23 23.75C22.808 23.75 22.616 23.677 22.47 23.53L19.47 20.53C19.329 20.389 19.25 20.198 19.25 20V15C19.25 14.586 19.586 14.25 20 14.25C20.414 14.25 20.75 14.586 20.75 15V19.689L23.53 22.469C23.823 22.763 23.823 23.237 23.53 23.53Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 3,
      title: t('admin.performanceAnalytics.kpi.improvementPercent'),
      value: "5%",
      subtext: "",
      subtextClassName: "text-dark-gray",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M30.0002 15V19.1541C30.0002 19.7061 29.5522 20.1541 29.0002 20.1541C28.4482 20.1541 28.0002 19.7061 28.0002 19.1541V17.4141L22.4143 23C21.6353 23.78 20.3652 23.78 19.5862 23L17.0003 20.4141L11.7073 25.707C11.5123 25.902 11.2563 26 11.0003 26C10.7443 26 10.4882 25.902 10.2932 25.707C9.90225 25.316 9.90225 24.684 10.2932 24.293L15.5862 19C16.3652 18.22 17.6353 18.22 18.4143 19L21.0003 21.5859L26.5862 16H24.8462C24.2942 16 23.8462 15.552 23.8462 15C23.8462 14.448 24.2942 14 24.8462 14H29.0002C29.1302 14 29.2603 14.0269 29.3823 14.0769C29.6273 14.1789 29.8213 14.3729 29.9233 14.6179C29.9733 14.7399 30.0002 14.87 30.0002 15Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 4,
      title: t('admin.performanceAnalytics.kpi.totalAttempt'),
      value: "1,250",
      subtext: "",
      subtextClassName: "text-dark-gray",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M20 16C16.41 16 13.5 18.91 13.5 22.5C13.5 26.09 16.41 29 20 29C23.59 29 26.5 26.09 26.5 22.5C26.5 18.91 23.59 16 20 16ZM22.9 22.14L21.8199 23.19C21.7399 23.26 21.7 23.37 21.72 23.48L21.97 24.92C22.02 25.21 21.71 25.43 21.45 25.29L20.16 24.61C20.06 24.56 19.94 24.56 19.84 24.61L18.55 25.29C18.29 25.43 17.98 25.21 18.03 24.91L18.28 23.48C18.3 23.37 18.2601 23.26 18.1801 23.19L17.1 22.14C16.9 21.95 17.01 21.61 17.29 21.57L18.78 21.35C18.89 21.34 18.98 21.27 19.03 21.17L19.6801 19.87C19.8101 19.6 20.1899 19.6 20.3199 19.87L20.97 21.17C21.02 21.27 21.11 21.34 21.22 21.35L22.71 21.57C22.99 21.61 23.1 21.95 22.9 22.14ZM25.163 16.4C24.279 15.645 23.226 15.081 22.069 14.767C21.873 14.714 21.781 14.495 21.889 14.324L24 11H29L25.605 16.339C25.507 16.493 25.301 16.519 25.163 16.4ZM14.395 16.339L11 11H16L18.11 14.324C18.219 14.495 18.1261 14.714 17.9301 14.767C16.7741 15.081 15.7201 15.646 14.8361 16.4C14.6991 16.519 14.493 16.493 14.395 16.339Z" fill="white"/>
        </svg>
      ),
    },
  ];

  // Accuracy over Time Data
  const accuracyData = [
    { month: "Jan", accuracy: 10 },
    { month: "Feb", accuracy: 15 },
    { month: "Mar", accuracy: 20 },
    { month: "Apr", accuracy: 30 },
    { month: "May", accuracy: 45 },
    { month: "Jun", accuracy: 55 },
    { month: "Jul", accuracy: 65 },
    { month: "Aug", accuracy: 70 },
    { month: "Sep", accuracy: 75 },
    { month: "Oct", accuracy: 80 },
    { month: "Nov", accuracy: 83 },
    { month: "Dec", accuracy: 85 },
  ];

  // Subject Distribution Data
  const subjectDistribution = [
    { subject: "Math", percentage: 40, color: "#ED4122" },
    { subject: "English", percentage: 20, color: "#FDF0D5" },
    { subject: "Art", percentage: 15, color: "#6CA6C1" },
    { subject: "Science", percentage: 15, color: "#032746" },
    { subject: "History", percentage: 10, color: "#9CA3AF" },
  ];

  // Top Performer Data
  const topPerformers = [
    { name: "Ali Raza", accuracy: "95%", timePerQ: "30s" },
    { name: "John Doe", accuracy: "92%", timePerQ: "35s" },
    { name: "Sarah Khan", accuracy: "90%", timePerQ: "40s" },
    { name: "John Doe", accuracy: "88%", timePerQ: "42s" },
  ];

  // Weak Areas Data
  const weakAreas = [
    { subject: "Math", avgAccuracy: "60%", attempted: 120 },
    { subject: "English", avgAccuracy: "65%", attempted: 110 },
    { subject: "Science", avgAccuracy: "68%", attempted: 95 },
    { subject: "History", avgAccuracy: "70%", attempted: 85 },
  ];

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
  const donutPaths = subjectDistribution.map((item) => {
    const path = getDonutPath(item.percentage, currentAngle, 60, 35);
    currentAngle += (item.percentage / 100) * 360;
    return { ...item, path };
  });

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
              {t('admin.performanceAnalytics.hero.title')}
            </h1>
            <p className="mt-2 font-roboto text-[14px] md:text-[18px] font-normal leading-[20px] md:leading-[24px] text-dark-gray">
              {t('admin.performanceAnalytics.hero.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <button
              type="button"
              className="flex h-[36px] items-center justify-center gap-2 rounded-[8px] border border-[#03274633] bg-white px-3 md:px-4 text-[14px] md:text-[16px] font-roboto font-medium leading-[16px] text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.1999 14C10.9951 14 10.7903 13.9193 10.6343 13.7587C10.3215 13.4367 10.3215 12.9162 10.6343 12.5942L13.2686 9.88242H3.20012C2.75773 9.88242 2.40014 9.51349 2.40014 9.05891C2.40014 8.60433 2.75773 8.23539 3.20012 8.23539H15.1998C15.523 8.23539 15.8159 8.43628 15.9391 8.74345C16.0631 9.05145 15.9942 9.40563 15.7654 9.64116L11.7655 13.7587C11.6095 13.9193 11.4047 14 11.1999 14ZM13.5999 4.94133C13.5999 4.48675 13.2423 4.11781 12.7999 4.11781H2.73138L5.36569 1.406C5.67848 1.084 5.67848 0.563491 5.36569 0.241496C5.0529 -0.0804987 4.54726 -0.0804987 4.23447 0.241496L0.23457 4.35908C0.00577566 4.5946 -0.0630554 4.94878 0.0609415 5.25678C0.184138 5.56477 0.476989 5.76484 0.800181 5.76484H12.7999C13.2423 5.76484 13.5999 5.39591 13.5999 4.94133Z"
                  fill="#25314C"
                />
              </svg>
              {t('admin.performanceAnalytics.actions.comparePeriod')}
            </button>
            <button
              type="button"
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
              {t('admin.performanceAnalytics.actions.exportReport')}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 md:gap-3">
          {/* Exam Dropdown */}
          <div style={{ width: "135px" }}>
            <Dropdown
              value={exam || ""}
              options={[
                { value: "exam1", label: "Exam 1" },
                { value: "exam2", label: "Exam 2" },
              ]}
              onChange={(value) => setExam(value)}
              placeholder={t('admin.performanceAnalytics.filters.exam')}
              showDefaultOnEmpty={false}
              className="w-full"
              height="h-[50px]"
            />
          </div>

          {/* Subject Dropdown */}
          <div style={{ width: "184px" }}>
            <Dropdown
              value={subject || ""}
              options={[
                { value: "math", label: "Mathematics" },
                { value: "science", label: "Science" },
                { value: "english", label: "English" },
              ]}
              onChange={(value) => setSubject(value)}
              placeholder={t('admin.performanceAnalytics.filters.subject')}
              showDefaultOnEmpty={false}
              className="w-full"
              height="h-[50px]"
            />
          </div>

          {/* Date Range Dropdown */}
          <div style={{ width: "184px" }}>
            <Dropdown
              value={dateRange || ""}
              options={[
                { value: "Last 30 Days", label: t('admin.performanceAnalytics.filters.last30Days') },
                { value: "Last 7 Days", label: t('admin.performanceAnalytics.filters.last7Days') },
                { value: "Last 90 Days", label: t('admin.performanceAnalytics.filters.last90Days') },
                { value: "Last Year", label: t('admin.performanceAnalytics.filters.lastYear') },
              ]}
              onChange={(value) => setDateRange(value)}
              placeholder={t('admin.performanceAnalytics.filters.dateRange')}
              showDefaultOnEmpty={false}
              className="w-full"
              height="h-[50px]"
            />
          </div>

          {/* Cognitive Level Dropdown */}
          <div style={{ width: "206px" }}>
            <Dropdown
              value={cognitiveLevel || ""}
              options={[
                { value: "recall", label: t('admin.performanceAnalytics.filters.recall') },
                { value: "analysis", label: t('admin.performanceAnalytics.filters.analysis') },
                { value: "synthesis", label: t('admin.performanceAnalytics.filters.synthesis') },
              ]}
              onChange={(value) => setCognitiveLevel(value)}
              placeholder={t('admin.performanceAnalytics.filters.cognitiveLevel')}
              showDefaultOnEmpty={false}
              className="w-full"
              height="h-[50px]"
            />
          </div>
        </div>

        {/* Performance KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {performanceKPICards.map((card) => (
            <AdminMetricCard
              key={card.id}
              title={card.title}
              value={card.value}
              subtext={card.subtext}
              subtextClassName={card.subtextClassName}
              icon={card.icon}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[262px]"
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="flex justify-between gap-6">
          {/* Accuracy over Time Chart */}
          <div className="rounded-[12px] border border-[#03274633] w-[639px]  bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="pt-3 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
                {t('admin.performanceAnalytics.charts.accuracyOverTime')}
              </h2>
              <span className="font-archivo text-oxford-blue leading-[32px] align-middle">
                <span className="font-bold text-[20px] text-[#ED4122]">72%</span>
                <span className="font-normal text-[16px] text-oxford-blue"> {t('admin.performanceAnalytics.charts.last30Days')} </span>
                <span className="font-normal text-[16px] text-orange-dark">{t('admin.performanceAnalytics.charts.improvement')}</span>
              </span>
            </div>
            <div className="h-[350px] relative">
              <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
                {/* Y-axis labels */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                  <g key={val}>
                    <line
                      x1="50"
                      y1={280 - (val / 100) * 240}
                      x2="550"
                      y2={280 - (val / 100) * 240}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="45"
                      y={280 - (val / 100) * 240 + 5}
                      textAnchor="end"
                      className="font-roboto text-[12px] fill-[#6B7280]"
                    >
                      {val}%
                    </text>
                  </g>
                ))}
                {/* X-axis labels */}
                {accuracyData.map((data, index) => (
                  <text
                    key={data.month}
                    x={70 + (index * 480) / 11}
                    y="295"
                    textAnchor="middle"
                    className="font-roboto text-[12px] fill-[#6B7280]"
                  >
                    {data.month}
                  </text>
                ))}
                {/* Line chart */}
                <polyline
                  points={accuracyData
                    .map(
                      (data, index) =>
                        `${70 + (index * 480) / 11},${280 - (data.accuracy / 100) * 240}`
                    )
                    .join(" ")}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Data points */}
                {accuracyData.map((data, index) => (
                  <circle
                    key={data.month}
                    cx={70 + (index * 480) / 11}
                    cy={280 - (data.accuracy / 100) * 240}
                    r="4"
                    fill="#3B82F6"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Subject Distribution Chart */}
          <div className="rounded-[12px] border border-[#03274633] w-[455px] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="pt-3 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.performanceAnalytics.charts.subjectDistribution')}
            </h2>
            <div className="flex flex-col items-center justify-center gap-6 mt-6">
              <div className="relative">
                <svg width="260" height="260" viewBox="0 0 200 200">
                  {donutPaths.map((item, index) => (
                    <path
                      key={index}
                      d={item.path}
                      fill={item.color}
                    />
                  ))}
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full max-w-[300px] mx-auto">
                {subjectDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue">
                      {item.subject}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performer Table */}
          <div className="rounded-[12px] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] w-full h-auto">
            <h2 className="py-6 pt-10 px-6 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.performanceAnalytics.tables.topPerformer')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="px-6 py-4 text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue text-left">
                      {t('admin.performanceAnalytics.tables.columns.name')}
                    </th>
                    <th className="px-6 py-4 text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue text-center">
                      {t('admin.performanceAnalytics.tables.columns.accuracy')}
                    </th>
                    <th className="px-6 py-4 text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue text-right">
                      {t('admin.performanceAnalytics.tables.columns.timePerQ')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topPerformers.map((performer, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#E5E7EB] bg-white last:border-none"
                    >
                      <td className="px-6 py-3 text-[16px] font-roboto font-normal leading-[100%] text-dark-gray text-left">
                        {performer.name}
                      </td>
                      <td className="px-6 py-3 text-[16px] font-roboto font-normal leading-[100%] text-dark-gray text-center">
                        {performer.accuracy}
                      </td>
                      <td className="px-6 py-3 text-[16px] font-roboto font-normal leading-[100%] text-dark-gray text-right">
                        {performer.timePerQ}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weak Areas Table */}
          <div className="rounded-[12px] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] w-full h-auto">
            <h2 className="py-6 pt-10 px-6 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.performanceAnalytics.tables.weakAreas')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="px-6 py-4 text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue text-left">
                      {t('admin.performanceAnalytics.tables.columns.subject')}
                    </th>
                    <th className="px-6 py-4 text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue text-center">
                      {t('admin.performanceAnalytics.tables.columns.avgAccuracy')}
                    </th>
                    <th className="px-6 py-4 text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue text-right">
                      {t('admin.performanceAnalytics.tables.columns.attempted')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {weakAreas.map((area, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#E5E7EB] bg-white last:border-none"
                    >
                      <td className="px-6 py-3 text-[16px] font-roboto font-normal leading-[100%] text-dark-gray text-left">
                        {area.subject}
                      </td>
                      <td className="px-6 py-3 text-[16px] font-roboto font-normal leading-[100%] text-dark-gray text-center">
                        {area.avgAccuracy}
                      </td>
                      <td className="px-6 py-3 text-[14px] font-roboto font-normal leading-[100%] text-dark-gray text-right">
                        {area.attempted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsPage;

