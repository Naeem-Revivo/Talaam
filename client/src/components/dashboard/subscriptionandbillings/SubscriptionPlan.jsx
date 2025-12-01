import React from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../common/Button";

export default function SubscriptionPlan() {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <h2 className="text-[24px] leading-7 font-semibold text-oxford-blue font-archivo mb-7">
        {t("dashboard.subscriptionBilling.currentPlan.title")}
      </h2>
      
      <div className="border-[0.5px] border-[#D2D2D2] bg-white shadow-[0px_2px_10px_0px_#0327461A] rounded-[12px] px-4 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-[30px]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-0 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-[24px] leading-[100%] font-archivo font-semibold text-oxford-blue">
              {t("dashboard.subscriptionBilling.currentPlan.planName")}
            </h3>
            <span className="px-[10px] py-[5px] bg-[#FDF0D5] text-orange-dark text-[14px] leading-[100%] font-normal font-roboto rounded-md">
              {t("dashboard.subscriptionBilling.currentPlan.statusActive")}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <OutlineButton 
              text={t("dashboard.subscriptionBilling.currentPlan.cancelSubscription")} 
              className="py-[10px] px-7 text-nowrap"
            />
            <PrimaryButton 
              text={t("dashboard.subscriptionBilling.currentPlan.upgradePlan")} 
              className="py-[10px] px-7 text-nowrap"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-5">
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">{t("dashboard.subscriptionBilling.currentPlan.plan")}</span>
              <span className="ml-2 text-[#6B7280]">{t("dashboard.subscriptionBilling.currentPlan.monthly")}</span>
            </div>
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">{t("dashboard.subscriptionBilling.currentPlan.renewsOn")}</span>
              <span className="ml-2 text-[#6B7280]">12 Jan 2025</span>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">{t("dashboard.subscriptionBilling.currentPlan.access")}</span>
              <span className="ml-2 text-[#6B7280]">{t("dashboard.subscriptionBilling.currentPlan.questionBankAccess")}</span>
            </div>
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">{t("dashboard.subscriptionBilling.currentPlan.autoRenew")}</span>
              <span className="ml-2 text-[#6B7280]">{t("dashboard.subscriptionBilling.currentPlan.on")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}