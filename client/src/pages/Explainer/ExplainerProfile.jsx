import React, { useState } from "react";
import { PrimaryButton } from "../../components/common/Button";
import Dropdown from "../../components/shared/Dropdown";

const ExplainerProfile = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("English (US)");
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
              Account Settings
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              Manage your profile, password, and application settings.
            </p>
          </div>
        </header>

        {/* Profile Information Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              Profile Information
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-[50px] pb-[35px] px-[65px]">
            {/* Name */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                Name
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
                Current Plan
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
                Email
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
                Phone
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
                text="Save Changes"
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
              Change Password
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-[50px] pb-[35px] px-[65px]">
            {/* Current Password */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                Current Password
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
                  Enter Email address
                </label>
                <input
                  type="email"
                  value={passwordData.email}
                  onChange={(e) => handlePasswordChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
                />
              </div>
              <div className="flex justify-end">
                <PrimaryButton
                  text="Send Code"
                  className="py-[10px] px-7 text-nowrap"
                  onClick={handleSendCode}
                />
              </div>


            {/* Verification Code */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                Enter Code
              </label>
              <input
                type="text"
                value={passwordData.code}
                onChange={(e) => handlePasswordChange('code', e.target.value)}
                placeholder="6-digit Code"
                className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
              />
            </div>

            {/* New Password Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-8 w-full flex justify-end">
              <PrimaryButton
                text="Update Password"
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
              Application Settings
            </h2>
          </div>

          <div className="space-y-8 pt-[50px] pb-[35px] px-[65px]">
            {/* Language Setting */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-roboto text-[18px] leading-[100%] font-medium text-oxford-blue mb-2">
                  Language
                </h3>
              </div>
              <div className="w-full lg:w-[180px]">
                <Dropdown
                  value={language}
                  options={languageOptions}
                  onChange={setLanguage}
                  height="h-[50px]"
                  textClassName="font-roboto text-[16px] text-oxford-blue"
                />
              </div>
            </div>

            {/* Notifications Setting */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-2">
              <div className="flex-1">
                <h3 className="font-roboto text-[18px] leading-[100%] font-medium text-oxford-blue mb-2">
                  Notifications
                </h3>
                <p className="font-roboto text-[16px] leading-[100%] font-normal text-[#6B7280]">
                  Enable or disable email notifications for important updates.
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
                      notificationsEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-8 w-full flex justify-end">
              <PrimaryButton
                text="Save Settings"
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

export default ExplainerProfile;