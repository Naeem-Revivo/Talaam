import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import studentQuestionsAPI from '../../api/studentQuestions';
import { showSuccessToast, showErrorToast } from '../../utils/toastConfig';

const ReportIssueModal = ({ 
  isOpen, 
  onClose, 
  questionId, 
  question = null,
  onSuccess = null 
}) => {
  const { t, language } = useLanguage();
  const [flagReason, setFlagReason] = useState('');
  const [isFlagging, setIsFlagging] = useState(false);
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Check if question is flagged
  const isFlagged = question?.isFlagged || question?.flagStatus;
  const flagStatus = question?.flagStatus;
  const studentFlagReason = question?.flagReason;
  const rejectionReason = question?.flagRejectionReason;

  const handleClose = () => {
    setFlagReason('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!flagReason.trim()) {
      showErrorToast(t('dashboard.questionSession.flagReasonRequired') || 'Please provide a reason');
      return;
    }
    if (!questionId) {
      showErrorToast('Question ID is missing');
      return;
    }
    
    setIsFlagging(true);
    try {
      await studentQuestionsAPI.flagQuestion(questionId, flagReason);
      showSuccessToast(t('dashboard.questionSession.flagSuccess') || 'Issue reported successfully');
      setFlagReason('');
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      showErrorToast(error.message || t('dashboard.questionSession.flagError') || 'Failed to report issue');
    } finally {
      setIsFlagging(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir={dir}>
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-modal">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[18px] font-archivo font-bold text-oxford-blue">
            {t('dashboard.questionSession.reportIssue') || 'Report Issue'}
          </h3>
          <button
            onClick={handleClose}
            className="text-oxford-blue hover:text-cinnebar-red text-[24px] leading-none transition-colors"
            disabled={isFlagging}
          >
            ×
          </button>
        </div>
        <p className="text-[14px] font-roboto text-dark-gray mb-4">
          {t('dashboard.questionSession.reportIssueLabel') || 'Please provide a reason for reporting this question:'}
        </p>
        <textarea
          value={flagReason}
          onChange={(e) => setFlagReason(e.target.value)}
          placeholder={t('dashboard.questionSession.reportIssuePlaceholder') || 'Enter reason for reporting this question...'}
          className="w-full h-32 p-3 border border-[#E5E7EB] rounded-lg text-[14px] font-roboto text-oxford-blue mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-cinnebar-red focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          dir={dir}
          disabled={isFlagging}
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-[14px] font-roboto text-oxford-blue border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isFlagging}
          >
            {t('dashboard.questionSession.cancel') || 'Cancel'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isFlagging || !flagReason.trim()}
            className="px-4 py-2 text-[14px] font-roboto text-white bg-cinnebar-red rounded-lg hover:bg-[#d43a1f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFlagging ? (t('dashboard.questionSession.flagging') || 'Submitting...') : (t('dashboard.questionSession.submitFlag') || 'Submit')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Reason Modal Component - Shows flag status and reason
export const FlagReasonModal = ({ 
  isOpen, 
  onClose, 
  question = null 
}) => {
  const { t, language } = useLanguage();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  if (!isOpen) return null;

  const flagStatus = question?.flagStatus;
  const studentFlagReason = question?.flagReason;
  const rejectionReason = question?.flagRejectionReason;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir={dir}>
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-modal">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[18px] font-archivo font-bold text-oxford-blue">
            {t('dashboard.questionSession.flagReason') || 'Report Issue Status'}
          </h3>
          <button
            onClick={onClose}
            className="text-oxford-blue hover:text-cinnebar-red text-[24px] leading-none transition-colors"
          >
            ×
          </button>
        </div>
        
        {flagStatus === 'rejected' && rejectionReason && (
          <div className="mb-4 p-3 bg-papaya-whip border border-cinnebar-red rounded-lg">
            <p className="text-[12px] font-roboto font-medium text-cinnebar-red mb-1">
              {t('dashboard.questionSession.flagRejected') || 'Your report was rejected'}
            </p>
            <p className="text-[12px] font-roboto text-oxford-blue">
              <span className="font-medium">{t('dashboard.questionSession.adminReason') || 'Admin reason:'} </span>
              {rejectionReason}
            </p>
          </div>
        )}

        {flagStatus === 'pending' && (
          <div className="mb-4 p-3 bg-[#FEF2F2] border border-cinnebar-red rounded-lg">
            <p className="text-[12px] font-roboto font-medium text-cinnebar-red mb-2">
              {t('dashboard.questionSession.flagPending') || 'Report pending review'}
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
              {t('dashboard.questionSession.flagApproved') || 'Report approved - Question under review'}
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
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-roboto text-white bg-cinnebar-red rounded-lg hover:bg-[#d43a1f] transition"
          >
            {t('dashboard.questionSession.close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueModal;

