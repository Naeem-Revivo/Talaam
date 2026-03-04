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
    <button
      disabled={!canStartSession || !hasActiveSubscription || checkingSubscription}
      onClick={onClick}
      className={`font-archivo font-medium text-base text-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 w-full h-12 ${
        canStartSession && hasActiveSubscription ? 'bg-gradient-to-r from-[#ED4122] to-[#DC2626] text-white' : 'bg-ash-gray text-oxford-blue cursor-not-allowed'
      }`}
    >
      {!hasActiveSubscription && !checkingSubscription 
        ? 'Subscribe to Start Session' 
        : t('dashboard.practice.beginSession')}
    </button>
  );
};

export default BeginSessionButton;
