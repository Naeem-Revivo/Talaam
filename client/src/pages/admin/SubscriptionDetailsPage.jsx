import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const SubscriptionDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const subscription = location.state?.subscription || {
    user: "Sarah Khan",
    email: "sarahkhan@gmail.com",
    plan: "Premium",
    duration: "Monthly",
    renewalDate: "July 15, 2024",
    status: "Active",
    lastPayment: "$19.99 June 24, 2024",
    nextDueDate: "July 15, 2024",
    paymentMethod: "Visa ending in 1234",
  };

  const [formData] = useState({
    currentPlan: subscription.plan || "Premium",
    duration: subscription.duration || "Monthly",
    renewalDate: subscription.renewalDate || "July 15, 2024",
    status: subscription.status || "Active",
  });

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
  };

  const statusBadge = statusBadgeColors[formData.status] || statusBadgeColors.Active;

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[800px] flex-col gap-6">
       

        {/* Main Card */}
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard ">
           {/* Header */}
        <h1 className="font-archivo pb-4 p-6 border-b border-[#E5E7EB] text-[20px] leading-[40px] font-bold text-oxford-blue">
          {t('admin.subscriptionDetails.hero.title')}
        </h1>
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
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">Premium</p>
              </div>
              <div className="flex items-center gap-[290px]">
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.duration')}
                </span>
                <p className="font-roboto text-[16px] font-normal leading-[20px] text-oxford-blue">Monthly</p>
              </div>
              <div className="flex items-center gap-[254px]">
                <span className="font-roboto text-[16px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.renewalDate')}
                </span>
                <p className="font-roboto text-[16px] font-normal  leading-[20px] text-oxford-blue">July 15, 2024</p>
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
                  {t('admin.subscriptionDetails.fields.lastPayment')}
                </span>
                <span className="font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue">
                  {subscription.lastPayment || "$19.99 June 24, 2024"}
                </span>
              </div>
              <div className="flex items-center gap-[260px]">
                <span className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.subscriptionDetails.fields.nextDueDate')}
                </span>
                <span className="font-roboto text-[14px] font-normal leading-[20px] text-oxford-blue">
                  {subscription.nextDueDate || "July 15, 2024"}
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
                    {subscription.paymentMethod || "Visa ending in 1234"}
                  </span>
                </div>
              </div>
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

