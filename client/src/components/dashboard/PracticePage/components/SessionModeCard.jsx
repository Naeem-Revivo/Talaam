import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext';

const SessionModeCard = ({ 
  sessionMode, 
  hasActiveSubscription, 
  checkingSubscription, 
  onModeChange 
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full lg:h-full">
      <h2 className="font-archivo font-bold text-lg md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
        {t('dashboard.practice.sessionMode.title')}
      </h2>
      {!hasActiveSubscription && !checkingSubscription && (
        <div className="mb-4 flex items-center gap-2 rounded-lg w-full bg-yellow-50 border border-yellow-200 p-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-yellow-800">
            Subscription required to access study mode and test mode. 
            <button 
              onClick={() => navigate('/dashboard/subscription-billings')}
              className="ml-1 underline font-semibold hover:text-yellow-900"
            >
              Subscribe now
            </button>
          </p>
        </div>
      )}
      <div className="flex flex-row gap-2 md:gap-4 mb-4">
        <button
          onClick={() => onModeChange('test')}
          disabled={!hasActiveSubscription || checkingSubscription}
          className={`rounded-lg transition-all duration-200 text-left w-full h-[82px] md:h-[81.6px] p-2 md:p-4 ${
            sessionMode === 'test'
              ? 'bg-cinnebar-red border border-cinnebar-red shadow-input'
              : hasActiveSubscription
              ? 'bg-white border border-[#E5E7EB]'
              : 'bg-gray-100 border border-gray-300 opacity-60 cursor-not-allowed'
          }`}
        >
          <p className={`font-archivo font-bold text-[16px] leading-[24px] tracking-[0%] mb-1 md:mb-2 text-center ${
            sessionMode === 'test' ? 'text-white' : hasActiveSubscription ? 'text-black' : 'text-gray-500'
          }`}>
            {t('dashboard.practice.sessionMode.testMode')}
          </p>
          <p className={`font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-center ${
            sessionMode === 'test' ? 'text-white' : hasActiveSubscription ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {t('dashboard.practice.sessionMode.testModeDescription')}
          </p>
        </button>
        <button
          onClick={() => onModeChange('study')}
          disabled={!hasActiveSubscription || checkingSubscription}
          className={`rounded-lg transition-all duration-200 text-left w-full h-[82px] md:h-[81.6px] p-2 md:p-4 ${
            sessionMode === 'study'
              ? 'bg-cinnebar-red border border-cinnebar-red shadow-input'
              : hasActiveSubscription
              ? 'bg-white border border-[#E5E7EB]'
              : 'bg-gray-100 border border-gray-300 opacity-60 cursor-not-allowed'
          }`}
        >
          <p className={`font-archivo font-bold text-[16px] leading-[24px] tracking-[0%] mb-1 md:mb-2 text-center ${
            sessionMode === 'study' ? 'text-white' : hasActiveSubscription ? 'text-black' : 'text-gray-500'
          }`}>
            {t('dashboard.practice.sessionMode.studyMode')}
          </p>
          <p className={`font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-center ${
            sessionMode === 'study' ? 'text-white' : hasActiveSubscription ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {t('dashboard.practice.sessionMode.studyModeDescription')}
          </p>
        </button>
      </div>
      <div className="flex items-center gap-2 rounded-lg w-full lg:w-[544px] h-auto lg:h-[45px] bg-papaya-whip border border-[#FFE5B0] p-3 mt-6 lg:mt-10">
        <svg className="w-5 h-5 text-oxford-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-oxford-blue">
          {t('dashboard.practice.sessionMode.timeLimitNote')}
        </p>
      </div>
    </div>
  );
};

export default SessionModeCard;
