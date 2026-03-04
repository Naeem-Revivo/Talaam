import React, { useState } from 'react';
import { OutlineButton, PrimaryButton } from '../../../common/Button';
import { showErrorToast } from '../../../../utils/toastConfig';

const FlagModal = ({ isOpen, onClose, onConfirm, isVariant, t }) => {
  const [flagReason, setFlagReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!flagReason.trim()) {
      showErrorToast("Please provide a reason for flagging");
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-[20px] font-bold text-blue-dark font-archivo mb-2">
          Flag {isVariant ? "Variant" : "Question"}
        </h2>
        <p className="text-[14px] text-dark-gray mb-4">
          Please provide a reason for flagging this {isVariant ? "variant" : "question"}.
        </p>
        <div className="mb-4">
          <label className="block text-[14px] font-medium text-blue-dark mb-2">
            Reason for Flagging
          </label>
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Enter the reason for flagging..."
            className="w-full p-3 border border-[#03274633] rounded-[8px] min-h-[100px] outline-none text-blue-dark placeholder:text-gray-400"
            rows={4}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <OutlineButton
            text="Cancel"
            className="py-[10px] px-6"
            onClick={handleClose}
          />
          <PrimaryButton
            text="Flag"
            className="py-[10px] px-6"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default FlagModal;
