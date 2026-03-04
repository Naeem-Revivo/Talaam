import React, { useMemo, useState, useEffect } from "react";
import {
  headcard1,
  headcard2,
  headcard3,
  headcard4,
  alert,
  sclock,
  blacktick,
} from "../../assets/svg/dashboard/admin";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import { useLanguage } from "../../context/LanguageContext";
import adminAPI from "../../api/admin";
import Loader from "../../components/common/Loader";

const growthYAxis = [0, 2.5, 5, 7.5, 10, 12.5, 15];

// Avatar colors for user avatars
const avatarColors = [
  "bg-[#FDE68A]",
  "bg-[#BFDBFE]",
  "bg-[#C4B5FD]",
  "bg-[#FECACA]",
  "bg-[#D1FAE5]",
  "bg-[#FEF3C7]",
];

const AdminDashboardPage = () => {
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'week', 'month', 'year'
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminAPI.getDashboardStatistics();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `SAR ${amount?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'}`;
  };

  // Calculate percentage change (placeholder - you may want to add this to the API)
  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(0)}%` : `${change.toFixed(0)}%`;
  };

  // Prepare stats from API data
  const stats = useMemo(() => {
    if (!dashboardData?.statistics) return [];

    const { totalStudents, verifiedEmailStudents, activeSubscriptions, totalRevenue } = dashboardData.statistics;
    const verificationRate = totalStudents > 0 ? ((verifiedEmailStudents / totalStudents) * 100).toFixed(0) : 0;

    return [
      {
        title: t('admin.dashboard.stats.totalUsers'),
        value: formatNumber(totalStudents),
        delta: t('admin.dashboard.stats.fromLastMonth'),
        deltaColor: "text-[#ED4122]",
        icon: headcard1,
      },
      {
        title: t('admin.dashboard.stats.verifiedUsers'),
        value: formatNumber(verifiedEmailStudents),
        delta: `${verificationRate}% ${t('admin.dashboard.stats.verificationRate')}`,
        deltaColor: "text-dark-gray",
        icon: headcard2,
      },
      {
        title: t('admin.dashboard.stats.activeSubscriptions'),
        value: formatNumber(activeSubscriptions),
        delta: t('admin.dashboard.stats.thisWeek'),
        deltaColor: "text-dark-gray",
        icon: headcard3,
      },
      {
        title: t('admin.dashboard.stats.revenue'),
        value: formatCurrency(totalRevenue),
        delta: t('admin.dashboard.stats.thisMonth'),
        deltaColor: "text-dark-gray",
        icon: headcard4,
      },
    ];
  }, [dashboardData, t]);

  // Prepare subscription segments from API data - filter to show Free and Premium
  const subscriptionSegments = useMemo(() => {
    if (!dashboardData?.subscriptionPlanBreakdown) return [];

    return dashboardData.subscriptionPlanBreakdown
      .filter((segment) => {
        const label = segment.label.toLowerCase();
        return label === 'free' || label === 'premium';
      })
      .map((segment) => ({
        label: t(`admin.dashboard.charts.planLabels.${segment.label.toLowerCase()}`),
        value: segment.value,
        color: segment.color,
        isBase: segment.isBase || false,
      }));
  }, [dashboardData, t]);

  // Prepare latest signups from API data
  const latestSignups = useMemo(() => {
    if (!dashboardData?.latestSignups) return [];

    return dashboardData.latestSignups.map((user, index) => ({
      name: user.name,
      email: user.email,
      time: user.timeAgo,
      avatarColor: avatarColors[index % avatarColors.length],
    }));
  }, [dashboardData]);

  // Prepare subscription notifications from API data
  const notifications = useMemo(() => {
    if (!dashboardData?.subscriptionNotifications || dashboardData.subscriptionNotifications.length === 0) {
      // Return default success notification if no notifications
      return [{
        title: 'All Subscriptions Active',
        description: 'All subscriptions are active and up to date.',
        time: 'System healthy',
        bg: "bg-[#F0FDF4]",
        border: "border-[#10B981]",
        iconBg: "bg-[#10B981]",
        titleColor: "text-[#032746]",
        descriptionColor: "text-[#032746]",
        timeColor: "text-[#032746]",
        icon: blacktick,
        titleClass: "text-[16px] leading-[16px]",
        descriptionClass: "text-[12px] leading-[16px]",
        timeClass: "text-[8px] leading-[14px]",
      }];
    }

    // Map API notifications to UI format
    return dashboardData.subscriptionNotifications.map((notification) => {
      // Select icon based on notification type
      let icon = blacktick; // default
      if (notification.type === 'error') {
        icon = alert;
      } else if (notification.type === 'warning') {
        icon = sclock;
      } else if (notification.type === 'info') {
        icon = sclock;
      } else if (notification.type === 'success') {
        icon = blacktick;
      }

      return {
        title: notification.title,
        description: notification.description,
        time: notification.time,
        bg: notification.bg,
        border: notification.border,
        iconBg: notification.iconBg,
        // Use the colors from API (already set correctly per type)
        titleColor: notification.titleColor,
        descriptionColor: notification.descriptionColor,
        timeColor: notification.timeColor,
        icon: icon,
        titleClass: "text-[16px] leading-[16px]",
        descriptionClass: "text-[12px] leading-[16px]",
        timeClass: "text-[8px] leading-[14px]",
      };
    });
  }, [dashboardData]);

  useEffect(() => {
    if (!isFilterOpen) return;
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setIsFilterOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);
  // Filter user growth data based on time filter
  const filteredGrowthData = useMemo(() => {
    if (!dashboardData?.userGrowthData || dashboardData.userGrowthData.length === 0) {
      return [];
    }

    const now = new Date();
    let filteredData = [...dashboardData.userGrowthData];

    switch (timeFilter) {
      case 'week': {
        // Show last 4 weeks (approximately 1 month of data)
        // Since we have monthly data, we'll show the most recent month
        filteredData = filteredData.slice(-1);
        break;
      }
      case 'month': {
        // Show last month
        filteredData = filteredData.slice(-1);
        break;
      }
      case 'year': {
        // Show last 12 months (all available data)
        filteredData = filteredData.slice(-12);
        break;
      }
      case 'all':
      default: {
        // Show all data
        filteredData = dashboardData.userGrowthData;
        break;
      }
    }

    return filteredData;
  }, [dashboardData, timeFilter]);

  // Prepare growth chart data from filtered data
  const { linePath, points, growthMonths, growthValues, maxValue } = useMemo(() => {
    if (!filteredGrowthData || filteredGrowthData.length === 0) {
      return { linePath: '', points: [], growthMonths: [], growthValues: [], maxValue: 15 };
    }

    const chartWidth = 460;
    const chartHeight = 240;
    const leftPadding = 50;
    const rightPadding = 20;
    const topPadding = 20;
    const bottomPadding = 30;
    const usableWidth = chartWidth - leftPadding - rightPadding;
    const usableHeight = chartHeight - topPadding - bottomPadding;

    // Extract months and cumulative counts from filtered data
    const months = filteredGrowthData.map(item => item.month);
    const values = filteredGrowthData.map(item => item.cumulativeCount / 1000); // Convert to thousands

    // Find max value for scaling - round up to nearest 2.5k for better Y-axis labels
    const rawMax = Math.max(...values, 15);
    const maxValue = Math.ceil(rawMax / 2.5) * 2.5; // Round up to nearest 2.5k

    const pointCoords = values.map((value, index) => {
      const x = leftPadding + (usableWidth / Math.max(values.length - 1, 1)) * index;
      const y = topPadding + usableHeight - (value / maxValue) * usableHeight;
      return { x, y, value };
    });

    const d = pointCoords
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(
            2
          )}`
      )
      .join(" ");

    return { linePath: d, points: pointCoords, growthMonths: months, growthValues: values, maxValue };
  }, [filteredGrowthData]);

  const donutData = useMemo(() => {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const total = subscriptionSegments.reduce((sum, seg) => sum + seg.value, 0);
    const gapSize = 8;
    const segmentsCount = subscriptionSegments.length;
    const availableCircumference = circumference - gapSize * segmentsCount;
    const gapFraction = gapSize / circumference;

    let rotationAccumulator = 0;
    const segments = subscriptionSegments.map((segment) => {
      const strokeLength =
        (segment.value / total) * Math.max(availableCircumference, 0);
      const dasharray = `${strokeLength} ${circumference}`;
      const dashFraction = strokeLength / circumference;
      const rotation = rotationAccumulator;
      rotationAccumulator += dashFraction + gapFraction;

      return {
        ...segment,
        dasharray,
        rotation,
      };
    });

    const highlighted =
      subscriptionSegments.find((segment) => segment.isBase) ??
      subscriptionSegments[0];

    return {
      segments,
      radius,
      circumference,
      gapSize,
      trackColor: "#EEF2F6",
      highlighted,
    };
  }, [subscriptionSegments]);

  // Loading state
  if (loading) {
    return (
      <Loader
        fullScreen={true}
        size="lg"
        color="oxford-blue"
        text="Loading dashboard data..."
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] px-4 py-6 sm:px-6 sm:py-8 2xl:px-16 flex items-center justify-center">
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
    <div className="min-h-screen bg-[#F5F7FB] px-4 py-6 sm:px-6 sm:py-8 2xl:px-16">
      <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
        <header className={`space-y-1 text-center ${dir === "ltr" ? "sm:text-left" : "sm:text-right"}`}>
          <h1 className="font-archivo font-bold text-[28px] leading-[32px] text-oxford-blue sm:text-[36px] sm:leading-[40px]">
            {t('admin.dashboard.hero.title')}
          </h1>
          <p className="font-roboto text-[16px] leading-[24px] text-dark-gray sm:text-[18px] sm:leading-[28px]">
            {t('admin.dashboard.hero.subtitle')}
          </p>
        </header>

        {/* Stats */}
        <section className="flex flex-wrap gap-4 sm:gap-6 lg:gap-7 w-full xl:justify-between">
          {stats.map((item) => (
            <AdminMetricCard
              key={item.title}
              title={item.title}
              value={item.value}
              subtext={item.delta}
              subtextClassName={item.deltaColor}
              icon={item.icon}
              iconWrapperClassName="bg-[#ED4122]"
              className="w-full sm:w-[calc(50%-12px)] lg:w-[262px] lg:h-[130px]"
            />
          ))}
        </section>

        {/* Charts */}
        <section className="flex flex-col lg:flex-row gap-10 w-full justify-between">
          <div className="rounded-[8px] bg-white shadow-dashboard border border-[#E5E7EB] p-6 w-full lg:w-[639px] xl:w-full lg:h-[462px]">
            <div className="flex items-start justify-between flex-col gap-4 sm:flex-row sm:gap-0">
              <div>
                <h3 className="text-[20px] leading-[32px] font-archivo font-semibold text-oxford-blue">
                  {t('admin.dashboard.charts.userGrowthTrend.title')}
                </h3>
                {/* <p className="text-sm text-dark-gray font-roboto">
                  {t('admin.dashboard.charts.userGrowthTrend.subtitle')}
                </p> */}
              </div>
              {/* Time Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-roboto rounded-lg bg-white border border-[#E5E7EB] text-oxford-blue hover:bg-gray-50 transition"
                >
                  <span>
                    {timeFilter === 'all' ? 'All' : timeFilter === 'month' ? 'This month' : 'This year'}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[150px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        setTimeFilter('all');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-roboto hover:bg-gray-50 transition first:rounded-t-lg ${timeFilter === 'all' ? 'bg-gray-50 text-oxford-blue font-medium' : 'text-dark-gray'
                        }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        setTimeFilter('month');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-roboto hover:bg-gray-50 transition ${timeFilter === 'month' ? 'bg-gray-50 text-oxford-blue font-medium' : 'text-dark-gray'
                        }`}
                    >
                      This month
                    </button>
                    <button
                      onClick={() => {
                        setTimeFilter('year');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-roboto hover:bg-gray-50 transition last:rounded-b-lg ${timeFilter === 'year' ? 'bg-gray-50 text-oxford-blue font-medium' : 'text-dark-gray'
                        }`}
                    >
                      This year
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 sm:mt-8">
              <div className="relative h-[300px] sm:h-[348px]">
                <svg
                  viewBox="0 0 460 240"
                  className="absolute inset-0 h-full w-full"
                >
                  <defs>
                    <linearGradient
                      id="growthGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#1D4ED8"
                        stopOpacity="0.18"
                      />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines - dynamically generate based on maxValue */}
                  {(() => {
                    const chartHeight = 240;
                    const topPadding = 20;
                    const bottomPadding = 30;
                    const usableHeight = chartHeight - topPadding - bottomPadding;

                    // Generate Y-axis labels based on maxValue
                    const steps = 6; // Number of grid lines
                    const stepValue = maxValue / (steps - 1);
                    const yAxisValues = [];

                    for (let i = 0; i < steps; i++) {
                      yAxisValues.push(i * stepValue);
                    }

                    return yAxisValues.map((value) => {
                      const y = topPadding + usableHeight - (value / maxValue) * usableHeight;
                      return (
                        <g key={value}>
                          <line
                            x1={50}
                            x2={440}
                            y1={y}
                            y2={y}
                            stroke="#E5E7EB"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            opacity="0.8"
                          />
                          <text
                            x={30}
                            y={y + 4}
                            fill="#9CA3AF"
                            fontSize="12"
                            fontFamily="Roboto"
                            textAnchor="end"
                          >
                            {value === 0 ? "0" : `${value.toFixed(1)}k`}
                          </text>
                        </g>
                      );
                    });
                  })()}

                  {/* Area */}
                  {points.length > 0 && (
                    <>
                      <path
                        d={`M${points[0].x} ${points[0].y} ${points
                          .map((point) => `L${point.x} ${point.y}`)
                          .join(" ")} L${points[points.length - 1].x} 230 L${points[0].x
                          } 230 Z`}
                        fill="url(#growthGradient)"
                      />
                      {/* Line */}
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#60A5FA"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Points */}
                      {points.map((point, index) => (
                        <circle
                          key={index}
                          cx={point.x}
                          cy={point.y}
                          r="4.5"
                          fill="#60A5FA"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                      ))}
                    </>
                  )}
                  {/* Month Labels */}
                  {growthMonths && growthMonths.length > 0 && points.length > 0 && growthMonths.map((label, idx) => (
                    <text
                      key={`${label}-${idx}`}
                      x={points[idx]?.x || 0}
                      y={230}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="12"
                      fontFamily="Roboto"
                    >
                      {label}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>
          <div className="rounded-[8px] bg-white shadow-dashboard border border-[#E5E7EB] p-6 flex flex-col w-full lg:w-[455px] lg:h-[462px]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[20px] leading-[28px] font-archivo font-semibold text-oxford-blue">
                  {t('admin.dashboard.charts.subscriptionPlans.title')}
                </h3>
                {/* <p className="text-sm text-dark-gray font-roboto">
                  {t('admin.dashboard.charts.subscriptionPlans.subtitle')}
                </p> */}
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="relative">
                <svg width="260" height="260" viewBox="0 0 260 260">
                  <circle
                    cx="130"
                    cy="130"
                    r={donutData.radius}
                    stroke={donutData.trackColor}
                    strokeWidth="26"
                    fill="none"
                  />
                  {donutData.segments.map((segment) => (
                    <circle
                      key={segment.label}
                      cx="130"
                      cy="130"
                      r={donutData.radius}
                      stroke={segment.color}
                      strokeWidth="26"
                      fill="none"
                      strokeLinecap="butt"
                      strokeDasharray={segment.dasharray}
                      transform={`rotate(${segment.rotation * 360 - 90
                        } 130 130)`}
                    />
                  ))}
                  <circle
                    cx="130"
                    cy="130"
                    r={donutData.radius - 30}
                    fill="#FFFFFF"
                  />
                </svg>
                {/* <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <p className="font-archivo font-semibold text-[32px] leading-[36px] text-oxford-blue">
                    {donutData.highlighted.value.toFixed(1)}%
                  </p>
                  <p className="text-sm font-roboto text-dark-gray">
                    {donutData.highlighted.label}
                  </p>
                </div> */}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {subscriptionSegments.map((segment) => (
                <div
                  key={segment.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="text-sm text-dark-gray font-roboto">
                      {segment.label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-oxford-blue font-roboto">
                    {segment.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom panels */}
        <section className="flex flex-col lg:flex-row gap-6 lg:gap-4 justify-between">
          <div className="flex-wrap rounded-[8px] bg-white shadow-dashboard border border-[#E5E7EB] p-6 w-full lg:w-[558px] xl:w-full lg:h-[410px]">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h3 className="font-archivo font-semibold text-[20px] leading-[28px] text-oxford-blue">
                {t('admin.dashboard.sections.latestSignups')}
              </h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {latestSignups.map((user, index) => (
                <div
                  key={`${user.email}-${index}-${user.time}`}
                  dir="ltr"
                  className="flex w-full flex-col gap-3 rounded-xl border border-[#6CA6C1] bg-[#E5E7EB] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0 xl:w-[500px] lg:h-[86px]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`${user.avatarColor} flex h-10 w-10 items-center justify-center rounded-full`}
                    >
                      <span className="font-roboto text-[16px] leading-[20px] text-oxford-blue font-normal">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-roboto text-[16px] leading-[20px] text-[#032746] font-normal">
                        {user.name}
                      </p>
                      <p className="font-roboto text-[12px] leading-[20px] text-[#6B7280]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span className="font-roboto text-[12px] leading-[20px] text-[#6B7280]">
                    {user.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-wrap rounded-[8px] bg-white shadow-dashboard border border-[#E5E7EB] p-6 w-full lg:w-[558px] xl:w-full lg:h-[410px]">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h3 className="font-archivo font-semibold text-[20px] leading-[28px] text-oxford-blue">
                {t('admin.dashboard.sections.systemNotifications')}
              </h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {notifications.map((note) => (
                <div
                  key={note.title}
                  className={`${note.bg} flex w-full flex-col gap-2 rounded-xl border ${note.border} px-4 py-4 w-full lg:h-[86px]`}
                >
                  <div className="flex items-start gap-3">
                    <img src={note.icon} alt="" className="" />
                    <div className="flex flex-col gap-1">
                      <p
                        className={`font-roboto font-normal ${note.titleClass} ${note.titleColor}`}
                      >
                        {note.title}
                      </p>
                      <p
                        className={`font-roboto font-normal ${note.descriptionClass} ${note.descriptionColor}`}
                      >
                        {note.description}
                      </p>
                      <p
                        className={`font-roboto font-normal ${note.timeClass} ${note.timeColor}`}
                      >
                        {note.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
