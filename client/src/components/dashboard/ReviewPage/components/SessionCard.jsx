import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext';

const SessionCard = ({ session, getCorrectColor }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-dashboard p-7 h-[143px] flex flex-col justify-between">
      {/* Top Row: Session ID, Mode, Date */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="text-[14px] font-normal text-oxford-blue font-roboto leading-[100%] tracking-[0%]">
          {session.sessionCode || session.id}
        </div>
        <div className="flex-1 flex justify-center">
          <span
            className={`px-[10px] py-[5px] rounded-[6px] text-[14px] font-normal font-roboto whitespace-nowrap leading-[100%] tracking-[0%] text-center ${
              session.mode === 'Test'
                ? 'bg-[#FEEBC8] text-[#ED4122]'
                : 'bg-[#C6D8D3] text-oxford-blue'
            }`}
          >
            {session.mode}
          </span>
        </div>
        <div className="text-[14px] font-normal text-oxford-blue font-archivo leading-[100%] tracking-[0%]">
          {session.date}
        </div>
      </div>

      {/* Middle Row: Questions, Correct, Avg Time */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2 text-[14px] font-normal font-roboto leading-[100%] tracking-[0%]">
        <div className="text-oxford-blue">
          {t('dashboard.review.table.mobile.questions')} {session.questions}
        </div>
        <div className={`${getCorrectColor(session.correct)}`}>
          {t('dashboard.review.table.mobile.correct')} {session.correct}%
        </div>
        <div className="text-oxford-blue">
          {t('dashboard.review.table.mobile.avgTime')} {session.avgTime}
        </div>
      </div>

      {/* Bottom Row: Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {session.status === 'paused' ? (
          <button
            className="flex-1 min-w-[120px] px-[10px] py-[5px] bg-[#EF4444] text-[#FFFFFF] rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity"
            onClick={() => navigate(`/dashboard/session?mode=${session.mode === 'Test' ? 'test' : 'study'}&resume=${session.id}`, {
              state: { pausedSessionId: session.id }
            })}
          >
            {t('dashboard.review.table.actions.continue') || 'Continue'}
          </button>
        ) : (
          <>
            <button
              className="flex-1 min-w-[120px] px-[10px] py-[5px] bg-[#ED4122] text-[#FFFFFF] rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity"
              onClick={() => navigate(`/dashboard/review-all?sessionId=${session.id}`)}
            >
              {t('dashboard.review.table.actions.reviewAll')}
            </button>
            <button
              className="flex-1 min-w-[120px] px-[10px] py-[5px] bg-[#C6D8D3] text-oxford-blue rounded-[6px] text-[14px] font-normal font-roboto leading-[100%] tracking-[0%] text-center hover:opacity-90 transition-opacity"
              onClick={() => navigate(`/dashboard/review-incorrect?sessionId=${session.id}`)}
            >
              {t('dashboard.review.table.actions.reviewIncorrect')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
