import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useSelector } from "react-redux";
import AuthButton from "../../components/auth/AuthButton";
import { shield } from "../../assets/svg/signup";
import authAPI from "../../api/auth";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";

const VerifyIdentityPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [expirationTime, setExpirationTime] = useState(10 * 60); // 10 minutes in seconds

  const passwordData = location.state || {};

  useEffect(() => {
    // Send code automatically when page loads
    handleSendCode();
  }, []);

  useEffect(() => {
    // Countdown timer for resend
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    // Expiration countdown
    if (expirationTime > 0) {
      const timer = setTimeout(() => setExpirationTime(expirationTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [expirationTime]);

  const handleSendCode = async () => {
    const email = user?.email;
    if (!email) {
      showErrorToast(t("dashboard.verifyIdentity.errors.emailRequired") || "Email is required");
      return;
    }

    setIsSendingCode(true);
    try {
      await authAPI.forgotPasswordOTP({
        email: email,
      });
      setResendCountdown(60);
      setExpirationTime(10 * 60);
    } catch (error) {
      showErrorToast(error.message || t("dashboard.verifyIdentity.errors.sendCodeFailed") || "Failed to send verification code");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split("");
      const newCode = [...code];
      pastedCode.forEach((digit, i) => {
        if (index + i < 6 && /^\d$/.test(digit)) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      // Focus next empty input or last input
      const nextIndex = Math.min(index + pastedCode.length, 5);
      document.getElementById(`code-input-${nextIndex}`)?.focus();
    } else if (/^\d$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`code-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      showErrorToast(t("dashboard.verifyIdentity.errors.incompleteCode") || "Please enter the complete 6-digit code");
      return;
    }

    if (!user?.email) {
      showErrorToast(t("dashboard.verifyIdentity.errors.emailRequired") || "Email is required");
      return;
    }

    setIsVerifying(true);
    try {
      await authAPI.resetPasswordOTP({
        email: user.email,
        otp: verificationCode,
        password: passwordData.newPassword || passwordData.password,
      });

      showSuccessToast(t("dashboard.verifyIdentity.success.passwordUpdated") || "Password updated successfully");
      navigate("/dashboard/setting");
    } catch (error) {
      showErrorToast(error.message || t("dashboard.verifyIdentity.errors.verificationFailed") || "Verification failed");
      // Clear code on error
      setCode(["", "", "", "", "", ""]);
      document.getElementById("code-input-0")?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-white px-[32px] pt-6 pb-[60px]">
      <div className="">
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
              <path d="M6 12L10 8L6 4" stroke="#CCDCE7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <button
              onClick={() => navigate("/dashboard/setting")}
              className="font-roboto text-[14px] leading-[21px] font-normal text-[#99B9CF]"
            >
              {t("common.breadcrumb.settings") || "Settings"}
            </button>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="#CCDCE7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <button
              onClick={() => navigate("/dashboard/settings/change-password")}
              className="font-roboto text-[14px] leading-[21px] font-normal text-[#99B9CF]"
            >
              {t("dashboard.changePassword.title") || "Change Password"}
            </button>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="#CCDCE7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[#00040A] text-[14px] leading-[21px] font-medium font-roboto">
              {t("dashboard.verifyIdentity.title") || "Verify your identity"}
            </span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="">
          {/* Header */}
          <div className="flex items-center gap-1 mb-4">
            <div className="">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12.0004L11 14.0004L15 10.0004M20 13.0004C20 18.0004 16.5 20.5005 12.34 21.9505C12.1222 22.0243 11.8855 22.0207 11.67 21.9405C7.5 20.5005 4 18.0004 4 13.0004V6.00045C4 5.73523 4.10536 5.48088 4.29289 5.29334C4.48043 5.10581 4.73478 5.00045 5 5.00045C7 5.00045 9.5 3.80045 11.24 2.28045C11.4519 2.09945 11.7214 2 12 2C12.2786 2 12.5481 2.09945 12.76 2.28045C14.51 3.81045 17 5.00045 19 5.00045C19.2652 5.00045 19.5196 5.10581 19.7071 5.29334C19.8946 5.48088 20 5.73523 20 6.00045V13.0004Z" stroke="#032746" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </div>
            <h1 className="font-archivo text-[20px] leading-[28px] font-bold text-oxford-blue">
              {t("dashboard.verifyIdentity.title") || "Verify your identity"}
            </h1>
          </div>

            <p className="font-roboto font-normal text-[14px] leading-[21px] text-[#6CA6C1] mb-4">
              {t("dashboard.verifyIdentity.instructions") || "Please enter the 6-digit code we sent to"}{" "}
              <strong className="text-oxford-blue font-semibold text-[16px] leading-[26px]">{user?.email || "your.email@xyz.com"}</strong>
            </p>
          <div className="w-full max-w-[420px] mx-auto">
            {/* Timer Badge */}
            {expirationTime > 0 && (
              <div className="flex justify-center mb-6">
                <div className="bg-[#FEF2F2] rounded-[10px] px-4 py-2 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7" stroke="#ED4122" strokeWidth="1.5"/>
                    <path d="M8 4V8L10.5 10.5" stroke="#ED4122" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="font-roboto font-semibold text-[12px] leading-[16px] tracking-[0px] text-cinnebar-red">
                    {t("dashboard.verifyIdentity.codeExpiresMessage") || "Code expires in 10 minutes"}
                  </span>
                </div>
              </div>
            )}

            {/* Code Input Section */}
            <div className="flex flex-col gap-4 mb-6">
              <label className="block font-roboto font-semibold text-[14px] leading-[20px] tracking-[0px] text-oxford-blue text-start">
                {t("dashboard.verifyIdentity.enterCode") || "Enter Code"}
              </label>
              
              {/* 6 Input Boxes */}
              <div className="flex gap-2 justify-between mx-auto w-full">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 lg:w-14 h-12 lg:h-14 border-2 border-[#E5E7EB] rounded-[14px] text-center text-xl lg:text-2xl font-semibold focus:outline-none focus:border-[#6CA6C1] focus:ring-2 focus:ring-[#6CA6C1]/20"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <div className="mb-6">
              <AuthButton
                onClick={handleVerify}
                disabled={isVerifying || code.join("").length !== 6}
                className="w-full"
                showIcon={false}
              >
                {isVerifying ? t("common.verifying") || "Verifying..." : t("dashboard.verifyIdentity.verifyButton") || "Verify"}
              </AuthButton>
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <p className="font-roboto text-[14px] leading-[20px]">
                <span className="text-[#6CA6C1]">
                  {t("dashboard.verifyIdentity.dontReceiveCode") || "Don't receive the code?"}
                </span>{" "}
                {resendCountdown > 0 ? (
                  <>
                    <span className="text-red-600 underline">
                      {t("dashboard.verifyIdentity.resend") || "Resend"}
                    </span>{" "}
                    <span className="text-gray-400">
                      code in {resendCountdown}s
                    </span>
                  </>
                ) : (
                  <button
                    onClick={handleSendCode}
                    disabled={isSendingCode}
                    className="text-red-600 hover:text-red-700 underline"
                  >
                    {isSendingCode ? t("common.sending") || "Sending..." : t("dashboard.verifyIdentity.resend") || "Resend"}
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyIdentityPage;
