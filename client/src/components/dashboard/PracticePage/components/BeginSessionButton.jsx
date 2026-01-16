import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const BeginSessionButton = ({ 
  canStartSession, 
  hasActiveSubscription, 
  checkingSubscription, 
  onClick 
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-center">
      <button
        disabled={!canStartSession || !hasActiveSubscription || checkingSubscription}
        onClick={onClick}
        className={`font-archivo font-bold text-[20px] leading-[28px] tracking-[0%] text-oxford-blue text-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full lg:w-[1120px] h-[50px] md:h-[60px] ${
          canStartSession && hasActiveSubscription ? 'bg-cinnebar-red text-white' : 'bg-ash-gray text-oxford-blue cursor-not-allowed'
        }`}
      >
        {!hasActiveSubscription && !checkingSubscription 
          ? 'Subscribe to Start Session' 
          : t('dashboard.practice.beginSession')}
      </button>
    </div>
  );
};

export default BeginSessionButton;
