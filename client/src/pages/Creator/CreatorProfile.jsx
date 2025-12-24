import React, { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { PrimaryButton } from "../../components/common/Button";
import Dropdown from "../../components/shared/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/slices/authSlice";
import profileAPI from "../../api/profile";
import authAPI from "../../api/auth";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import { eye, openeye } from "../../assets/svg/signup";

const CreatorProfile = () => {
  const { language, t, changeLanguage } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";
  const isRTL = dir === "rtl";
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(
    language === "ar" ? "Arabic" : "English (US)"
  );
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch initial data on mount and refresh when needed
  useEffect(() => {
    const loadUserData = async () => {
      // Always fetch fresh user data to ensure we have the latest from DB
      try {
        const result = await dispatch(fetchCurrentUser());
        const fetched = result.payload?.data?.user;
        if (fetched) {
          setProfileData({
            name: fetched.fullName || fetched.name || "",
            email: fetched.email || "",
            phone: fetched.phone !== null && fetched.phone !== undefined ? fetched.phone : "",
          });
          setPasswordData(prev => ({
            ...prev,
            email: fetched.email || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If fetch fails, try to use existing user from Redux as fallback
        if (user) {
          setProfileData({
            name: user.fullName || user.name || "",
            email: user.email || "",
            phone: user.phone !== null && user.phone !== undefined ? user.phone : "",
          });
        }
      }
    };
    
    loadUserData();
  }, [dispatch]);

  const languageOptions = [
    {
      value: "English (US)",
      label: t("creator.profile.languageOptions.english") || "English (US)",
    },
    {
      value: "Arabic",
      label: t("creator.profile.languageOptions.arabic") || "Arabic",
    },
  ];

  const handleSaveChanges = async () => {
    if (!profileData.name || !profileData.email) {
      showErrorToast("Name and email are required");
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
      
      showSuccessToast("Profile updated successfully");
    } catch (error) {
      showErrorToast(error.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.email) {
      showErrorToast("Email is required");
      return;
    }
    if (!passwordData.code) {
      showErrorToast("Verification code is required");
      return;
    }
    if (!passwordData.newPassword) {
      showErrorToast("New password is required");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showErrorToast("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await authAPI.resetPasswordOTP({
        email: passwordData.email,
        otp: passwordData.code,
        password: passwordData.newPassword.trim(),
      });
      
      showSuccessToast("Password updated successfully");
      // Clear password form
      setPasswordData({
        currentPassword: "",
        email: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showErrorToast(error.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSendCode = async () => {
    if (!passwordData.email) {
      showErrorToast("Email is required");
      return;
    }

    setIsSendingCode(true);
    try {
      await authAPI.forgotPasswordOTP({
        email: passwordData.email,
      });
      showSuccessToast("Verification code sent to your email");
    } catch (error) {
      showErrorToast(error.message || "Failed to send verification code");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSaveApplicationSettings = async () => {
    setIsSavingSettings(true);
    try {
      // Only save notification settings if needed in the future
      // Language is already saved when dropdown changes
      showSuccessToast("Settings saved successfully");
    } catch (error) {
      showErrorToast(error.message || "Failed to save settings");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div
      className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6"
      dir={dir}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex gap-4">
          <div>
            <h1 className="font-archivo text-[36px] mb-2 leading-[40px] font-bold text-oxford-blue">
              {t("creator.profile.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("creator.profile.subtitle")}
            </p>
          </div>
        </header>

        {/* Profile Information Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              {t("creator.profile.profileInformation")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-[50px] pb-[35px] px-[65px]">
            {/* Name */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("creator.profile.name")}
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className={`w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] font-normal rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("creator.profile.email")}
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                className={`w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("creator.profile.phone")}
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                className={`w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </div>

            <div
              className={`mt-[70px] w-full flex ${
                isRTL ? "justify-start" : "justify-end"
              } col-span-2`}
            >
              <PrimaryButton
                text={isSavingProfile ? t("common.updating") || "Updating..." : t("creator.profile.saveChanges")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleSaveChanges}
                disabled={isSavingProfile}
              />
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              {t("creator.profile.changePassword")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-[50px] pb-[35px] px-[65px]">
            {/* Current Password */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("creator.profile.currentPassword")}
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    handlePasswordChange("currentPassword", e.target.value)
                  }
                  placeholder={t("creator.profile.placeholders.currentPassword")}
                  className={`w-full p-3 ${isRTL ? "pl-12" : "pr-12"} placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 ${
                    isRTL ? "left-4" : "right-4"
                  } text-gray-500 hover:text-gray-700 cursor-pointer`}
                >
                  <img 
                    src={showCurrentPassword ? openeye : eye} 
                    alt="toggle password visibility" 
                    className="w-5 h-5" 
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("creator.profile.enterEmail")}
              </label>
              <input
                type="email"
                value={passwordData.email}
                onChange={(e) => handlePasswordChange("email", e.target.value)}
                placeholder={t("creator.profile.placeholders.email")}
                className={`w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </div>

            <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
              <PrimaryButton
                text={isSendingCode ? t("common.sending") || "Sending..." : t("creator.profile.sendCode")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleSendCode}
                disabled={isSendingCode}
              />
            </div>

            {/* Verification Code */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("creator.profile.enterCode")}
              </label>
              <input
                type="text"
                value={passwordData.code}
                onChange={(e) => handlePasswordChange("code", e.target.value)}
                placeholder={t("creator.profile.placeholders.code")}
                className={`w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </div>

            {/* New Password Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  {t("creator.profile.newPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                    placeholder={t("creator.profile.placeholders.newPassword")}
                    className={`w-full p-3 ${isRTL ? "pr-12" : "pl-12"} placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute top-1/2 transform -translate-y-1/2 ${
                      isRTL ? "left-4" : "right-4"
                    } text-gray-500 hover:text-gray-700 cursor-pointer`}
                  >
                    <img 
                      src={showNewPassword ? openeye : eye} 
                      alt="toggle password visibility" 
                      className="w-5 h-5" 
                    />
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  {t("creator.profile.confirmNewPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    placeholder={t("creator.profile.placeholders.confirmPassword")}
                    className={`w-full p-3 ${isRTL ? "pr-12" : "pl-12"} placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute top-1/2 transform -translate-y-1/2 ${
                      isRTL ? "left-4" : "right-4"
                    } text-gray-500 hover:text-gray-700 cursor-pointer`}
                  >
                    <img 
                      src={showConfirmPassword ? openeye : eye} 
                      alt="toggle password visibility" 
                      className="w-5 h-5" 
                    />
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`mt-8 w-full flex ${
                isRTL ? "justify-start" : "justify-end"
              }`}
            >
              <PrimaryButton
                text={isUpdatingPassword ? t("common.updating") || "Updating..." : t("creator.profile.updatePassword")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
              />
            </div>
          </div>
        </div>

        {/* Application Settings Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              {t("creator.profile.applicationSettings")}
            </h2>
          </div>

          <div className="space-y-8 pt-[50px] pb-[35px] px-[65px]">
            {/* Language Setting */}
            <div
              className={`flex flex-col lg:flex-row ${
                isRTL ? "lg:flex-row-reverse" : ""
              } lg:items-center lg:justify-between gap-4`}
            >
              <div className="flex-1">
                <h3
                  className={`font-roboto text-[18px] leading-[100%] font-medium text-oxford-blue mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("creator.profile.language")}
                </h3>
              </div>
              <div className="w-full lg:w-[180px]">
                <Dropdown
                  value={selectedLanguage}
                  options={languageOptions}
                  onChange={async (value) => {
                    setSelectedLanguage(value);
                    // Change language immediately like the toggle button
                    const languageCode = value === "Arabic" ? "ar" : "en";
                    changeLanguage(languageCode);
                    // Also sync with backend
                    try {
                      await profileAPI.updateProfile({ language: languageCode });
                    } catch (error) {
                      console.error("Failed to sync language with backend:", error);
                    }
                  }}
                  height="h-[50px]"
                  textClassName={`font-roboto text-[16px] text-oxford-blue ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                />
              </div>
            </div>

            {/* Notifications Setting */}
            <div
              className={`flex flex-col lg:flex-row ${
                isRTL ? "lg:flex-row-reverse" : ""
              } lg:items-center lg:justify-between gap-4 pt-2`}
            >
              <div className="flex-1">
                <h3
                  className={`font-roboto text-[18px] leading-[100%] font-medium text-oxford-blue mb-2 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("creator.profile.notifications")}
                </h3>
                <p
                  className={`font-roboto text-[16px] leading-[100%] font-normal text-[#6B7280] ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("creator.profile.notificationsDescription")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificationsEnabled ? "bg-orange-dark" : "bg-[#E5E7EB]"
                  }`}
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

            <div
              className={`mt-8 w-full flex ${
                isRTL ? "justify-start" : "justify-end"
              }`}
            >
              <PrimaryButton
                text={isSavingSettings ? t("common.saving") || "Saving..." : t("creator.profile.saveSettings")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleSaveApplicationSettings}
                disabled={isSavingSettings}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
