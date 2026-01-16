import React from 'react';
import { OutlineButton, PrimaryButton } from '../../../common/Button';
import ProfileDropdown from '../../../common/ProfileDropdown';
import Loader from '../../../common/Loader';

const SelectUserModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  processing,
  loadingUsers,
  users,
  selectedUser,
  setSelectedUser,
  title,
  description,
  placeholder,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[12px] shadow-xl p-6 max-w-md w-full">
        <h3 className="text-[24px] font-bold font-archivo text-oxford-blue mb-2">
          {title}
        </h3>
        <p className="text-[16px] font-roboto text-dark-gray mb-6">
          {description}
        </p>
        {loadingUsers ? (
          <Loader 
            size="md" 
            color="oxford-blue" 
            text="Loading..."
            className="py-4"
          />
        ) : users.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-dark-gray">No users available</p>
          </div>
        ) : (
          <div className="mb-4">
            <ProfileDropdown
              value={selectedUser}
              options={users.map((user) => ({
                value: user.id,
                label: user.name
              }))}
              onChange={(value) => setSelectedUser(value)}
              placeholder={placeholder}
              className="w-full"
            />
          </div>
        )}
        <div className="flex gap-4 mt-6">
          <OutlineButton
            text={t("processor.viewQuestion.cancel")}
            onClick={onClose}
            className="flex-1"
            disabled={processing}
          />
          <PrimaryButton
            text="Confirm"
            onClick={onConfirm}
            className="flex-1"
            disabled={processing || !selectedUser || loadingUsers}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectUserModal;
