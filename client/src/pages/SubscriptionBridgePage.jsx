import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { book, add, feature, lock, arrowup, tick } from "../assets/svg";
import { useLanguage } from "../context/LanguageContext";
import plansAPI from "../api/plans";
import subscriptionAPI from "../api/subscription";
import Loader from "../components/common/Loader";

const SubscriptionBridgePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [error, setError] = useState(null);

  // Check subscription status first - this is the bridge logic
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setCheckingSubscription(true);
        const response = await subscriptionAPI.getMySubscription();
        if (response.success && response.data?.subscription) {
          const sub = response.data.subscription;
          const isActive =
            sub.isActive === true &&
            sub.paymentStatus === "Paid" &&
            new Date(sub.expiryDate) > new Date();
          
          if (isActive) {
            // User has active subscription - redirect to dashboard
            setHasActiveSubscription(true);
            navigate("/dashboard", { replace: true });
            return;
          }
        }
        // No active subscription - stay on page to show plans
        setHasActiveSubscription(false);
      } catch (err) {
        console.error("Error checking subscription:", err);
        // If error (e.g., no subscription), stay on page to show plans
        setHasActiveSubscription(false);
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [navigate]);

  // Load plans
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await plansAPI.getAllPlans({ status: "active" });
        if (response.success && response.data?.plans) {
          setPlans(response.data.plans);
        } else {
          setPlans([]);
        }
      } catch (err) {
        console.error("Error loading plans:", err);
        setError(err.message || "Failed to load plans");
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleSubscribe = (planId) => {
    if (!planId) return;
    // User is authenticated (they reached this page), so go directly to payment
    navigate(`/moyassar-payment?planId=${planId}`);
  };

  const exams = [
    {
      id: 1,
      name: t("questionBanks.exams.moreExamsComingSoon"),
      icon: add,
      isPlaceholder: true,
    },
    {
      id: 2,
      name: t("questionBanks.exams.advancedFeatures"),
      icon: feature,
      isPlaceholder: true,
    },
  ];

  // Show loading while checking subscription
  if (checkingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text={t("dashboard.loading") || "Checking subscription..."} />
      </div>
    );
  }

  return (
    <>
      {/* Title and Subtitle */}
      <div className="w-full h-auto md:h-auto lg:h-[277px] bg-soft-orange-fade flex items-center justify-center py-8 md:py-10 lg:py-0">
        <div className="text-center px-4 md:px-6 lg:px-0">
          <h1 className="text-oxford-blue font-archivo font-bold text-[32px] md:text-[50px] lg:text-[70px] leading-[120%] md:leading-[105%] lg:leading-[91px] tracking-[0] align-middle">
            {t("questionBanks.hero.title")}
          </h1>
          <p className="font-roboto font-normal text-[14px] md:text-[15px] lg:text-[16px] leading-[140%] md:leading-[130%] lg:leading-[25.6px] tracking-[0] align-middle text-oxford-blue mt-2 px-4 md:px-8 lg:px-0">
            {t("questionBanks.hero.subtitle")}
          </p>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="w-full h-auto lg:h-[898px] bg-soft-blue-green flex flex-col items-center gap-8 justify-center py-8 md:py-10 lg:py-12 pr-0 md:pr-6 lg:pr-10 px-4 md:px-6 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-x-[145px] lg:gap-y-[30px] max-w-full lg:max-w-[1280px]">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader size="md" text={t("dashboard.loading") || "Loading..."} />
            </div>
          ) : plans.length === 0 ? (
            <div className="col-span-full text-center text-oxford-blue font-roboto">
              {error ? error : t("questionBanks.exams.moreExamsComingSoon")}
            </div>
          ) : (
            plans.map((plan) => {
              const statusText = t("questionBanks.exams.notSubscribed");
              const buttonText = t("questionBanks.exams.upgradeToAccess");
              const statusColor = "bg-[#FDF0D5]";
              const textColor = "text-orange-dark";
              const statusIcon = lock;
              const statusIconBg = "bg-orange-dark";
              const icon = plan.icon || book;
              const iconBgColor = "bg-oxford-blue";

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-[352px] md:w-full lg:w-[610px] h-[174px] md:h-auto lg:h-[248px] mx-auto md:mx-0"
                >
                  <div className="w-full h-full p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center">
                    <>
                      {/* Top Section - Icon, Title, Status */}
                      <div className="flex items-center justify-between mb-7 md:mb-auto lg:mb-auto w-full lg:w-[530px] pt-2 md:pt-4 lg:pt-5 gap-2 lg:gap-0">
                        <div className="flex items-center gap-3 md:gap-6 lg:gap-7 flex-1 min-w-0">
                          <div
                            className={`${iconBgColor} rounded-xl flex items-center justify-center flex-shrink-0 w-10 h-10 md:w-14 md:h-14 lg:w-auto lg:h-auto p-1.5 md:p-3 lg:p-0`}
                          >
                            <img src={icon} alt={plan.name} className="w-5 h-5 md:w-7 md:h-7 lg:w-auto lg:h-auto" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <h3 className="text-oxford-blue font-bold text-[16px] md:text-[20px] lg:text-2xl truncate">
                              {plan.name}
                            </h3>
                            <span className="text-dark-gray font-roboto text-sm md:text-base">
                              {plan.price ? `${plan.price} / ${plan.duration || 'plan'}` : ''}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`${statusColor} px-2 py-1 md:px-2.5 md:py-1.5 lg:px-3 lg:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 lg:gap-1.5 ${
                            statusText === t("questionBanks.exams.notSubscribed") ? "w-[129px] md:w-auto" : "w-[105px] md:w-auto"
                          } h-[24px] lg:w-auto lg:h-auto justify-center flex-shrink-0`}
                        >
                          <div className={`${statusIconBg} w-4 h-4 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center`}>
                            <img src={statusIcon} alt="" className="w-[7px] h-[9px] md:w-[9px] md:h-[11px] lg:w-[10px] lg:h-[12px]" />
                          </div>
                          <span className={`${textColor} font-roboto font-normal text-[11px] md:text-[14px] lg:text-[16px] leading-[100%] tracking-[0]`}>
                            {statusText}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Section - Action Button */}
                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        className="w-full lg:w-[530px] h-[40px] md:h-[52px] lg:h-[54px] rounded-lg bg-gradient-to-r from-orange-dark to-orange-light text-white hover:opacity-90 transition-opacity font-archivo font-semibold text-[11px] md:text-[13px] lg:text-[14px] leading-[14px] tracking-[0] align-middle uppercase"
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {buttonText === t("questionBanks.exams.upgradeToAccess") && (
                            <p><img src={arrowup} alt="" className="w-[9px] h-[11px] md:w-[11px] md:h-[13px] lg:w-[12px] lg:h-[14px]" /></p>
                          )}
                          <p className="">{buttonText}</p>
                        </div>
                      </button>
                    </>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-x-[145px] lg:gap-y-[30px] max-w-full lg:max-w-[1280px]">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-[352px] md:w-full lg:w-[610px] h-[174px] md:h-auto lg:h-[248px] mx-auto md:mx-0"
            >
              <div className="w-full h-full p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center">
                {exam.isPlaceholder ? (
                  <>
                    {/* Icon */}
                    <div className="mb-4">
                      <div className="rounded-xl flex items-center justify-center">
                        <img
                          src={exam.icon}
                          alt={exam.name}
                          className=""
                        />
                      </div>
                    </div>
                    {/* Title */}
                    <h3 className="font-archivo font-semibold text-[20px] md:text-[24px] lg:text-[26px] leading-[100%] tracking-[0] text-dark-gray text-center">
                      {exam.name}
                    </h3>
                  </>
                ) : (
                  <>
                    {/* Top Section - Icon, Title, Status */}
                    <div className="flex items-center justify-between mb-7 md:mb-auto lg:mb-auto w-full lg:w-[530px] pt-2 md:pt-4 lg:pt-5 gap-2 lg:gap-0">
                      <div className="flex items-center gap-3 md:gap-6 lg:gap-7 flex-1 min-w-0">
                        <div
                          className={`${exam.iconBgColor} rounded-xl flex items-center justify-center flex-shrink-0 w-10 h-10 md:w-14 md:h-14 lg:w-auto lg:h-auto p-1.5 md:p-3 lg:p-0`}
                        >
                          <img src={exam.icon} alt={exam.name} className="w-5 h-5 md:w-7 md:h-7 lg:w-auto lg:h-auto" />
                        </div>
                        <h3 className="text-oxford-blue font-bold text-[16px] md:text-[20px] lg:text-2xl truncate">
                          {exam.name}
                        </h3>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SubscriptionBridgePage;

