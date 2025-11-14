import React, { useState } from "react";
import AdminMetricCard from "../../components/admin/AdminMetricCard";

const SubscriptionTrendsPage = () => {
  // Subscription Trends filters
  const [planType, setPlanType] = useState("");
  const [dateRange, setDateRange] = useState("");

  // Subscription Trends KPI Cards
  const subscriptionKPICards = [
    {
      id: 1,
      title: "Total Subscribers",
      value: "1,234",
      subtext: "",
      subtextClassName: "text-[#6B7280]",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M27.8929 27.5186C27.8929 29.7644 26.6542 31 24.4067 31H16.5933C14.3458 31 13.1071 29.7632 13.1071 27.5186C13.1071 24.9899 14.5309 22.0368 18.545 22.0368H22.454C26.4691 22.0357 27.8929 24.9899 27.8929 27.5186ZM20.5088 19.9612C22.6358 19.9612 24.3652 18.2227 24.3652 16.0863C24.3652 13.9489 22.6347 12.2115 20.5088 12.2115C18.383 12.2115 16.6536 13.95 16.6536 16.0863C16.6536 18.2227 18.3819 19.9612 20.5088 19.9612ZM27.9367 17.1076H26.1734C26.0201 17.1076 25.8886 17.2181 25.8557 17.3618C25.6148 18.4117 25.0671 19.3511 24.3114 20.0695C24.1252 20.2463 24.2348 20.5558 24.4867 20.6221C26.4253 21.0863 27.7724 22.2357 28.5719 23.6946C28.6267 23.8162 28.7362 23.8935 28.8786 23.8935H29.3385C31.058 23.8935 32 22.9431 32 21.219C32 19.329 30.9377 17.1076 27.9367 17.1076ZM26.5348 10.0011C25.4417 10.0011 24.4877 10.6056 23.9872 11.4997C23.9467 11.5726 23.9489 11.6533 23.9642 11.723C23.9806 11.7959 24.0125 11.8347 24.0804 11.8922C25.1526 12.8039 25.8678 14.1246 25.985 15.6178C25.9916 15.7018 26.0201 15.7537 26.0704 15.8079C26.1208 15.862 26.1963 15.8951 26.296 15.9039C26.3738 15.9106 26.4537 15.915 26.5348 15.915C28.1448 15.915 29.4591 14.5888 29.4591 12.9531C29.4591 11.3273 28.1448 10.0011 26.5348 10.0011ZM9 21.219C9 22.9431 9.94196 23.8935 11.6615 23.8935H12.1214C12.2638 23.8935 12.3733 23.8162 12.4281 23.6946C13.2276 22.2357 14.5747 21.0863 16.5133 20.6221C16.7652 20.5558 16.8748 20.2463 16.6886 20.0695C15.9329 19.3511 15.3852 18.4117 15.1443 17.3618C15.1114 17.2181 14.9799 17.1076 14.8266 17.1076H13.0633C10.0623 17.1076 9 19.329 9 21.219ZM11.5409 12.952C11.5409 14.5877 12.8552 15.9139 14.4652 15.9139C14.5463 15.9139 14.6262 15.9095 14.704 15.9028C14.8048 15.894 14.8792 15.8609 14.9296 15.8068C14.9799 15.7526 15.0084 15.7007 15.015 15.6167C15.1322 14.1236 15.8474 12.8027 16.9196 11.8909C16.9864 11.8335 17.0194 11.7948 17.0358 11.7219C17.0511 11.6523 17.0533 11.5727 17.0128 11.4986C16.5112 10.6045 15.5583 10 14.4652 10C12.8552 10.0011 11.5409 11.3274 11.5409 12.952Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 2,
      title: "Total Revenue",
      value: "$50,432",
      subtext: "",
      subtextClassName: "text-[#6B7280]",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M25.002 23.2185C25.002 21.5699 23.643 20.1353 21.693 19.7279L18.797 19.1369C18.276 19.0283 17.828 18.7879 17.496 18.4364C17.177 18.1047 17.001 17.6809 17.001 17.243C17.001 16.1672 18.064 15.2923 19.371 15.2923H20.631C21.839 15.2923 22.852 16.0397 22.987 17.0307C23.049 17.4826 23.545 17.8093 24.092 17.7566C24.641 17.7056 25.036 17.2982 24.974 16.8471C24.738 15.1146 23.037 13.8017 20.96 13.6725V12.8231C20.96 12.3704 20.51 12 19.96 12C19.41 12 18.96 12.3704 18.96 12.8231V13.6807C16.745 13.8536 15 15.3754 15 17.2438C15 18.0496 15.329 18.8364 15.92 19.4521C16.513 20.0818 17.36 20.5362 18.309 20.7345L21.205 21.3254C22.262 21.546 23 22.3247 23 23.2193C23 23.7371 22.752 24.2259 22.302 24.5963C21.853 24.9667 21.259 25.17 20.63 25.17H19.37C18.162 25.17 17.149 24.4227 17.014 23.4317C16.952 22.9799 16.453 22.6547 15.909 22.7057C15.36 22.7568 14.965 23.1643 15.027 23.6153C15.26 25.3257 16.921 26.6253 18.961 26.7841V27.6385C18.961 28.0912 19.411 28.4615 19.961 28.4615C20.511 28.4615 20.961 28.0912 20.961 27.6385V26.7891C22 26.724 22.971 26.3751 23.718 25.7602C24.546 25.0787 25.002 24.1766 25.002 23.2185Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 3,
      title: "Renewal Rate",
      value: "95%",
      subtext: "",
      subtextClassName: "text-[#6B7280]",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M12 19.5003C12 20.2153 12.1649 20.9044 12.4919 21.5484C12.7409 22.0414 12.544 22.6424 12.052 22.8924C11.906 22.9654 11.752 23.0003 11.601 23.0003C11.236 23.0003 10.884 22.8002 10.708 22.4522C10.245 21.5382 10 20.5173 10 19.5003C10 15.6733 12.673 13.0003 16.5 13.0003H22.5861L22.293 12.7073C21.902 12.3163 21.902 11.6842 22.293 11.2932C22.684 10.9022 23.316 10.9022 23.707 11.2932L25.7061 13.2923C25.7991 13.3853 25.872 13.4952 25.923 13.6182C26.024 13.8622 26.024 14.1384 25.923 14.3824C25.872 14.5054 25.7991 14.6153 25.7061 14.7083L23.707 16.7073C23.512 16.9023 23.256 17.0003 23 17.0003C22.744 17.0003 22.488 16.9023 22.293 16.7073C21.902 16.3163 21.902 15.6842 22.293 15.2933L22.5861 15.0003H16.5C13.767 15.0003 12 16.7673 12 19.5003ZM29.292 16.5484C29.043 16.0554 28.444 15.8572 27.948 16.1082C27.456 16.3582 27.2591 16.9592 27.5081 17.4522C27.8351 18.0972 28 18.7853 28 19.5003C28 22.2333 26.233 24.0003 23.5 24.0003H17.4139L17.707 23.7073C18.098 23.3163 18.098 22.6842 17.707 22.2933C17.316 21.9023 16.684 21.9023 16.293 22.2933L14.293 24.2933C13.902 24.6842 13.902 25.3163 14.293 25.7073L16.293 27.7073C16.488 27.9023 16.744 28.0003 17 28.0003C17.256 28.0003 17.512 27.9023 17.707 27.7073C18.098 27.3163 18.098 26.6842 17.707 26.2933L17.4139 26.0003H23.5C27.327 26.0003 30 23.3273 30 19.5003C30 18.4833 29.755 17.4624 29.292 16.5484Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 4,
      title: "Churn Rate",
      value: "5%",
      subtext: "",
      subtextClassName: "text-[#6B7280]",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M10.0002 25.0003C10.0002 25.1303 10.0272 25.2604 10.0772 25.3824C10.1782 25.6264 10.3732 25.8214 10.6182 25.9234C10.7402 25.9744 10.8702 26.0003 11.0002 26.0003H15.1542C15.7062 26.0003 16.1542 25.5523 16.1542 25.0003C16.1542 24.4483 15.7062 24.0003 15.1542 24.0003H13.4142L19.0002 18.4143L21.5862 21.0003C22.3652 21.7803 23.6352 21.7803 24.4142 21.0003L29.7072 15.7073C30.0982 15.3163 30.0982 14.6842 29.7072 14.2932C29.3162 13.9022 28.6842 13.9022 28.2932 14.2932L23.0002 19.5862L20.4142 17.0003C19.6352 16.2203 18.3652 16.2203 17.5862 17.0003L12.0002 22.5862V20.8462C12.0002 20.2942 11.5522 19.8462 11.0002 19.8462C10.4482 19.8462 10.0002 20.2942 10.0002 20.8462V25.0003Z" fill="white"/>
        </svg>
      ),
    },
  ];

  // Revenue Trend Chart Data - matching the pattern: low start, peak, trough, then rise
  const revenueData = [
    { month: "Jan", revenue: 15000 },
    { month: "Feb", revenue: 28000 },
    { month: "Mar", revenue: 32000 },
    { month: "Apr", revenue: 18000 },
    { month: "May", revenue: 12000 },
    { month: "Jun", revenue: 22000 },
    { month: "Jul", revenue: 26000 },
  ];

  // Plan Distribution Data
  const planDistribution = [
    { plan: "Basic", percentage: 60, color: "#ED4122" },
    { plan: "Premium", percentage: 30, color: "#6CA6C1" },
    { plan: "Enterprise", percentage: 10, color: "#FDF0D5" },
  ];

  // Plan-Wise Breakdown Data
  const planBreakdown = [
    {
      planType: "Basic Plan",
      subscribers: 500,
      active: 450,
      expired: 50,
      revenue: "$3,000",
      avgDuration: "3 month",
    },
    {
      planType: "Premium Plan",
      subscribers: 300,
      active: 280,
      expired: 20,
      revenue: "$25,000",
      avgDuration: "6 month",
    },
    {
      planType: "Enterprise",
      subscribers: 200,
      active: 190,
      expired: 10,
      revenue: "$2,000",
      avgDuration: "12 month",
    },
    {
      planType: "Trial",
      subscribers: 190,
      active: 190,
      expired: 0,
      revenue: "$0",
      avgDuration: "1 month",
    },
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
  const donutPaths = planDistribution.map((item) => {
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
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-[#032746]">
              Subscription Trend
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          {/* Plan Type Filter */}
          <div className="relative">
            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="appearance-none rounded-[8px] border border-[#03274633] bg-white px-4 pr-10 font-archivo text-[16px] font-semibold leading-[16px] text-[#032746] outline-none cursor-pointer hover:border-[#03274666] transition"
              style={{
                width: "184px",
                height: "50px",
              }}
            >
              <option value="" disabled>Plan Type</option>
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Trial">Trial</option>
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

          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none rounded-[8px] border border-[#03274633] bg-white px-4 pr-10 font-archivo text-[16px] font-semibold leading-[16px] text-[#032746] outline-none cursor-pointer hover:border-[#03274666] transition"
              style={{
                width: "184px",
                height: "50px",
              }}
            >
              <option value="" disabled>Date range</option>
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
        </div>

        {/* Subscription KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {subscriptionKPICards.map((card) => (
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
        <div className="flex justify-between gap-6 ">
          {/* Revenue Trend Chart */}
          <div className="rounded-[12px] w-[639px] h-[462px] border border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="pt-3 font-archivo text-[20px] font-bold leading-[28px] text-[#032746]">
              Revenue Trend
            </h2>
            <div className="h-[322px] relative mt-6">
              <svg width="100%" height="100%" viewBox="0 0 599 322" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ED4122" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ED4122" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid lines - horizontal */}
                {[0, 5, 10, 15, 20, 25, 30, 35].map((val) => (
                  <g key={val}>
                    <line
                      x1="50"
                      y1={302 - (val / 35) * 260}
                      x2="549"
                      y2={302 - (val / 35) * 260}
                      stroke="#E5E7EB"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      opacity="0.5"
                    />
                  </g>
                ))}
                {/* Grid lines - vertical */}
                {revenueData.map((data, index) => {
                  const x = 50 + (index * 499) / (revenueData.length - 1);
                  return (
                    <line
                      key={`v-${index}`}
                      x1={x}
                      y1="42"
                      x2={x}
                      y2="302"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      opacity="0.5"
                    />
                  );
                })}
                {/* Calculate smooth curve path */}
                {(() => {
                  const points = revenueData.map((data, index) => {
                    const x = 50 + (index * 499) / (revenueData.length - 1);
                    const y = 302 - (data.revenue / 35000) * 260;
                    return { x, y };
                  });

                  // Create smooth curve using cubic bezier
                  let path = `M ${points[0].x} ${points[0].y}`;
                  for (let i = 0; i < points.length - 1; i++) {
                    const p0 = points[i];
                    const p1 = points[i + 1];
                    const cp1x = p0.x + (p1.x - p0.x) / 3;
                    const cp1y = p0.y;
                    const cp2x = p1.x - (p1.x - p0.x) / 3;
                    const cp2y = p1.y;
                    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
                  }

                  // Area path
                  const areaPath = `${path} L ${points[points.length - 1].x} 302 L ${points[0].x} 302 Z`;

                  return (
                    <>
                      {/* Area chart */}
                      <path
                        d={areaPath}
                        fill="url(#revenueGradient)"
                      />
                      {/* Smooth line chart */}
                      <path
                        d={path}
                        fill="none"
                        stroke="#ED4122"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Plan Distribution Chart */}
          <div className="rounded-[12px] border w-[455px] h-[462px] border-[#03274633] bg-white p-4 md:p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
            <h2 className="pt-3 font-archivo text-[20px] font-bold leading-[28px] text-[#032746]">
              Plan Distribution
            </h2>
            <div className="flex flex-col items-center justify-center gap-6 mt-6">
              <div className="relative">
                <svg width="270" height="270" viewBox="0 0 200 200">
                  {donutPaths.map((item, index) => (
                    <path
                      key={index}
                      d={item.path}
                      fill={item.color}
                    />
                  ))}
                </svg>
              </div>
              <div className="flex justify-around gap-3 ">
                {planDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-roboto text-[14px] font-normal leading-[20px] text-[#032746]">
                        {item.plan}
                      </span>
                    </div>
                    <span className="font-roboto pl-1.5 text-[14px] font-medium leading-[20px] text-[#032746]">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Plan-Wise Breakdown Table */}
        <h2 className="pt-6 font-archivo text-[20px] font-bold leading-[28px] text-[#032746]">
          Plan-Wise Breakdown
        </h2>
        <section className="w-full flex flex-col overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_6px_54px_rgba(0,0,0,0.05)]">
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full border-collapse">
              <thead className="hidden md:table-header-group">
                <tr className="bg-[#032746] text-center">
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    PLAN TYPE
                  </th>
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    SUBSCRIBERS
                  </th>
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    ACTIVE
                  </th>
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    EXPIRED
                  </th>
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    REVENUE
                  </th>
                  <th className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white">
                    AVG DURATION
                  </th>
                </tr>
              </thead>
              <tbody>
                {planBreakdown.length ? (
                  planBreakdown.map((plan, index) => (
                    <tr
                      key={index}
                      className="hidden border-b border-[#E5E7EB] bg-white text-[#032746] last:border-none md:table-row"
                    >
                      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {plan.planType}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {plan.subscribers}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {plan.active}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {plan.expired}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {plan.revenue}
                      </td>
                      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {plan.avgDuration}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-[#6B7280]"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 text-[#032746] md:flex-row md:items-center md:justify-between md:bg-[#032746] md:px-6 md:text-white">
            <p className="text-[12px] font-roboto font-medium leading-[18px] tracking-[3%]">
              Showing 1 to 3 of 25 results
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors border-[#032746] bg-white text-[#032746] hover:bg-[#F3F4F6] md:border-white"
              >
                Previous
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors border-[#ED4122] bg-[#ED4122] text-white"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors border-[#E5E7EB] bg-white text-[#032746] hover:bg-[#F3F4F6] md:border-[#032746]"
              >
                2
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors border-[#E5E7EB] bg-white text-[#032746] hover:bg-[#F3F4F6] md:border-[#032746]"
              >
                3
              </button>
              <button
                type="button"
                className="flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors border-[#032746] bg-white text-[#032746] hover:bg-[#F3F4F6] md:border-white"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SubscriptionTrendsPage;

