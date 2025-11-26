export default function PricingPlans() {
  const plans = [
    {
      name: "Starter Plan",
      price: "9.99",
      currency: "SAR",
      period: "month",
      features: [
        "Access to Question Bank",
        "50 Question per month",
        "Basic analytics",
        "Email support",
      ],
      buttonText: "SUBSCRIBE NOW",
      buttonStyle:
        "border border-oxford-blue text-[14px] leading-[14px]  text-oxford-blue hover:bg-gray-800 hover:text-white",
      isPopular: false,
    },
    {
      name: "Professional Plan",
      price: "24.99",
      currency: "SAR",
      period: "month",
      features: [
        "Unlimited access",
        "Variants & explanations",
        "Export features",
        "Priority support",
      ],
      buttonText: "CURRENT PLAN",
      buttonStyle: " bg-gradient-to-r from-[#ED4122] to-[#FF8B67] font-[14px] leading-[100%] font-bold text-white hover:bg-orange-600",
      isPopular: true,
    },
    {
      name: "Enterprise Plan",
      price: "Custom",
      currency: "",
      period: "",
      features: [
        "Multi-user license",
        "Bulk upload features",
        "Admin dashboard",
        "24/7 dedicated support",
      ],
      buttonText: "CONTACT SALES",
      buttonStyle:
        "border border-oxford-blue text-[14px] leading-[14px]  text-oxford-blue hover:bg-gray-800 hover:text-white",
      isPopular: false,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-[24px] leading-7 font-semibold text-oxford-blue font-archivo mb-7">
        Choose the Right Plan for You
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
            Most Popular
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
              <span className="text-[20px] leading-[100%] font-semibold font-archivo text-orange-dark">
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
