import { useLanguage } from "../../context/LanguageContext";
import { RoleCard } from "../../components/common/RoleCard";
import { PerformanceCard } from "../../components/gatherer/performanceCard";
import { LastLoginCard } from "../../components/gatherer/LastLogin";

const GathererDashboard = () => {
  const { t } = useLanguage();
  const roleData = {
    role: t("gatherer.dashboard.role"),
    tasks: [
      t("gatherer.dashboard.tasks.task1"),
      t("gatherer.dashboard.tasks.task2"),
      t("gatherer.dashboard.tasks.task3"),
      t("gatherer.dashboard.tasks.task4"),
    ],
    pendingCount: 3,
  };

  const performanceData = {
    acceptanceRate: 89,
    rejectionRate: 11,
    daysRange: 50,
  };

  const lastLoginData = {
    loginTime: "Today at 09:05 PM",
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <header className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="space-y-6">
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("gatherer.dashboard.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("gatherer.dashboard.subtitle")}
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
            <PerformanceCard 
              data={performanceData}
              fields={[
                { key: 'rejectionRate', label: t('gatherer.dashboard.performance.rejectionRate'), format: 'percentage' },
                { key: 'acceptanceRate', label: t('gatherer.dashboard.performance.acceptanceRate'), format: 'percentage' }
              ]}
            />

            <LastLoginCard loginTime={lastLoginData.loginTime} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GathererDashboard;
