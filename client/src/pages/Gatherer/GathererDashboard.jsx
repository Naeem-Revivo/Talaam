import { PrimaryButton } from "../../components/common/Button";
import { RoleCard } from "../../components/common/RoleCard";
import { PerformanceCard } from "../../components/gatherer/performanceCard";
import { LastLoginCard } from "../../components/gatherer/LastLogin";

const GathererDashboard = () => {
  const roleData = {
    role: "Gatherer",
    tasks: [
      "Add new questions",
      "Upload bulk questions",
      "Track your submission",
      "Fix rejected questions",
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
              Dashboard
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              Welcome back, John Doe submit question and track your review
              progress.
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
            />
          </div>

          {/* Right Column - Performance and Last Login Cards */}
          <div className="space-y-6">
            <PerformanceCard data={performanceData} />

            <LastLoginCard loginTime={lastLoginData.loginTime} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GathererDashboard;
