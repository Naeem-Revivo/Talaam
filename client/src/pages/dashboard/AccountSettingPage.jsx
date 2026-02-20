import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { PrimaryButton, OutlineButton } from "../../components/common/Button";
import Dropdown from "../../components/shared/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/slices/authSlice";
import profileAPI from "../../api/profile";
import subscriptionAPI from "../../api/subscription";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";

const AccountSettingPage = () => {
  const { language, t, changeLanguage } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const isRTL = dir === "rtl";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(
    language === "ar" ? "Arabic" : "English"
  );
  const [currentPlan, setCurrentPlan] = useState("Free Plan");
  const [renewalDate, setRenewalDate] = useState("");
  const [passwordLastUpdated, setPasswordLastUpdated] = useState("2 days ago");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [originalProfileData, setOriginalProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [hasProfileChanges, setHasProfileChanges] = useState(false);

  // Fetch initial data on mount and refresh when needed
  useEffect(() => {
    const loadUserData = async () => {
      // Always fetch fresh user data to ensure we have the latest from DB
      try {
        const result = await dispatch(fetchCurrentUser());
        const fetched = result.payload?.data?.user;
        if (fetched) {
          const data = {
            name: fetched.fullName || fetched.name || "",
            email: fetched.email || "",
            phone: fetched.phone !== null && fetched.phone !== undefined ? fetched.phone : "",
          };
          setProfileData(data);
          setOriginalProfileData(data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If fetch fails, try to use existing user from Redux as fallback
        if (user) {
          const data = {
            name: user.fullName || user.name || "",
            email: user.email || "",
            phone: user.phone !== null && user.phone !== undefined ? user.phone : "",
          };
          setProfileData(data);
          setOriginalProfileData(data);
        }
      }

      // Fetch current subscription plan
      try {
        const subscriptionResponse = await subscriptionAPI.getMySubscription();
        if (subscriptionResponse.success && subscriptionResponse.data?.subscription) {
          const planName = subscriptionResponse.data.subscription.planName || "Free Plan";
          setCurrentPlan(planName);
          // Set renewal date if available
          if (subscriptionResponse.data.subscription.renewalDate) {
            const date = new Date(subscriptionResponse.data.subscription.renewalDate);
            setRenewalDate(date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }));
          }
        }
      } catch (error) {
        // If no subscription found, keep default "Free Plan"
        console.log("No subscription found, using default plan");
      }
    };

    loadUserData();
  }, [dispatch]); // Fetch fresh data on mount

  const languageOptions = [
    {
      value: "English",
      label: t("dashboard.accountSettings.languageOptions.english"),
    },
    {
      value: "Arabic",
      label: t("dashboard.accountSettings.languageOptions.arabic"),
    },
  ];

  const handleSaveChanges = async () => {
    if (!profileData.name || !profileData.email) {
      showErrorToast(t("dashboard.accountSettings.profileInformation.errors.nameAndEmailRequired") || "Name and email are required");
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await profileAPI.updateProfile({
        name: profileData.name,
        fullName: profileData.name,
        email: profileData.email,
        phone: profileData.phone || undefined,
      });

      // Refresh user data in Redux first to get latest from DB
      const result = await dispatch(fetchCurrentUser());
      const updatedUser = result.payload?.data?.user;

      // Update profileData from both API response and fresh Redux state
      if (response.data?.profile) {
        setProfileData({
          name: response.data.profile.fullName || response.data.profile.name || "",
          email: response.data.profile.email || "",
          phone: response.data.profile.phone !== null && response.data.profile.phone !== undefined ? (response.data.profile.phone || "") : "",
        });
      } else if (updatedUser) {
        // Fallback to updated user from Redux if profile response doesn't have data
        setProfileData({
          name: updatedUser.fullName || updatedUser.name || "",
          email: updatedUser.email || "",
          phone: updatedUser.phone !== null && updatedUser.phone !== undefined ? (updatedUser.phone || "") : "",
        });
      }

      // Update original data
      setOriginalProfileData({
        name: updatedUser?.fullName || updatedUser?.name || profileData.name,
        email: updatedUser?.email || profileData.email,
        phone: updatedUser?.phone !== null && updatedUser?.phone !== undefined ? (updatedUser.phone || "") : profileData.phone,
      });
      setHasProfileChanges(false);

      showSuccessToast(t("dashboard.accountSettings.profileInformation.success.profileUpdated") || "Profile updated successfully");
    } catch (error) {
      showErrorToast(error.message || t("dashboard.accountSettings.profileInformation.errors.updateFailed") || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveApplicationSettings = async () => {
    setIsSavingSettings(true);
    try {
      // Only save notification settings if needed in the future
      // Language is already saved when dropdown changes
      showSuccessToast(t("dashboard.accountSettings.preferences.success.settingsSaved") || "Settings saved successfully");
    } catch (error) {
      showErrorToast(error.message || t("dashboard.accountSettings.preferences.errors.saveFailed") || "Failed to save settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => {
      const updated = { ...prev, [field]: value };
      // Check if there are changes
      const hasChanges =
        updated.name !== originalProfileData.name ||
        updated.email !== originalProfileData.email ||
        updated.phone !== originalProfileData.phone;
      setHasProfileChanges(hasChanges);
      return updated;
    });
  };

  const handleCancel = () => {
    setProfileData(originalProfileData);
    setHasProfileChanges(false);
  };

  return (
    <div
      className="min-h-screen bg-white px-[32px] pt-6 pb-[60px]"
      dir={dir}
    >
      <div className="mx-auto flex flex-col gap-[32px]">
        {/* Header with Breadcrumb and Action Buttons */}
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          <nav>
            <div className="flex items-center gap-[2px]">
              <button
                onClick={() => navigate("/dashboard")}
                className="font-roboto text-[14px] leading-[21px] font-normal text-[#99B9CF]"
              >
                {t("common.breadcrumb.dashboard") || "Dashboard"}
              </button>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="#CCDCE7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span className="text-[#00040A] text-[14px] leading-[21px] font-medium font-roboto">
                {t("common.breadcrumb.settings") || "Settings"}
              </span>
            </div>
          </nav>
          {/* Action Buttons */}
        </div>

        {/* Profile Section */}
        <div className="border-b border-[#E2E2E2] pb-[32px]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 10.7614 9.23858 13 12 13ZM12 13C14.1217 13 16.1566 13.8429 17.6569 15.3431C19.1571 16.8434 20 18.8783 20 21M12 13C9.87827 13 7.84344 13.8429 6.34315 15.3431C4.84285 16.8434 4 18.8783 4 21" stroke="#032746" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <h2 className="text-[20px] leading-[28px] font-bold text-oxford-blue font-archivo">
                {t("dashboard.accountSettings.profileInformation.title") || "Profile"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="font-roboto text-base font-medium h-12 w-[97px] rounded-[12px] text-[#404040] bg-[#F5F5F5]" onClick={handleCancel}>
                {t("common.cancel") || "Cancel"}
              </button>
              <PrimaryButton
                text={isSavingProfile ? t("common.saving") || "Saving..." : t("common.save") || "Save"}
                className="py-3 px-7 text-nowrap"
                onClick={handleSaveChanges}
                disabled={isSavingProfile || !hasProfileChanges}
              />
            </div>
          </div>

          <div className="flex flex-col max-w-[500px] gap-6 pt-4 px-[32px] pb-[27px]">
            {/* Full Name */}
            <div>
              <label className="block font-roboto text-[14px] leading-[21px] font-medium text-oxford-blue mb-2">
                {t("dashboard.accountSettings.profileInformation.fullName") || "Full Name"}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.6666 14V12.6667C12.6666 11.9594 12.3856 11.2811 11.8855 10.781C11.3854 10.281 10.7072 10 9.99992 10H5.99992C5.29267 10 4.6144 10.281 4.1143 10.781C3.6142 11.2811 3.33325 11.9594 3.33325 12.6667V14" stroke="#6697B7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.99992 7.33333C9.47268 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47268 2 7.99992 2C6.52716 2 5.33325 3.19391 5.33325 4.66667C5.33325 6.13943 6.52716 7.33333 7.99992 7.33333Z" stroke="#6697B7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                </div>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  placeholder={t("dashboard.accountSettings.profileInformation.namePlaceholder") || "John Doe"}
                  className={`w-full pl-12 pr-4 py-3 placeholder:text-[#6B7280] placeholder:text-[14px] font-normal rounded-[14px] border-2 border-[#F5F5F5] bg-[#F9FAFB] font-roboto text-[14px] text-oxford-blue focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? "text-right" : "text-left"
                    }`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-roboto text-[14px] leading-[21px] font-medium text-oxford-blue mb-2">
                {t("dashboard.accountSettings.profileInformation.email") || "Email Address"}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3333 2.66699H2.66659C1.93021 2.66699 1.33325 3.26395 1.33325 4.00033V12.0003C1.33325 12.7367 1.93021 13.3337 2.66659 13.3337H13.3333C14.0696 13.3337 14.6666 12.7367 14.6666 12.0003V4.00033C14.6666 3.26395 14.0696 2.66699 13.3333 2.66699Z" stroke="#6697B7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14.6666 4.66699L8.68658 8.46699C8.48077 8.59594 8.2428 8.66433 7.99992 8.66433C7.75704 8.66433 7.51907 8.59594 7.31325 8.46699L1.33325 4.66699" stroke="#6697B7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  placeholder={t("dashboard.accountSettings.profileInformation.emailPlaceholder") || "johndoe@gmail.com"}
                  className={`w-full pl-12 pr-4 py-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[14px] border-2 border-[#F5F5F5] bg-white font-roboto text-[14px] text-oxford-blue focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? "text-right" : "text-left"
                    }`}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-roboto text-[14px] leading-[21px] font-medium text-oxford-blue mb-2">
                {t("dashboard.accountSettings.profileInformation.phone") || "Phone Number"}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_114_4683)">
                      <path d="M14.6667 11.2807V13.2807C14.6675 13.4664 14.6294 13.6502 14.555 13.8203C14.4807 13.9904 14.3716 14.1431 14.2348 14.2686C14.0979 14.3941 13.9364 14.4897 13.7605 14.5492C13.5847 14.6087 13.3983 14.6308 13.2134 14.614C11.1619 14.3911 9.19137 13.6901 7.46004 12.5674C5.84926 11.5438 4.48359 10.1782 3.46004 8.56738C2.33336 6.82819 1.6322 4.84805 1.41337 2.78738C1.39671 2.60303 1.41862 2.41722 1.4777 2.2418C1.53679 2.06637 1.63175 1.90518 1.75655 1.76846C1.88134 1.63175 2.03324 1.52252 2.20256 1.44773C2.37189 1.37294 2.55493 1.33422 2.74004 1.33405H4.74004C5.06357 1.33086 5.37723 1.44543 5.62254 1.6564C5.86786 1.86737 6.02809 2.16035 6.07337 2.48072C6.15779 3.12076 6.31434 3.7492 6.54004 4.35405C6.62973 4.59266 6.64915 4.85199 6.59597 5.1013C6.5428 5.35061 6.41928 5.57946 6.24004 5.76072L5.39337 6.60738C6.34241 8.27641 7.72434 9.65835 9.39337 10.6074L10.24 9.76072C10.4213 9.58147 10.6501 9.45795 10.8994 9.40478C11.1488 9.35161 11.4081 9.37102 11.6467 9.46072C12.2516 9.68642 12.88 9.84297 13.52 9.92738C13.8439 9.97307 14.1396 10.1362 14.3511 10.3857C14.5625 10.6352 14.6748 10.9538 14.6667 11.2807Z" stroke="#6697B7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_114_4683">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  placeholder={t("dashboard.accountSettings.profileInformation.phonePlaceholder") || "+1 (555) 123-4567"}
                  className={`w-full pl-12 pr-4 py-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[14px] border-2 border-[#F5F5F5] bg-[#F9FAFB] font-roboto text-[14px] text-oxford-blue focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? "text-right" : "text-left"
                    }`}
                />
              </div>
            </div>

            {/* Current Plan and Password Section - Side by side */}
          </div>
          <div className="flex px-[32px] gap-6">
            {/* Current Plan */}
            <div className="w-full max-w-[500px]">
              <label className="block font-roboto text-[14px] leading-[21px] font-medium text-oxford-blue mb-2">
                {t("dashboard.accountSettings.profileInformation.currentPlan") || "Current Plan"}
              </label>
              <div className="relative">
                <div className="flex items-center justify-between border-2 border-[#F5F5F5] rounded-[14px] px-4 py-[14px] bg-[#F9FAFB]">
                  <input
                    type="text"
                    value={currentPlan}
                    readOnly
                    className={`w-full font-roboto text-[14px] leading-[20px] font-normal text-[#6A7282] bg-[#F9FAFB] ${isRTL ? "text-right" : "text-left"
                      }`}
                  />
                  <button
                    onClick={() => navigate("/dashboard/subscription-billings")}
                    className="text-orange-dark font-roboto text-xs font-semibold hover:text-[#E55A2B]"
                  >
                    {t("dashboard.accountSettings.profileInformation.upgrade") || "Upgrade"}
                  </button>
                </div>
                <p className="text-[#6CA6C1] font-roboto text-xs font-normal mt-2">
                  {t("dashboard.accountSettings.profileInformation.renewalDate") || "Renewal date:"} {renewalDate}
                </p>
              </div>
            </div>

            {/* Password Section */}
            <div className="flex gap-6 items-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.66667 6.66732V4.66732C4.66667 3.78326 5.01786 2.93542 5.64298 2.3103C6.2681 1.68517 7.11595 1.33398 8 1.33398C8.88406 1.33398 9.7319 1.68517 10.357 2.3103C10.9821 2.93542 11.3333 3.78326 11.3333 4.66732V6.66732M8.66667 10.6673C8.66667 11.0355 8.36819 11.334 8 11.334C7.63181 11.334 7.33333 11.0355 7.33333 10.6673C7.33333 10.2991 7.63181 10.0007 8 10.0007C8.36819 10.0007 8.66667 10.2991 8.66667 10.6673ZM3.33333 6.66732H12.6667C13.403 6.66732 14 7.26427 14 8.00065V13.334C14 14.0704 13.403 14.6673 12.6667 14.6673H3.33333C2.59695 14.6673 2 14.0704 2 13.334V8.00065C2 7.26427 2.59695 6.66732 3.33333 6.66732Z" stroke="#6697B7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <label className="block font-roboto text-[14px] leading-[21px] font-medium text-oxford-blue">
                    {t("dashboard.accountSettings.profileInformation.password") || "Password"}
                  </label>
                </div>
                <div>
                  <p className="font-roboto text-[14px] leading-[21px] text-[#6A7282] font-normal">
                    {t("dashboard.accountSettings.profileInformation.passwordLastUpdated") || "Last updated:"} {passwordLastUpdated}
                  </p>
                </div>
              </div>
              <OutlineButton
                text={t("dashboard.accountSettings.profileInformation.changePassword") || "Change Password"}
                className="py-3 px-6 text-nowrap border-2 border-[#E5E7EB] rounded-[14px] text-base text-[#525252] font-medium font-roboto"
                onClick={() => navigate("/dashboard/settings/change-password")}
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
          <div className="">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 4H14M10 4H3M21 12H12M8 12H3M21 20H16M12 20H3M14 2V6M8 10V14M16 18V22" stroke="#032746" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <h2 className="font-archivo text-[20px] leading-[28px] font-bold text-oxford-blue">
                {t("dashboard.accountSettings.preferences.title") || "Preferences"}
              </h2>
            </div>
          </div>

          
            {/* Language Setting */}
            <div
              className={`flex flex-col w-full gap-4`}
            >
              <label className="block font-roboto text-[14px] leading-[21px] font-medium text-oxford-blue mb-2">
                {t("dashboard.accountSettings.preferences.language.label") || "Language"}
              </label>
              <div className="w-full max-w-[500px]">
                <Dropdown
                  value={selectedLanguage}
                  options={languageOptions}
                  onChange={async (value) => {
                    setSelectedLanguage(value);
                    // Change language immediately
                    const languageCode = value === "Arabic" ? "ar" : "en";
                    changeLanguage(languageCode);
                    // Also sync with backend
                    try {
                      await profileAPI.updateProfile({ language: languageCode });
                    } catch (error) {
                      console.error("Failed to sync language with backend:", error);
                    }
                  }}
                  className="w-full max-w-[500px]"
                  height="h-[50px]"
                  textClassName={`font-roboto text-[16px] text-oxford-blue ${isRTL ? "text-right" : "text-left"
                    }`}
                />
              </div>
            </div>

            {/* Notifications Setting */}
            <div className="flex flex-col gap-4">
              <h3
                className={`font-roboto text-[14px] leading-[21px] font-medium text-oxford-blue ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("dashboard.accountSettings.preferences.notifications.label") || "Notifications"}
              </h3>
              <div className="bg-[#F9FAFB] rounded-[18px] p-4 max-w-[500px]">
                <div
                  className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex-1">
                    <h4
                      className={`font-archivo text-[14px] leading-[21px] font-semibold text-oxford-blue mb-1 ${isRTL ? "text-right" : "text-left"
                        }`}
                    >
                      {t("dashboard.accountSettings.preferences.notifications.emailNotifications") || "Email Notifications"}
                    </h4>
                    <p
                      className={`font-roboto text-xs font-normal text-[#6A7282] ${isRTL ? "text-right" : "text-left"
                        }`}
                    >
                      {t("dashboard.accountSettings.preferences.notifications.description") || "Enable or disable email notifications for important updates."}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <button
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        notificationsEnabled ? "bg-[#032746]" : "bg-[#E5E7EB]"
                      }`}
                      role="switch"
                      aria-checked={notificationsEnabled}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationsEnabled
                            ? isRTL
                              ? "-translate-x-6"
                              : "translate-x-6"
                            : isRTL
                            ? "-translate-x-1"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
};

export default AccountSettingPage;
