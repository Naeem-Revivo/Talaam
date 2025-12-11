import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { PrimaryButton } from "../../components/common/Button";
import Dropdown from "../../components/shared/Dropdown";
import profileAPI from "../../api/profile";
import authAPI from "../../api/auth";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";

const GathererProfile = () => {
  const { t, language, changeLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [islanguage, setIsLanguage] = useState("en");
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

  const dir = language === "ar" ? "rtl" : "ltr";

  const isRTL = dir === "rtl";

  const languageOptions = [
    {
      value: "en",
      label: t("gatherer.profile.languageOptions.english"),
    },
    {
      value: "ar",
      label: t("gatherer.profile.languageOptions.arabic"),
    },
  ];

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Try to get user from localStorage first for faster initial load
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser.email || storedUser.fullName) {
          setProfileData({
            name: storedUser.fullName || storedUser.name || "",
            email: storedUser.email || "",
            phone: storedUser.phone || "",
          });
          setPasswordData(prev => ({
            ...prev,
            email: storedUser.email || "",
          }));
        }

        // Then fetch fresh data from API
        const response = await profileAPI.getProfile();
        if (response.success && response.data?.profile) {
          const profile = response.data.profile;
          setProfileData({
            name: profile.fullName || profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
          });
          setPasswordData(prev => ({
            ...prev,
            email: profile.email || "",
          }));
          // Set language preference if available
          // Only update if localStorage doesn't have a more recent language preference
          const savedLanguage = localStorage.getItem('talaam-language');
          if (profile.language) {
            const profileLanguage = profile.language === "ar" ? "ar" : "en";
            // Use localStorage language if it exists and is different from profile (user just changed it)
            const languageToUse = savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar') 
              ? savedLanguage 
              : profileLanguage;
            
            setIsLanguage(languageToUse);
            // Only update context if it's different from current language
            if (changeLanguage && languageToUse !== language) {
              changeLanguage(languageToUse);
            }
          } else if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
            // If no profile language but localStorage has one, use that
            setIsLanguage(savedLanguage);
            if (changeLanguage && savedLanguage !== language) {
              changeLanguage(savedLanguage);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Only show error if we don't have cached data
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser.email && !storedUser.fullName) {
          showErrorToast(error.message || "Failed to load profile data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [t, changeLanguage, language]);

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const updateData = {
        fullName: profileData.name,
        // Note: email and phone might not be updatable via profile API
        // Adjust based on your API requirements
      };
      
      const response = await profileAPI.updateProfile(updateData);
      if (response.success) {
        showSuccessToast(response.message || "Profile updated successfully");
        // Update local storage if user data is returned
        if (response.data?.profile) {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({
            ...user,
            fullName: response.data.profile.fullName,
            name: response.data.profile.fullName,
          }));
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!passwordData.email) {
      showErrorToast("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.forgotPasswordOTP({ email: passwordData.email });
      if (response.success) {
        showSuccessToast(response.message || "OTP code sent to your email");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      showErrorToast(error.message || "Failed to send OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.email || !passwordData.code || !passwordData.newPassword || !passwordData.confirmPassword) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.resetPasswordOTP({
        email: passwordData.email,
        otp: passwordData.code,
        password: passwordData.newPassword,
      });
      
      if (response.success) {
        showSuccessToast(response.message || "Password updated successfully");
        // Reset password form
        setPasswordData({
          currentPassword: "",
          email: "",
          code: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      showErrorToast(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (selectedLanguage) => {
    setIsLanguage(selectedLanguage);
    
    // Immediately change the language in the context
    if (changeLanguage) {
      changeLanguage(selectedLanguage);
    }
    
    // Save to backend
    try {
      setLoading(true);
      const updateData = {
        language: selectedLanguage,
      };
      
      const response = await profileAPI.updateProfile(updateData);
      if (response.success) {
        showSuccessToast("Language updated successfully");
      }
    } catch (error) {
      console.error("Error updating language:", error);
      showErrorToast(error.message || "Failed to update language");
      // Revert language change on error
      const previousLanguage = selectedLanguage === "ar" ? "en" : "ar";
      if (changeLanguage) {
        changeLanguage(previousLanguage);
      }
      // Revert dropdown selection
      setIsLanguage(previousLanguage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApplicationSettings = async () => {
    try {
      setLoading(true);
      const updateData = {
        language: islanguage,
        // Note: notifications might need a separate API endpoint
        // Adjust based on your API requirements
      };
      
      const response = await profileAPI.updateProfile(updateData);
      if (response.success) {
        showSuccessToast("Application settings saved successfully");
        // Update language context if needed
        if (islanguage !== language && changeLanguage) {
          changeLanguage(islanguage);
        }
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showErrorToast(error.message || "Failed to save application settings");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex gap-4">
          <div>
            <h1 className="font-archivo text-[36px] mb-2 leading-[40px] font-bold text-oxford-blue">
              {t("gatherer.profile.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("gatherer.profile.subtitle")}
            </p>
          </div>
        </header>

        {/* Profile Information Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              {t("gatherer.profile.profileInformation")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-[50px] pb-[35px] px-[65px]">
            {/* Name */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("gatherer.profile.name")}
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] font-normal rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("gatherer.profile.email")}
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("gatherer.profile.phone")}
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            <div className="mt-[10px] w-full flex justify-end col-span-3">
              <PrimaryButton
                text={t("gatherer.profile.saveChanges")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleSaveChanges}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              {t("gatherer.profile.changePassword")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-[50px] pb-[35px] px-[65px]">
            {/* Current Password */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("gatherer.profile.currentPassword")}
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
                placeholder={t("gatherer.profile.placeholders.currentPassword")}
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("gatherer.profile.enterEmail")}
              </label>
              <input
                type="email"
                value={passwordData.email}
                onChange={(e) => handlePasswordChange("email", e.target.value)}
                placeholder={t("gatherer.profile.placeholders.email")}
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <PrimaryButton
                text={t("gatherer.profile.sendCode")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleSendCode}
                disabled={loading}
              />
            </div>

            {/* Verification Code */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("gatherer.profile.enterCode")}
              </label>
              <input
                type="text"
                value={passwordData.code}
                onChange={(e) => handlePasswordChange("code", e.target.value)}
                placeholder={t("gatherer.profile.placeholders.code")}
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            {/* New Password Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  {t("gatherer.profile.newPassword")}
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  placeholder={t("gatherer.profile.placeholders.newPassword")}
                  className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  {t("gatherer.profile.confirmNewPassword")}
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                  placeholder={t(
                    "gatherer.profile.placeholders.confirmPassword"
                  )}
                  className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-8 w-full flex justify-end">
              <PrimaryButton
                text={t("gatherer.profile.updatePassword")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleUpdatePassword}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Application Settings Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              {t("gatherer.profile.applicationSettings")}
            </h2>
          </div>

          <div className="space-y-8 pt-[50px] pb-[35px] px-[65px]">
            {/* Language Setting */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-roboto text-[18px] leading-[100%] font-medium text-oxford-blue mb-2">
                  {t("gatherer.profile.language")}
                </h3>
              </div>
              <div className="w-full lg:w-[180px]">
                <Dropdown
                  value={islanguage}
                  options={languageOptions}
                  onChange={handleLanguageChange}
                  height="h-[50px]"
                  textClassName="font-roboto text-[16px] text-oxford-blue"
                />
              </div>
            </div>

            {/* Notifications Setting */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-2">
              <div className="flex-1">
                <h3 className="font-roboto text-[18px] leading-[100%] font-medium text-oxford-blue mb-2">
                  {t("gatherer.profile.notifications")}
                </h3>
                <p className="font-roboto text-[16px] leading-[100%] font-normal text-[#6B7280]">
                  {t("gatherer.profile.notificationsDescription")}
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

            <div className="mt-8 w-full flex justify-end">
              <PrimaryButton
                text={t("gatherer.profile.saveSettings")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleSaveApplicationSettings}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GathererProfile;
