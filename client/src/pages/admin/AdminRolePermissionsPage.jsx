import React, { useState } from 'react';

// ============= ROLE CARD COMPONENT =============
const RoleCard = ({ title, description, badge, onEdit, onDelete }) => {
  const getBadgeStyles = () => {
    if (badge === 'All Permissions') {
      return 'bg-[#FDF0D5] text-[#ED4122]';
    }
    return 'bg-[#C6D8D3] text-[#032746]';
  };

  return (
    <div className="flex flex-col rounded-[8px] border border-[#E5E7EB] bg-white shadow-sm overflow-hidden h-full">
      {/* Top section with title and edit button - Fixed height */}
      <div className="flex items-start justify-between px-6 pt-8 pb-6 flex-1">
        <div className="flex-1 pr-3">
          <h3 className="text-xl font-bold text-[#032746] mb-4">{title}</h3>
          <p className="text-[14px] text-[#6B7280] leading-[100%] line-clamp-2">{description}</p>
        </div>
        <button
          onClick={onEdit}
          className="text-[#032746] hover:text-[#000] transition-colors flex-shrink-0 mt-2"
          aria-label={`Edit ${title}`}
        >
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5854 8.20759C15.3678 8.20759 15.1592 8.29401 15.0054 8.44784C14.8515 8.60168 14.7651 8.81032 14.7651 9.02787V13.9496C14.7651 14.1671 14.6787 14.3758 14.5248 14.5296C14.371 14.6834 14.1624 14.7699 13.9448 14.7699H2.46085C2.2433 14.7699 2.03465 14.6834 1.88082 14.5296C1.72699 14.3758 1.64057 14.1671 1.64057 13.9496V2.46561C1.64057 2.24805 1.72699 2.03941 1.88082 1.88558C2.03465 1.73175 2.2433 1.64532 2.46085 1.64532H7.38255C7.6001 1.64532 7.80874 1.5589 7.96258 1.40507C8.11641 1.25123 8.20283 1.04259 8.20283 0.82504C8.20283 0.607487 8.11641 0.398845 7.96258 0.245012C7.80874 0.0911787 7.6001 0.00475628 7.38255 0.00475628H2.46085C1.80819 0.00475628 1.18227 0.264024 0.720766 0.725523C0.259267 1.18702 0 1.81295 0 2.46561V13.9496C0 14.6022 0.259267 15.2282 0.720766 15.6897C1.18227 16.1512 1.80819 16.4104 2.46085 16.4104H13.9448C14.5975 16.4104 15.2234 16.1512 15.6849 15.6897C16.1464 15.2282 16.4057 14.6022 16.4057 13.9496V9.02787C16.4057 8.81032 16.3192 8.60168 16.1654 8.44784C16.0116 8.29401 15.8029 8.20759 15.5854 8.20759ZM3.28113 8.831V12.309C3.28113 12.5266 3.36756 12.7352 3.52139 12.889C3.67522 13.0429 3.88386 13.1293 4.10142 13.1293H7.57942C7.68737 13.1299 7.79439 13.1092 7.89433 13.0684C7.99427 13.0276 8.08517 12.9674 8.16182 12.8914L13.8382 7.20684L16.1678 4.92646C16.2447 4.8502 16.3057 4.75948 16.3473 4.65952C16.389 4.55956 16.4104 4.45234 16.4104 4.34405C16.4104 4.23577 16.389 4.12855 16.3473 4.02859C16.3057 3.92863 16.2447 3.83791 16.1678 3.76165L12.6898 0.242638C12.6135 0.165755 12.5228 0.10473 12.4228 0.0630855C12.3229 0.0214408 12.2157 0 12.1074 0C11.9991 0 11.8919 0.0214408 11.7919 0.0630855C11.692 0.10473 11.6012 0.165755 11.525 0.242638L9.21178 2.56404L3.51901 8.2486C3.44299 8.32525 3.38284 8.41615 3.34202 8.51609C3.3012 8.61603 3.28051 8.72305 3.28113 8.831ZM12.1074 1.98164L14.4288 4.30304L13.264 5.46784L10.9426 3.14644L12.1074 1.98164ZM4.9217 9.16732L9.78598 4.30304L12.1074 6.62444L7.2431 11.4887H4.9217V9.16732Z" fill="#032746" />
          </svg>
        </button>
      </div>

      {/* Bottom section with badge and delete button - Fixed height */}
      <div className="flex items-center justify-between px-6 h-[80px] border-t border-[#E5E7EB]">
        <span className={`inline-flex items-center px-[10px] py-[5px] rounded-md text-[14px] font-normal ${getBadgeStyles()}`}>
          {badge}
        </span>
        <button
          onClick={onDelete}
          className="text-[#6B7280] hover:text-[#DC2626] transition-colors"
          aria-label={`Delete ${title}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.3846 2.46154H12.4644C11.7251 2.46154 11.694 2.368 11.4913 1.76082L11.3255 1.26277C11.0736 0.507899 10.3705 0 9.57457 0H6.42543C5.62953 0 4.92554 0.507078 4.67446 1.26277L4.50872 1.76082C4.30605 2.36882 4.27487 2.46154 3.53559 2.46154H0.615385C0.275692 2.46154 0 2.73723 0 3.07692C0 3.41662 0.275692 3.69231 0.615385 3.69231H1.68041L2.30975 13.1274C2.43118 14.953 3.55036 16 5.38011 16H10.6207C12.4496 16 13.5688 14.953 13.6911 13.1274L14.3204 3.69231H15.3846C15.7243 3.69231 16 3.41662 16 3.07692C16 2.73723 15.7243 2.46154 15.3846 2.46154ZM5.84205 1.65169C5.92656 1.3998 6.16041 1.23077 6.42543 1.23077H9.57457C9.83959 1.23077 10.0743 1.3998 10.158 1.65169L10.3237 2.14974C10.3598 2.25723 10.3959 2.36144 10.4353 2.46154H5.56308C5.60246 2.36062 5.63939 2.25641 5.67549 2.14974L5.84205 1.65169ZM12.462 13.0453C12.384 14.2211 11.7981 14.7692 10.6199 14.7692H5.37928C4.20103 14.7692 3.616 14.222 3.53723 13.0453L2.91364 3.69231H3.53477C3.63733 3.69231 3.72267 3.68164 3.81457 3.67508C3.84246 3.67918 3.8679 3.69231 3.89662 3.69231H12.1017C12.1313 3.69231 12.1559 3.67918 12.1838 3.67508C12.2757 3.68164 12.361 3.69231 12.4636 3.69231H13.0847L12.462 13.0453ZM10.2564 7.17949V11.2821C10.2564 11.6217 9.98072 11.8974 9.64103 11.8974C9.30133 11.8974 9.02564 11.6217 9.02564 11.2821V7.17949C9.02564 6.8398 9.30133 6.5641 9.64103 6.5641C9.98072 6.5641 10.2564 6.8398 10.2564 7.17949ZM6.97436 7.17949V11.2821C6.97436 11.6217 6.69867 11.8974 6.35897 11.8974C6.01928 11.8974 5.74359 11.6217 5.74359 11.2821V7.17949C5.74359 6.8398 6.01928 6.5641 6.35897 6.5641C6.69867 6.5641 6.97436 6.8398 6.97436 7.17949Z" fill="#032746" />
          </svg>
        </button>
      </div>
    </div>
  );
};


// ============= CHECKBOX COMPONENT =============
const Checkbox = ({ id, label, checked, onChange }) => {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer group">
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${checked
          ? 'bg-[#ED4122] border-[#ED4122]'
          : 'bg-white border-[#D1D5DB] group-hover:border-[#9CA3AF]'
          }`}>
          {checked && (
            <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-[16px] leading-[100%] font-normal text-[#032746] select-none">{label}</span>
    </label>
  );
};

// ============= PERMISSION SECTION COMPONENT =============
const PermissionSection = ({ title, permissions, values, onChange }) => {
  return (
    <div>
      <h4 className="text-[20px] leading-[100%] font-bold text-[#032746] mb-8">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {permissions.map((permission) => (
          <Checkbox
            key={permission.id}
            id={permission.id}
            label={permission.label}
            checked={values[permission.id] || false}
            onChange={(e) => onChange(permission.id, e.target.checked)}
          />
        ))}
      </div>
    </div>
  );
};

// ============= MAIN APP COMPONENT =============
export default function AdminRolePermissions() {
  const [roles] = useState([
    {
      id: 1,
      title: 'Super Admin',
      description: 'Full access to all features and settings',
      badge: 'All Permissions'
    },
    {
      id: 2,
      title: 'Moderator',
      description: 'Manages user interactions and content moderation',
      badge: 'Limited Permissions'
    },
    {
      id: 3,
      title: 'Instructor',
      description: 'Manages courses and student progress',
      badge: 'Limited Permissions'
    }
  ]);

  const [permissions, setPermissions] = useState({
    viewAnalytics: true,
    viewReports: true,
    createUsers: false,
    editUsers: true,
    deleteUsers: false,
    assignRoles: true,
    createQuestions: false,
    editQuestions: false,
    deleteQuestions: false
  });

  const dashboardPermissions = [
    { id: 'viewAnalytics', label: 'View Analytics' },
    { id: 'viewReports', label: 'View Reports' }
  ];

  const userManagementPermissions = [
    { id: 'createUsers', label: 'Create Users' },
    { id: 'editUsers', label: 'Edit Users' },
    { id: 'deleteUsers', label: 'Delete Users' },
    { id: 'assignRoles', label: 'Assign Roles' }
  ];

  const questionBankPermissions = [
    { id: 'createQuestions', label: 'Create Questions' },
    { id: 'editQuestions', label: 'Edit Questions' },
    { id: 'deleteQuestions', label: 'Delete Questions' }
  ];

  const handlePermissionChange = (permissionId, value) => {
    setPermissions(prev => ({
      ...prev,
      [permissionId]: value
    }));
  };

  const handleEditRole = (role) => {
    console.log('Edit role:', role);
  };

  const handleDeleteRole = (role) => {
    console.log('Delete role:', role);
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  const handleSaveChanges = () => {
    console.log('Save changes:', permissions);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-[50px] flex flex-col md:flex-row items-start md:items-center justify-between">
          <h1 className="text-[26px] leading[40px] font-bold text-[#032746]">Admin Roles & Permissions</h1>
          <button className="flex items-center justify-center w-[171px] h-[36px] gap-2 rounded-lg bg-[#ED4122] px-4 py-2.5 text-[16px] leading[16px] font-semibold text-white shadow-sm transition-all hover:bg-[#DC2626] active:scale-95">
            + Add New Role
          </button>
        </div>

        {/* Role Cards */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6 border bg-white border-[#E5E7EB] rounded-xl shadow-[6px_6px_54px_0px_#0000000D]">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              title={role.title}
              description={role.description}
              badge={role.badge}
              onEdit={() => handleEditRole(role)}
              onDelete={() => handleDeleteRole(role)}
            />
          ))}
        </div>

        {/* Permission Settings */}
        <div className="">
          <div className="pb-[30px]">
            <h2 className="text-[20px] font-bold leading-[100%] text-[#032746]">Permission Settings</h2>
          </div>


        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm">

          <div className="space-y-6 px-6 py-10">
            <PermissionSection
              title="Dashboard"
              permissions={dashboardPermissions}
              values={permissions}
              onChange={handlePermissionChange}
            />

            <div className="pt-6">
              <PermissionSection
                title="User Management"
                permissions={userManagementPermissions}
                values={permissions}
                onChange={handlePermissionChange}
              />
            </div>

            <div className="pt-6">
              <PermissionSection
                title="Question Bank"
                permissions={questionBankPermissions}
                values={permissions}
                onChange={handlePermissionChange}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#E5E7EB] px-6 py-4">
            <button
              onClick={handleCancel}
              className="rounded-md w-full sm:w-[120px] border border-[#E5E7EB] bg-white px-5 py-2 text-[16px] leading-[100%] font-medium text-[#032746] shadow-sm transition-all hover:bg-[#F9FAFB] active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="rounded-md bg-[#ED4122] px-5 py-2 text-[16px] leading-[100%] w-full sm:w-[158px] font-medium text-white shadow-sm transition-all hover:bg-[#DC2626] active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}