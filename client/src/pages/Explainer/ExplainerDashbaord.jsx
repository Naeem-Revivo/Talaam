import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { RoleCard } from "../../components/common/RoleCard";
import { PerformanceCard } from "../../components/gatherer/performanceCard";
import { LastLoginCard } from "../../components/gatherer/LastLogin";
import axiosClient from "../../api/client";

const ExplainerDashboard = () => {
  const { t } = useLanguage();
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
        const response = await axiosClient.get('/explainer/dashboard');
        
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
    role: t("explainer.dashboard.role"),
    tasks: [
      t("explainer.dashboard.tasks.task1"),
      t("explainer.dashboard.tasks.task2"),
      t("explainer.dashboard.tasks.task3"),
      t("explainer.dashboard.tasks.task4")
    ],
    pendingCount: dashboardData?.pendingTasks || 0
  };

  const performanceData = dashboardData?.performance ? {
    explaintionCompletionRate: dashboardData.performance.explaintionCompletionRate || 0,
    qualityScore: dashboardData.performance.qualityScore || 0,
    drafts: dashboardData.performance.drafts || 0,
    daysRange: dashboardData.performance.daysRange || 30,
    fields: [
      { key: 'explaintionCompletionRate', label: t('explainer.dashboard.performance.explanationCompletionRate'), format: 'percentage' },
      { key: 'qualityScore', label: t('explainer.dashboard.performance.qualityScore'), format: 'percentage' },
      { key: 'drafts', label: t('explainer.dashboard.performance.drafts'), format: 'number' }
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
                {t("explainer.dashboard.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("explainer.dashboard.subtitle")}
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

export default ExplainerDashboard;
