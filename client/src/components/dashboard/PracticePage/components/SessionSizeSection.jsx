import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const SessionSizeSection = ({ 
  sessionMode, 
  sessionSize, 
  onSessionSizeChange, 
  selectedSubtopicCount, 
  totalAvailableQuestions 
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-[15px] border border-[#E6EEF3] shadow-sm shadow-[#0000001A] p-4 md:p-6 w-full">
      <h2 className="font-archivo font-bold text-[16px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
        {t('dashboard.practice.sessionSize.title')}
      </h2>
      <div className="mb-2">
        <label className="block font-archivo font-medium text-[14px] leading-[21px] text-[#00040A] mb-2">
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
          className="w-full h-[48px] px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-cinnebar-red focus:border-transparent font-roboto font-medium text-[14px] leading-[20px] text-black placeholder:text-[14px] placeholder:text-black"
        />
        <p className="font-roboto font-normal text-[12px] leading-[26px] tracking-[0%] text-dashboard-gray mt-2">
          Enter between 1-50.
        </p>
      </div>
    </div>
  );
};

export default SessionSizeSection;
