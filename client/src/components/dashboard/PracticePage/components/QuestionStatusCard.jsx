import React, { useEffect } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import Loader from '../../../../components/common/Loader';
import Dropdown from '../../../../components/shared/Dropdown';

const QuestionStatusCard = ({ 
  questionStatus, 
  onStatusChange, 
  sessionMode, 
  testSummary, 
  studySummary, 
  loadingSummary,
  selectedStatuses,
  onSelectedStatusesChange
}) => {
  const { t } = useLanguage();

  const solvedStatusOptions = [
    { value: 'incorrect', label: 'Incorrect' },
    { value: 'correct', label: 'Correct' },
    { value: 'flagged', label: 'Flagged' }
  ];

  // Set default to "incorrect" when "Solved" is selected and no status is set
  useEffect(() => {
    if (questionStatus === 'solved' && onSelectedStatusesChange) {
      const hasAnyStatus = selectedStatuses?.incorrect || selectedStatuses?.correct || selectedStatuses?.flagged;
      if (!hasAnyStatus) {
        onSelectedStatusesChange({
          incorrect: true,
          correct: false,
          flagged: false
        });
      }
    }
  }, [questionStatus, selectedStatuses, onSelectedStatusesChange]);

  const currentSolvedStatus = selectedStatuses?.incorrect ? 'incorrect' : 
                              selectedStatuses?.correct ? 'correct' : 
                              selectedStatuses?.flagged ? 'flagged' : 'incorrect';

  const handleSolvedStatusChange = (value) => {
    const newStatuses = {
      incorrect: false,
      correct: false,
      flagged: false,
      [value]: true
    };
    onSelectedStatusesChange && onSelectedStatusesChange(newStatuses);
  };

  return (
    <div className="bg-white rounded-[15px] border border-[#E6EEF3] shadow-sm shadow-[#0000001A] p-4 md:p-6 w-full">
      <h2 className="font-archivo font-bold text-[16px] md:text-[20px] leading-[28px] tracking-[0%] text-oxford-blue mb-4">
        {t('dashboard.practice.questionStatus.title')}
      </h2>
      
      {/* Radio buttons for New and Solved */}
      <div className="space-y-3 mb-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="questionStatus"
            checked={questionStatus === 'new'}
            onChange={() => onStatusChange('new')}
            className="mt-1 w-4 h-4 accent-cinnebar-red focus:ring-cinnebar-red"
          />
          <div className="flex-1">
            <span className="font-archivo font-medium text-[14px] leading-[21px] text-[#00040A] block">
              New
            </span>
            <span className="font-roboto font-normal text-[12px] leading-[26px] text-dashboard-gray block">
              Never attempted.
            </span>
          </div>
        </label>
        
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="questionStatus"
            checked={questionStatus === 'solved'}
            onChange={() => onStatusChange('solved')}
            className="mt-1 w-4 h-4 accent-cinnebar-red focus:ring-cinnebar-red"
          />
          <div className="flex-1">
            <span className="font-archivo font-medium text-[14px] leading-[21px] text-[#00040A] block">
              Solved
            </span>
            <span className="font-roboto font-normal text-[12px] leading-[26px] text-dashboard-gray block mb-2">
              All solved questions.
            </span>
            {questionStatus === 'solved' && (
              <Dropdown
                value={currentSolvedStatus}
                onChange={handleSolvedStatusChange}
                options={solvedStatusOptions}
                className="w-full"
                height="h-[40px]"
                textClassName="font-roboto font-normal text-[14px] leading-[20px] text-[#6A7282]"
              />
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default QuestionStatusCard;
