import React from "react";

const AdminRejectFlagModal = ({
  isOpen,
  flagRejectionReason,
  setFlagRejectionReason,
  onClose,
  onConfirm,
  processing,
  t,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    setFlagRejectionReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-oxford-blue mb-4">
          {t('gatherer.addNewQuestion.rejectFlag.title')}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {t('gatherer.addNewQuestion.rejectFlag.description')}
        </p>
        <textarea
          value={flagRejectionReason}
          onChange={(e) => setFlagRejectionReason(e.target.value)}
          placeholder={t('gatherer.addNewQuestion.rejectFlag.placeholder')}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={processing}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('gatherer.addNewQuestion.rejectFlag.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={processing || !flagRejectionReason.trim()}
            className={`px-4 py-2 text-white rounded-lg transition ${
              processing || !flagRejectionReason.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#ED4122] hover:bg-[#d43a1f]"
            }`}
          >
            {processing ? t('gatherer.addNewQuestion.rejectFlag.submitting') : t('gatherer.addNewQuestion.rejectFlag.submit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRejectFlagModal;
