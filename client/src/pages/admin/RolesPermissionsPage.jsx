import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RolesTable } from '../../components/admin/SecurityAndPermissions/RolesTable';

// ============= DROPDOWN COMPONENT =============
const Dropdown = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayValue = value && value.trim() !== "" ? value : options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full lg:w-[206px]" ref={dropdownRef}>
      <p className="text-[16px] leading-[100%] font-semibold text-oxford-blue mb-3 block lg:hidden">{label}</p>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-[48px] cursor-pointer items-center justify-between rounded-lg border bg-white px-4 text-[16px] leading-[100%] font-semibold text-oxford-blue font-archivo border-[#E5E7EB]"
      >
        <span>{displayValue}</span>
        <svg
          width="15"
          height="9"
          viewBox="0 0 15 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562"
            stroke="#032746"
            strokeWidth="2"
          />
        </svg>
        {isOpen && (
          <ul className="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-100 bg-white shadow-lg max-h-[200px] overflow-y-auto">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  displayValue === option ? "font-semibold text-oxford-blue" : "text-gray-700"
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ============= MAIN PAGE COMPONENT =============
export default function RolesPermissionsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [permissions, setPermissions] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Demo data matching the image
  const rolesData = [
    {
      id: 1,
      rolename: 'Super Admin',
      assignedadmins: '5',
      permissionssummary: 'Full Access',
      status: 'Active'
    },
    {
      id: 2,
      rolename: 'Content Manager',
      assignedadmins: '3',
      permissionssummary: 'Content Creation & Management',
      status: 'Active'
    },
    {
      id: 3,
      rolename: 'User Support',
      assignedadmins: '2',
      permissionssummary: 'User Management & Support',
      status: 'Active'
    },
    {
      id: 4,
      rolename: 'Billing Admin',
      assignedadmins: '1',
      permissionssummary: 'User Management & Support',
      status: 'Active'
    },
    {
      id: 5,
      rolename: 'Analytics Viewer',
      assignedadmins: '4',
      permissionssummary: 'User Management & Support',
      status: 'Inactive'
    }
  ];

  const handleAddNewRole = () => {
    console.log('Add new role clicked');
    alert('Add new role functionality to be implemented');
  };

  const handleViewRole = (item) => {
    console.log('View role:', item);
    alert(`Viewing role: ${item.rolename}`);
  };

  const handleEditRole = (item) => {
    console.log('Edit role:', item);
    alert(`Editing role: ${item.rolename}`);
  };

  const filteredRoles = rolesData;
  const paginatedRoles = filteredRoles.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-[36px] leading-[40px] font-bold text-oxford-blue font-archivo">{t('admin.rolesPermissions.hero.title')}</h1>
          <button
            onClick={handleAddNewRole}
            className="flex items-center font-archivo justify-center gap-2 rounded-lg bg-[#ED4122] px-7 py-2.5 text-[16px] leading-[16px] font-semibold text-white shadow-sm transition-all hover:bg-[#DC2626] active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3.33337V12.6667M3.33334 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add New Role
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-dark"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.11111 15.2222C12.0385 15.2222 15.2222 12.0385 15.2222 8.11111C15.2222 4.18375 12.0385 1 8.11111 1C4.18375 1 1 4.18375 1 8.11111C1 12.0385 4.18375 15.2222 8.11111 15.2222Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 17L13.1333 13.1333"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by role name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[48px] w-full rounded-lg border border-[#E5E7EB] bg-white pl-12 pr-4 text-[14px] text-oxford-blue placeholder-[#9CA3AF] shadow-filter-hover focus:outline-none focus:ring-[1px] focus:ring-blue-dark"
              />
            </div>
          </div>

          {/* Dropdowns */}
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-3">
            <Dropdown
              label="All Permissions"
              value={permissions}
              options={['All Permissions', 'Full Access', 'Limited Access', 'View Only']}
              onChange={setPermissions}
            />
            <Dropdown
              label="Any Status"
              value={status}
              options={['Any Status', 'Active', 'Inactive']}
              onChange={setStatus}
            />
          </div>
        </div>

        {/* Table */}
        <RolesTable
          items={paginatedRoles}
          columns={['Role Name', 'Assigned Admins', 'Permissions Summary', 'Status', 'Actions']}
          page={page}
          pageSize={pageSize}
          total={filteredRoles.length}
          onPageChange={setPage}
          onView={handleViewRole}
          onEdit={handleEditRole}
          emptyMessage="No roles found"
        />
      </div>
    </div>
  );
}