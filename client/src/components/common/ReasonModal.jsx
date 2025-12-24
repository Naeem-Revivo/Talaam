import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const ReasonModal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  reason, 
  noReasonText,
  closeText 
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-[600px] w-full p-8">
        <h2 className="text-[24px] leading-[100%] font-bold text-oxford-blue mb-2">
          {title}
        </h2>
        <p className="text-[16px] leading-[100%] font-normal text-dark-gray mb-6">
          {subtitle}
        </p>
        <div className="mb-6">
          <label className="block text-[16px] leading-[100%] font-roboto font-normal text-oxford-blue mb-2">
            {t("gatherer.questionBank.rejectionReasonModal.reasonLabel") || "Reason"}
          </label>
          <div className="w-full min-h-[120px] rounded-[8px] border border-[#03274633] bg-white px-4 py-3 font-roboto text-[16px] leading-[20px] text-oxford-blue">
            {reason || noReasonText || t("gatherer.questionBank.rejectionReasonModal.noReason") || "No reason provided"}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 font-roboto px-4 py-3 border-[0.5px] text-base font-normal border-[#032746] rounded-lg text-blue-dark hover:bg-gray-50 transition-colors"
          >
            {closeText || t("gatherer.questionBank.rejectionReasonModal.close") || "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;

