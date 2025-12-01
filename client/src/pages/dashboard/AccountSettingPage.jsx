import React, { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { PrimaryButton } from "../../components/common/Button";
import Dropdown from "../../components/shared/Dropdown";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/slices/authSlice";

const AccountSettingPage = () => {
  const { language, t } = useLanguage();
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

  useEffect(() => {
    const init = async () => {
      if (!user) {
        try {
          const result = await dispatch(fetchCurrentUser());
          const fetched = result.payload?.data?.user;
          if (fetched) {
            setProfileData((prev) => ({
              ...prev,
              name: fetched.fullName || fetched.name || "",
              email: fetched.email || "",
              phone: fetched.phone || "",
            }));
          }
        } catch {
          // ignore
        }
      } else {
        setProfileData((prev) => ({
          ...prev,
          name: user.fullName || user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        }));
      }
    };
    init();
  }, [user, dispatch]);

  const languageOptions = [
    {
      value: "English (US)",
      label: t("dashboard.accountSettings.languageOptions.english"),
    },
    {
      value: "Arabic",
      label: t("dashboard.accountSettings.languageOptions.arabic"),
    },
  ];

  const handleSaveChanges = () => {
    console.log("Saving profile changes...", profileData);
  };

  const handleUpdatePassword = () => {
    console.log("Updating password...", passwordData);
  };

  const handleSendCode = () => {
    console.log("Sending verification code...");
  };

  const handleSaveApplicationSettings = () => {
    console.log("Saving application settings...");
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
              {t("dashboard.accountSettings.hero.title")}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t("dashboard.accountSettings.hero.subtitle")}
            </p>
          </div>
        </header>

        {/* Profile Information Section */}
        <div className="bg-white rounded-[12px] shadow-[0px_2px_25px_0px_#0000001A]">
          <div className="pt-[42px] pb-[28px] px-[30px] border-b border-[#E2E2E2]">
            <h2 className="font-archivo text-[20px] leading-[100%] font-bold text-oxford-blue">
              {t("dashboard.accountSettings.profileInformation.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-[50px] pb-[35px] px-[65px]">
            {/* Name */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("dashboard.accountSettings.profileInformation.name")}
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

            {/* Current Plan */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("dashboard.accountSettings.profileInformation.currentPlan")}
              </label>
              <div className="p-3 rounded-[12px] shadow-sm border border-[#03274633]">
                <span
                  className={`font-roboto text-[14px] text-[#6B7280] font-normal ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t(
                    "dashboard.accountSettings.profileInformation.professionalPlan"
                  )}
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("dashboard.accountSettings.profileInformation.email")}
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
                {t("dashboard.accountSettings.profileInformation.phone")}
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
                text={t(
                  "dashboard.accountSettings.profileInformation.saveChanges"
                )}
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
              {t("dashboard.accountSettings.changePassword.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-[50px] pb-[35px] px-[65px]">
            {/* Current Password */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("dashboard.accountSettings.changePassword.currentPassword")}
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
                placeholder={t(
                  "dashboard.accountSettings.changePassword.currentPasswordPlaceholder"
                )}
                className={`w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </div>

            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("dashboard.accountSettings.changePassword.enterEmail")}
              </label>
              <input
                type="email"
                value={passwordData.email}
                onChange={(e) => handlePasswordChange("email", e.target.value)}
                placeholder={t(
                  "dashboard.accountSettings.changePassword.emailPlaceholder"
                )}
                className={`w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </div>

            <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
              <PrimaryButton
                text={t("dashboard.accountSettings.changePassword.sendCode")}
                className="py-[10px] px-7 text-nowrap"
                onClick={handleSendCode}
              />
            </div>

            {/* Verification Code */}
            <div>
              <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                {t("dashboard.accountSettings.changePassword.enterCode")}
              </label>
              <input
                type="text"
                value={passwordData.code}
                onChange={(e) => handlePasswordChange("code", e.target.value)}
                placeholder={t(
                  "dashboard.accountSettings.changePassword.codePlaceholder"
                )}
                className={`w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                  isRTL ? "text-right" : "text-left"
                }`}
              />
            </div>

            {/* New Password Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  {t("dashboard.accountSettings.changePassword.newPassword")}
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  placeholder={t(
                    "dashboard.accountSettings.changePassword.newPasswordPlaceholder"
                  )}
                  className={`w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                />
              </div>

              <div>
                <label className="block font-roboto text-[16px] leading-[100%] font-normal text-oxford-blue mb-3">
                  {t(
                    "dashboard.accountSettings.changePassword.confirmNewPassword"
                  )}
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                  placeholder={t(
                    "dashboard.accountSettings.changePassword.confirmPasswordPlaceholder"
                  )}
                  className={`w-full p-3 placeholder:text-[#6B7280] placeholder:text-[14px] rounded-[12px] shadow-sm border border-[#03274633] font-roboto text-[14px] text-[#6B7280] focus:outline-none ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                />
              </div>
            </div>

            <div
              className={`mt-8 w-full flex ${
                isRTL ? "justify-start" : "justify-end"
              }`}
            >
              <PrimaryButton
                text={t(
                  "dashboard.accountSettings.changePassword.updatePassword"
                )}
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
              {t("dashboard.accountSettings.applicationSettings.title")}
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
                  {t(
                    "dashboard.accountSettings.applicationSettings.language.label"
                  )}
                </h3>
              </div>
              <div className="w-full lg:w-[180px]">
                <Dropdown
                  value={selectedLanguage}
                  options={languageOptions}
                  onChange={setSelectedLanguage}
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
                  {t(
                    "dashboard.accountSettings.applicationSettings.notifications.label"
                  )}
                </h3>
                <p
                  className={`font-roboto text-[16px] leading-[100%] font-normal text-[#6B7280] ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t(
                    "dashboard.accountSettings.applicationSettings.notifications.description"
                  )}
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
                text={t(
                  "dashboard.accountSettings.applicationSettings.saveSettings"
                )}
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

export default AccountSettingPage;
