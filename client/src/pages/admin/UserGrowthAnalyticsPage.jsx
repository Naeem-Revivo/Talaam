import React, { useState } from "react";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import { useLanguage } from "../../context/LanguageContext";
import Dropdown from "../../components/shared/Dropdown";

const UserGrowthAnalyticsPage = () => {
  const { t } = useLanguage();
  
  // User Growth Analytics filters
  const [userGrowthDateRange, setUserGrowthDateRange] = useState("Last 30 Days");
  const [userType, setUserType] = useState("");
  const [userRole, setUserRole] = useState("All Roles");
  const [userPlan, setUserPlan] = useState("All Plans");

  // User Growth Analytics Data
  const userGrowthKPICards = [
    {
      id: 1,
      title: t('admin.userGrowthAnalytics.kpi.newSignups'),
      value: "10,884",
      subtext: "+15% from last month",
      subtextClassName: "text-[#10B981]",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M29.25 18.528C29.25 18.942 28.914 19.278 28.5 19.278H26.75V21.028C26.75 21.442 26.414 21.778 26 21.778C25.586 21.778 25.25 21.442 25.25 21.028V19.278H23.5C23.086 19.278 22.75 18.942 22.75 18.528C22.75 18.114 23.086 17.778 23.5 17.778H25.25V16.028C25.25 15.614 25.586 15.278 26 15.278C26.414 15.278 26.75 15.614 26.75 16.028V17.778H28.5C28.914 17.778 29.25 18.114 29.25 18.528ZM17.509 19C19.715 19 21.509 17.206 21.509 15C21.509 12.794 19.715 11 17.509 11C15.303 11 13.509 12.794 13.509 15C13.509 17.206 15.303 19 17.509 19ZM19.5 21H15.5C11.44 21 10 23.973 10 26.519C10 28.796 11.2111 30 13.5031 30H21.4969C23.7889 30 25 28.796 25 26.519C25 23.973 23.56 21 19.5 21Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 2,
      title: t('admin.userGrowthAnalytics.kpi.activeUsers'),
      value: "5,432",
      subtext: "+ 8% vs last month",
      subtextClassName: "text-[#10B981]",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M26.8929 27.5186C26.8929 29.7644 25.6542 31 23.4067 31H15.5933C13.3458 31 12.1071 29.7632 12.1071 27.5186C12.1071 24.9899 13.5309 22.0368 17.545 22.0368H21.454C25.4691 22.0357 26.8929 24.9899 26.8929 27.5186ZM19.5088 19.9612C21.6358 19.9612 23.3652 18.2227 23.3652 16.0863C23.3652 13.9489 21.6347 12.2115 19.5088 12.2115C17.383 12.2115 15.6536 13.95 15.6536 16.0863C15.6536 18.2227 17.3819 19.9612 19.5088 19.9612ZM26.9367 17.1076H25.1734C25.0201 17.1076 24.8886 17.2181 24.8557 17.3618C24.6148 18.4117 24.0671 19.3511 23.3114 20.0695C23.1252 20.2463 23.2348 20.5558 23.4867 20.6221C25.4253 21.0863 26.7724 22.2357 27.5719 23.6946C27.6267 23.8162 27.7362 23.8935 27.8786 23.8935H28.3385C30.058 23.8935 31 22.9431 31 21.219C31 19.329 29.9377 17.1076 26.9367 17.1076ZM25.5348 10.0011C24.4417 10.0011 23.4877 10.6056 22.9872 11.4997C22.9467 11.5726 22.9489 11.6533 22.9642 11.723C22.9806 11.7959 23.0125 11.8347 23.0804 11.8922C24.1526 12.8039 24.8678 14.1246 24.985 15.6178C24.9916 15.7018 25.0201 15.7537 25.0704 15.8079C25.1208 15.862 25.1963 15.8951 25.296 15.9039C25.3738 15.9106 25.4537 15.915 25.5348 15.915C27.1448 15.915 28.4591 14.5888 28.4591 12.9531C28.4591 11.3273 27.1448 10.0011 25.5348 10.0011ZM8 21.219C8 22.9431 8.94196 23.8935 10.6615 23.8935H11.1214C11.2638 23.8935 11.3733 23.8162 11.4281 23.6946C12.2276 22.2357 13.5747 21.0863 15.5133 20.6221C15.7652 20.5558 15.8748 20.2463 15.6886 20.0695C14.9329 19.3511 14.3852 18.4117 14.1443 17.3618C14.1114 17.2181 13.9799 17.1076 13.8266 17.1076H12.0633C9.06234 17.1076 8 19.329 8 21.219ZM10.5409 12.952C10.5409 14.5877 11.8552 15.9139 13.4652 15.9139C13.5463 15.9139 13.6262 15.9095 13.704 15.9028C13.8048 15.894 13.8792 15.8609 13.9296 15.8068C13.9799 15.7526 14.0084 15.7007 14.015 15.6167C14.1322 14.1236 14.8474 12.8027 15.9196 11.8909C15.9864 11.8335 16.0194 11.7948 16.0358 11.7219C16.0511 11.6523 16.0533 11.5727 16.0128 11.4986C15.5112 10.6045 14.5583 10 13.4652 10C11.8552 10.0011 10.5409 11.3274 10.5409 12.952Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 3,
      title: t('admin.userGrowthAnalytics.kpi.retentionRate'),
      value: "85%",
      subtext: "- 2% vs last month",
      subtextClassName: "text-[#ED4122]",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M30 20.0003V23.0003C30 25.2063 28.206 27.0003 26 27.0003H13.4141L14.707 28.2932C15.098 28.6842 15.098 29.3163 14.707 29.7073C14.512 29.9023 14.256 30.0003 14 30.0003C13.744 30.0003 13.488 29.9023 13.293 29.7073L10.2939 26.7083C10.2009 26.6153 10.1279 26.5054 10.0769 26.3824C9.9759 26.1384 9.9759 25.8622 10.0769 25.6182C10.1279 25.4952 10.2009 25.3853 10.2939 25.2923L13.293 22.2933C13.684 21.9023 14.316 21.9023 14.707 22.2933C15.098 22.6842 15.098 23.3163 14.707 23.7073L13.4141 25.0003H26C27.103 25.0003 28 24.1033 28 23.0003V20.0003C28 19.4483 28.447 19.0003 29 19.0003C29.553 19.0003 30 19.4483 30 20.0003ZM11 21.0003C11.553 21.0003 12 20.5523 12 20.0003V17.0003C12 15.8973 12.897 15.0003 14 15.0003H26.5859L25.293 16.2933C24.902 16.6842 24.902 17.3163 25.293 17.7073C25.488 17.9023 25.744 18.0003 26 18.0003C26.256 18.0003 26.512 17.9023 26.707 17.7073L29.7061 14.7083C29.7991 14.6153 29.8721 14.5054 29.9231 14.3824C30.0241 14.1384 30.0241 13.8622 29.9231 13.6182C29.8721 13.4952 29.7991 13.3853 29.7061 13.2923L26.707 10.2932C26.316 9.90225 25.684 9.90225 25.293 10.2932C24.902 10.6842 24.902 11.3163 25.293 11.7073L26.5859 13.0003H14C11.794 13.0003 10 14.7943 10 17.0003V20.0003C10 20.5523 10.447 21.0003 11 21.0003Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 4,
      title: t('admin.userGrowthAnalytics.kpi.verificationRate'),
      value: "72%",
      subtext: "+5% vs month",
      subtextClassName: "text-[#10B981]",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M20.0181 10C17.7781 11.111 16 12 11 13C11 14.137 11 17.7019 11 18.8889C11 25.5559 16.667 28.889 20 30C23.333 28.889 29 25.5559 29 18.8889C29 17.6639 29 14.194 29 13C24 12 22.2221 11.111 20.0181 10ZM23.542 18.53L19.542 22.53C19.396 22.676 19.204 22.75 19.012 22.75C18.82 22.75 18.6279 22.677 18.4819 22.53L16.4819 20.53C16.1889 20.237 16.1889 19.762 16.4819 19.469C16.7749 19.176 17.25 19.176 17.543 19.469L19.0129 20.939L22.4829 17.469C22.7759 17.176 23.2509 17.176 23.5439 17.469C23.8369 17.762 23.835 18.237 23.542 18.53Z" fill="white"/>
        </svg>
      ),
    },
  ];

  // Overall User Growth Chart Data (Week 1-4)
  const userGrowthData = [
    { week: "Week 1", users: 120 },
    { week: "Week 2", users: 200 },
    { week: "Week 3", users: 90 },
    { week: "Week 4", users: 180 },
  ];

  // Sign-ups by Role Chart Data
  const signupsByRole = [
    { role: "Student", value: 450, color: "#ED4122" },
    { role: "Teacher", value: 280, color: "#032746" },
    { role: "Admin", value: 320, color: "#60A5FA" },
    { role: "Parent", value: 150, color: "#FBBF24" },
  ];

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
              {t('admin.userGrowthAnalytics.hero.title')}
            </h1>
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
              {t('admin.userGrowthAnalytics.actions.comparePeriod')}
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
              {t('admin.userGrowthAnalytics.actions.exportReport')}
            </button>
          </div>
        </div>

        {/* User Growth Filters */}
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          {/* Date Range Filter */}
          <div className="w-[184px]">
            <Dropdown
              value={userGrowthDateRange}
              options={[
                { value: "Last 30 Days", label: t('admin.userGrowthAnalytics.filters.last30Days') },
                { value: "Last 7 Days", label: t('admin.userGrowthAnalytics.filters.last7Days') },
                { value: "Last 90 Days", label: t('admin.userGrowthAnalytics.filters.last90Days') },
                { value: "Last Year", label: t('admin.userGrowthAnalytics.filters.lastYear') },
              ]}
              onChange={(value) => setUserGrowthDateRange(value)}
              placeholder={t('admin.userGrowthAnalytics.filters.dateRange')}
              showDefaultOnEmpty={false}
              className="w-full"
              height="h-[50px]"
              textClassName="font-archivo text-[16px] font-semibold"
            />
          </div>

          {/* User Type Filter */}
          <div className="relative xl:ml-[320px] w-[184px]">
            <Dropdown
              value={userType || ""}
              options={[
                { value: "Student", label: t('admin.userGrowthAnalytics.filters.student') },
                { value: "Teacher", label: t('admin.userGrowthAnalytics.filters.teacher') },
                { value: "Admin", label: t('admin.userGrowthAnalytics.filters.admin') },
                { value: "Parent", label: t('admin.userGrowthAnalytics.filters.parent') },
              ]}
              onChange={(value) => setUserType(value)}
              placeholder={t('admin.userGrowthAnalytics.filters.userType')}
              showDefaultOnEmpty={false}
              className="w-full"
              height="h-[50px]"
              textClassName="font-archivo text-[16px] font-semibold"
            />
          </div>

          {/* All Roles Filter */}
          <div className="w-[184px]">
            <Dropdown
              value={userRole}
              options={[
                { value: "All Roles", label: t('admin.userGrowthAnalytics.filters.allRoles') },
                { value: "Student", label: t('admin.userGrowthAnalytics.filters.student') },
                { value: "Teacher", label: t('admin.userGrowthAnalytics.filters.teacher') },
                { value: "Admin", label: t('admin.userGrowthAnalytics.filters.admin') },
                { value: "Parent", label: t('admin.userGrowthAnalytics.filters.parent') },
              ]}
              onChange={(value) => setUserRole(value)}
              placeholder={t('admin.userGrowthAnalytics.filters.allRoles')}
              showDefaultOnEmpty={true}
              className="w-full"
              height="h-[50px]"
              textClassName="font-archivo text-[16px] font-semibold"
            />
          </div>

          {/* All Plans Filter */}
          <div className="w-[184px]">
            <Dropdown
              value={userPlan}
              options={[
                { value: "All Plans", label: t('admin.userGrowthAnalytics.filters.allPlans') },
                { value: "Free", label: t('admin.userGrowthAnalytics.filters.free') },
                { value: "Premium", label: t('admin.userGrowthAnalytics.filters.premium') },
                { value: "Organization", label: t('admin.userGrowthAnalytics.filters.organization') },
              ]}
              onChange={(value) => setUserPlan(value)}
              placeholder={t('admin.userGrowthAnalytics.filters.allPlans')}
              showDefaultOnEmpty={true}
              className="w-full"
              height="h-[50px]"
              textClassName="font-archivo text-[16px] font-semibold"
            />
          </div>
        </div>

        {/* User Growth KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {userGrowthKPICards.map((card) => (
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

        {/* User Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall User Growth Chart */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="pt-3 font-archivo text-[20px] font-bold leading-[28px] text-oxford-blue">
              {t('admin.userGrowthAnalytics.charts.overallUserGrowth')}
            </h2>
            <p className="mt-1 font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
              {t('admin.userGrowthAnalytics.charts.newUsersOverLast30Days')}
            </p>
            <div className="h-[300px] relative mt-6">
              <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
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
                      x="45"
                      y={280 - (val / 300) * 240 + 5}
                      textAnchor="end"
                      className="font-roboto text-[12px] fill-[#6B7280]"
                    >
                      {val}
                    </text>
                  </g>
                ))}
                {/* X-axis labels */}
                {userGrowthData.map((data, index) => (
                  <text
                    key={data.week}
                    x={100 + (index * 450) / 3}
                    y="295"
                    textAnchor="middle"
                    className="font-roboto text-[12px] fill-[#6B7280]"
                  >
                    {data.week}
                  </text>
                ))}
                {/* Area chart */}
                <path
                  d={`M${100 + (0 * 450) / 3},${280 - (userGrowthData[0].users / 300) * 240} ${userGrowthData
                    .map(
                      (data, index) =>
                        `L${100 + (index * 450) / 3},${280 - (data.users / 300) * 240}`
                    )
                    .join(" ")} L${100 + ((userGrowthData.length - 1) * 450) / 3},280 L100,280 Z`}
                  fill="url(#userGrowthGradient)"
                />
                {/* Line chart */}
                <polyline
                  points={userGrowthData
                    .map(
                      (data, index) =>
                        `${100 + (index * 450) / 3},${280 - (data.users / 300) * 240}`
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
                    key={data.week}
                    cx={100 + (index * 450) / 3}
                    cy={280 - (data.users / 300) * 240}
                    r="4"
                    fill="#ED4122"
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Sign-ups by Role Chart */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="pt-3 font-archivo text-[20px] font-semibold leading-[28px] text-oxford-blue">
              {t('admin.userGrowthAnalytics.charts.signupsByRole')}
            </h2>
            <p className="mt-1 font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
              {t('admin.userGrowthAnalytics.charts.categorizationOfNewUsers')}
            </p>
            <div className="h-[300px] relative mt-6">
              <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
                {/* Y-axis labels */}
                {[0, 100, 200, 300, 400, 500].map((val) => (
                  <g key={val}>
                    <line
                      x1="50"
                      y1={280 - (val / 500) * 240}
                      x2="550"
                      y2={280 - (val / 500) * 240}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="45"
                      y={280 - (val / 500) * 240 + 5}
                      textAnchor="end"
                      className="font-roboto text-[12px] fill-[#6B7280]"
                    >
                      {val}
                    </text>
                  </g>
                ))}
                {/* Bars */}
                {signupsByRole.map((item, index) => {
                  const barWidth = 80;
                  const barSpacing = 50;
                  const x = 100 + index * (barWidth + barSpacing);
                  const barHeight = (item.value / 500) * 240;
                  const y = 280 - barHeight;
                  return (
                    <g key={item.role}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={item.color}
                        rx="4"
                      />
                      <text
                        x={x + barWidth / 2}
                        y="295"
                        textAnchor="middle"
                        className="font-roboto text-[12px] fill-[#6B7280]"
                      >
                        {item.role}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {signupsByRole.map((item) => (
                <div key={item.role} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue">
                    {item.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthAnalyticsPage;

