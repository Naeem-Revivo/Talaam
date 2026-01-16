import React from 'react';
import { OutlineButton, PrimaryButton } from '../../common/Button';

const RejectModal = ({
  isOpen,
  rejectionReason,
  setRejectionReason,
  onClose,
  onConfirm,
  processing,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-oxford-blue mb-4">
          {t("processor.viewQuestion.rejectQuestion")}
        </h3>
        <p className="text-dark-gray mb-4">
          {t("processor.viewQuestion.rejectReason")}
        </p>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-lg p-3 min-h-[100px] font-roboto text-[16px]"
          placeholder={t(
            "processor.viewQuestion.rejectReasonPlaceholder"
          )}
        />
        <div className="flex gap-4 mt-6">
          <OutlineButton
            text={t("processor.viewQuestion.cancel")}
            onClick={onClose}
            className="flex-1"
            disabled={processing}
          />
          <PrimaryButton
            text={t("processor.viewQuestion.confirmReject")}
            onClick={onConfirm}
            className="flex-1"
            disabled={processing || !rejectionReason.trim()}
          />
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
