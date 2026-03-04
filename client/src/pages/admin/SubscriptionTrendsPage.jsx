import React, { useState, useEffect, useMemo } from "react";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import { useLanguage } from "../../context/LanguageContext";
import Dropdown from "../../components/shared/Dropdown";
import adminAPI from "../../api/admin";
import Loader from "../../components/common/Loader";

const SubscriptionTrendsPage = () => {
  const { t } = useLanguage();
  // Subscription Trends filters
  const [planType, setPlanType] = useState("");
  const [dateRange, setDateRange] = useState("");
  
  // Month/Year selection for daily revenue trend (empty = show monthly data)
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Generate year options (last 3 years and next year)
  const currentYear = currentDate.getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - 2 + i;
    return { value: year.toString(), label: year.toString() };
  });

  // Month options
  const monthOptions = [
    { value: "1", label: t('common.months.january') || 'January' },
    { value: "2", label: t('common.months.february') || 'February' },
    { value: "3", label: t('common.months.march') || 'March' },
    { value: "4", label: t('common.months.april') || 'April' },
    { value: "5", label: t('common.months.may') || 'May' },
    { value: "6", label: t('common.months.june') || 'June' },
    { value: "7", label: t('common.months.july') || 'July' },
    { value: "8", label: t('common.months.august') || 'August' },
    { value: "9", label: t('common.months.september') || 'September' },
    { value: "10", label: t('common.months.october') || 'October' },
    { value: "11", label: t('common.months.november') || 'November' },
    { value: "12", label: t('common.months.december') || 'December' },
  ];

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Prepare revenue chart params - if month and year are selected, use them
        const revenueParams = selectedMonth && selectedYear 
          ? { month: parseInt(selectedMonth, 10), year: parseInt(selectedYear, 10) }
          : {};
        
        const [metricsData, revenueData, planDistData, breakdownData] = await Promise.all([
          adminAPI.getSubscriptionTrendMetrics(),
          adminAPI.getRevenueTrendChart(revenueParams),
          adminAPI.getPlanDistribution(),
          adminAPI.getPlanWiseBreakdown({ page: currentPage, limit: 3 }),
        ]);

        // Log for debugging
        console.log('Revenue data received:', revenueData);
        
        setSubscriptionData({
          metrics: metricsData.data,
          revenue: revenueData.data,
          planDistribution: planDistData.data,
          breakdown: breakdownData.data,
        });
      } catch (err) {
        console.error('Error fetching subscription data:', err);
        setError(err.message || 'Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [currentPage, selectedMonth, selectedYear]);

  // Format currency
  const formatCurrency = (amount) => {
    if (typeof amount === 'string') return amount;
    return `SAR ${amount?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'}`;
  };

  // Format number
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  // Prepare Subscription KPI Cards from API data
  const subscriptionKPICards = subscriptionData?.metrics ? [
    {
      id: 1,
      title: t('admin.subscriptionTrends.kpi.totalSubscribers'),
      value: formatNumber(subscriptionData.metrics.totalSubscribers),
      subtext: "",
      subtextClassName: "text-dark-gray",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M27.8929 27.5186C27.8929 29.7644 26.6542 31 24.4067 31H16.5933C14.3458 31 13.1071 29.7632 13.1071 27.5186C13.1071 24.9899 14.5309 22.0368 18.545 22.0368H22.454C26.4691 22.0357 27.8929 24.9899 27.8929 27.5186ZM20.5088 19.9612C22.6358 19.9612 24.3652 18.2227 24.3652 16.0863C24.3652 13.9489 22.6347 12.2115 20.5088 12.2115C18.383 12.2115 16.6536 13.95 16.6536 16.0863C16.6536 18.2227 18.3819 19.9612 20.5088 19.9612ZM27.9367 17.1076H26.1734C26.0201 17.1076 25.8886 17.2181 25.8557 17.3618C25.6148 18.4117 25.0671 19.3511 24.3114 20.0695C24.1252 20.2463 24.2348 20.5558 24.4867 20.6221C26.4253 21.0863 27.7724 22.2357 28.5719 23.6946C28.6267 23.8162 28.7362 23.8935 28.8786 23.8935H29.3385C31.058 23.8935 32 22.9431 32 21.219C32 19.329 30.9377 17.1076 27.9367 17.1076ZM26.5348 10.0011C25.4417 10.0011 24.4877 10.6056 23.9872 11.4997C23.9467 11.5726 23.9489 11.6533 23.9642 11.723C23.9806 11.7959 24.0125 11.8347 24.0804 11.8922C25.1526 12.8039 25.8678 14.1246 25.985 15.6178C25.9916 15.7018 26.0201 15.7537 26.0704 15.8079C26.1208 15.862 26.1963 15.8951 26.296 15.9039C26.3738 15.9106 26.4537 15.915 26.5348 15.915C28.1448 15.915 29.4591 14.5888 29.4591 12.9531C29.4591 11.3273 28.1448 10.0011 26.5348 10.0011ZM9 21.219C9 22.9431 9.94196 23.8935 11.6615 23.8935H12.1214C12.2638 23.8935 12.3733 23.8162 12.4281 23.6946C13.2276 22.2357 14.5747 21.0863 16.5133 20.6221C16.7652 20.5558 16.8748 20.2463 16.6886 20.0695C15.9329 19.3511 15.3852 18.4117 15.1443 17.3618C15.1114 17.2181 14.9799 17.1076 14.8266 17.1076H13.0633C10.0623 17.1076 9 19.329 9 21.219ZM11.5409 12.952C11.5409 14.5877 12.8552 15.9139 14.4652 15.9139C14.5463 15.9139 14.6262 15.9095 14.704 15.9028C14.8048 15.894 14.8792 15.8609 14.9296 15.8068C14.9799 15.7526 15.0084 15.7007 15.015 15.6167C15.1322 14.1236 15.8474 12.8027 16.9196 11.8909C16.9864 11.8335 17.0194 11.7948 17.0358 11.7219C17.0511 11.6523 17.0533 11.5727 17.0128 11.4986C16.5112 10.6045 15.5583 10 14.4652 10C12.8552 10.0011 11.5409 11.3274 11.5409 12.952Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 2,
      title: t('admin.subscriptionTrends.kpi.totalRevenue'),
      value: formatCurrency(subscriptionData.metrics.totalRevenue),
      subtext: "",
      subtextClassName: "text-dark-gray",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M25.002 23.2185C25.002 21.5699 23.643 20.1353 21.693 19.7279L18.797 19.1369C18.276 19.0283 17.828 18.7879 17.496 18.4364C17.177 18.1047 17.001 17.6809 17.001 17.243C17.001 16.1672 18.064 15.2923 19.371 15.2923H20.631C21.839 15.2923 22.852 16.0397 22.987 17.0307C23.049 17.4826 23.545 17.8093 24.092 17.7566C24.641 17.7056 25.036 17.2982 24.974 16.8471C24.738 15.1146 23.037 13.8017 20.96 13.6725V12.8231C20.96 12.3704 20.51 12 19.96 12C19.41 12 18.96 12.3704 18.96 12.8231V13.6807C16.745 13.8536 15 15.3754 15 17.2438C15 18.0496 15.329 18.8364 15.92 19.4521C16.513 20.0818 17.36 20.5362 18.309 20.7345L21.205 21.3254C22.262 21.546 23 22.3247 23 23.2193C23 23.7371 22.752 24.2259 22.302 24.5963C21.853 24.9667 21.259 25.17 20.63 25.17H19.37C18.162 25.17 17.149 24.4227 17.014 23.4317C16.952 22.9799 16.453 22.6547 15.909 22.7057C15.36 22.7568 14.965 23.1643 15.027 23.6153C15.26 25.3257 16.921 26.6253 18.961 26.7841V27.6385C18.961 28.0912 19.411 28.4615 19.961 28.4615C20.511 28.4615 20.961 28.0912 20.961 27.6385V26.7891C22 26.724 22.971 26.3751 23.718 25.7602C24.546 25.0787 25.002 24.1766 25.002 23.2185Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 3,
      title: t('admin.subscriptionTrends.kpi.renewalRate'),
      value: subscriptionData.metrics.renewalRate || "0%",
      subtext: "",
      subtextClassName: "text-dark-gray",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M12 19.5003C12 20.2153 12.1649 20.9044 12.4919 21.5484C12.7409 22.0414 12.544 22.6424 12.052 22.8924C11.906 22.9654 11.752 23.0003 11.601 23.0003C11.236 23.0003 10.884 22.8002 10.708 22.4522C10.245 21.5382 10 20.5173 10 19.5003C10 15.6733 12.673 13.0003 16.5 13.0003H22.5861L22.293 12.7073C21.902 12.3163 21.902 11.6842 22.293 11.2932C22.684 10.9022 23.316 10.9022 23.707 11.2932L25.7061 13.2923C25.7991 13.3853 25.872 13.4952 25.923 13.6182C26.024 13.8622 26.024 14.1384 25.923 14.3824C25.872 14.5054 25.7991 14.6153 25.7061 14.7083L23.707 16.7073C23.512 16.9023 23.256 17.0003 23 17.0003C22.744 17.0003 22.488 16.9023 22.293 16.7073C21.902 16.3163 21.902 15.6842 22.293 15.2933L22.5861 15.0003H16.5C13.767 15.0003 12 16.7673 12 19.5003ZM29.292 16.5484C29.043 16.0554 28.444 15.8572 27.948 16.1082C27.456 16.3582 27.2591 16.9592 27.5081 17.4522C27.8351 18.0972 28 18.7853 28 19.5003C28 22.2333 26.233 24.0003 23.5 24.0003H17.4139L17.707 23.7073C18.098 23.3163 18.098 22.6842 17.707 22.2933C17.316 21.9023 16.684 21.9023 16.293 22.2933L14.293 24.2933C13.902 24.6842 13.902 25.3163 14.293 25.7073L16.293 27.7073C16.488 27.9023 16.744 28.0003 17 28.0003C17.256 28.0003 17.512 27.9023 17.707 27.7073C18.098 27.3163 18.098 26.6842 17.707 26.2933L17.4139 26.0003H23.5C27.327 26.0003 30 23.3273 30 19.5003C30 18.4833 29.755 17.4624 29.292 16.5484Z" fill="white"/>
        </svg>
      ),
    },
    {
      id: 4,
      title: t('admin.subscriptionTrends.kpi.churnRate'),
      value: subscriptionData.metrics.churnRate || "0%",
      subtext: "",
      subtextClassName: "text-dark-gray",
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="6" fill="#ED4122"/>
          <path d="M10.0002 25.0003C10.0002 25.1303 10.0272 25.2604 10.0772 25.3824C10.1782 25.6264 10.3732 25.8214 10.6182 25.9234C10.7402 25.9744 10.8702 26.0003 11.0002 26.0003H15.1542C15.7062 26.0003 16.1542 25.5523 16.1542 25.0003C16.1542 24.4483 15.7062 24.0003 15.1542 24.0003H13.4142L19.0002 18.4143L21.5862 21.0003C22.3652 21.7803 23.6352 21.7803 24.4142 21.0003L29.7072 15.7073C30.0982 15.3163 30.0982 14.6842 29.7072 14.2932C29.3162 13.9022 28.6842 13.9022 28.2932 14.2932L23.0002 19.5862L20.4142 17.0003C19.6352 16.2203 18.3652 16.2203 17.5862 17.0003L12.0002 22.5862V20.8462C12.0002 20.2942 11.5522 19.8462 11.0002 19.8462C10.4482 19.8462 10.0002 20.2942 10.0002 20.8462V25.0003Z" fill="white"/>
        </svg>
      ),
    },
  ] : [];

  // Prepare Revenue Trend Chart Data from API
  const revenueData = useMemo(() => {
    if (!subscriptionData?.revenue) {
      console.log('No revenue data in subscriptionData:', subscriptionData);
      return { data: [], type: 'monthly' };
    }
    
    // Handle different possible data structures
    const rawData = subscriptionData.revenue.data || subscriptionData.revenue || [];
    const dataType = subscriptionData.revenue.type || 'monthly'; // 'daily' or 'monthly'
    
    if (!Array.isArray(rawData)) {
      console.warn('Revenue data is not an array:', rawData);
      return { data: [], type: 'monthly' };
    }
    
    const mapped = rawData.map(item => {
      const revenue = typeof item.revenue === 'string' ? parseFloat(item.revenue) || 0 : (Number(item.revenue) || 0);
      
      if (dataType === 'daily') {
        // For daily data, use day number as label
        return {
          label: item.label || `${item.day}/${item.monthNumber}` || item.day?.toString() || 'N/A',
          day: item.day,
          month: item.month || item.monthName || 'N/A',
          monthNumber: item.monthNumber,
          year: item.year,
          revenue,
          date: item.date,
        };
      } else {
        // For monthly data, use month/year
        return {
          label: item.label || `${item.month || item.monthName || 'N/A'} ${item.year || ''}`,
          month: item.month || item.monthName || 'N/A',
          monthNumber: item.monthNumber,
          year: item.year,
          revenue,
          date: item.date,
        };
      }
    });
    
    console.log('Processed revenue data:', mapped, 'Type:', dataType);
    return { data: mapped, type: dataType };
  }, [subscriptionData?.revenue]);

  // Prepare Plan Distribution from API
  const planDistribution = useMemo(() => {
    const data = subscriptionData?.planDistribution || [];
    console.log('Plan distribution data:', data);
    
    // Ensure we have valid data
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    // Validate and normalize percentages
    const totalPercentage = data.reduce((sum, item) => sum + (parseFloat(item.percentage) || 0), 0);
    
    // If percentages don't add up to 100, normalize them
    if (totalPercentage !== 100 && totalPercentage > 0) {
      return data.map(item => ({
        ...item,
        percentage: Math.round((parseFloat(item.percentage) || 0) * 100 / totalPercentage),
      }));
    }
    
    return data.map(item => ({
      ...item,
      percentage: parseFloat(item.percentage) || 0,
    }));
  }, [subscriptionData?.planDistribution]);

  // Prepare Plan-Wise Breakdown from API
  const planBreakdown = subscriptionData?.breakdown?.plans?.map(plan => ({
    planType: plan.planType || plan.name || 'N/A',
    subscribers: plan.subscribers || 0,
    active: plan.active || 0,
    expired: plan.expired || 0,
    revenue: formatCurrency(plan.revenue),
    avgDuration: plan.avgDuration || 'N/A',
  })) || [];

  // Calculate donut chart path
  const getDonutPath = (percentage, startAngle, radius, innerRadius) => {
    if (percentage <= 0) return '';
    
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    // Center point
    const cx = 100;
    const cy = 100;

    // Outer arc points
    const x1 = cx + radius * Math.cos(startAngleRad);
    const y1 = cy + radius * Math.sin(startAngleRad);
    const x2 = cx + radius * Math.cos(endAngleRad);
    const y2 = cy + radius * Math.sin(endAngleRad);

    // Inner arc points
    const x3 = cx + innerRadius * Math.cos(endAngleRad);
    const y3 = cy + innerRadius * Math.sin(endAngleRad);
    const x4 = cx + innerRadius * Math.cos(startAngleRad);
    const y4 = cy + innerRadius * Math.sin(startAngleRad);

    // Determine if we need large arc (for angles > 180)
    const largeArc = angle > 180 ? 1 : 0;
    
    // For 100% (full circle), use a simpler path that works correctly
    if (percentage >= 100) {
      // Full circle: draw outer circle and inner circle, then connect
      // Use a point slightly before 360 to avoid overlap issues
      const almostFullAngle = 359.9;
      const almostFullEndAngle = startAngle + almostFullAngle;
      const almostFullEndAngleRad = (almostFullEndAngle * Math.PI) / 180;
      const x2Almost = cx + radius * Math.cos(almostFullEndAngleRad);
      const y2Almost = cy + radius * Math.sin(almostFullEndAngleRad);
      const x3Almost = cx + innerRadius * Math.cos(almostFullEndAngleRad);
      const y3Almost = cy + innerRadius * Math.sin(almostFullEndAngleRad);
      return `M ${x1} ${y1} A ${radius} ${radius} 0 1 1 ${x2Almost} ${y2Almost} L ${x3Almost} ${y3Almost} A ${innerRadius} ${innerRadius} 0 1 0 ${x4} ${y4} Z`;
    }

    // Normal path for segments < 100%
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Generate donut paths
  const donutPaths = useMemo(() => {
    if (!planDistribution || planDistribution.length === 0) {
      console.log('No plan distribution data available');
      return [];
    }
    
    let currentAngle = -90; // Start from top
    const paths = planDistribution.map((item) => {
      const percentage = parseFloat(item.percentage) || 0;
      const path = getDonutPath(percentage, currentAngle, 60, 35);
      const prevAngle = currentAngle;
      currentAngle += (percentage / 100) * 360;
      
      return {
        ...item,
        path,
        startAngle: prevAngle,
        endAngle: currentAngle,
      };
    });
    
    console.log('Generated donut paths:', paths);
    return paths;
  }, [planDistribution]);

  // Loading state
  if (loading) {
    return (
      <Loader 
        fullScreen={true}
        size="lg" 
        color="oxford-blue" 
        text="Loading subscription data..."
        className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]"
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px] flex items-center justify-center">
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
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 xl:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="font-archivo text-[24px] md:text-[36px] font-bold leading-[28px] md:leading-[40px] text-oxford-blue">
              {t('admin.subscriptionTrends.hero.title')}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
            <button
              type="button"
              className="flex mt-1 h-[36px] items-center justify-center gap-2 rounded-[8px] bg-[#ED4122] px-3 md:px-5 text-[14px] md:text-[16px] font-roboto font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
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
              {t('admin.subscriptionTrends.actions.exportReport')}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          {/* Plan Type Filter */}
          <div className="w-full md:w-[184px] md:flex-shrink-0">
            <Dropdown
              value={planType || ""}
              options={[
                { value: "Basic", label: "Basic" },
                { value: "Premium", label: "Premium" },
                { value: "Enterprise", label: "Enterprise" },
                { value: "Trial", label: "Trial" },
              ]}
              onChange={(value) => setPlanType(value)}
              placeholder={t('admin.subscriptionTrends.filters.planType')}
              showDefaultOnEmpty={false}
              className="!w-full md:!w-[184px]"
              height="h-[50px]"
            />
          </div>

          {/* Date Range Filter */}
          <div className="w-full md:w-[184px] md:flex-shrink-0">
            <Dropdown
              value={dateRange || ""}
              options={[
                { value: "Last 30 Days", label: t('admin.subscriptionTrends.filters.last30Days') },
                { value: "Last 7 Days", label: t('admin.subscriptionTrends.filters.last7Days') },
                { value: "Last 90 Days", label: t('admin.subscriptionTrends.filters.last90Days') },
                { value: "Last Year", label: t('admin.subscriptionTrends.filters.lastYear') },
              ]}
              onChange={(value) => setDateRange(value)}
              placeholder={t('admin.subscriptionTrends.filters.dateRange')}
              showDefaultOnEmpty={false}
              className="!w-full md:!w-[184px]"
              height="h-[50px]"
            />
          </div>

          {/* Month Selector for Revenue Trend */}
          <div className="w-full md:w-[150px] md:flex-shrink-0">
            <Dropdown
              value={selectedMonth || ""}
              options={monthOptions}
              onChange={(value) => setSelectedMonth(value)}
              placeholder={t('admin.subscriptionTrends.filters.month') || 'Month'}
              showDefaultOnEmpty={false}
              className="!w-full md:!w-[150px]"
              height="h-[50px]"
            />
          </div>

          {/* Year Selector for Revenue Trend */}
          <div className="w-full md:w-[120px] md:flex-shrink-0">
            <Dropdown
              value={selectedYear || ""}
              options={yearOptions}
              onChange={(value) => setSelectedYear(value)}
              placeholder={t('admin.subscriptionTrends.filters.year') || 'Year'}
              showDefaultOnEmpty={false}
              className="!w-full md:!w-[120px]"
              height="h-[50px]"
            />
          </div>
        </div>

        {/* Subscription KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {subscriptionKPICards.map((card) => (
            <AdminMetricCard
              key={card.id}
              title={card.title}
              value={card.value}
              subtext={card.subtext}
              subtextClassName={card.subtextClassName}
              icon={card.icon}
              className="w-full h-[107px]"
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Revenue Trend Chart */}
          <div className="rounded-[12px] w-full border border-[#03274633] bg-white p-4 md:p-6 shadow-card">
            <h2 className="pt-3 font-archivo text-[18px] md:text-[20px] font-bold leading-[24px] md:leading-[28px] text-oxford-blue">
              {subscriptionData?.revenue?.title || t('admin.subscriptionTrends.charts.revenueTrend')}
            </h2>
            <div className="h-[250px] md:h-[322px] relative mt-4 md:mt-6">
              <svg width="100%" height="100%" viewBox="0 0 599 322" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ED4122" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#ED4122" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid lines - horizontal with Y-axis labels */}
                {(() => {
                  const chartData = revenueData.data || [];
                  if (chartData.length === 0) {
                    return [0, 5, 10, 15, 20, 25, 30, 35].map((val) => (
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
                    ));
                  }
                  
                  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1) || 35000;
                  const minRevenue = Math.min(...chartData.map(d => d.revenue), 0);
                  const revenueRange = maxRevenue - minRevenue || 1;
                  const stepCount = 5;
                  const stepValue = revenueRange / stepCount;
                  
                  return Array.from({ length: stepCount + 1 }, (_, i) => {
                    const val = minRevenue + (stepValue * i);
                    const yPos = 302 - ((val - minRevenue) / revenueRange) * 260;
                    return (
                      <g key={i}>
                        <line
                          x1="50"
                          y1={yPos}
                          x2="549"
                          y2={yPos}
                          stroke="#E5E7EB"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                          opacity="0.5"
                        />
                        <text
                          x="45"
                          y={yPos + 4}
                          textAnchor="end"
                          fill="#6B7280"
                          fontSize="10"
                          fontFamily="Roboto, sans-serif"
                        >
                          SAR {val.toFixed(0)}
                        </text>
                      </g>
                    );
                  });
                })()}
                {/* Grid lines - vertical and X-axis labels */}
                {(() => {
                  const chartData = revenueData.data || [];
                  const isDaily = revenueData.type === 'daily';
                  
                  if (chartData.length === 0) return null;
                  
                  return (
                    <>
                      {chartData.length > 0 && chartData.map((data, index) => {
                        const x = 50 + (index * 499) / Math.max(chartData.length - 1, 1);
                        // Show labels: every 5 days for daily data (or more frequently if less data), or every item for monthly
                        let showLabel = false;
                        if (isDaily) {
                          if (chartData.length <= 31) {
                            // Show every 3-5 days depending on month length
                            const step = chartData.length > 20 ? 5 : 3;
                            showLabel = (data.day % step === 0 || index === 0 || index === chartData.length - 1 || data.day === 1);
                          } else {
                            showLabel = (data.day % 7 === 0 || index === 0 || index === chartData.length - 1);
                          }
                        } else {
                          // For monthly data, show all labels
                          showLabel = true;
                        }
                        
                        return (
                          <g key={`v-${index}`}>
                            <line
                              x1={x}
                              y1="42"
                              x2={x}
                              y2="302"
                              stroke="#E5E7EB"
                              strokeWidth="1"
                              strokeDasharray="2 2"
                              opacity="0.5"
                            />
                            {/* X-axis labels */}
                            {showLabel && (
                              <text
                                x={x}
                                y="315"
                                textAnchor="middle"
                                fill="#6B7280"
                                fontSize="10"
                                fontFamily="Roboto, sans-serif"
                              >
                                {isDaily ? data.day : (data.monthNumber ? `${data.monthNumber}/${data.year?.toString().slice(-2)}` : data.label)}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
                {/* Calculate smooth curve path */}
                {(() => {
                  const chartData = revenueData.data || [];
                  
                  if (chartData.length === 0) {
                    return (
                      <text
                        x="299.5"
                        y="161"
                        textAnchor="middle"
                        fill="#6B7280"
                        fontSize="14"
                        fontFamily="Roboto, sans-serif"
                      >
                        No revenue data available
                      </text>
                    );
                  }
                  
                  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1) || 35000;
                  const minRevenue = Math.min(...chartData.map(d => d.revenue), 0);
                  const revenueRange = maxRevenue - minRevenue || 1;
                  
                  const points = chartData.map((data, index) => {
                    const x = 50 + (index * 499) / Math.max(chartData.length - 1, 1);
                    const normalizedRevenue = revenueRange > 0 
                      ? (data.revenue - minRevenue) / revenueRange 
                      : 0;
                    const y = 302 - (normalizedRevenue * 260);
                    return { x, y, revenue: data.revenue, label: data.label };
                  });

                  // Always draw a trend line, even for single point (horizontal line)
                  let path;
                  if (points.length === 1) {
                    // For single point, draw a horizontal line spanning the width
                    const point = points[0];
                    path = `M 50 ${point.y} L 549 ${point.y}`;
                  } else {
                    // Create smooth curve using cubic bezier for multiple points
                    path = `M ${points[0].x} ${points[0].y}`;
                    for (let i = 0; i < points.length - 1; i++) {
                      const p0 = points[i];
                      const p1 = points[i + 1];
                      const cp1x = p0.x + (p1.x - p0.x) / 3;
                      const cp1y = p0.y;
                      const cp2x = p1.x - (p1.x - p0.x) / 3;
                      const cp2y = p1.y;
                      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
                    }
                  }

                  // Area path - connect line to bottom
                  let areaPath;
                  if (points.length === 1) {
                    // For single point, create area from left to right at the same height
                    const point = points[0];
                    areaPath = `M 50 ${point.y} L 549 ${point.y} L 549 302 L 50 302 Z`;
                  } else {
                    // For multiple points, create area under the curve
                    areaPath = `${path} L ${points[points.length - 1].x} 302 L ${points[0].x} 302 Z`;
                  }

                  return (
                    <>
                      {/* Area chart with gradient fill */}
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
                      {/* Data point markers - show for all points */}
                      {points.map((point, index) => (
                        <g key={index}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="#ED4122"
                            stroke="white"
                            strokeWidth="2"
                          />
                          {/* Show value on hover/always for better visibility */}
                          {points.length <= 10 && (
                            <text
                              x={point.x}
                              y={point.y - 12}
                              textAnchor="middle"
                              fill="#032746"
                              fontSize="10"
                              fontFamily="Roboto, sans-serif"
                              fontWeight="600"
                            >
                              SAR {point.revenue.toFixed(0)}
                            </text>
                          )}
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>

          {/* Plan Distribution Chart */}
          <div className="rounded-[12px] border w-full md:w-[455px] border-[#03274633] bg-white p-4 md:p-6 shadow-card">
            <h2 className="pt-3 font-archivo text-[18px] md:text-[20px] font-bold leading-[24px] md:leading-[28px] text-oxford-blue">
              {t('admin.subscriptionTrends.charts.planDistribution')}
            </h2>
            <div className="flex flex-col items-center justify-center gap-4 md:gap-6 mt-4 md:mt-6">
              <div className="relative w-full max-w-[270px] h-[270px] flex items-center justify-center">
                {donutPaths.length > 0 ? (
                  <svg 
                    width="270" 
                    height="270" 
                    viewBox="0 0 200 200" 
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-full"
                  >
                    {/* Render each segment of the donut chart */}
                    {donutPaths.map((item, index) => {
                      if (!item.path) return null;
                      return (
                        <path
                          key={`segment-${index}-${item.plan}`}
                          d={item.path}
                          fill={item.color || '#9CA3AF'}
                          stroke="#ffffff"
                          strokeWidth="2"
                          style={{
                            transition: 'opacity 0.3s',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.opacity = '0.8';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.opacity = '1';
                          }}
                        />
                      );
                    })}
                    {/* Center circle to create donut effect - optional, can be styled */}
                    <circle
                      cx="100"
                      cy="100"
                      r="35"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <div className="w-full h-[270px] flex flex-col items-center justify-center text-dark-gray">
                    <div className="text-center">
                      <p className="font-roboto text-sm mb-2">No distribution data available</p>
                      <p className="font-roboto text-xs text-gray-400">Add subscriptions to see plan distribution</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-around gap-3 w-full max-w-[400px]">
                {planDistribution.length > 0 ? planDistribution.map((item, index) => (
                  <div key={`legend-${index}-${item.plan}`} className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="w-4 h-4 rounded flex-shrink-0"
                        style={{ backgroundColor: item.color || '#9CA3AF' }}
                      ></div>
                      <span className="font-roboto text-[13px] md:text-[14px] font-normal leading-[18px] md:leading-[20px] text-oxford-blue">
                        {item.plan || 'Unknown'}
                      </span>
                    </div>
                    <span className="font-roboto pl-1.5 text-[13px] md:text-[14px] font-medium leading-[18px] md:leading-[20px] text-oxford-blue">
                      {item.percentage}%
                    </span>
                  </div>
                )) : (
                  <p className="text-center text-dark-gray w-full">No data available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Plan-Wise Breakdown Table */}
        <h2 className="pt-6 font-archivo text-[18px] md:text-[20px] font-bold leading-[24px] md:leading-[28px] text-oxford-blue">
          {t('admin.subscriptionTrends.table.title')}
        </h2>
        <section className="w-full flex flex-col overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-oxford-blue text-center">
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white whitespace-nowrap">
                    {t('admin.subscriptionTrends.table.columns.planType')}
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white whitespace-nowrap">
                    {t('admin.subscriptionTrends.table.columns.subscribers')}
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white whitespace-nowrap">
                    {t('admin.subscriptionTrends.table.columns.active')}
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white whitespace-nowrap">
                    {t('admin.subscriptionTrends.table.columns.expired')}
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white whitespace-nowrap">
                    {t('admin.subscriptionTrends.table.columns.revenue')}
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[14px] md:text-[16px] font-archivo font-medium leading-[16px] text-white whitespace-nowrap">
                    {t('admin.subscriptionTrends.table.columns.avgDuration')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {planBreakdown.length > 0 ? (
                  planBreakdown.map((plan, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none hover:bg-[#F9FAFB] transition"
                    >
                      <td className="px-3 md:px-6 py-3 md:py-4 text-[12px] md:text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {plan.planType}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-[12px] md:text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {formatNumber(plan.subscribers)}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-[12px] md:text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {formatNumber(plan.active)}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-[12px] md:text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {formatNumber(plan.expired)}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-[12px] md:text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {plan.revenue}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-[12px] md:text-[14px] font-roboto font-normal leading-[100%] text-center">
                        {plan.avgDuration}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-dark-gray"
                    >
                      {t('admin.subscriptionTrends.table.emptyState')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {subscriptionData?.breakdown?.pagination && (
            <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 text-oxford-blue md:flex-row md:items-center md:justify-between md:bg-oxford-blue md:px-6 md:text-white">
              <p className="text-[12px] font-roboto font-medium leading-[18px] tracking-[3%]">
                {t('admin.subscriptionTrends.table.pagination.showing')
                  .replace('{{first}}', subscriptionData.breakdown.pagination.showing?.from || '1')
                  .replace('{{last}}', subscriptionData.breakdown.pagination.showing?.to || '3')
                  .replace('{{total}}', subscriptionData.breakdown.pagination.totalItems || '0')}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!subscriptionData.breakdown.pagination.hasPreviousPage}
                  className="flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('admin.subscriptionTrends.table.pagination.previous')}
                </button>
                {Array.from({ length: Math.min(subscriptionData.breakdown.pagination.totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`flex h-8 w-8 items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${
                        currentPage === pageNum
                          ? 'border-[#ED4122] bg-[#ED4122] text-white'
                          : 'border-[#E5E7EB] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-[#032746]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!subscriptionData.breakdown.pagination.hasNextPage}
                  className="flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors border-[#032746] bg-white text-oxford-blue hover:bg-[#F3F4F6] md:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('admin.subscriptionTrends.table.pagination.next')}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SubscriptionTrendsPage;

