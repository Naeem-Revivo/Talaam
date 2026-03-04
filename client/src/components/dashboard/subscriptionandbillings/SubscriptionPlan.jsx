import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLanguage } from "../../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../../common/Button";
import { ConfirmationModal } from "../../common/ConfirmationModal";
import subscriptionAPI from "../../../api/subscription";
import paymentAPI from "../../../api/payment";
import { showSuccessToast, showErrorToast, showLogoutToast } from "../../../utils/toastConfig";
import { logout as logoutAction } from "../../../store/slices/authSlice";
import Loader from "../../common/Loader";
import { access, calender, document, renew } from "../../../assets/svg";

export default function SubscriptionPlan({ onSubscriptionChange }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        // Notify parent component of subscription change
        if (onSubscriptionChange) {
          onSubscriptionChange(response.data.subscription);
        }
      } else {
        // No subscription found - component will show empty state
        setSubscription(null);
        // Notify parent component that no subscription exists
        if (onSubscriptionChange) {
          onSubscriptionChange(null);
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // If 404, no subscription exists (this is okay)
      if (error.response?.status !== 404) {
        showErrorToast(error.message || 'Failed to load subscription');
      }
      setSubscription(null);
      // Notify parent component that no subscription exists
      if (onSubscriptionChange) {
        onSubscriptionChange(null);
      }
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
          const updatedSubscription = {
            ...subscription,
            paymentStatus: 'Cancelled',
            isActive: false,
            ...response.data.subscription
          };
          setSubscription(updatedSubscription);
          // Notify parent component of subscription change
          if (onSubscriptionChange) {
            onSubscriptionChange(updatedSubscription);
          }
        }
        // Also refresh subscription data to ensure consistency
        await fetchSubscription();

        // Logout user after successful cancellation
        dispatch(logoutAction());
        showLogoutToast(t('toast.message.logoutSuccess') || 'You have been logged out successfully.', {
          title: t('toast.title.logout') || 'Logout Successful',
          isAuth: true
        });
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
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

    // Check active paid subscription - light green background with dark green text
    if (subscription.paymentStatus === 'Paid' && subscription.isActive) {
      return {
        bg: "bg-[#DCFCE7]",
        text: "text-[#16A34A]",
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
        <div className="bg-[#032746] rounded-[12px] px-6 py-8">
          <h2 className="text-[24px] leading-7 font-semibold text-white font-archivo mb-7">
            {t("dashboard.subscriptionBilling.currentPlan.title")}
          </h2>
          <div className="flex items-center justify-center py-12">
            <Loader size="md" color="white" />
          </div>
        </div>
      </div>
    );
  }

  // If no subscription, show fallback message
  if (!subscription) {
    return (
      <div className="w-full">
        <div className="bg-[#032746] rounded-[12px] px-6 py-8">
          <h2 className="text-[24px] leading-7 font-semibold text-white font-archivo mb-7">
            {t("dashboard.subscriptionBilling.currentPlan.title")}
          </h2>
          <div className="flex items-center justify-center py-12">
            <p className="text-[16px] leading-[100%] font-normal font-roboto text-white/80 text-center">
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
      <div className="bg-gradient-to-br from-[#032746] via-[#0A4B6E] to-[#173B50] rounded-[24px] px-10 py-8">
        {/* Header with title and status badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[14px] leading-[21px] font-normal text-white font-roboto">
              {t("dashboard.subscriptionBilling.currentPlan.title")}
            </h2>
            <div className="flex items-center gap-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 21.0007H19M11.562 3.26666C11.6052 3.18826 11.6686 3.12289 11.7456 3.07736C11.8227 3.03183 11.9105 3.00781 12 3.00781C12.0895 3.00781 12.1773 3.03183 12.2544 3.07736C12.3314 3.12289 12.3948 3.18826 12.438 3.26666L15.39 8.87066C15.4604 9.00042 15.5586 9.11299 15.6777 9.20028C15.7968 9.28756 15.9337 9.34741 16.0786 9.37552C16.2235 9.40362 16.3729 9.39929 16.5159 9.36283C16.659 9.32638 16.7922 9.2587 16.906 9.16466L21.183 5.50066C21.2651 5.43388 21.3663 5.39487 21.472 5.38926C21.5776 5.38364 21.6824 5.4117 21.7711 5.4694C21.8598 5.5271 21.9279 5.61147 21.9657 5.71035C22.0034 5.80923 22.0087 5.91753 21.981 6.01966L19.147 16.2657C19.0891 16.4753 18.9645 16.6604 18.792 16.7929C18.6195 16.9253 18.4085 16.9979 18.191 16.9997H5.81C5.59233 16.9981 5.38111 16.9256 5.20839 16.7932C5.03567 16.6607 4.91089 16.4755 4.853 16.2657L2.02 6.02066C1.99225 5.91853 1.99762 5.81023 2.03534 5.71135C2.07306 5.61247 2.14118 5.5281 2.2299 5.4704C2.31862 5.4127 2.42335 5.38464 2.52904 5.39026C2.63472 5.39587 2.73589 5.43488 2.818 5.50166L7.094 9.16566C7.2078 9.2597 7.341 9.32738 7.48406 9.36383C7.62712 9.40029 7.77647 9.40462 7.9214 9.37652C8.06632 9.34841 8.20323 9.28856 8.32229 9.20127C8.44135 9.11399 8.5396 9.00142 8.61 8.87166L11.562 3.26666Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <h3 className="text-[20px] leading-[28px] font-bold font-archivo text-white">
                {subscription.planName || t("dashboard.subscriptionBilling.currentPlan.planName")}
              </h3>
            </div>

          </div>
          {statusBadge && (
            <span className={`px-[10px] py-[5px] ${statusBadge.bg} ${statusBadge.text} text-[14px] leading-[100%] font-normal font-roboto rounded-full w-fit`}>
              {statusBadge.label}
            </span>
          )}
        </div>

        {/* Plan Details - Horizontal Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Plan Type */}
          <div className="flex items-center gap-3">
            <img src={document} alt="access" className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-[14px] leading-[21px] font-normal font-roboto text-[#E5E5E5]">
                {t("dashboard.subscriptionBilling.currentPlan.planType") || "Plan Type"}
              </span>
              <span className="text-[16px] leading-[24px] font-medium font-roboto text-white mt-1">
                {getPlanDuration()}
              </span>
            </div>
          </div>

          {/* Renews On */}
          <div className="flex items-center gap-3">
            <img src={calender} alt="access" className="w-10 h-10" /> 
            <div className="flex flex-col">
              <span className="text-[14px] leading-[21px] font-normal font-roboto text-[#E5E5E5]">
                {t("dashboard.subscriptionBilling.currentPlan.renewsOn") || "Renews On"}
              </span>
              <span className="text-[16px] leading-[24px] font-medium font-roboto text-white mt-1">
                {formatDate(subscription.expiryDate)}
              </span>
            </div>
          </div>

          {/* Access Level */}
          <div className="flex items-center gap-3">
            <img src={access} alt="access" className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-[14px] leading-[21px] font-normal font-roboto text-[#E5E5E5]">
                {t("dashboard.subscriptionBilling.currentPlan.accessLevel") || "Access Level"}
              </span>
              <span className="text-[16px] leading-[24px] font-medium font-roboto text-white mt-1">
                {t("dashboard.subscriptionBilling.currentPlan.questionBankAccess") || "Question Bank Access"}
              </span>
            </div>
          </div>

          {/* Auto-Renew */}
          <div className="flex items-center gap-3">
            <img src={renew} alt="access" className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-[14px] leading-[21px] font-normal font-roboto text-[#E5E5E5]">
                {t("dashboard.subscriptionBilling.currentPlan.autoRenew") || "Auto-Renew"}
              </span>
              <span className={`text-[16px] leading-[24px] font-medium font-roboto mt-1 ${subscription.paymentStatus === 'Paid' && subscription.isActive
                  ? "text-[#10B981]"
                  : "text-white"
                }`}>
                {subscription.paymentStatus === 'Paid' && subscription.isActive
                  ? (t("dashboard.subscriptionBilling.currentPlan.enabled") || "Enabled")
                  : (t("dashboard.subscriptionBilling.currentPlan.disabled") || "Disabled")
                }
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
          <button
            onClick={handleRenew}
            disabled={!canRenew || isRenewing}
            className="bg-gradient-to-l from-[#DC2626] to-[#ED4122] w-[320px] text-white px-6 py-3 rounded-md text-[16px] font-roboto font-medium leading-[16px] transition hover:bg-[#d43a1f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("dashboard.subscriptionBilling.currentPlan.upgradePlan") || "Upgrade Plan"}
          </button>
          <button
            onClick={handleCancelClick}
            disabled={!canCancel || isCancelling}
            className="text-white text-[16px] font-roboto font-normal leading-[16px] hover:underline transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("dashboard.subscriptionBilling.currentPlan.cancelSubscription") || "Cancel Subscription"}
          </button>
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