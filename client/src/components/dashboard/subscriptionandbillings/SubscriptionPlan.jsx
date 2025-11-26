import { OutlineButton, PrimaryButton } from "../../common/Button";

export default function SubscriptionPlan() {
  return (
    <div className="w-full">
      <h2 className="text-[24px] leading-7 font-semibold text-oxford-blue font-archivo mb-7">Your Current Plan</h2>
      
      <div className="border-[0.5px] border-[#D2D2D2] bg-white shadow-[0px_2px_10px_0px_#0327461A] rounded-[12px] px-4 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-[30px]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-0 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-[24px] leading-[100%] font-archivo font-semibold text-oxford-blue">Professional Plan</h3>
            <span className="px-[10px] py-[5px] bg-[#FDF0D5] text-orange-dark text-[14px] leading-[100%] font-normal font-roboto rounded-md">
              Active
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <OutlineButton text="Cancel Subscription" className="py-[10px] px-7 text-nowrap"/>
            <PrimaryButton text="Upgrade Plan" className="py-[10px] px-7 text-nowrap"/>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-5">
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">Plan:</span>
              <span className="ml-2 text-[#6B7280]">Monthly</span>
            </div>
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">Renews on:</span>
              <span className="ml-2 text-[#6B7280]">12 Jan 2025</span>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">Access:</span>
              <span className="ml-2 text-[#6B7280]">Question Bank Access</span>
            </div>
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">Auto-Renew:</span>
              <span className="ml-2 text-[#6B7280]">On</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}