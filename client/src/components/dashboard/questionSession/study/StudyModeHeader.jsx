import React, { useState, useEffect } from 'react';
import { flag, setting, listcheck } from '../icons';
import { useLanguage } from '../../../../context/LanguageContext';
import studentQuestionsAPI from '../../../../api/studentQuestions';
import { showSuccessToast, showErrorToast } from '../../../../utils/toastConfig';

const StudyModeHeader = ({
  currentIndex,
  totalQuestions,
  currentQuestion,
  onToggleQuestionNav,
  onNavigate,
  sessionStartTime,
}) => {
  const { t, language } = useLanguage();
  const [timeRunning, setTimeRunning] = useState('00:00:00');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [isFlagging, setIsFlagging] = useState(false);
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const [studentId, setStudentId] = useState('');

  // Load student id from stored user object
  useEffect(() => {
    try {
      const stored =
        localStorage.getItem('user') || sessionStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        const id =
          user?.studentId ||
          user?.studentID ||
          user?.id ||
          user?._id ||
          '';
        setStudentId(id);
      }
    } catch (err) {
      // Ignore parse errors; non-blocking for header
      setStudentId('');
    }
  }, []);
  
  // Check if question is flagged
  const isFlagged = currentQuestion?.isFlagged || currentQuestion?.flagStatus;
  const flagStatus = currentQuestion?.flagStatus;
  const studentFlagReason = currentQuestion?.flagReason;
  const rejectionReason = currentQuestion?.flagRejectionReason;

  // Format time as HH:MM:SS
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Update time running every second
  useEffect(() => {
    if (!sessionStartTime) return;

    // Update running time immediately
    const updateTime = () => {
      const elapsed = Date.now() - sessionStartTime;
      setTimeRunning(formatTime(elapsed));
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);
  return (
    <header className="bg-white border-b border-[#E5E7EB] px-4 md:px-6 py-3 md:py-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
          <div className="text-[20px] font-bold text-oxford-blue font-archivo leading-[28px] tracking-[0%]">
            {t('dashboard.questionSession.item').replace('{{current}}', (currentIndex + 1).toString()).replace('{{total}}', totalQuestions.toString())}
          </div>
          <div className="hidden lg:block text-[14px] md:text-[16px] leading-[100%] font-normal font-archivo text-oxford-blue">
            {t('dashboard.questionSession.questionId')} {currentQuestion.id}
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <button 
              onClick={() => setShowFlagModal(true)}
              className="flex items-center justify-center gap-1 border-[0.5px] border-[#032746] rounded-[4px] w-[61px] h-[35px] hover:bg-[#F3F4F6] transition"
            >
              <p className='text-[10px] leading-[100%] font-normal font-archivo'>Mark</p><svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.44434 0.5L6.86719 1.29395L5.59863 3.03613L6.86719 4.7793L7.44434 5.57422H2.05566V7.65137C2.05566 8.07935 1.70533 8.42969 1.27734 8.42969C0.849549 8.42946 0.5 8.07921 0.5 7.65137V2.11133C0.5 1.6639 0.611812 1.23584 0.923828 0.923828C1.23584 0.611812 1.6639 0.5 2.11133 0.5H7.44434Z" stroke="#032746" />
              </svg>
            </button>
            {isFlagged && (
              <button 
                onClick={() => setShowReasonModal(true)}
                className="flex items-center justify-center gap-1 border-[0.5px] border-[#ED4122] rounded-[4px] px-2 h-[35px] hover:bg-[#FEF2F2] transition"
              >
                <p className='text-[10px] leading-[100%] font-normal font-archivo text-[#ED4122]'>{t('dashboard.questionSession.reason') || 'Reason'}</p>
              </button>
            )}
          </div>
          <button onClick={onToggleQuestionNav} className="lg:hidden text-oxford-blue hover:opacity-70">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-2 w-full justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFlagModal(true)}
              className="px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[14px] font-normal font-roboto hover:opacity-70 flex items-center gap-2"
            >
              <img src={flag} alt="Mark" />
            </button>
            {isFlagged && (
              <button 
                onClick={() => setShowReasonModal(true)}
                className="px-3 py-1.5 bg-[#FEF2F2] text-[#ED4122] border border-[#ED4122] rounded text-[14px] font-normal font-roboto hover:opacity-70"
              >
                {t('dashboard.questionSession.reason') || 'Reason'}
              </button>
            )}
          </div>
          {/* <button className="px-3 py-1.5 bg-[#F3F4F6] text-oxford-blue rounded text-[14px] font-normal font-roboto hover:opacity-70">
            {t('dashboard.questionSession.formulaSheet')}
          </button> */}
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal text-oxford-blue font-roboto">
              {t('dashboard.questionSession.timeRunning')}: <span className="font-bold">{timeRunning}</span>
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-wrap flex-1 justify-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(-1)}
              disabled={currentIndex === 0}
              className={`px-3 py-1 rounded text-[18px] leading-[100%] font-medium font-archivo transition-colors ${currentIndex === 0 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-oxford-blue hover:bg-[#F3F4F6]'
                }`}
            >
              {t('dashboard.questionSession.actions.previous')}
            </button>
            <button
              onClick={() => onNavigate(1)}
              disabled={currentIndex === totalQuestions - 1}
              className={`px-3 py-1 rounded text-[18px] leading-[100%] font-medium font-archivo transition-colors ${currentIndex === totalQuestions - 1 ? 'text-[#9CA3AF] cursor-not-allowed' : 'text-oxford-blue hover:bg-[#F3F4F6]'
                }`}
            >
              {t('dashboard.questionSession.actions.next')}
            </button>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 md:gap-4 w-full lg:w-auto justify-between lg:justify-end">
          {/* <button className="hidden lg:flex w-[116px] max-h-[35px] items-center text-nowrap justify-center px-2 md:px-4 py-3 border-[0.5px] text-oxford-blue rounded text-[10px] leading-[100%] font-normal font-archivo hover:opacity-70">
            <img src={listcheck} alt="Mark" className='w-5 h-5'/>
            <span className="hidden sm:inline">{t('dashboard.questionSession.formulaSheet')}</span>
            <span className="sm:hidden">{t('dashboard.questionSession.formulaSheet')}</span>
          </button> */}
          <div className="hidden lg:flex items-center gap-2">
          {studentId && (
              <span className="text-[12px] md:text-[14px] font-normal text-dark-gray font-roboto">
                Student ID: <span className="font-semibold text-oxford-blue">{studentId}</span>
              </span>
            )}
            <span className="text-[12px] md:text-[14px] leading-[24px] font-normal text-black font-archivo border py-2 px-4 border-[#E5E7EB] rounded-lg flex flex-col">
              <span className="hidden sm:inline text-[10px] leading-[16px] font-roboto font-normal text-[#4B5563]">{t('dashboard.questionSession.timeRunning')} </span>
              <span className="text-[12px] font-bold">{timeRunning}</span>
            </span>
            <button className="text-oxford-blue hover:opacity-70">
              <img src={setting} alt="Settings" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir={dir}>
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] font-archivo font-bold text-oxford-blue">
                {t('dashboard.questionSession.flagQuestion') || 'Flag Question'}
              </h3>
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason('');
                }}
                className="text-oxford-blue hover:text-[#ED4122] text-[24px] leading-none"
                disabled={isFlagging}
              >
                ×
              </button>
            </div>
            <p className="text-[14px] font-roboto text-dark-gray mb-4">
              {t('dashboard.questionSession.flagReasonLabel') || 'Please provide a reason for flagging this question:'}
            </p>
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder={t('dashboard.questionSession.flagReasonPlaceholder') || 'Enter reason...'}
              className="w-full h-32 p-3 border border-[#E5E7EB] rounded-lg text-[14px] font-roboto text-oxford-blue mb-4 resize-none"
              dir={dir}
              disabled={isFlagging}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setFlagReason('');
                }}
                className="px-4 py-2 text-[14px] font-roboto text-oxford-blue border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition"
                disabled={isFlagging}
              >
                {t('dashboard.questionSession.cancel') || 'Cancel'}
              </button>
              <button
                onClick={async () => {
                  if (!flagReason.trim()) {
                    showErrorToast(t('dashboard.questionSession.flagReasonRequired') || 'Please provide a reason');
                    return;
                  }
                  if (!currentQuestion?.id) {
                    showErrorToast('Question ID is missing');
                    return;
                  }
                  setIsFlagging(true);
                  try {
                    await studentQuestionsAPI.flagQuestion(currentQuestion.id, flagReason);
                    showSuccessToast(t('dashboard.questionSession.flagSuccess') || 'Question flagged successfully');
                    setShowFlagModal(false);
                    setFlagReason('');
                  } catch (error) {
                    showErrorToast(error.message || t('dashboard.questionSession.flagError') || 'Failed to flag question');
                  } finally {
                    setIsFlagging(false);
                  }
                }}
                disabled={isFlagging || !flagReason.trim()}
                className="px-4 py-2 text-[14px] font-roboto text-white bg-[#ED4122] rounded-lg hover:bg-[#d43a1f] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFlagging ? (t('dashboard.questionSession.flagging') || 'Flagging...') : (t('dashboard.questionSession.submitFlag') || 'Submit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reason Modal - Show flag reason */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir={dir}>
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] font-archivo font-bold text-oxford-blue">
                {t('dashboard.questionSession.flagReason') || 'Flag Reason'}
              </h3>
              <button
                onClick={() => setShowReasonModal(false)}
                className="text-oxford-blue hover:text-[#ED4122] text-[24px] leading-none"
              >
                ×
              </button>
            </div>
            
            {flagStatus === 'rejected' && rejectionReason && (
              <div className="mb-4 p-3 bg-[#FDF0D5] border border-[#ED4122] rounded-lg">
                <p className="text-[12px] font-roboto font-medium text-[#ED4122] mb-1">
                  {t('dashboard.questionSession.flagRejected') || 'Your flag was rejected'}
                </p>
                <p className="text-[12px] font-roboto text-oxford-blue">
                  <span className="font-medium">{t('dashboard.questionSession.adminReason') || 'Admin reason:'} </span>
                  {rejectionReason}
                </p>
              </div>
            )}

            {flagStatus === 'pending' && (
              <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#ED4122] rounded-lg">
                <p className="text-[12px] font-roboto font-medium text-[#ED4122] mb-2">
                  {t('dashboard.questionSession.flagPending') || 'Flag pending review'}
                </p>
                <p className="text-[14px] font-roboto text-dark-gray mb-2">
                  <span className="font-medium">{t('dashboard.questionSession.yourReason') || 'Your reason:'} </span>
                </p>
                <p className="text-[14px] font-roboto text-oxford-blue">
                  {studentFlagReason || t('dashboard.questionSession.noReasonProvided') || 'No reason provided'}
                </p>
              </div>
            )}

            {flagStatus === 'approved' && (
              <div className="mb-4 p-3 bg-[#ECFDF5] border border-[#10B981] rounded-lg">
                <p className="text-[12px] font-roboto font-medium text-[#047857] mb-2">
                  {t('dashboard.questionSession.flagApproved') || 'Flag approved - Question under review'}
                </p>
                <p className="text-[14px] font-roboto text-dark-gray mb-2">
                  <span className="font-medium">{t('dashboard.questionSession.yourReason') || 'Your reason:'} </span>
                </p>
                <p className="text-[14px] font-roboto text-oxford-blue">
                  {studentFlagReason || t('dashboard.questionSession.noReasonProvided') || 'No reason provided'}
                </p>
              </div>
            )}

            {!flagStatus && studentFlagReason && (
              <div className="mb-4">
                <p className="text-[14px] font-roboto text-dark-gray mb-2">
                  <span className="font-medium">{t('dashboard.questionSession.yourReason') || 'Your reason:'} </span>
                </p>
                <p className="text-[14px] font-roboto text-oxford-blue">
                  {studentFlagReason}
                </p>
              </div>
            )}

            {!studentFlagReason && !rejectionReason && (
              <p className="text-[14px] font-roboto text-dark-gray">
                {t('dashboard.questionSession.noReasonAvailable') || 'No reason available'}
              </p>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowReasonModal(false)}
                className="px-4 py-2 text-[14px] font-roboto text-white bg-[#ED4122] rounded-lg hover:bg-[#d43a1f] transition"
              >
                {t('dashboard.questionSession.close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default StudyModeHeader;


