import { PrimaryButton } from "../../components/common/Button";
import { RoleCard } from "../../components/common/RoleCard";
import { PerformanceCard } from "../../components/gatherer/performanceCard";
import { LastLoginCard } from "../../components/gatherer/LastLogin";
import { useLanguage } from "../../context/LanguageContext";

const ProcessorDashboard = () => {
  const { t } = useLanguage();
  
  const roleData = {
    role: t("processor.dashboard.role"),
    tasks: [
      t("processor.dashboard.tasks.task1"),
      t("processor.dashboard.tasks.task2"),
      t("processor.dashboard.tasks.task3"),
      t("processor.dashboard.tasks.task4"),
    ],
    pendingCount: 14,
  };

  const performanceData = {
  approval: 78,
  feedback: 92,
  cases: 4,
  daysRange: 50,
  fields: [
    { key: 'approval', label: t("processor.dashboard.performance.approvalRate"), format: 'percentage' },
    { key: 'feedback', label: t("processor.dashboard.performance.feedbackAccuracy"), format: 'percentage' },
    { key: 'cases', label: t("processor.dashboard.performance.returnedCases"), format: 'number' }
  ]
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
              {t("processor.dashboard.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("processor.dashboard.subtitle")}
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
              roleLabel={t("processor.dashboard.roleLabel")}
              pendingTasksLabel={t("processor.dashboard.pendingTasks")}
            />
          </div>

          {/* Right Column - Performance and Last Login Cards */}
          <div className="space-y-6">
            <PerformanceCard 
              data={performanceData} 
              title={t("processor.dashboard.performance.title")}
              subtitle={t("processor.dashboard.performance.subtitle").replace("{{days}}", String(performanceData.daysRange || 50)) || `Based on the last ${performanceData.daysRange || 50} days.`}
            />

            <LastLoginCard 
              loginTime={lastLoginData.loginTime}
              title={t("processor.dashboard.lastLogin.title")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessorDashboard;
