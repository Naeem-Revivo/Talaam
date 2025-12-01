import React, { useState } from "react";
import { PrimaryButton } from "../../components/common/Button";
import Dropdown from "../../components/shared/Dropdown";
import { useLanguage } from "../../context/LanguageContext";

const ProcessorProfile = () => {
  const { t, language } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [islanguage, setIsLanguage] = useState("English (US)");
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "+1 (555) 123-4567"
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr'

  const isRTL = dir === "rtl";

  const languageOptions = [
    { value: "English (US)", label: "English (US)" },
    { value: "Arabic", label: "Arabic" },
  ];

  const handleSaveChanges = () => {
    // Handle profile save logic
    console.log("Saving profile changes...", profileData);
  };

  const handleUpdatePassword = () => {
    // Handle password update logic
    console.log("Updating password...", passwordData);
  };

  const handleSendCode = () => {
    // Handle send code logic
    console.log("Sending verification code...");
  };

  const handleSaveApplicationSettings = () => {
    // Handle application settings save logic
    console.log("Saving application settings...");
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 2xl:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header className="flex gap-4">
          <div>
            <h1 className="font-archivo text-[36px] mb-2 leading-[40px] font-bold text-oxford-blue">
              {t("processor.profile.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("processor.profile.subtitle")}
            </p>
          </div>
        </header>

        {/* Profile Information Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              {t("processor.profile.profileInformation")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-[50px] pb-[35px] px-[65px]">
            {/* Name */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("processor.profile.name")}
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] font-normal rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            {/* Current Plan */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("processor.profile.currentPlan")}
              </label>
              <div className="p-3 rounded-[12px] shadow-sm border border-[#03274633]">
                <span className="font-roboto text-[14px] text-[#6B7280] font-normal">
                  Professional Plan
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("processor.profile.email")}
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("processor.profile.phone")}
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            <div className="mt-[70px] w-full flex justify-end col-span-2">
              <PrimaryButton
                text={t("processor.profile.saveChanges")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleSaveChanges}
              />
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              {t("processor.profile.changePassword")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-[50px] pb-[35px] px-[65px]">
            {/* Current Password */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("processor.profile.currentPassword")}
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                placeholder="Enter your current password"
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  {t("processor.profile.enterEmail")}
                </label>
                <input
                  type="email"
                  value={passwordData.email}
                  onChange={(e) => handlePasswordChange('email', e.target.value)}
                  placeholder={t("processor.profile.enterEmailPlaceholder")}
                  className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
                />
              </div>
              <div className="flex justify-end">
                <PrimaryButton
                  text={t("processor.profile.sendCode")}
                  className="py-[10px] px-7 text-nowrap"
                  onClick={handleSendCode}
                />
              </div>


            {/* Verification Code */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("processor.profile.enterCode")}
              </label>
              <input
                type="text"
                value={passwordData.code}
                onChange={(e) => handlePasswordChange('code', e.target.value)}
                placeholder={t("processor.profile.enterCodePlaceholder")}
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            {/* New Password Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  {t("processor.profile.newPassword")}
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder={t("processor.profile.newPasswordPlaceholder")}
                  className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  {t("processor.profile.confirmNewPassword")}
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder={t("processor.profile.confirmNewPasswordPlaceholder")}
                  className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-8 w-full flex justify-end">
              <PrimaryButton
                text={t("processor.profile.updatePassword")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleUpdatePassword}
              />
            </div>
          </div>
        </div>

        {/* Application Settings Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              {t("processor.profile.applicationSettings")}
            </h2>
          </div>

          <div className="space-y-8 pt-[50px] pb-[35px] px-[65px]">
            {/* Language Setting */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-roboto text-[18px] leading-[100%] font-medium text-oxford-blue mb-2">
                  {t("processor.profile.language")}
                </h3>
              </div>
              <div className="w-full lg:w-[180px]">
                <Dropdown
                  value={islanguage}
                  options={languageOptions}
                  onChange={setIsLanguage}
                  height="h-[50px]"
                  textClassName="font-roboto text-[16px] text-oxford-blue"
                />
              </div>
            </div>

            {/* Notifications Setting */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-2">
              <div className="flex-1">
                <h3 className="font-roboto text-[18px] leading-[100%] font-medium text-oxford-blue mb-2">
                  {t("processor.profile.notifications")}
                </h3>
                <p className="font-roboto text-[16px] leading-[100%] font-normal text-[#6B7280]">
                  {t("processor.profile.notificationsDescription")}
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
                text={t("processor.profile.saveSettings")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleSaveApplicationSettings}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessorProfile;