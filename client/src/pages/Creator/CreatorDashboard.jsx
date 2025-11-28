import { useLanguage } from "../../context/LanguageContext";
import { RoleCard } from "../../components/common/RoleCard";
import { PerformanceCard } from "../../components/gatherer/performanceCard";
import { LastLoginCard } from "../../components/gatherer/LastLogin";

const CreatorDashboard = () => {
  const { t } = useLanguage();
  const roleData = {
  role: t("creator.dashboard.role"),
  tasks: [
    t("creator.dashboard.tasks.task1"),
    t("creator.dashboard.tasks.task2"),
    t("creator.dashboard.tasks.task3"),
    t("creator.dashboard.tasks.task4")
  ],
  pendingCount: 14
};

const performanceData = {
  variantCompletionRate: 85,
  sentBackRate: 72,
  approvedVariants: 28,
  daysRange: 50,
  fields: [
    { key: 'variantCompletionRate', label: t('creator.dashboard.performance.variantCompletionRate'), format: 'percentage' },
    { key: 'sentBackRate', label: t('creator.dashboard.performance.sentBackRate'), format: 'percentage' },
    { key: 'approvedVariants', label: t('creator.dashboard.performance.approvedVariants'), format: 'number' }
  ]
};

const lastLoginData = {
  loginTime: "Today at 09:05 PM"
};

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <header className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="space-y-6">
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("creator.dashboard.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("creator.dashboard.subtitle")}
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
            />
            
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
