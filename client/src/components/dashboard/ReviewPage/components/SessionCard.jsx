import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext';

const SessionCard = ({ session }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Calculate incorrect count
  const incorrect = session.questions - Math.round((session.correct / 100) * session.questions);

  // Get accuracy assessment
  const getAccuracyAssessment = (percentage) => {
    if (percentage >= 90) return 'Excellent!';
    if (percentage >= 80) return 'Great!';
    if (percentage >= 70) return 'Good';
    return 'Keep going';
  };

  const accuracyAssessment = getAccuracyAssessment(session.correct);
  const circumference = 2 * Math.PI * 18; // radius = 18
  const offset = circumference - (session.correct / 100) * circumference;

  // Get accuracy color based on percentage
  const getAccuracyColor = (percentage) => {
    if (percentage > 90) return '#00C950';
    if (percentage > 80) return '#33749F';
    if (percentage > 70) return '#ED4122';
    return '#032746';
  };

  const accuracyColor = getAccuracyColor(session.correct);

  return (
    <div className="bg-white rounded-[16px] border-[1.5px] border-[#E6EEF3] shadow-dashboard p-6 flex flex-col gap-3">
      {/* Header: Session ID, Date, Mode */}
      <div className="flex items-center justify-between">
        {/* Session ID */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-b from-[#032746] to-[#173B50] text-white px-2 py-3 rounded-md text-[14px] font-roboto font-normal">
            {session.sessionCode ? `#${session.sessionCode}` : `#${String(session.id).slice(-3).padStart(3, '0')}`}
          </div>

          {/* Date */}
          <div className="flex flex-col items-start">
            <div className="text-[#737373] text-[12px] leading-[18px] font-normal font-roboto">Session Date</div>
            <div className="text-[#032746] text-[14px] leading-[20px] font-semibold font-archivo">{session.date}</div>
          </div>
        </div>

        {/* Mode Badge */}
        <span
          className={`px-4 py-1 rounded-full text-[12px] font-medium font-roboto whitespace-nowrap leading-[18px] tracking-[0%] text-center ${
            session.mode === 'Test'
              ? 'bg-[#FEF2F0] text-[#ED4122]'
              : 'bg-[#E6EEF3] text-[#33749F]'
          }`}
        >
          {session.mode}
        </span>
      </div>

      {/* Performance Metrics */}
      <div className="flex items-center gap-2">
        {/* Questions */}
        <div className="bg-[#F5F5F5] rounded-[14px] px-3 pt-3 pb-2 text-center flex-1">
          <div className="text-[12px] leading-[16px] font-roboto font-normal text-[#6A7282] mb-1">Questions</div>
          <div className="text-[20px] leading-[28px] font-archivo font-bold text-[#010814]">{session.questions}</div>
        </div>

        {/* Avg Time */}
        <div className="bg-[#F5F5F5] rounded-[14px] px-3 pt-3 pb-2 text-center flex-1">
          <div className="text-[12px] leading-[16px] font-roboto font-normal text-[#6A7282] mb-1">Avg Time</div>
          <div className="text-[20px] leading-[28px] font-archivo font-bold text-oxford-blue">{session.avgTime}</div>
        </div>

        {/* Incorrect */}
        <div className="bg-[#FEF2F0] rounded-[14px] px-3 pt-3 pb-2 text-center flex-1">
          <div className="text-[12px] leading-[16px] font-roboto font-normal text-[#6A7282] mb-1">Incorrect</div>
          <div className="text-[20px] leading-[28px] font-archivo font-bold text-[#ED4122]">{incorrect}</div>
        </div>
      </div>

      {/* Overall Accuracy */}
      <div className="flex items-center justify-between bg-[#EFF6FF] rounded-[14px] p-4">
        <div className="flex-1">
          <div className="text-xs font-normal font-roboto text-dashboard-gray mb-2">Overall Accuracy</div>
          <div className="flex items-center gap-2">
            <span className="text-[26px] leading-[36px] font-archivo font-bold" style={{ color: accuracyColor }}>{session.correct}%</span>
            <span className="text-xs font-normal font-roboto text-[#262626]">{accuracyAssessment}</span>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="relative w-14 h-14">
          <svg className="transform -rotate-90 w-14 h-14">
            <circle
              cx="24"
              cy="24"
              r="18"
              stroke="#E5E7EB"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="18"
              stroke={session.mode === 'Test' ? '#ED4122' : '#33749F'}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-[10px] flex-wrap">
        {session.status === 'paused' ? (
          <button
            className="flex-1 px-4 py-2 bg-[#EF4444] text-[#FFFFFF] rounded-[8px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity whitespace-nowrap"
            onClick={() => navigate(`/dashboard/session?mode=${session.mode === 'Test' ? 'test' : 'study'}&resume=${session.id}`, {
              state: { pausedSessionId: session.id }
            })}
          >
            {t('dashboard.review.table.actions.continue') || 'Continue'}
          </button>
        ) : (
          <>
            <button
              className="flex-1 px-4 py-2 bg-gradient-to-b from-[#032746] to-[#173B50] text-white rounded-[8px] text-[12px] font-medium font-roboto leading-[18px] tracking-[0%] text-center hover:opacity-90 transition-opacity whitespace-nowrap"
              onClick={() => navigate(`/dashboard/review-incorrect?sessionId=${session.id}`)}
            >
              {t('dashboard.review.table.actions.reviewIncorrect') || 'Review Incorrect'}
            </button>
            <button
              className="flex-1 px-4 py-2 bg-white border border-orange-dark text-orange-dark rounded-[8px] text-[12px] font-medium font-roboto leading-[18px] tracking-[0%] text-center hover:bg-red-50 transition-colors whitespace-nowrap"
              onClick={() => navigate(`/dashboard/review-all?sessionId=${session.id}`)}
            >
              {t('dashboard.review.table.actions.reviewAll') || 'Review All'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
