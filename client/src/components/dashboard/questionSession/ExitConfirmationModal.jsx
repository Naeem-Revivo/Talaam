// components/dashboard/questionSession/ExitConfirmationModal.jsx
import React from 'react';

const ExitConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg relative">
        {/* Close button in top right */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon, title, and message - centered column */}
        <div className="flex flex-col items-center justify-center mb-4">
          {/* Yellow warning icon - large circular with exclamation */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 16V24M24 32H24.02M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" stroke="#FACC15" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>


          {/* Title */}
          <h2 className="text-[26px] font-archivo leading-[36px] font-bold text-[#0A0A0A] my-4 text-center">
            Exit Session
          </h2>

          {/* Message */}
          <p className="text-[#737373] text-sm font-normal font-roboto text-center">
            Your progress will be automatically saved
          </p>
        </div>

        {/* Divider line */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-3 text-[#475569] text-[14px] leading-[21px] font-medium font-roboto bg-transparent hover:bg-gray-50 transition-colors rounded-lg"
          >
            Cancel & Continue
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-3 w-[228px] bg-gradient-to-r from-[#032746] to-[#0A4B6E] text-white rounded-[12px] hover:opacity-90 transition-colors text-[14px] leading-[21px] font-roboto font-medium"
          >
            Yes, Exit & Save Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationModal;