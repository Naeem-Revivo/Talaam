import React, { useState } from 'react';
import { showErrorToast } from '../../../../../utils/toastConfig';

const CreatorRejectFlagModal = ({ isOpen, onClose, onConfirm, isRejectingFlag, t }) => {
  const [flagRejectionReason, setFlagRejectionReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!flagRejectionReason.trim()) {
      showErrorToast("Please enter a reason for rejecting the flag.");
      return;
    }
    onConfirm(flagRejectionReason);
    setFlagRejectionReason("");
  };

  const handleClose = () => {
    setFlagRejectionReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-[600px] w-full p-8">
        <h2 className="text-[24px] leading-[100%] font-bold text-oxford-blue mb-2">
          {t("creator.flaggedVariant.rejectFlagTitle") || "Reject Flag"}
        </h2>
        <p className="text-[16px] leading-[100%] font-normal text-dark-gray mb-6">
          {t("creator.flaggedVariant.rejectFlagDescription") || "Please provide a reason for rejecting this flag. The question will be sent back to the processor for review."}
        </p>
        
        <div className="mb-6">
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-oxford-blue mb-2">
            {t("creator.flaggedVariant.rejectionReason") || "Reason for Rejecting Flag"}
          </label>
          <textarea
            value={flagRejectionReason}
            onChange={(e) => setFlagRejectionReason(e.target.value)}
            placeholder={t("creator.flaggedVariant.rejectionReasonPlaceholder") || "Enter the reason for rejecting this flag..."}
            className="w-full h-[120px] rounded-[8px] border border-[#03274633] bg-white px-4 py-3 font-roboto text-[16px] leading-[20px] text-oxford-blue outline-none placeholder:text-[#9CA3AF] resize-none focus:border-oxford-blue"
            disabled={isRejectingFlag}
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleClose}
            disabled={isRejectingFlag}
            className="flex-1 font-roboto px-4 py-3 border-[0.5px] text-base font-normal border-[#032746] rounded-lg text-blue-dark hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("creator.flaggedVariant.cancel") || "Cancel"}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isRejectingFlag || !flagRejectionReason.trim()}
            className="flex-1 font-roboto px-4 py-3 bg-[#ED4122] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d43a1f]"
          >
            {isRejectingFlag ? (t("creator.flaggedVariant.rejecting") || "Rejecting...") : (t("creator.flaggedVariant.submitRejection") || "Submit Rejection")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorRejectFlagModal;
