// components/dashboard/questionSession/ExitConfirmationModal.jsx
import React from 'react';

const ExitConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-oxford-blue mb-4">
          Are you sure you want to exit?
        </h2>
        <p className="text-gray-600 mb-6">
          You have unsaved progress. If you exit now, all your progress will be lost. 
          Do you want to continue?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-cinnebar-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Exit Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationModal;