import React, { useState } from 'react';
import { showErrorToast } from '../../../../../utils/toastConfig';

const CreatorFlagModal = ({ isOpen, onClose, onConfirm, isFlagging, t }) => {
  const [flagReason, setFlagReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!flagReason.trim()) {
      showErrorToast("Please enter a reason for flagging the question.");
      return;
    }
    onConfirm(flagReason);
    setFlagReason("");
  };

  const handleClose = () => {
    setFlagReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-[600px] w-full p-8">
        <h2 className="text-[24px] leading-[100%] font-bold text-oxford-blue mb-2">
          Flag Question
        </h2>
        <p className="text-[16px] leading-[100%] font-normal text-dark-gray mb-6">
          Please provide a reason for flagging this question. This will send the question back to the processor for review.
        </p>
        
        <div className="mb-6">
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-oxford-blue mb-2">
            Reason for Flagging
          </label>
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Enter the reason for flagging this question..."
            className="w-full h-[120px] rounded-[8px] border border-[#03274633] bg-white px-4 py-3 font-roboto text-[16px] leading-[20px] text-oxford-blue outline-none placeholder:text-[#9CA3AF] resize-none focus:border-oxford-blue"
            disabled={isFlagging}
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleClose}
            disabled={isFlagging}
            className="flex-1 font-roboto px-4 py-3 border-[0.5px] text-base font-normal border-[#032746] rounded-lg text-blue-dark hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isFlagging || !flagReason.trim()}
            className="flex-1 font-roboto px-4 py-3 bg-[#ED4122] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d43a1f]"
          >
            {isFlagging ? "Flagging..." : "Submit Flag"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorFlagModal;
