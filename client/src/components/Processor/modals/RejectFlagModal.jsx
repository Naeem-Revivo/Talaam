import React from 'react';
import { OutlineButton, PrimaryButton } from '../../common/Button';

const RejectFlagModal = ({
  isOpen,
  flagRejectionReason,
  setFlagRejectionReason,
  onClose,
  onConfirm,
  processing,
  gathererRejectedFlag,
  flagType,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-oxford-blue mb-4">
          {t("processor.viewQuestion.rejectFlagReason") ||
            "Reject Flag Reason"}
        </h3>
        <p className="text-dark-gray mb-4">
          {gathererRejectedFlag
            ? t(
                "processor.viewQuestion.rejectGathererRejectionDescription"
              ) ||
              "Please provide a reason for rejecting the gatherer's flag rejection. The flag will be restored and the question will be sent back to the gatherer."
            : flagType === "student"
            ? t(
                "processor.viewQuestion.rejectFlagReasonDescriptionStudent"
              ) ||
              "Please provide a reason for rejecting the student's flag. The flag will be cleared."
            : flagType === "explainer"
            ? t(
                "processor.viewQuestion.rejectFlagReasonDescriptionExplainer"
              ) ||
              "Please provide a reason for rejecting the explainer's flag. The question will be sent back to the explainer."
            : t("processor.viewQuestion.rejectFlagReasonDescription") ||
              "Please provide a reason for rejecting the creator's flag. The question will be sent back to the creator."}
        </p>
        <textarea
          value={flagRejectionReason}
          onChange={(e) => setFlagRejectionReason(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-lg p-3 min-h-[100px] font-roboto text-[16px]"
          placeholder={
            t("processor.viewQuestion.rejectFlagReasonPlaceholder") ||
            "Enter reason for rejecting the flag..."
          }
        />
        <div className="flex gap-4 mt-6">
          <OutlineButton
            text={t("processor.viewQuestion.cancel")}
            onClick={onClose}
            className="flex-1"
            disabled={processing}
          />
          <PrimaryButton
            text={
              t("processor.viewQuestion.confirmRejectFlag") ||
              "Reject Flag Reason"
            }
            onClick={onConfirm}
            className="flex-1"
            disabled={processing || !flagRejectionReason.trim()}
          />
        </div>
      </div>
    </div>
  );
};

export default RejectFlagModal;
