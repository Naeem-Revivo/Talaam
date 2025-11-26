import { PrimaryButton } from "../../components/common/Button";
import { RoleCard } from "../../components/common/RoleCard";
import { PerformanceCard } from "../../components/gatherer/performanceCard";
import { LastLoginCard } from "../../components/gatherer/LastLogin";

const CreatorDashboard = () => {
  const roleData = {
  role: "Creator",
  tasks: [
    "Create question variants",
    "Improve questions (rewriting)",
    "Submit revised versions",
    "Fix Processor feedback"
  ],
  pendingCount: 14
};

const performanceData = {
  variantCompletionRate: 85,
  sentBackRate: 72,
  approvedVariants: 28,
  daysRange: 50,
  fields: [
    { key: 'variantCompletionRate', label: 'Variant Completion Rate', format: 'percentage' },
    { key: 'sentBackRate', label: 'Sent Back Rate', format: 'percentage' },
    { key: 'approvedVariants', label: 'Approved Variants', format: 'number' }
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
              Creator
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              Welcome back, John Doe create variants, improve questions, and submit refined versions.
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
