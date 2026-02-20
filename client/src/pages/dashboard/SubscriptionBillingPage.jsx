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
    <div className="min-h-screen bg-white px-[32px] pt-6 pb-[60px]">
      <div className="mx-auto flex flex-col gap-10">
        {/* Show SubscriptionPlan only when user has an active subscription */}
        {hasActiveSubscription && <SubscriptionPlan onSubscriptionChange={fetchSubscription} />}
        {/* Show PricingPlans only when user does NOT have an active subscription */}
        {!hasActiveSubscription && !loading && <PricingPlans />}
        <div className="mt-4">
          <h2 className="text-[20px] leading-7 font-bold text-oxford-blue font-archivo mb-5">
            {t("dashboard.subscriptionBilling.billingHistory.title")}
          </h2>
          <BillingHistoryTable />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBillingPage;