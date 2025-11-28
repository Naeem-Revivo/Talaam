import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import BillingHistoryTable from "../../components/dashboard/subscriptionandbillings/BillingHistoryTable";
import PricingPlans from "../../components/dashboard/subscriptionandbillings/PricingPlans";
import SubscriptionPlan from "../../components/dashboard/subscriptionandbillings/SubscriptionPlan";

const SubscriptionBillingPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-8 py-6 2xl:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="space-y-6">
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t("dashboard.subscriptionBilling.hero.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("dashboard.subscriptionBilling.hero.subtitle")}
            </p>
          </div>
        </header>
        <SubscriptionPlan />
        <PricingPlans />
        <div>
          <h2 className="text-[24px] leading-7 font-semibold text-oxford-blue font-archivo mb-7">
            {t("dashboard.subscriptionBilling.billingHistory.title")}
          </h2>
          <BillingHistoryTable />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBillingPage;