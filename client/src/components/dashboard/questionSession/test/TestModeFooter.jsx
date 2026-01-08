import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

const TestModeFooter = ({
  onExit,
  onPause,
  isPauseDisabled = false,
}) => {
  const { t } = useLanguage();
  const [studentEmail, setStudentEmail] = useState('');
  const [studentId, setStudentId] = useState('');

  // Load student email and ID from stored user object
  useEffect(() => {
    try {
      const stored =
        localStorage.getItem('user') || sessionStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        const email = user?.email || '';
        const id =
          user?.shortId ||
          user?.studentId ||
          user?.studentID ||
          user?.id ||
          user?._id ||
          '';
        setStudentEmail(email);
        setStudentId(id);
      }
    } catch (err) {
      // Ignore parse errors
      setStudentEmail('');
      setStudentId('');
    }
  }, []);

  // Format student ID as "fb4ef...174247" (first 5 chars + ... + last 6 chars)
  const formatStudentId = (id) => {
    if (!id || id.length <= 11) return id;
    const firstPart = id.substring(0, 5);
    const lastPart = id.substring(id.length - 6);
    return `${firstPart}...${lastPart}`;
  };

  return (
    <footer className="bg-white border-t border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 md:gap-10">
        {/* Student Info - Left Corner */}
        {(studentEmail || studentId) && (
          <div className="hidden md:flex flex-col items-start">
            {studentEmail && (
              <span className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto">
                {studentEmail}
              </span>
            )}
            {studentId && (
              <span className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto">
                Student ID: <span className="font-semibold text-oxford-blue">{formatStudentId(studentId)}</span>
              </span>
            )}
          </div>
        )}

        {/* Action Buttons - Right Side */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 md:gap-10">
        <button
          onClick={onPause}
          disabled={isPauseDisabled}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg text-[14px] md:text-[16px] font-normal font-roboto transition-opacity ${
            isPauseDisabled
              ? 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
              : 'bg-[#C6D8D3] text-oxford-blue hover:opacity-90'
          }`}
        >
          {t('dashboard.questionSession.actions.pauseSession') || 'Pause Session'}
        </button>
        <button
          onClick={onExit}
          className="w-full sm:w-auto px-4 py-2 bg-white border border-[#E5E7EB] text-oxford-blue rounded-lg text-[14px] md:text-[16px] font-normal font-roboto hover:opacity-90 transition-opacity"
        >
          {t('dashboard.questionSession.actions.exitSession')}
        </button>
        </div>
      </div>
    </footer>
  );
};

export default TestModeFooter;