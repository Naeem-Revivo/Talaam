import React from "react";
import { useSelector } from "react-redux";

const WelcomeHeader = ({ t }) => {
  const { user } = useSelector((state) => state.auth);

  const getDisplayName = () => {
    if (user?.name && user.name.trim()) {
      return user.name.trim();
    }
    if (user?.fullName && user.fullName.trim()) {
      const firstName = user.fullName.trim().split(/\s+/)[0];
      return firstName || user.fullName.trim();
    }
    return "User";
  };

  const displayName = getDisplayName();
  const welcomeTitle = t("dashboard.welcome.title")?.replace("{{name}}", displayName) || `Welcome back, ${displayName}!`;

  return (
    <div className="mb-1 w-full">
      <h2 className="font-archivo font-bold text-2xl md:text-3xl lg:text-[32px] leading-tight md:leading-[45px] text-dashboard-dark mb-[2.5px]">
        {welcomeTitle} 👋
      </h2>
      <p className="font-roboto font-normal text-base text-dashboard-gray">
        {t("dashboard.welcome.subtitle") || "Your QBank progress at a glance."}
      </p>
    </div>
  );
};

export default WelcomeHeader;
