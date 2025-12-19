import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import BillingHistoryTable from "../../components/dashboard/subscriptionandbillings/BillingHistoryTable";
import PricingPlans from "../../components/dashboard/subscriptionandbillings/PricingPlans";
import SubscriptionPlan from "../../components/dashboard/subscriptionandbillings/SubscriptionPlan";
import subscriptionAPI from "../../api/subscription";

const SubscriptionBillingPage = () => {
  const { t } = useLanguage();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await subscriptionAPI.getMySubscription();
      if (response.success && response.data?.subscription) {
        setSubscription(response.data.subscription);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      if (error.response?.status !== 404) {
        console.error('Failed to load subscription');
      }
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has an active subscription
  const hasActiveSubscription = subscription && 
    subscription.paymentStatus === 'Paid' && 
    subscription.isActive;

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
        {/* Show SubscriptionPlan only when user has an active subscription */}
        {hasActiveSubscription && <SubscriptionPlan onSubscriptionChange={fetchSubscription} />}
        {/* Show PricingPlans only when user does NOT have an active subscription */}
        {!hasActiveSubscription && !loading && <PricingPlans />}
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