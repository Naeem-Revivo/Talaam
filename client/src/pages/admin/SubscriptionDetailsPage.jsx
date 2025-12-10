import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import adminAPI from "../../api/admin";
import paymentAPI from "../../api/payment";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig";

const SubscriptionDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [formData, setFormData] = useState({
    currentPlan: "",
    duration: "",
    renewalDate: "",
    status: "",
  });

  // Get subscription ID from URL params or location state
  const subscriptionId = searchParams.get('id') || location.state?.subscriptionId || location.state?.subscription?.id;

  useEffect(() => {
    if (subscriptionId) {
      fetchSubscriptionDetails();
    } else {
      showErrorToast("Subscription ID is required");
      navigate("/admin/subscriptions/manage-users");
    }
  }, [subscriptionId]);

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSubscriptionDetails(subscriptionId);
      
      if (response.success && response.data) {
        // Handle nested response structure from backend
        const sub = response.data.subscription || response.data;
        const userInfo = sub.userInfo || sub.user || {};
        const planInfo = sub.planInfo || sub.plan || {};
        const billingInfo = sub.billingInfo || {};
        
        // Format dates
        const formatDate = (dateString) => {
          if (!dateString) return "N/A";
          const date = new Date(dateString);
          return date.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          });
        };

        // Get subscription details (may be nested)
        const subscriptionDetails = sub.subscriptionDetails || sub;
        const startDate = formatDate(subscriptionDetails.startDate || sub.startDate);
        const expiryDate = formatDate(subscriptionDetails.expiryDate || sub.expiryDate);
        const renewalDate = planInfo.renewalDate || expiryDate;

        // Determine status
        let status = planInfo.status || subscriptionDetails.status || sub.paymentStatus || "Pending";
        const paymentStatus = subscriptionDetails.paymentStatus || sub.paymentStatus || "Pending";
        const isActive = subscriptionDetails.isActive !== undefined ? subscriptionDetails.isActive : (sub.isActive || false);
        
        if (isActive && paymentStatus === "Paid") {
          status = "Active";
        } else if (!isActive || (expiryDate !== "N/A" && new Date(subscriptionDetails.expiryDate || sub.expiryDate) < new Date())) {
          status = "Expired";
        } else if (paymentStatus === "Pending") {
          status = "Pending";
        }

        // Format payment method
        let paymentMethod = billingInfo.paymentMethod || "N/A";
        if (paymentMethod === "Not set" || paymentMethod === "N/A") {
          if (sub.paymentMethod === "moyassar") {
            paymentMethod = "Moyassar";
            if (sub.moyassarPaymentId) {
              paymentMethod += ` (${sub.moyassarPaymentId.substring(0, 8)}...)`;
            }
          } else if (sub.paymentMethod) {
            paymentMethod = sub.paymentMethod;
          }
        }

        // Format last payment
        let lastPayment = billingInfo.lastPayment || "N/A";
        if (lastPayment === "N/A" && paymentStatus === "Paid") {
          const planPrice = planInfo.price || sub.plan?.price || 0;
          const paymentDate = formatDate(subscriptionDetails.startDate || sub.startDate || sub.createdAt);
          lastPayment = `$${parseFloat(planPrice).toFixed(2)} ${paymentDate}`;
        }

        const subscriptionData = {
          id: sub.id,
          user: userInfo.name || userInfo.fullName || sub.user?.name || sub.user?.fullName || sub.userName || "N/A",
          email: userInfo.email || sub.user?.email || "N/A",
          plan: planInfo.currentPlan || planInfo.name || sub.plan?.name || sub.planName || "N/A",
          duration: planInfo.duration || sub.plan?.duration || "N/A",
          renewalDate: renewalDate,
          expiryDate: expiryDate,
          startDate: startDate,
          status: status,
          paymentStatus: paymentStatus,
          isActive: isActive,
          lastPayment: lastPayment,
          nextDueDate: billingInfo.nextDueDate || expiryDate,
          paymentMethod: paymentMethod,
          transactionId: subscriptionDetails.transactionId || sub.transactionId || sub.moyassarPaymentId || "N/A",
          moyassarPaymentStatus: subscriptionDetails.moyassarPaymentStatus || sub.moyassarPaymentStatus || "N/A",
          price: planInfo.price || sub.plan?.price || 0,
        };

        setSubscription(subscriptionData);
        setFormData({
          currentPlan: subscriptionData.plan,
          duration: subscriptionData.duration,
          renewalDate: subscriptionData.renewalDate,
          status: subscriptionData.status,
        });

        // Auto-sync payment status if it's Pending and has Moyassar payment ID
        if (subscriptionData.paymentStatus === "Pending" && 
            subscriptionData.transactionId && 
            subscriptionData.transactionId !== "N/A") {
          // Auto-sync in background (don't show loading, just update silently)
          setTimeout(() => {
            syncPaymentStatusSilently(subscriptionData.id);
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error fetching subscription details:", error);
      showErrorToast(error.message || "Failed to fetch subscription details");
      navigate("/admin/subscriptions/manage-users");
    } finally {
      setLoading(false);
    }
  };

  const syncPaymentStatusSilently = async (subId) => {
    try {
      const response = await adminAPI.syncSubscriptionPayment(subId);
      if (response.success && response.data?.subscription) {
        // Refresh subscription details silently
        await fetchSubscriptionDetails();
      }
    } catch (error) {
      console.error("Error auto-syncing payment:", error);
      // Don't show error for silent sync
    }
  };

  const handleSyncPayment = async () => {
    if (!subscription?.id) return;
    
    try {
      setSyncing(true);
      const response = await adminAPI.syncSubscriptionPayment(subscription.id);
      
      if (response.success) {
        showSuccessToast(response.message || "Payment status synced successfully");
        // Refresh subscription details
        await fetchSubscriptionDetails();
      } else {
        showErrorToast(response.message || "Failed to sync payment status");
      }
    } catch (error) {
      console.error("Error syncing payment:", error);
      showErrorToast(error.message || "Failed to sync payment status");
    } finally {
      setSyncing(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/subscriptions/manage-users");
  };

  const handleSave = () => {
    // TODO: Add API call to save subscription changes
    console.log("Saving subscription changes:", formData);
    navigate("/admin/subscriptions/manage-users");
  };

  const statusBadgeColors = {
    Active: { bg: "bg-[#FDF0D5]", text: "text-[#ED4122]" },
    Inactive: { bg: "bg-[#C6D8D3]", text: "text-oxford-blue" },
    Expired: { bg: "bg-[#C6D8D3]", text: "text-oxford-blue" },
    Paid: { bg: "bg-[#FDF0D5]", text: "text-[#ED4122]" },
    Pending: { bg: "bg-[#C6D8D3]", text: "text-oxford-blue" },
  };

  const statusBadge = statusBadgeColors[formData.status] || statusBadgeColors[subscription?.paymentStatus] || statusBadgeColors.Active;

  if (loading) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED4122] mx-auto mb-4"></div>
          <p className="text-oxford-blue font-roboto text-[16px]">
            {t('admin.subscriptionDetails.loading') || 'Loading subscription details...'}
          </p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
        <div className="mx-auto flex max-w-[800px] flex-col gap-6">
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard p-8 text-center">
            <p className="text-oxford-blue font-roboto text-[16px]">
              {t('admin.subscriptionDetails.notFound') || 'Subscription not found'}
            </p>
            <button
              onClick={() => navigate("/admin/subscriptions/manage-users")}
              className="mt-4 h-[40px] rounded-[8px] bg-[#ED4122] px-6 font-roboto text-[16px] font-medium leading-[20px] text-white transition hover:bg-[#d43a1f]"
            >
              {t('admin.subscriptionDetails.buttons.back') || 'Back to Subscriptions'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[800px] flex-col gap-6">
        {/* Main Card */}
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard ">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 p-6 border-b border-[#E5E7EB]">
            <h1 className="font-archivo text-[20px] leading-[40px] font-bold text-oxford-blue">
              {t('admin.subscriptionDetails.hero.title') || 'Subscription Details'}
            </h1>
            <button
              onClick={() => navigate("/admin/subscriptions/manage-users")}
              className="text-oxford-blue hover:text-[#ED4122] transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          {/* User Info Section */}
          <div className="px-6 py-8 border-b border-[#E5E7EB]">
            <h2 className="mb-4 font-roboto text-[16px] font-medium leading-[100%] text-oxford-blue">
              {t('admin.subscriptionDetails.sections.userInfo')}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-[300px]">
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.name')}
                </span>
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                  {subscription.user}
                </span>
              </div>
              <div className="flex items-center gap-[300px]">
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.email')}
                </span>
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">
                  {subscription.email}
                </span>
              </div>
            </div>
          </div>

          {/* Plan Info Section */}
          <div className="px-6 py-8 border-b border-[#E5E7EB]">
            <h2 className="mb-4 font-roboto text-[16px] font-medium leading-[100%] text-oxford-blue">
              {t('admin.subscriptionDetails.sections.planInfo')}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-[265px]">
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.currentPlan')}
                </span>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">{subscription.plan}</p>
              </div>
              <div className="flex items-center gap-[290px]">
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.duration')}
                </span>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">{subscription.duration}</p>
              </div>
              <div className="flex items-center gap-[254px]">
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.startDate') || 'Start Date'}
                </span>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">{subscription.startDate}</p>
              </div>
              <div className="flex items-center gap-[254px]">
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.renewalDate')}
                </span>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">{subscription.renewalDate}</p>
              </div>
              <div className="flex items-center gap-[254px]">
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.expiryDate') || 'Expiry Date'}
                </span>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">{subscription.expiryDate}</p>
              </div>
              <div className="flex items-center gap-[204px]">
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.status')}
                </span>
                <span
                  className={`inline-flex h-[26px] ml-24 items-center justify-center rounded-[6px] py-[5px] px-[10px] font-roboto text-[14px] font-normal leading-[100%] tracking-[0%] ${statusBadge.bg} ${statusBadge.text}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {formData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Billing Info Section */}
          <div className="px-6 py-8 border-b border-[#E5E7EB]">
            <h2 className="mb-4 font-archivo text-[20px] font-bold leading-[100%] text-oxford-blue">
              {t('admin.subscriptionDetails.sections.billingInfo')}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-[265px]">
                <span className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.paymentStatus') || 'Payment Status'}
                </span>
                <span
                  className={`inline-flex h-[26px] items-center justify-center rounded-[6px] py-[5px] px-[10px] font-roboto text-[14px] font-normal leading-[100%] tracking-[0%] ${
                    subscription.paymentStatus === 'Paid' 
                      ? 'bg-[#FDF0D5] text-[#ED4122]' 
                      : 'bg-[#C6D8D3] text-oxford-blue'
                  }`}
                >
                  {subscription.paymentStatus}
                </span>
              </div>
              <div className="flex items-center gap-[265px]">
                <span className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.lastPayment')}
                </span>
                <span className="font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue">
                  {subscription.lastPayment}
                </span>
              </div>
              <div className="flex items-center gap-[260px]">
                <span className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.nextDueDate')}
                </span>
                <span className="font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue">
                  {subscription.nextDueDate}
                </span>
              </div>
              <div className="flex items-center gap-[243px]">
                <span className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.paymentMethod')}
                </span>
                <div className="flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="1"
                      y="4"
                      width="22"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line
                      x1="1"
                      y1="10"
                      x2="23"
                      y2="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue">
                    {subscription.paymentMethod}
                  </span>
                </div>
              </div>
              {subscription.transactionId && subscription.transactionId !== "N/A" && (
                <div className="flex items-center gap-[243px]">
                  <span className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.subscriptionDetails.fields.transactionId') || 'Transaction ID'}
                  </span>
                  <span className="font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue font-mono">
                    {subscription.transactionId}
                  </span>
                </div>
              )}
              {subscription.moyassarPaymentStatus && subscription.moyassarPaymentStatus !== "N/A" && (
                <div className="flex items-center gap-[243px]">
                  <span className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray">
                    {t('admin.subscriptionDetails.fields.moyassarStatus') || 'Moyassar Status'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue capitalize">
                      {subscription.moyassarPaymentStatus}
                    </span>
                    {subscription.paymentStatus === "Pending" && subscription.moyassarPaymentId && (
                      <button
                        onClick={handleSyncPayment}
                        disabled={syncing}
                        className="ml-2 px-3 py-1 text-xs bg-[#ED4122] text-white rounded hover:bg-[#d43a1f] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t('admin.subscriptionDetails.actions.syncPayment') || 'Sync Payment Status from Moyassar'}
                      >
                        {syncing ? t('admin.subscriptionDetails.actions.syncing') || 'Syncing...' : t('admin.subscriptionDetails.actions.syncPayment') || 'Sync'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subscription Management Actions */}
          <div className="p-6 border-t border-[#E5E7EB] pt-6">
            <div className="space-y-3">
              <button
                type="button"
                className="flex w-full items-center gap-2 font-roboto text-[16px] font-medium leading-[20px] text-oxford-blue transition hover:text-[#ED4122]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                {t('admin.subscriptionDetails.actions.upgradeDowngrade')}
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 font-roboto text-[16px] font-medium leading-[20px] text-[#6CA6C1] transition hover:text-[#d43a1f]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {t('admin.subscriptionDetails.actions.cancelSubscription')}
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 font-roboto text-[16px] font-medium leading-[20px] text-oxford-blue transition hover:text-[#ED4122]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
                {t('admin.subscriptionDetails.actions.renewalManually')}
              </button>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 py-6 mr-10">
            <button
              type="button"
              onClick={handleCancel}
              className="h-[40px] rounded-[8px] border border-[#E5E7EB] bg-white px-6 font-roboto text-[16px] font-medium leading-[20px] text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              {t('admin.subscriptionDetails.buttons.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-[40px] rounded-[8px] bg-[#ED4122] px-6 font-roboto text-[16px] font-medium leading-[20px] text-white transition hover:bg-[#d43a1f]"
            >
              {t('admin.subscriptionDetails.buttons.saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsPage;

