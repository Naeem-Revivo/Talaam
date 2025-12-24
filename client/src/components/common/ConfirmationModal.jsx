export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this item?",
  subMessage = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-[505px] w-full p-8">
        <h2 className="text-[23px] leading-[100%] font-bold text-[#ED4122] mb-4 text-center">{title}</h2>
        
        <div className="mb-6 text-[14px] leading-[100%] font-normal text-blue-dark">
          <p className="text-center mb-1">{message}</p>
          <p className="text-center">{subMessage}</p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="font-roboto border-[0.5px] px-8 py-2 text-base font-normal border-[#032746] rounded-lg text-blue-dark hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className=" font-roboto px-8 py-2 bg-[#ED4122] text-white rounded-lg font-semibold transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};