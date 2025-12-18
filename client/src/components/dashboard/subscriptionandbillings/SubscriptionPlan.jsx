import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../common/Button";
import { ConfirmationModal } from "../../common/ConfirmationModal";
import subscriptionAPI from "../../../api/subscription";
import paymentAPI from "../../../api/payment";
import { showSuccessToast, showErrorToast } from "../../../utils/toastConfig";
import Loader from "../../common/Loader";

export default function SubscriptionPlan() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

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
        // No subscription found - component will show empty state
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // If 404, no subscription exists (this is okay)
      if (error.response?.status !== 404) {
        showErrorToast(error.message || 'Failed to load subscription');
      }
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (subscription && subscription.paymentStatus === 'Paid' && subscription.isActive) {
      setIsModalOpen(true);
    } else {
      showErrorToast('Only active paid subscriptions can be cancelled');
    }
  };

  const handleConfirmCancel = async () => {
    if (!subscription?.id) return;

    try {
      setIsCancelling(true);
      const response = await subscriptionAPI.cancelSubscription(subscription.id);
      
      if (response.success) {
        showSuccessToast('Subscription cancelled successfully');
        // Update subscription state immediately with cancelled status
        if (response.data?.subscription) {
          setSubscription(prev => ({
            ...prev,
            paymentStatus: 'Cancelled',
            isActive: false,
            ...response.data.subscription
          }));
        }
        // Also refresh subscription data to ensure consistency
        await fetchSubscription();
      } else {
        showErrorToast(response.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      showErrorToast(error.response?.data?.message || error.message || 'Failed to cancel subscription');
    } finally {
      setIsCancelling(false);
      setIsModalOpen(false);
    }
  };

  const handleRenew = async () => {
    if (!subscription?.id) return;

    // Check if subscription is eligible for renewal
    if (subscription.paymentStatus !== 'Paid' || !subscription.isActive) {
      showErrorToast('Only active paid subscriptions can be renewed');
      return;
    }

    try {
      setIsRenewing(true);
      const response = await subscriptionAPI.renewSubscription(subscription.id);
      
      if (response.success && response.data?.subscription) {
        showSuccessToast('Renewal subscription created. Redirecting to payment...');
        // Initiate payment for the renewal
        const renewalSubscriptionId = response.data.subscription.id;
        const paymentResponse = await paymentAPI.initiateMoyassarPayment(renewalSubscriptionId);
        
        if (paymentResponse.success && paymentResponse.data?.paymentUrl) {
          // Redirect to payment page
          window.location.href = paymentResponse.data.paymentUrl;
        } else {
          showErrorToast('Renewal created but failed to initiate payment. Please try again.');
          // Refresh subscription data
          await fetchSubscription();
        }
      } else {
        showErrorToast(response.message || 'Failed to renew subscription');
      }
    } catch (error) {
      console.error('Error renewing subscription:', error);
      showErrorToast(error.response?.data?.message || error.message || 'Failed to renew subscription');
    } finally {
      setIsRenewing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get plan duration from subscription (if available) or default to monthly
  const getPlanDuration = () => {
    // Use planDuration from API if available
    if (subscription?.planDuration) {
      const duration = subscription.planDuration;
      if (duration === 'Annual' || duration === 'Yearly') {
        return t("dashboard.subscriptionBilling.currentPlan.annual") || "Annual";
      } else if (duration === 'Quarterly') {
        return t("dashboard.subscriptionBilling.currentPlan.quarterly") || "Quarterly";
      } else if (duration === 'Semi-Annual') {
        return t("dashboard.subscriptionBilling.currentPlan.semiAnnual") || "Semi-Annual";
      } else if (duration === 'Monthly') {
        return t("dashboard.subscriptionBilling.currentPlan.monthly") || "Monthly";
      }
    }
    
    // Fallback: Try to infer from plan name
    if (subscription?.planName) {
      const planName = subscription.planName.toLowerCase();
      if (planName.includes('annual') || planName.includes('year')) {
        return t("dashboard.subscriptionBilling.currentPlan.annual") || "Annual";
      } else if (planName.includes('quarterly') || planName.includes('quarter')) {
        return t("dashboard.subscriptionBilling.currentPlan.quarterly") || "Quarterly";
      } else if (planName.includes('semi-annual') || planName.includes('semi annual')) {
        return t("dashboard.subscriptionBilling.currentPlan.semiAnnual") || "Semi-Annual";
      }
    }
    
    return t("dashboard.subscriptionBilling.currentPlan.monthly") || "Monthly";
  };

  // Get status badge color based on subscription status
  const getStatusBadge = () => {
    if (!subscription) return null;
    
    // Check cancelled status first (highest priority)
    if (subscription.paymentStatus === 'Cancelled') {
      return {
        bg: "bg-[#FEF2F2]",
        text: "text-[#EF4444]",
        label: t("dashboard.subscriptionBilling.currentPlan.statusCancelled") || "Cancelled"
      };
    }
    
    // Check active paid subscription
    if (subscription.paymentStatus === 'Paid' && subscription.isActive) {
      return {
        bg: "bg-[#FDF0D5]",
        text: "text-orange-dark",
        label: t("dashboard.subscriptionBilling.currentPlan.statusActive") || "Active"
      };
    }
    
    // Check pending status
    if (subscription.paymentStatus === 'Pending') {
      return {
        bg: "bg-[#EFF6FF]",
        text: "text-[#3B82F6]",
        label: t("dashboard.subscriptionBilling.currentPlan.statusPending") || "Pending"
      };
    }
    
    // Default to inactive
    return {
      bg: "bg-[#F3F4F6]",
      text: "text-[#6B7280]",
      label: t("dashboard.subscriptionBilling.currentPlan.statusInactive") || "Inactive"
    };
  };

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-[24px] leading-7 font-semibold text-oxford-blue font-archivo mb-7">
          {t("dashboard.subscriptionBilling.currentPlan.title")}
        </h2>
        <div className="flex items-center justify-center py-12">
          <Loader size="md" color="oxford-blue" />
        </div>
      </div>
    );
  }

  // If no subscription, show fallback message
  if (!subscription) {
    return (
      <div className="w-full">
        <h2 className="text-[24px] leading-7 font-semibold text-oxford-blue font-archivo mb-7">
          {t("dashboard.subscriptionBilling.currentPlan.title")}
        </h2>
        <div className="border-[0.5px] border-[#D2D2D2] bg-white shadow-[0px_2px_10px_0px_#0327461A] rounded-[12px] px-4 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-[30px]">
          <div className="flex items-center justify-center py-12">
            <p className="text-[16px] leading-[100%] font-normal font-roboto text-[#6B7280] text-center">
              {t("dashboard.subscriptionBilling.currentPlan.noPlanAvailable") || "No subscription plan available"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge();
  const canCancel = subscription.paymentStatus === 'Paid' && subscription.isActive;
  const canRenew = subscription.paymentStatus === 'Paid' && subscription.isActive;

  return (
    <div className="w-full">
      <h2 className="text-[24px] leading-7 font-semibold text-oxford-blue font-archivo mb-7">
        {t("dashboard.subscriptionBilling.currentPlan.title")}
      </h2>
      
      <div className="border-[0.5px] border-[#D2D2D2] bg-white shadow-[0px_2px_10px_0px_#0327461A] rounded-[12px] px-4 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-[30px]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-0 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-[24px] leading-[100%] font-archivo font-semibold text-oxford-blue">
              {subscription.planName || t("dashboard.subscriptionBilling.currentPlan.planName")}
            </h3>
            {statusBadge && (
              <span className={`px-[10px] py-[5px] ${statusBadge.bg} ${statusBadge.text} text-[14px] leading-[100%] font-normal font-roboto rounded-md`}>
                {statusBadge.label}
            </span>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <OutlineButton 
              text={t("dashboard.subscriptionBilling.currentPlan.cancelSubscription")} 
              className="py-[10px] px-7 text-nowrap"
              onClick={handleCancelClick}
              disabled={!canCancel || isCancelling}
            />
            <PrimaryButton 
              text={t("dashboard.subscriptionBilling.currentPlan.renewPlan") || t("dashboard.subscriptionBilling.currentPlan.upgradePlan")} 
              className="py-[10px] px-7 text-nowrap"
              onClick={handleRenew}
              disabled={!canRenew || isRenewing}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-5">
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">{t("dashboard.subscriptionBilling.currentPlan.plan")}</span>
              <span className="ml-2 text-[#6B7280]">{getPlanDuration()}</span>
            </div>
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">{t("dashboard.subscriptionBilling.currentPlan.renewsOn")}</span>
              <span className="ml-2 text-[#6B7280]">{formatDate(subscription.expiryDate)}</span>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">{t("dashboard.subscriptionBilling.currentPlan.access")}</span>
              <span className="ml-2 text-[#6B7280]">{t("dashboard.subscriptionBilling.currentPlan.questionBankAccess")}</span>
            </div>
            <div className="flex items-center text-[16px] leading-[100%] font-normal font-roboto">
              <span className="text-oxford-blue">{t("dashboard.subscriptionBilling.currentPlan.autoRenew")}</span>
              <span className="ml-2 text-[#6B7280]">
                {subscription.paymentStatus === 'Paid' && subscription.isActive 
                  ? (t("dashboard.subscriptionBilling.currentPlan.on") || "On")
                  : (t("dashboard.subscriptionBilling.currentPlan.off") || "Off")
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title={t("dashboard.subscriptionBilling.currentPlan.cancelModalTitle") || "Cancel Subscription"}
        message={t("dashboard.subscriptionBilling.currentPlan.cancelModalMessage") || `Are you sure you want to cancel your "${subscription.planName}" subscription?`}
        subMessage={t("dashboard.subscriptionBilling.currentPlan.cancelModalSubMessage") || "This action cannot be undone. Your subscription will remain active until the end of the current billing period."}
        confirmText={t("dashboard.subscriptionBilling.currentPlan.cancelConfirm") || "Cancel Subscription"}
        cancelText={t("dashboard.subscriptionBilling.currentPlan.cancelCancel") || "Keep Subscription"}
      />
    </div>
  );
}