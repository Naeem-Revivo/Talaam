import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthSidePanel from './AuthSidePanel';
import { useLanguage } from '../../context/LanguageContext';

const AuthLayout = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className={`flex bg-white ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Side Panel */}
      <div className="lg:w-[50%] xl:w-[45%]">
        <AuthSidePanel />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen flex items-center justify-center overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
