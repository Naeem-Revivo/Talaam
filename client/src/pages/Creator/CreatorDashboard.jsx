import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { RoleCard } from "../../components/common/RoleCard";
import { PerformanceCard } from "../../components/gatherer/performanceCard";
import { LastLoginCard } from "../../components/gatherer/LastLogin";
import axiosClient from "../../api/client";
import { useSelector } from "react-redux";

const CreatorDashboard = () => {
  const { t } = useLanguage();
  const { user: authUser } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date to readable string
  const formatLastLogin = (dateString) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return minutes <= 1 ? "Just now" : `${minutes} minutes ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (diffInDays < 2) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} days ago`;
    } else {
      // Format as "DD/MM/YYYY at HH:MM"
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} at ${hours}:${minutes}`;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get('/creator/dashboard');
        
        if (response.data.success) {
          setDashboardData(response.data.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const roleData = {
    role: t("creator.dashboard.role"),
    tasks: [
      t("creator.dashboard.tasks.task1"),
      t("creator.dashboard.tasks.task2"),
      t("creator.dashboard.tasks.task3"),
      t("creator.dashboard.tasks.task4")
    ],
    pendingCount: dashboardData?.pendingTasks || 0
  };

  const performanceData = dashboardData?.performance ? {
    variantCompletionRate: dashboardData.performance.variantCompletionRate || 0,
    sentBackRate: dashboardData.performance.sentBackRate || 0,
    approvedVariants: dashboardData.performance.approvedVariants || 0,
    daysRange: dashboardData.performance.daysRange || 30,
    fields: [
      { key: 'variantCompletionRate', label: t('creator.dashboard.performance.variantCompletionRate'), format: 'percentage' },
      { key: 'sentBackRate', label: t('creator.dashboard.performance.sentBackRate'), format: 'percentage' },
      { key: 'approvedVariants', label: t('creator.dashboard.performance.approvedVariants'), format: 'number' }
    ]
  } : null;

  const lastLoginData = {
    loginTime: dashboardData?.lastLogin ? formatLastLogin(dashboardData.lastLogin) : "Never"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
          <div className="flex items-center justify-center h-64">
            <p className="text-[18px] text-dark-gray">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
          <div className="flex items-center justify-center h-64">
            <p className="text-[18px] text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <header className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="space-y-6">
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("creator.dashboard.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("creator.dashboard.subtitle").replace("John Doe", authUser?.name || "User")}
            </p>
          </div>
        </header>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Role Card */}
          <div>
            <RoleCard 
              role={roleData.role}
              tasks={roleData.tasks}
              pendingCount={roleData.pendingCount}
              roleLabel={t("explainer.dashboard.roleLabel")}
              pendingTasksLabel={t("explainer.dashboard.pendingTasks")}
            />
          </div>

          {/* Right Column - Performance and Last Login Cards */}
          <div className="space-y-6">
            {performanceData && (
              <PerformanceCard 
                data={performanceData}
              />
            )}
            
            <LastLoginCard 
              loginTime={lastLoginData.loginTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
