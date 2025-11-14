import React, { useState } from 'react';

// ============= ROLE CARD COMPONENT =============
const RoleCard = ({ title, description, badge, onEdit, onDelete }) => {
  const getBadgeStyles = () => {
    if (badge === 'All Permissions') {
      return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
    }
    return 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]';
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[16px] font-semibold text-[#111827]">{title}</h3>
            <button
              onClick={onEdit}
              className="text-[#6B7280] hover:text-[#111827] transition-colors"
              aria-label={`Edit ${title}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.3333 2.00004C11.5084 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44775 12.6666 1.44775C12.9142 1.44775 13.1594 1.49653 13.3882 1.59129C13.617 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.383 14.4087 2.61178C14.5035 2.84055 14.5523 3.08575 14.5523 3.33337C14.5523 3.58099 14.5035 3.82619 14.4087 4.05497C14.314 4.28374 14.1751 4.49161 14 4.66671L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className="text-[13px] text-[#6B7280] leading-relaxed">{description}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <span className={`inline-flex items-center px-3 py-1 rounded-md text-[12px] font-medium border ${getBadgeStyles()}`}>
          {badge}
        </span>
        <button
          onClick={onDelete}
          className="text-[#6B7280] hover:text-[#DC2626] transition-colors"
          aria-label={`Delete ${title}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.33334 4.00004V2.66671C5.33334 2.31309 5.47381 1.97395 5.72386 1.7239C5.97391 1.47385 6.31305 1.33337 6.66667 1.33337H9.33334C9.68696 1.33337 10.0261 1.47385 10.2761 1.7239C10.5262 1.97395 10.6667 2.31309 10.6667 2.66671V4.00004M12.6667 4.00004V13.3334C12.6667 13.687 12.5262 14.0261 12.2761 14.2762C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2762C3.47381 14.0261 3.33334 13.687 3.33334 13.3334V4.00004H12.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        <div className={`w-5 h-5 border-2 rounded transition-all ${
          checked 
            ? 'bg-[#EF4444] border-[#EF4444]' 
            : 'bg-white border-[#D1D5DB] group-hover:border-[#9CA3AF]'
        }`}>
          {checked && (
            <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-[14px] text-[#374151] select-none">{label}</span>
    </label>
  );
};

// ============= PERMISSION SECTION COMPONENT =============
const PermissionSection = ({ title, permissions, values, onChange }) => {
  return (
    <div>
      <h4 className="text-[14px] font-semibold text-[#111827] mb-3">{title}</h4>
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
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[24px] font-bold text-[#111827]">Admin Roles & Permissions</h1>
          <button className="flex items-center gap-2 rounded-lg bg-[#EF4444] px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#DC2626] active:scale-95">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3.33337V12.6667M3.33334 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add New Role
          </button>
        </div>

        {/* Role Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
          <div className="border-b border-[#E5E7EB] px-6 py-4">
            <h2 className="text-[18px] font-semibold text-[#111827]">Permission Settings</h2>
          </div>
          
          <div className="space-y-6 p-6">
            <PermissionSection
              title="Dashboard"
              permissions={dashboardPermissions}
              values={permissions}
              onChange={handlePermissionChange}
            />

            <div className="border-t border-[#E5E7EB] pt-6">
              <PermissionSection
                title="User Management"
                permissions={userManagementPermissions}
                values={permissions}
                onChange={handlePermissionChange}
              />
            </div>

            <div className="border-t border-[#E5E7EB] pt-6">
              <PermissionSection
                title="Question Bank"
                permissions={questionBankPermissions}
                values={permissions}
                onChange={handlePermissionChange}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] px-6 py-4">
            <button
              onClick={handleCancel}
              className="rounded-lg border border-[#D1D5DB] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#374151] shadow-sm transition-all hover:bg-[#F9FAFB] active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="rounded-lg bg-[#EF4444] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#DC2626] active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}