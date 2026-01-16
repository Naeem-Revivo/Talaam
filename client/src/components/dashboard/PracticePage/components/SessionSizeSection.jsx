import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import Dropdown from '../../../../components/shared/Dropdown';

const SessionSizeSection = ({ 
  sessionMode, 
  sessionSize, 
  timeLimit, 
  onSessionSizeChange, 
  onTimeLimitChange, 
  selectedSubtopicCount, 
  totalAvailableQuestions 
}) => {
  const { t } = useLanguage();

  return (
    <div className="mb-8 bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6">
      <h2 className="font-archivo font-bold text-[18px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
        {t('dashboard.practice.sessionSize.title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Number of Questions - For both modes */}
        <div className="w-full max-w-[200px]">
          <label className="block font-archivo font-bold text-[16px] leading-[24px] text-oxford-blue mb-2">
            {t('dashboard.practice.sessionSize.numberOfQuestions')}
          </label>
          <input
            type="number"
            value={sessionSize}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || (Number(value) >= 1 && Number(value) <= 50)) {
                onSessionSizeChange(value);
              }
            }}
            min="1"
            max="50"
            className="w-full h-[48px] px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-cinnebar-red focus:border-transparent font-roboto font-medium text-[16px] leading-[24px] text-black placeholder:text-[16px] placeholder:text-black"
          />
        </div>
        {/* Time Limit - Only for test mode, positioned on the right */}
        {sessionMode === 'test' && (
          <div className="w-full">
            <label className="block font-archivo font-bold text-[16px] leading-[24px] text-oxford-blue mb-2">
              {t('dashboard.practice.sessionSize.timeLimit')}
            </label>
            <Dropdown
              value={timeLimit}
              onChange={onTimeLimitChange}
              options={[
                { value: '15', label: `15 ${t('dashboard.practice.sessionSize.minutes')}` },
                { value: '30', label: `30 ${t('dashboard.practice.sessionSize.minutes')}` },
                { value: '45', label: `45 ${t('dashboard.practice.sessionSize.minutes')}` },
                { value: '60', label: `60 ${t('dashboard.practice.sessionSize.minutes')}` },
              ]}
              className="w-full"
              height="h-[48px]"
              textClassName="font-roboto font-medium text-[16px] leading-[24px]"
            />
          </div>
        )}
      </div>
      <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-gray-500 mb-4">
        {t('dashboard.practice.sessionSize.enterRange')}
      </p>
      {/* Warning Message - Only show when topics are selected and total is 0 */}
      {selectedSubtopicCount > 0 && totalAvailableQuestions === 0 && (
        <div className="rounded-lg flex items-center gap-2 w-full h-auto lg:h-[47px] bg-papaya-whip border border-cinnebar-red px-4 py-3 mb-4">
          <svg className="w-5 h-5 text-cinnebar-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="font-roboto font-normal text-[14px] leading-[20px] tracking-[0%] text-cinnebar-red">
            {t('dashboard.practice.sessionSize.onlyQuestionsAvailable')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionSizeSection;
