import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import Loader from '../../../../components/common/Loader';

const QuestionStatusCard = ({ 
  questionStatus, 
  onStatusChange, 
  sessionMode, 
  testSummary, 
  studySummary, 
  loadingSummary 
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-dashboard p-4 md:p-6 w-full lg:h-auto">
      <h2 className="font-archivo font-bold text-[18px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
        {t('dashboard.practice.questionStatus.title')}
      </h2>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onStatusChange('solved')}
          className={`px-4 py-2 rounded-full font-roboto font-normal text-[16px] leading-[24px] text-center transition-all duration-200 ${
            questionStatus === 'solved'
              ? 'bg-cinnebar-red text-white'
              : 'bg-white text-oxford-blue border border-[#E5E7EB]'
          }`}
        >
          {t('dashboard.practice.questionStatus.solved')}
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
            {t('dashboard.practice.questionStatus.incorrect')}
          </span>
          <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-moonstone-blue ml-auto">
            {loadingSummary ? (
              <Loader size="sm" color="moonstone-blue" className="inline-block" />
            ) : sessionMode === 'test' ? (
              testSummary?.totalIncorrectAnswers || 0
            ) : (
              studySummary?.totalIncorrectAnswers || 0
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-oxford-blue">
            {t('dashboard.practice.questionStatus.correct')}
          </span>
          <span className="font-roboto font-normal text-[16px] leading-[24px] tracking-[0%] text-moonstone-blue ml-auto">
            {loadingSummary ? (
              <Loader size="sm" color="moonstone-blue" className="inline-block" />
            ) : sessionMode === 'test' ? (
              testSummary?.totalCorrectAnswers || 0
            ) : (
              studySummary?.totalCorrectAnswers || 0
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionStatusCard;
