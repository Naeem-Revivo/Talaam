import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import Dropdown from "../../components/shared/Dropdown";

// Reusable KPI Card Component
const KPICard = ({ title, value, icon, valueWeight = "font-semibold", marginBottom = "mb-1" }) => {
  return (
    <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-4 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] w-full min-h-[90px] md:h-[106px]">
      <div className={`flex items-center justify-between ${marginBottom}`}>
        <h3 className="font-roboto text-[14px] md:text-[16px] font-normal leading-[18px] md:leading-[20px] text-dark-gray flex-1 pr-2">
          {title}
        </h3>
        <div className="flex-shrink-0">
        {icon}
        </div>
      </div>
      <p className={`font-archivo text-[24px] md:text-[30px] ${valueWeight} leading-[32px] md:leading-[40px] text-oxford-blue`}>
        {value}
      </p>
    </div>
  );
};

const ReportsAndAnalyticsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [exam, setExam] = useState("");
  const [subject, setSubject] = useState("");
  const [cognitiveLevel, setCognitiveLevel] = useState("");
  const [dateRange, setDateRange] = useState("");

  // Mock data for charts
  const performanceData = [
    { month: "Jan", accuracy: 12 },
    { month: "Feb", accuracy: 18 },
    { month: "Mar", accuracy: 25 },
    { month: "Apr", accuracy: 35 },
    { month: "May", accuracy: 45 },
    { month: "Jun", accuracy: 55 },
    { month: "Jul", accuracy: 65 },
    { month: "Aug", accuracy: 72 },
    { month: "Sep", accuracy: 78 },
    { month: "Oct", accuracy: 82 },
    { month: "Nov", accuracy: 85 },
    { month: "Dec", accuracy: 88 },
  ];

  const practiceDistribution = [
    { subject: "Math", percentage: 40, color: "#ED4122" },
    { subject: "Science", percentage: 25, color: "#032746" },
    { subject: "English", percentage: 15, color: "#FBBF24" },
    { subject: "History", percentage: 12, color: "#9CA3AF" },
    { subject: "Art", percentage: 8, color: "#60A5FA" },
  ];

  // KPI Cards Data
  const kpiCards = [
    {
      id: 1,
      title: t('admin.reportsAndAnalytics.kpi.totalQuestions'),
      value: "2,000",
      titleSize: "text-[16px]",
      valueSize: "text-[30px]",
      valueWeight: "font-semibold",
      marginBottom: "mb-0",
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
            d="M26.25 10H14.75C12.332 10 11 11.332 11 13.75V25.75C11 27.993 12.507 29.5 14.75 29.5H26.25C27.49 29.5 28.5 28.491 28.5 27.25V21.25V12.25C28.5 11.009 27.49 10 26.25 10ZM16.75 14H22.75C23.164 14 23.5 14.336 23.5 14.75C23.5 15.164 23.164 15.5 22.75 15.5H16.75C16.336 15.5 16 15.164 16 14.75C16 14.336 16.336 14 16.75 14ZM16.75 17H20.75C21.164 17 21.5 17.336 21.5 17.75C21.5 18.164 21.164 18.5 20.75 18.5H16.75C16.336 18.5 16 18.164 16 17.75C16 17.336 16.336 17 16.75 17ZM27 27.25C27 27.664 26.663 28 26.25 28H14.75C12.72 28 12.5 26.426 12.5 25.75C12.5 25.074 12.72 23.5 14.75 23.5H26.25C26.395 23.5 26.5351 23.483 26.6721 23.457C26.7161 23.449 26.758 23.434 26.801 23.423C26.867 23.406 26.936 23.394 27 23.371V27.25Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: t('admin.reportsAndAnalytics.kpi.averageAccuracy'),
      value: "78%",
      titleSize: "text-[16px]",
      valueSize: "text-[30px]",
      valueWeight: "font-semibold",
      marginBottom: "mb-0",
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
            d="M19 25.5004C16.243 25.5004 14 23.2574 14 20.5004C14 18.2124 15.544 16.2233 17.754 15.6613C18.281 15.5273 18.833 15.8484 18.969 16.3844C19.106 16.9204 18.781 17.4645 18.246 17.6005C16.924 17.9365 16 19.1294 16 20.5014C16 22.1554 17.346 23.5014 19 23.5014C20.371 23.5014 21.564 22.5773 21.901 21.2543C22.037 20.7183 22.582 20.3944 23.117 20.5314C23.652 20.6674 23.975 21.2125 23.839 21.7475C23.276 23.9575 21.287 25.5004 19 25.5004ZM28 20.5004C28 20.2824 27.988 20.0653 27.963 19.8473C27.901 19.2993 27.423 18.8994 26.857 18.9674C26.308 19.0294 25.915 19.5254 25.977 20.0744C25.993 20.2164 26 20.3584 26 20.5014C26 24.3614 22.859 27.5014 19 27.5014C15.141 27.5014 12 24.3614 12 20.5014C12 16.6414 15.141 13.5014 19 13.5014C19.143 13.5014 19.286 13.5093 19.43 13.5243C19.973 13.5923 20.473 13.1915 20.534 12.6415C20.595 12.0925 20.199 11.5985 19.65 11.5375C19.434 11.5135 19.216 11.5014 19 11.5014C14.037 11.5014 10 15.5394 10 20.5014C10 25.4634 14.037 29.5014 19 29.5014C23.963 29.5014 28 25.4624 28 20.5004ZM29.462 14.3095C29.385 14.1225 29.202 14.0004 29 14.0004H25.5V10.5004C25.5 10.2984 25.378 10.1155 25.191 10.0385C25.005 9.96047 24.79 10.0034 24.646 10.1464L22.085 12.7074C21.713 13.0794 21.499 13.5955 21.499 14.1215V16.5863L18.292 19.7934C17.901 20.1844 17.901 20.8164 18.292 21.2074C18.487 21.4024 18.743 21.5004 18.999 21.5004C19.255 21.5004 19.511 21.4024 19.706 21.2074L22.913 18.0004H25.378C25.904 18.0004 26.42 17.7874 26.792 17.4144L29.353 14.8534C29.496 14.7104 29.539 14.4965 29.462 14.3095Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: t('admin.reportsAndAnalytics.kpi.mostAttemptedSubject'),
      value: "Mathematics",
      titleSize: "text-[16px]",
      valueSize: "text-[30px]",
      valueWeight: "font-semibold",
      marginBottom: "mb-0",
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
      title: t('admin.reportsAndAnalytics.kpi.averageTimePerQuestion'),
      value: "45s",
      titleSize: "text-[16px]",
      valueSize: "text-[30px]",
      valueWeight: "font-semibold",
      marginBottom: "mb-0",
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
            d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM23.53 23.53C23.384 23.676 23.192 23.75 23 23.75C22.808 23.75 22.616 23.677 22.47 23.53L19.47 20.53C19.329 20.389 19.25 20.198 19.25 20V15C19.25 14.586 19.586 14.25 20 14.25C20.414 14.25 20.75 14.586 20.75 15V19.689L23.53 22.469C23.823 22.763 23.823 23.237 23.53 23.53Z"
            fill="white"
          />
        </svg>
      ),
    },
  ];

  const topUsers = [
    {
      id: "001",
      name: "John Due",
      email: "johndue@gmail.com",
      attempts: 150,
      accuracy: 92,
      avgTime: 30,
      lastActive: "2 days ago",
    },
    {
      id: "002",
      name: "Ali Raza",
      email: "aliraza@gmail.com",
      attempts: 140,
      accuracy: 90,
      avgTime: 35,
      lastActive: "3 days ago",
    },
    {
      id: "003",
      name: "Sarah khan",
      email: "sarahkhan@gmail.com",
      attempts: 145,
      accuracy: 88,
      avgTime: 45,
      lastActive: "4 days ago",
    },
    {
      id: "004",
      name: "Sofia Clark",
      email: "sofiaclark@gmail.com",
      attempts: 135,
      accuracy: 85,
      avgTime: 50,
      lastActive: "5 days ago",
    },
    {
      id: "005",
      name: "Laim Harper",
      email: "laimharper@gmail.com",
      attempts: 130,
      accuracy: 82,
      avgTime: 40,
      lastActive: "6 days ago",
    },
  ];

  const recentReports = [
    { name: "Q1 Student Performance", date: "25-12-2024" },
    { name: "Mathematics Subject Analysis", date: "25-12-2024" },
    { name: "Q1 Student Performance", date: "25-12-2024" },
  ];

  const systemInsights = [
    "Most Difficult Cognitive Level: Analysis",
    "Peak Activity: 8-10 PM",
    "Low Accuracy in Chemistry (58%)",
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
  const donutPaths = practiceDistribution.map((item) => {
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
              {t('admin.reportsAndAnalytics.hero.title')}
            </h1>
            <p className="mt-2 font-roboto text-[14px] md:text-[18px] font-normal leading-[20px] md:leading-[24px] text-dark-gray">
              {t('admin.reportsAndAnalytics.hero.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto py-8">
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
              {t('admin.reportsAndAnalytics.actions.comparePeriod')}
            </button>
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
              {t('admin.reportsAndAnalytics.actions.exportReport')}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:gap-3">
          {/* Exam Dropdown */}
          <div className="w-full md:w-[135px] md:flex-shrink-0 md:max-w-[135px]">
            <Dropdown
              value={exam || ""}
              options={[
                { value: "exam1", label: "Exam 1" },
                { value: "exam2", label: "Exam 2" },
              ]}
              onChange={(value) => setExam(value)}
              placeholder={t('admin.reportsAndAnalytics.filters.exam')}
              showDefaultOnEmpty={false}
              className="!w-full md:!w-[135px]"
              height="h-[50px]"
              textClassName="font-archivo text-[16px] font-semibold"
            />
          </div>

          {/* Subject Dropdown */}
          <div className="w-full md:w-[184px] md:flex-shrink-0 md:max-w-[184px]">
            <Dropdown
              value={subject || ""}
              options={[
                { value: "math", label: "Mathematics" },
                { value: "science", label: "Science" },
              ]}
              onChange={(value) => setSubject(value)}
              placeholder={t('admin.reportsAndAnalytics.filters.subject')}
              showDefaultOnEmpty={false}
              className="!w-full md:!w-[184px]"
              height="h-[50px]"
              textClassName="font-archivo text-[16px] font-semibold"
            />
          </div>

          {/* Cognitive Level Dropdown */}
          <div className="w-full md:w-[206px] md:flex-shrink-0 md:max-w-[206px]">
            <Dropdown
              value={cognitiveLevel || ""}
              options={[
                { value: "recall", label: "Recall" },
                { value: "analysis", label: "Analysis" },
              ]}
              onChange={(value) => setCognitiveLevel(value)}
              placeholder={t('admin.reportsAndAnalytics.filters.cognitiveLevel')}
              showDefaultOnEmpty={false}
              className="!w-full md:!w-[206px]"
              height="h-[50px]"
              textClassName="font-archivo text-[16px] font-semibold"
            />
          </div>

          {/* Date Range Dropdown */}
          <div className="w-full md:w-[206px] md:flex-shrink-0 md:max-w-[206px]">
            <Dropdown
              value={dateRange || ""}
              options={[
                { value: "week", label: t('admin.reportsAndAnalytics.filters.lastWeek') },
                { value: "month", label: t('admin.reportsAndAnalytics.filters.lastMonth') },
                { value: "year", label: t('admin.reportsAndAnalytics.filters.lastYear') },
              ]}
              onChange={(value) => setDateRange(value)}
              placeholder={t('admin.reportsAndAnalytics.filters.dateRange')}
              showDefaultOnEmpty={false}
              className="!w-full md:!w-[206px]"
              height="h-[50px]"
              textClassName="font-archivo text-[16px] font-semibold"
            />
          </div>

          {/* View Details Button */}
          <div className="flex gap-5 md:ml-auto md:flex-shrink-0">
            <button
              type="button"
              className="flex items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-4 font-roboto text-[16px] font-medium leading-[20px] text-oxford-blue transition hover:bg-[#F9FAFB] whitespace-nowrap w-[130px] h-9"
            >
              {t('admin.reportsAndAnalytics.filters.viewDetails')}
            </button>

            {/* Apply Filter Button */}
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-[8px] bg-[#ED4122] px-4 font-roboto text-[16px] font-medium leading-[20px] text-white transition hover:bg-[#d43a1f] whitespace-nowrap w-[157px] h-9"
            >
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.6 16C8.4728 16 8.34644 15.9582 8.24004 15.8769L5.04004 13.4154C4.88964 13.2989 4.8 13.1167 4.8 12.9231V9.64103C4.8 9.47692 4.73762 9.32184 4.62402 9.20533L0.527246 5.00348C0.187246 4.65394 0 4.19117 0 3.69804V1.84615C0 0.827897 0.808 0 1.8 0H12.2C13.192 0 14 0.827897 14 1.84615V3.69804C14 4.19117 13.8128 4.65476 13.4728 5.00348L9.37598 9.20533C9.26238 9.32184 9.2 9.4761 9.2 9.64103V15.3846C9.2 15.6176 9.07197 15.831 8.86797 15.9352C8.78317 15.9787 8.6912 16 8.6 16ZM6 12.6154L8 14.1538V9.64103C8 9.1479 8.18725 8.68431 8.52725 8.33559L12.624 4.13374C12.7376 4.01723 12.8 3.86297 12.8 3.69804V1.84615C12.8 1.50646 12.5304 1.23077 12.2 1.23077H1.8C1.4696 1.23077 1.2 1.50646 1.2 1.84615V3.69804C1.2 3.86214 1.26238 4.01723 1.37598 4.13374L5.47275 8.33559C5.81275 8.68513 6 9.1479 6 9.64103V12.6154Z"
                  fill="white"
                />
              </svg>
              {t('admin.reportsAndAnalytics.filters.applyFilter')}
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
            <h2 className="font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue pt-4">{t('admin.reportsAndAnalytics.charts.kpiSummary')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {kpiCards.map((card) => (
                <KPICard
                  key={card.id}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  valueWeight={card.valueWeight}
                  marginBottom={card.marginBottom}
                />
              ))}
            </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trend Chart */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="pt-3 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.reportsAndAnalytics.charts.performanceTrend')}
            </h2>
            <div className="h-[300px] relative">
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
                {performanceData.map((data, index) => (
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
                  points={performanceData
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
                {performanceData.map((data, index) => (
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

          {/* Practice Distribution Chart */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="pt-3 font-archivo text-[20px] font-semibold leading-[28px] text-oxford-blue">
              {t('admin.reportsAndAnalytics.charts.practiceDistribution')}
            </h2>
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200">
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
                {practiceDistribution.map((item, index) => (
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

        {/* Top Performance User Table */}
          <h2 className="font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue pt-6">
            {t('admin.reportsAndAnalytics.table.topPerformanceUser')}
          </h2>
        <div className="rounded-[12px] border border-[#03274633] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-oxford-blue">
                  <th className="text-left py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t('admin.reportsAndAnalytics.table.columns.number')}
                  </th>
                  <th className="text-left py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t('admin.reportsAndAnalytics.table.columns.user')}
                  </th>
                  <th className="text-left py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t('admin.reportsAndAnalytics.table.columns.email')}
                  </th>
                  <th className="text-center py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t('admin.reportsAndAnalytics.table.columns.attempts')}
                  </th>
                  <th className="text-center py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t('admin.reportsAndAnalytics.table.columns.accuracy')}
                  </th>
                  <th className="text-center py-3 px-3 md:px-4 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t('admin.reportsAndAnalytics.table.columns.averageTime')}
                  </th>
                  <th className="text-left py-3 px-3 md:px-6 font-roboto text-[14px] md:text-[16px] font-semibold leading-[20px] text-white whitespace-nowrap">
                    {t('admin.reportsAndAnalytics.table.columns.lastActive')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition"
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
                      {user.accuracy}%
                    </td>
                    <td className="py-4 px-3 md:px-4 text-center font-roboto text-[12px] md:text-[14px] font-normal leading-[20px] text-oxford-blue whitespace-nowrap">
                      {user.avgTime}s
                    </td>
                    <td className="py-4 px-3 md:px-4 font-roboto text-[12px] md:text-[14px] font-normal leading-[20px] text-oxford-blue whitespace-nowrap">
                      {user.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Row - Recent Reports and System Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Recent Reports Generated */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] w-full">
            <h2 className="mb-4 md:mb-6 font-archivo text-[18px] md:text-[20px] font-semibold leading-[24px] md:leading-[28px] text-oxford-blue">
              {t('admin.reportsAndAnalytics.sections.recentReports')}
            </h2>
            <div className="space-y-3 md:space-y-4">
              {recentReports.map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-[8px] border border-[#6CA6C1] bg-[#F9FAFB] w-full min-h-[70px] md:h-[86px] p-3 md:p-4"
                >
                  <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
                    <h3 className="font-roboto text-[13px] md:text-[16px] font-medium leading-[18px] md:leading-[20px] text-oxford-blue break-words">
                      {report.name}
                    </h3>
                    <p className="font-roboto text-[11px] md:text-[12px] font-normal leading-[16px] md:leading-[20px] text-dark-gray mt-1">
                      {t('admin.reportsAndAnalytics.sections.generated').replace('{{date}}', report.date)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="p-2 rounded-[8px] hover:bg-[#E5E7EB] transition flex-shrink-0"
                    aria-label="Download report"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.21997 11.28C5.92697 10.987 5.92697 10.512 6.21997 10.219C6.51297 9.92599 6.98801 9.92599 7.28101 10.219L9.00098 11.939V0.75C9.00098 0.336 9.33698 0 9.75098 0C10.165 0 10.501 0.336 10.501 0.75V11.939L12.2209 10.219C12.5139 9.92599 12.989 9.92599 13.282 10.219C13.575 10.512 13.575 10.987 13.282 11.28L10.282 14.28C10.213 14.349 10.1301 14.404 10.0381 14.442C9.94609 14.48 9.84898 14.5 9.75098 14.5C9.65298 14.5 9.55611 14.48 9.46411 14.442C9.37211 14.404 9.28897 14.349 9.21997 14.28L6.21997 11.28ZM15.75 7C15.336 7 15 7.336 15 7.75C15 8.164 15.336 8.5 15.75 8.5C17.327 8.5 18 9.173 18 10.75V15.75C18 17.327 17.327 18 15.75 18H3.75C2.173 18 1.5 17.327 1.5 15.75V10.75C1.5 9.173 2.173 8.5 3.75 8.5C4.164 8.5 4.5 8.164 4.5 7.75C4.5 7.336 4.164 7 3.75 7C1.332 7 0 8.332 0 10.75V15.75C0 18.168 1.332 19.5 3.75 19.5H15.75C18.168 19.5 19.5 18.168 19.5 15.75V10.75C19.5 8.332 18.168 7 15.75 7Z"
                        fill="#032746"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* System Insights */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] w-full">
            <h2 className="mb-4 md:mb-6 font-archivo text-[18px] md:text-[20px] font-bold leading-[24px] md:leading-[28px] text-oxford-blue">
              {t('admin.reportsAndAnalytics.sections.systemInsights')}
            </h2>
            <div className="space-y-3 md:space-y-4">
              {systemInsights.map((insight, index) => {
                // Parse insight text to highlight specific parts
                let formattedText = insight;
                if (insight.includes("Analysis")) {
                  formattedText = (
                    <>
                      {t('admin.reportsAndAnalytics.insights.mostDifficultCognitiveLevel')}{" "}
                      <span className="font-medium">Analysis</span>
                    </>
                  );
                } else if (insight.includes("8-10 PM")) {
                  formattedText = (
                    <>
                      {t('admin.reportsAndAnalytics.insights.peakActivity')} <span className="font-medium">8-10 PM</span>
                    </>
                  );
                } else if (insight.includes("58%")) {
                  formattedText = (
                    <>
                      {t('admin.reportsAndAnalytics.insights.lowAccuracy')}
                      <span className="font-medium">58%</span>)
                    </>
                  );
                }

                return (
                  <div
                    key={index}
                    className="flex items-center rounded-[8px] border border-[#ED4122] bg-[#FEF2F2] w-full min-h-[70px] md:h-[86px] p-3 md:p-4"
                  >
                    <p className="font-roboto text-[14px] md:text-[16px] font-normal leading-[20px] md:leading-[24px] text-oxford-blue flex items-center break-words">
                      {formattedText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAndAnalyticsPage;

