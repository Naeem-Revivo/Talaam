import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import {
  headcard1,
  headcard2,
  headcard3,
  headcard4,
} from "../../assets/svg/dashboard/admin";

const UserGrowthAnalyticsPage = () => {
  const navigate = useNavigate();
  
  // User Growth Analytics filters
  const [userGrowthDateRange, setUserGrowthDateRange] = useState("Last 30 Days");
  const [userType, setUserType] = useState("All Roles");
  const [userRole, setUserRole] = useState("All Roles");
  const [userPlan, setUserPlan] = useState("All Plans");

  // User Growth Analytics Data
  const userGrowthKPICards = [
    {
      id: 1,
      title: "New Sign-ups",
      value: "10,884",
      subtext: "+15% from last month",
      subtextClassName: "text-[#10B981]",
      icon: headcard1,
    },
    {
      id: 2,
      title: "Active Users",
      value: "5,432",
      subtext: "+ 8% vs last month",
      subtextClassName: "text-[#10B981]",
      icon: headcard2,
    },
    {
      id: 3,
      title: "Retention Rate",
      value: "85%",
      subtext: "- 2% vs last month",
      subtextClassName: "text-[#ED4122]",
      icon: headcard3,
    },
    {
      id: 4,
      title: "Verification Rate",
      value: "72%",
      subtext: "+5% vs month",
      subtextClassName: "text-[#10B981]",
      icon: headcard4,
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
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-[#032746]">
              User Growth Analytics
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
              Compare period
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
              Export Report
            </button>
          </div>
        </div>

        {/* User Growth Filters */}
        <div className="flex flex-wrap items-center gap-3 md:gap-3">
          <div className="relative">
            <select
              value={userGrowthDateRange}
              onChange={(e) => setUserGrowthDateRange(e.target.value)}
              className="appearance-none rounded-[8px] border border-[#03274633] bg-white px-4 pr-10 font-roboto text-[16px] font-normal leading-[20px] text-[#032746] outline-none"
              style={{
                width: "184px",
                height: "50px",
              }}
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="Last Year">Last Year</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#032746]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="relative">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="appearance-none rounded-[8px] border border-[#03274633] bg-white px-4 pr-10 font-roboto text-[16px] font-normal leading-[20px] text-[#032746] outline-none"
              style={{
                width: "184px",
                height: "50px",
              }}
            >
              <option value="All Roles">User Type</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
              <option value="Parent">Parent</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#032746]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="relative">
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="appearance-none rounded-[8px] border border-[#03274633] bg-white px-4 pr-10 font-roboto text-[16px] font-normal leading-[20px] text-[#032746] outline-none"
              style={{
                width: "184px",
                height: "50px",
              }}
            >
              <option value="All Roles">All Roles</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
              <option value="Parent">Parent</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#032746]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          <div className="relative">
            <select
              value={userPlan}
              onChange={(e) => setUserPlan(e.target.value)}
              className="appearance-none rounded-[8px] border border-[#03274633] bg-white px-4 pr-10 font-roboto text-[16px] font-normal leading-[20px] text-[#032746] outline-none"
              style={{
                width: "184px",
                height: "50px",
              }}
            >
              <option value="All Plans">All Plans</option>
              <option value="Free">Free</option>
              <option value="Premium">Premium</option>
              <option value="Organization">Organization</option>
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#032746]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
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
              iconWrapperClassName="bg-[#ED4122] p-2 rounded-[6px]"
              className="w-full sm:w-[calc(50%-12px)] lg:w-[262px]"
            />
          ))}
        </div>

        {/* User Growth Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall User Growth Chart */}
          <div className="rounded-[12px] border border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="pt-3 font-archivo text-[20px] font-bold leading-[28px] text-[#032746]">
              Overall User Growth
            </h2>
            <p className="mt-1 font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280]">
              New users over the last 30 days
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
            <h2 className="pt-3 font-archivo text-[20px] font-bold leading-[28px] text-[#032746]">
              Sign-ups by Role
            </h2>
            <p className="mt-1 font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280]">
              Categorization of new users
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
                  <span className="font-roboto text-[14px] font-normal leading-[20px] text-[#032746]">
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

