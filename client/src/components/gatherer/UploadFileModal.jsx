import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { OutlineButton, PrimaryButton } from "../common/Button";

export const UploadFileModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useLanguage();
  const [documentType, setDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ documentType, file: selectedFile });
    }
    handleClose();
  };

  const handleClose = () => {
    setDocumentType("");
    setSelectedFile(null);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 rounded-t-lg border-b border-gray-200">
          <h2 className="text-[24px] leading-[100%] font-semibold text-blue-dark font-archivo">
            {t("gatherer.uploadModal.title")}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-blue-dark font-semibold mb-3 text-[18px] leading-[100%]">
              {t("gatherer.uploadModal.documentType")}
            </label>
            <input
              type="text"
              placeholder={t("gatherer.uploadModal.placeholder")}
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full placeholder:text-sm font-normal placeholder:text-[#6B7280] px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="inline-flex  items-center text-[16px] leading-[100%] font-medium font-roboto gap-2 px-5 py-2.5 bg-orange-dark hover:bg-red-600 text-white rounded-md cursor-pointer transition-colors">
                <svg
                  width="12"
                  height="17"
                  viewBox="0 0 12 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.9156 8.03792C11.176 8.29336 11.176 8.70749 10.9156 8.96293C10.7858 9.09021 10.6151 9.1547 10.4444 9.1547C10.2738 9.1547 10.1031 9.09108 9.97331 8.96293L6.66667 5.71988V16.3462C6.66667 16.7071 6.368 17 6 17C5.632 17 5.33333 16.7071 5.33333 16.3462V5.71988L2.02669 8.96293C1.76625 9.21836 1.34399 9.21836 1.08355 8.96293C0.823106 8.70749 0.823106 8.29336 1.08355 8.03792L5.52799 3.67895C5.58933 3.61879 5.66301 3.57096 5.74479 3.53784C5.90746 3.47158 6.09146 3.47158 6.25412 3.53784C6.3359 3.57096 6.4098 3.61879 6.47114 3.67895L10.9156 8.03792ZM11.3333 0H0.666667C0.298667 0 0 0.292923 0 0.653846C0 1.01477 0.298667 1.30769 0.666667 1.30769H11.3333C11.7013 1.30769 12 1.01477 12 0.653846C12 0.292923 11.7013 0 11.3333 0Z"
                    fill="white"
                  />
                </svg>
                {t("gatherer.uploadModal.uploadDocument")}
              </span>
            </label>

            <button className="px-5 rounded-md py-2.5 text-blue-dark text-sm font-roboto font-medium hover:text-gray-900 transition-colors border border-[#E5E7EB]">
              {t("gatherer.uploadModal.add")}
            </button>
          </div>

          {selectedFile && (
            <div className="mt-4 text-sm text-gray-600">
              {t("gatherer.uploadModal.selected")}: {selectedFile.name}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 rounded-b-lg border-t border-gray-200 flex justify-end gap-3">
          <OutlineButton text={t("gatherer.uploadModal.cancel")} className="py-[10px] px-7 text-nowrap w-[110px]" onClick={handleClose}/>
          <PrimaryButton text={t("gatherer.uploadModal.done")} className="py-[10px] px-7 text-nowrap w-[110px]" onClick={handleSubmit}/>
        </div>
      </div>
    </div>
  );
};
