import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext';

const SessionModeCard = ({
  sessionMode,
  hasActiveSubscription,
  checkingSubscription,
  onModeChange,
  timeLimit,
  onTimeLimitChange,
  showExplanationAfterSubmit,
  onShowExplanationAfterSubmitChange
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[15px] border border-[#E6EEF3] shadow-sm shadow-[#0000001A] p-4 md:p-6 w-full">
      <h2 className="font-archivo font-bold text-lg md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-2">
        {t('dashboard.practice.sessionMode.title')}
      </h2>
      <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-gray-600 mb-5">
        {t('dashboard.practice.sessionMode.subtitle')}
      </p>
      {!hasActiveSubscription && !checkingSubscription && (
        <div className="flex items-center gap-2 rounded-lg w-full bg-yellow-50 border border-yellow-200 p-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-yellow-800">
            {t('dashboard.practice.sessionMode.subscriptionRequired')}
            <button
              onClick={() => navigate('/dashboard/subscription-billings')}
              className="ml-1 underline font-semibold hover:text-yellow-900"
            >
              {t('dashboard.practice.sessionMode.subscribeNow')}
            </button>
          </p>
        </div>
      )}
      <div className="flex flex-row gap-2 md:gap-4 mb-4">
        <div className="flex flex-col gap-1 w-full">
          <button
            onClick={() => onModeChange('test')}
            disabled={!hasActiveSubscription || checkingSubscription}
            className={`rounded-lg transition-all duration-200 text-left w-full h-[82px] md:h-[93px] p-4 md:p-5 ${sessionMode === 'test'
                ? 'bg-[#ED41220D] border border-[#ED4122] shadow-input'
                : hasActiveSubscription
                  ? 'bg-white border border-[#E5E7EB]'
                  : 'bg-gray-100 border border-gray-300 opacity-60 cursor-not-allowed'
              }`}
          >
            <p className={`font-archivo font-bold text-base text-[#00040A] tracking-[0%] mb-1 md:mb-2 text-start ${sessionMode === 'test' ? 'text-dashboard-dark' : hasActiveSubscription ? 'text-black' : 'text-gray-500'
              }`}>
              {t('dashboard.practice.sessionMode.testMode')}
            </p>
            <p className={`font-roboto font-normal text-[14px] leading-[21px] text-dashboard-gray tracking-[0%] text-start ${sessionMode === 'test' ? 'text-dashboard-gray' : hasActiveSubscription ? 'text-gray-600' : 'text-gray-400'
              }`}>
              {t('dashboard.practice.sessionMode.testModeFullDescription')}
            </p>
          </button>
          <div className="">
            <label className="block font-roboto font-medium text-[12px] leading-[18px] text-oxford-blue mb-1">
              {t('dashboard.practice.sessionMode.timeLimit')}
            </label>
            <div className="flex gap-2">
              {['10', '15', '20', '30'].map((limit) => (
                <button
                  key={limit}
                  onClick={() => onTimeLimitChange(limit)}
                  disabled={!hasActiveSubscription || checkingSubscription}
                  className={`flex-1 max-w-[69px] h-[34px] rounded-lg border transition-all duration-200 font-roboto font-medium text-[12px] leading-[18px] ${timeLimit === limit
                      ? 'bg-[#E6EEF3] border-[#33749F] text-[#33749F]'
                      : hasActiveSubscription
                        ? 'bg-white border-[#E5E7EB] text-dashboard-gray hover:border-[#33749F]'
                        : 'bg-gray-100 border-gray-300 text-dashboard-gray cursor-not-allowed'
                    }`}
                >
                  {limit} mins
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <button
            onClick={() => onModeChange('study')}
            disabled={!hasActiveSubscription || checkingSubscription}
            className={`rounded-lg transition-all duration-200 text-left w-full h-[82px] md:h-[93px] p-4 md:p-5 ${sessionMode === 'study'
                ? 'bg-[#ED41220D] border border-[#ED4122] shadow-input'
                : hasActiveSubscription
                  ? 'bg-white border border-[#E5E7EB]'
                  : 'bg-gray-100 border border-gray-300 opacity-60 cursor-not-allowed'
              }`}
          >
            <p className={`font-archivo font-bold text-base text-[#00040A] tracking-[0%] mb-1 md:mb-2 text-start ${sessionMode === 'study' ? 'text-dashboard-dark' : hasActiveSubscription ? 'text-black' : 'text-gray-500'
              }`}>
              {t('dashboard.practice.sessionMode.studyMode')}
            </p>
            <p className={`font-roboto font-normal text-[14px] leading-[21px] text-dashboard-gray tracking-[0%] text-start ${sessionMode === 'study' ? 'text-dashboard-gray' : hasActiveSubscription ? 'text-gray-600' : 'text-gray-400'
              }`}>
              {t('dashboard.practice.sessionMode.studyModeFullDescription')}
            </p>
          </button>
          <div className="flex items-center justify-between">
            <label className="font-roboto font-normal text-[12px] leading-[16px] text-dashboard-gray">
              {t('dashboard.practice.sessionMode.showExplanationAfterSubmit')}
            </label>
            <button
              onClick={() => onShowExplanationAfterSubmitChange && onShowExplanationAfterSubmitChange(!showExplanationAfterSubmit)}
              disabled={!hasActiveSubscription || checkingSubscription}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showExplanationAfterSubmit ? 'bg-[#032746]' : 'bg-gray-300'
                } ${!hasActiveSubscription || checkingSubscription ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showExplanationAfterSubmit ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionModeCard;
