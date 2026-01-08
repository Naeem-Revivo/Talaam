import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { mind, book, add, feature, lock, arrowup, tick } from "../../assets/svg";
import { useLanguage } from "../../context/LanguageContext";
import plansAPI from "../../api/plans";
import subscriptionAPI from "../../api/subscription";
import { showErrorToast } from "../../utils/toastConfig";
import Loader from "../common/Loader";
import Header from "../dashboard/Header";

const QuestionBankDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingSub, setCheckingSub] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  // Check if user is a student/user
  const isStudent = isAuthenticated && (user?.role === 'user' || user?.role === 'student');

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch active plans; backend should filter for non-admin users
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

  // Check subscription status when user is authenticated
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (!token || !user) {
      return;
    }

    const checkSub = async () => {
      try {
        setCheckingSub(true);
        const response = await subscriptionAPI.getMySubscription();
        if (response.success && response.data?.subscription) {
          const sub = response.data.subscription;
          const isActive =
            sub.isActive === true &&
            sub.paymentStatus === "Paid" &&
            new Date(sub.expiryDate) > new Date();
          setHasActiveSubscription(isActive);
        } else {
          setHasActiveSubscription(false);
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
        setHasActiveSubscription(false);
      } finally {
        setCheckingSub(false);
      }
    };

    checkSub();
  }, [searchParams]);

  const handleSubscribe = (planId) => {
    if (!planId) return;
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (!token || !user) {
      // Remember where to return after login/signup
      const redirectTarget = `/question-banks?planId=${planId}`;
      localStorage.setItem("redirectAfterLogin", redirectTarget);
      sessionStorage.setItem("redirectAfterLogin", redirectTarget);
      navigate("/login");
      return;
    }

    // Authenticated: if already subscribed, go to dashboard; otherwise payment
    if (hasActiveSubscription) {
      navigate("/dashboard");
    } else {
      navigate(`/moyassar-payment?planId=${planId}`);
    }
  };
  
  // Create placeholder card for "More Exams Coming Soon"
  const placeholderCard = {
    id: 'placeholder',
    name: t("questionBanks.exams.moreExamsComingSoon"),
    icon: add,
    isPlaceholder: true,
  };

  // Combine plans with placeholder card
  const allItems = loading ? [] : [...plans, placeholderCard];

  const content = (
    <>
      {/* Title and Subtitle */}
      <div className="w-full h-auto md:h-auto lg:h-[277px] bg-soft-orange-fade flex items-center justify-center py-8 md:py-10 lg:py-0">
        <div className="text-center px-4 md:px-6 lg:px-0">
          <h1 className="text-oxford-blue font-archivo font-bold text-[32px] md:text-[50px] lg:text-[70px] leading-[120%] md:leading-[105%] lg:leading-[91px] tracking-[0] align-middle">
            {t("questionBanks.hero.title")}
          </h1>
          <p className="font-roboto font-normal text-[14px] md:text-[15px] lg:text-[16px] leading-[140%] md:leading-[130%] lg:leading-[25.6px] tracking-[0] align-middle text-oxford-blue mt-2 px-4 md:px-8 lg:px-0 max-w-[800px] mx-auto">
            {t("questionBanks.hero.subtitle")}
          </p>
        </div>
      </div>

      {/* Plans and Exams Cards Grid */}
      <div className="w-full min-h-[400px] bg-soft-blue-green flex flex-col items-center justify-center py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="w-full max-w-[1280px] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-6 lg:gap-8 xl:gap-x-[145px] xl:gap-y-[30px]">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader size="md" text={t("dashboard.loading") || "Loading..."} />
            </div>
          ) : allItems.length === 0 ? (
            <div className="col-span-full text-center text-oxford-blue font-roboto text-sm sm:text-base md:text-lg">
              {error ? error : t("questionBanks.exams.moreExamsComingSoon")}
            </div>
          ) : (
            allItems.map((item) => {
              // Handle placeholder card
              if (item.isPlaceholder) {
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-full min-h-[160px] sm:min-h-[180px] md:min-h-[200px] lg:min-h-[248px] mx-auto"
                  >
                    <div className="w-full h-full p-4 sm:p-5 md:p-6 flex flex-col items-center justify-center">
                      {/* Icon */}
                      <div className="mb-3 sm:mb-4">
                        <div className="rounded-xl flex items-center justify-center">
                          <img
                            src={item.icon}
                            alt={item.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-auto lg:h-auto"
                          />
                        </div>
                      </div>
                      {/* Title */}
                      <h3 className="font-archivo font-semibold text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-[100%] tracking-[0] text-dark-gray text-center px-2">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                );
              }

              // Handle plan cards
              const isSubscribed = false; // Placeholder; can be wired to subscription status if available
              const statusText = isSubscribed
                ? t("questionBanks.exams.subscribed")
                : t("questionBanks.exams.notSubscribed");
              const buttonText = isSubscribed
                ? t("questionBanks.exams.startStudying")
                : t("questionBanks.exams.upgradeToAccess");
              const statusColor = isSubscribed ? "bg-orange-dark" : "bg-[#FDF0D5]";
              const textColor = isSubscribed ? "text-white" : "text-orange-dark";
              const statusIcon = isSubscribed ? tick : lock;
              const statusIconBg = isSubscribed ? "bg-white" : "bg-orange-dark";
              const icon = item.icon || book;
              const iconBgColor = "bg-oxford-blue";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-full min-h-[200px] sm:min-h-[220px] md:min-h-[240px] lg:min-h-[248px] mx-auto"
                >
                  <div className="w-full h-full p-4 sm:p-5 md:p-6 flex flex-col justify-between gap-4 sm:gap-6">
                    {/* Top Section - Icon, Title, Status */}
                    <div className="flex items-start sm:items-center justify-between w-full gap-2 sm:gap-3 md:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-7 flex-1 min-w-0">
                        <div
                          className={`${iconBgColor} rounded-xl flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-auto xl:h-auto p-2 sm:p-2.5 md:p-3 lg:p-0`}
                        >
                          <img src={icon} alt={item.name} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-auto xl:h-auto" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <h3 className="text-oxford-blue font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl truncate leading-tight">
                            {item.name}
                          </h3>
                          <span className="text-dark-gray font-roboto text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1 break-words">
                            {item.price !== undefined && item.price !== null 
                              ? `SAR ${parseFloat(item.price).toFixed(2)} / ${item.duration || 'plan'}` 
                              : item.duration ? item.duration : ''}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`${statusColor} px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 md:gap-2 justify-center flex-shrink-0 whitespace-nowrap`}
                      >
                        <div className={`${statusIconBg} w-4 h-4 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center flex-shrink-0`}>
                          <img src={statusIcon} alt="" className="w-[7px] h-[9px] sm:w-[8px] sm:h-[10px] md:w-[9px] md:h-[11px] lg:w-[10px] lg:h-[12px]" />
                        </div>
                        <span className={`${textColor} font-roboto font-normal text-[10px] sm:text-xs md:text-sm lg:text-base leading-[100%] tracking-[0] hidden sm:inline`}>
                          {statusText}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Section - Action Buttons */}
                    <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => handleSubscribe(item.id)}
                        className="flex-1 min-h-[40px] sm:h-[44px] md:h-[48px] lg:h-[54px] rounded-lg bg-gradient-to-r from-orange-dark to-orange-light text-white hover:opacity-90 transition-opacity font-archivo font-semibold text-[10px] sm:text-xs md:text-sm lg:text-[14px] leading-tight tracking-[0] align-middle uppercase flex items-center justify-center gap-1.5"
                      >
                        {buttonText === t("questionBanks.exams.upgradeToAccess") && (
                          <img src={arrowup} alt="" className="w-[8px] h-[10px] sm:w-[9px] sm:h-[11px] md:w-[11px] md:h-[13px] lg:w-[12px] lg:h-[14px] flex-shrink-0" />
                        )}
                        <span className="truncate">{buttonText}</span>
                      </button>
                      <button
                        onClick={() => navigate("/products")}
                        className="flex-1 min-h-[40px] sm:h-[44px] md:h-[48px] lg:h-[54px] rounded-lg bg-white border-2 border-orange-dark text-orange-dark hover:bg-orange-dark hover:text-white transition-colors font-archivo font-semibold text-[10px] sm:text-xs md:text-sm lg:text-[14px] leading-tight tracking-[0] align-middle uppercase"
                      >
                        {t("questionBanks.exams.moreDetail")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );

  // If student is logged in, show with dashboard header only (no sidebar)
  if (isStudent) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header onToggleSidebar={() => {}} showSidebarToggle={false} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {content}
        </main>
      </div>
    );
  }

  // If not a student, show without dashboard header
  return content;
};

export default QuestionBankDashboard;
