import React from "react";
import { useLanguage } from "../../../context/LanguageContext";

export default function PricingPlans() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t("dashboard.subscriptionBilling.pricingPlans.starter.name"),
      price: "9.99",
      currency: t("dashboard.subscriptionBilling.pricingPlans.starter.currency"),
      period: t("dashboard.subscriptionBilling.pricingPlans.starter.period"),
      features: t("dashboard.subscriptionBilling.pricingPlans.starter.features", { returnObjects: true }),
      buttonText: t("dashboard.subscriptionBilling.pricingPlans.starter.buttonText"),
      buttonStyle: "border border-oxford-blue text-[14px] leading-[14px] text-oxford-blue hover:bg-gray-800 hover:text-white",
      isPopular: false,
    },
    {
      name: t("dashboard.subscriptionBilling.pricingPlans.professional.name"),
      price: "24.99",
      currency: t("dashboard.subscriptionBilling.pricingPlans.professional.currency"),
      period: t("dashboard.subscriptionBilling.pricingPlans.professional.period"),
      features: t("dashboard.subscriptionBilling.pricingPlans.professional.features", { returnObjects: true }),
      buttonText: t("dashboard.subscriptionBilling.pricingPlans.professional.buttonText"),
      buttonStyle: "bg-gradient-to-r from-[#ED4122] to-[#FF8B67] font-[14px] leading-[100%] font-bold text-white hover:bg-orange-600",
      isPopular: true,
    },
    {
      name: t("dashboard.subscriptionBilling.pricingPlans.enterprise.name"),
      price: t("dashboard.subscriptionBilling.pricingPlans.enterprise.price"),
      // currency: t("dashboard.subscriptionBilling.pricingPlans.enterprise.currency"),
      period: t("dashboard.subscriptionBilling.pricingPlans.enterprise.period"),
      features: t("dashboard.subscriptionBilling.pricingPlans.enterprise.features", { returnObjects: true }),
      buttonText: t("dashboard.subscriptionBilling.pricingPlans.enterprise.buttonText"),
      buttonStyle: "border border-oxford-blue text-[14px] leading-[14px] text-oxford-blue hover:bg-gray-800 hover:text-white",
      isPopular: false,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-[24px] leading-7 font-semibold text-oxford-blue font-archivo mb-7">
        {t("dashboard.subscriptionBilling.pricingPlans.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((plan, index) => (
          <PlanCard key={index} plan={plan} />
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan }) {
  const { t } = useLanguage();

  return (
    <div
      className={`bg-white rounded-[12px] shadow-[0px_2px_10px_0px_#0327461A] ${
        plan.isPopular
          ? "border-[#E43F21] border"
          : "border-[#D2D2D2] border-[0.5px]"
      } px-6 py-[30px] relative flex flex-col h-full`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-4">
          <span className="bg-[#E43F21] text-[#FBFCFB] text-[14px] leading-[100%] font-normal font-roboto px-[21px] py-1.5 rounded-full">
            {t("dashboard.subscriptionBilling.pricingPlans.mostPopular")}
          </span>
        </div>
      )}

      <div className="mb-[30px]">
        <h3 className="text-[24px] leading-[100%] font-semibold text-oxford-blue font-archivo mb-[30px]">
          {plan.name}
        </h3>
        <div className="flex items-baseline">
          <span
            className={`text-[30px] leading-[100%] font-semibold font-archivo text-orange-dark`}
          >
            {plan.price}
          </span>
          {plan.currency && (
            <>
              <span className="ml-1 text-[20px] leading-[100%] font-semibold font-archivo text-orange-dark">
                {plan.currency}
              </span>
              <span className="text-[20px] leading-[100%] font-semibold font-archivo text-orange-dark">
                / {plan.period}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-5 mb-[30px] flex-grow">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-start">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="11" fill="#ED4122" />
              <path
                d="M8.74959 15C8.74959 15 8.7481 15 8.7466 15C8.54636 14.9992 8.35587 14.919 8.21562 14.7765L5.21582 11.7298C4.92484 11.4343 4.92859 10.9595 5.22407 10.6692C5.51955 10.379 5.99352 10.382 6.2845 10.6775L8.75409 13.1856L15.7197 6.21995C16.0129 5.92668 16.4868 5.92668 16.7801 6.21995C17.0733 6.51247 17.0733 6.988 16.7801 7.28052L9.28056 14.781C9.13956 14.9213 8.94833 15 8.74959 15Z"
                fill="white"
              />
            </svg>

            <span className="ml-[18px] text-[16px] leading-[26px] font-normal text-oxford-blue">{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`w-full py-4 px-4 rounded-lg font-semibold font-archivo text-sm transition-colors ${plan.buttonStyle}`}
      >
        {plan.buttonText}
      </button>
    </div>
  );
}