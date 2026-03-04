import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { PrimaryButton } from "../../components/common/Button";
import { eye, openeye, lockicon } from "../../assets/svg/signup";
import authAPI from "../../api/auth";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";

const ChangePasswordPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSetNewPassword = async () => {
    if (!passwordData.currentPassword) {
      showErrorToast(t("dashboard.changePassword.errors.currentPasswordRequired") || "Current password is required");
      return;
    }
    if (!passwordData.newPassword) {
      showErrorToast(t("dashboard.changePassword.errors.newPasswordRequired") || "New password is required");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showErrorToast(t("dashboard.changePassword.errors.passwordLength") || "Password must be at least 8 characters");
      return;
    }
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(passwordData.newPassword)) {
      showErrorToast(t("dashboard.changePassword.errors.passwordFormat") || "Password must contain letters and numbers");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast(t("dashboard.changePassword.errors.passwordsDoNotMatch") || "Passwords do not match");
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      showErrorToast(t("dashboard.changePassword.errors.samePassword") || "New password must be different from current password");
      return;
    }

    setIsUpdating(true);
    try {
      // First, navigate to verify identity page with email
      // We'll get email from user context or pass it through state
      navigate("/dashboard/settings/verify-identity", {
        state: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
      });
    } catch (error) {
      showErrorToast(error.message || t("dashboard.changePassword.errors.updateFailed") || "Failed to proceed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mmin-h-screen bg-white px-[32px] pt-6 pb-[60px]">
      <div className="max-w-[500px]">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => navigate("/dashboard")}
              className="font-roboto text-[14px] leading-[21px] font-normal text-[#99B9CF]"
            >
              {t("common.breadcrumb.dashboard") || "Dashboard"}
            </button>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="#CCDCE7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <button
              onClick={() => navigate("/dashboard/setting")}
              className="font-roboto text-[14px] leading-[21px] font-normal text-[#99B9CF]"
            >
              {t("common.breadcrumb.settings") || "Settings"}
            </button>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="#CCDCE7" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span className="text-[#00040A] text-[14px] leading-[21px] font-medium font-roboto">
              {t("dashboard.changePassword.title") || "Change Password"}
            </span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 11.0002V7.00015C6.99875 5.7602 7.45828 4.56402 8.28937 3.64382C9.12047 2.72362 10.2638 2.14506 11.4975 2.02044C12.7312 1.89583 13.9671 2.23406 14.9655 2.96947C15.9638 3.70488 16.6533 4.785 16.9 6.00015M5 11.0002H19C20.1046 11.0002 21 11.8956 21 13.0002V20.0002C21 21.1047 20.1046 22.0002 19 22.0002H5C3.89543 22.0002 3 21.1047 3 20.0002V13.0002C3 11.8956 3.89543 11.0002 5 11.0002Z" stroke="#032746" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <h1 className="font-archivo text-[20px] leading-[28px] font-bold text-oxford-blue">
              {t("dashboard.changePassword.setNewPassword.title") || "Set New Password"}
            </h1>
          </div>


          <div className="px-[32px]">
            {/* Info Message */}
            <p className="text-[#6CA6C1] font-roboto text-[14px] leading-[21px] font-normal mb-4">
              {t("dashboard.changePassword.setNewPassword.infoMessage") || "Your new password must be different from previous used password."}
            </p>

            {/* Form */}
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block font-roboto text-[14px] leading-[21px] font-medium text-oxford-blue mb-2">
                  {t("dashboard.changePassword.currentPassword") || "Current Password"}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.83333 8.33366V5.83366C5.83333 4.72859 6.27232 3.66878 7.05372 2.88738C7.83512 2.10598 8.89493 1.66699 10 1.66699C11.1051 1.66699 12.1649 2.10598 12.9463 2.88738C13.7277 3.66878 14.1667 4.72859 14.1667 5.83366V8.33366M10.8333 13.3337C10.8333 13.7939 10.4602 14.167 10 14.167C9.53976 14.167 9.16667 13.7939 9.16667 13.3337C9.16667 12.8734 9.53976 12.5003 10 12.5003C10.4602 12.5003 10.8333 12.8734 10.8333 13.3337ZM4.16667 8.33366H15.8333C16.7538 8.33366 17.5 9.07985 17.5 10.0003V16.667C17.5 17.5875 16.7538 18.3337 15.8333 18.3337H4.16667C3.24619 18.3337 2.5 17.5875 2.5 16.667V10.0003C2.5 9.07985 3.24619 8.33366 4.16667 8.33366Z" stroke="#6697B7" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                  </div>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    className="w-full pl-12 pr-12 py-3 rounded-[12px] border-2 border-[#F5F5F5] bg-white font-roboto text-[14px] text-oxford-blue focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <img
                      src={showCurrentPassword ? openeye : eye}
                      alt="toggle password visibility"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block font-roboto text-[14px] leading-[21px] font-medium text-oxford-blue mb-2">
                  {t("dashboard.changePassword.newPassword") || "New Password"}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.83333 8.33366V5.83366C5.83333 4.72859 6.27232 3.66878 7.05372 2.88738C7.83512 2.10598 8.89493 1.66699 10 1.66699C11.1051 1.66699 12.1649 2.10598 12.9463 2.88738C13.7277 3.66878 14.1667 4.72859 14.1667 5.83366V8.33366M10.8333 13.3337C10.8333 13.7939 10.4602 14.167 10 14.167C9.53976 14.167 9.16667 13.7939 9.16667 13.3337C9.16667 12.8734 9.53976 12.5003 10 12.5003C10.4602 12.5003 10.8333 12.8734 10.8333 13.3337ZM4.16667 8.33366H15.8333C16.7538 8.33366 17.5 9.07985 17.5 10.0003V16.667C17.5 17.5875 16.7538 18.3337 15.8333 18.3337H4.16667C3.24619 18.3337 2.5 17.5875 2.5 16.667V10.0003C2.5 9.07985 3.24619 8.33366 4.16667 8.33366Z" stroke="#6697B7" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    placeholder={t("dashboard.changePassword.newPasswordPlaceholder") || "Create a strong password."}
                    className="w-full pl-12 pr-12 py-3 rounded-[12px] border-2 border-[#F5F5F5] bg-white font-roboto text-[14px] text-oxford-blue placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <img
                      src={showNewPassword ? openeye : eye}
                      alt="toggle password visibility"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                <p className="text-[#6CA6C1] font-roboto text-xs mt-2">
                  {t("dashboard.changePassword.newPasswordHint") || "Must be at least 8 characters with letters and numbers."}
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-roboto text-[14px] leading-[21px] font-medium text-oxford-blue mb-2">
                  {t("dashboard.changePassword.confirmPassword") || "Confirm Password"}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.83333 8.33366V5.83366C5.83333 4.72859 6.27232 3.66878 7.05372 2.88738C7.83512 2.10598 8.89493 1.66699 10 1.66699C11.1051 1.66699 12.1649 2.10598 12.9463 2.88738C13.7277 3.66878 14.1667 4.72859 14.1667 5.83366V8.33366M10.8333 13.3337C10.8333 13.7939 10.4602 14.167 10 14.167C9.53976 14.167 9.16667 13.7939 9.16667 13.3337C9.16667 12.8734 9.53976 12.5003 10 12.5003C10.4602 12.5003 10.8333 12.8734 10.8333 13.3337ZM4.16667 8.33366H15.8333C16.7538 8.33366 17.5 9.07985 17.5 10.0003V16.667C17.5 17.5875 16.7538 18.3337 15.8333 18.3337H4.16667C3.24619 18.3337 2.5 17.5875 2.5 16.667V10.0003C2.5 9.07985 3.24619 8.33366 4.16667 8.33366Z" stroke="#6697B7" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    placeholder={t("dashboard.changePassword.confirmPasswordPlaceholder") || "Confirm password."}
                    className="w-full pl-12 pr-12 py-3 rounded-[12px] border-2 border-[#F5F5F5] bg-white font-roboto text-[14px] text-oxford-blue placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <img
                      src={showConfirmPassword ? openeye : eye}
                      alt="toggle password visibility"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                <p className="text-[#6CA6C1] font-roboto text-xs mt-2">
                  {t("dashboard.changePassword.confirmPasswordHint") || "Must Match Password."}
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <PrimaryButton
                  text={isUpdating ? t("common.updating") || "Updating..." : t("dashboard.changePassword.setNewPassword.button") || "Set New Password"}
                  className="w-full py-3 px-6 text-[16px] font-medium bg-gradient-to-b from-[#032746] to-[#0A4B6E]"
                  onClick={handleSetNewPassword}
                  disabled={isUpdating}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
