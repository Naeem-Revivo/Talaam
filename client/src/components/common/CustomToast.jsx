import React from "react";
import { loginFailed, loginSuccess } from "../../assets/svg/toast";

// Success Toast Component
export const SuccessToast = ({
  message,
  title = "Login Successful",
  icon: CustomIcon,
  showIcon = true,
}) => (
  <div className="flex flex-col items-start gap-3 p-4 z-50">
    <div className="flex items-center gap-3">
      {showIcon && (
        <div className="flex-shrink-0">
          <img
            src={CustomIcon || loginSuccess}
            alt="success"
            className="w-[30px] h-[30px]"
          />
        </div>
      )}
      <h3 className="font-archivo font-bold text-[20px] leading-[100%] text-[#166534]">
        {title}
      </h3>
    </div>
    <div className="flex-1 pt-0.5">
      <p className="font-roboto font-normal text-[14px] leading-[100%] text-[#166534]">
        {message || "You have successfully logged in."}
      </p>
    </div>
  </div>
);

// Error Toast Component
export const ErrorToast = ({
  message,
  title = "Login Failed",
  icon: CustomIcon,
  showIcon = true,
}) => (
  <div className="flex flex-col items-start gap-3 p-4 z-50">
    <div className="flex items-center gap-3">
      {showIcon && (
        <div className="flex-shrink-0">
          <img
            src={CustomIcon || loginFailed}
            alt="error"
            className="w-[30px] h-[30px]"
          />
        </div>
      )}
      <h3 className="font-archivo font-bold text-[20px] leading-[100%] text-[#B91C1C]">
        {title}
      </h3>
    </div>
    <div className="flex-1 pt-0.5">
      <p className="font-roboto font-normal text-[14px] leading-[100%] text-[#991B1B]">
        {message || "Incorrect email or password."}
      </p>
    </div>
  </div>
);

// Logout Success Toast
export const LogoutToast = ({
  message,
  title = "Logout Successful",
  icon: CustomIcon,
  showIcon = true,
}) => (
  <div className="flex flex-col items-start gap-3 p-4 z-50">
    <div className="flex items-center gap-3">
      {showIcon && (
        <div className="flex-shrink-0">
          <img
            src={CustomIcon || loginSuccess}
            alt="logout"
            className="w-[30px] h-[30px]"
          />
        </div>
      )}
      <h3 className="font-archivo font-bold text-[20px] leading-[100%] text-[#166534] mb-1">
        {title}
      </h3>
    </div>
    <div className="flex-1 pt-0.5">
      <p className="font-roboto font-normal text-[14px] leading-[100%] text-[#166534]">
        {message || "You have been logged out successfully."}
      </p>
    </div>
  </div>
);
