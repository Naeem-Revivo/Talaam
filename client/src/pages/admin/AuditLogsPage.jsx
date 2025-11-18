import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from '../../components/admin/SecurityAndPermissions/AuditLogsTable';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

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
    <div className="w-full lg:w-[204px]" ref={dropdownRef}>
      <p className="text-[16px] leading-[100%] font-semibold text-oxford-blue font-archivo mb-3 block lg:hidden">{label}</p>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-[48px] cursor-pointer items-center justify-between rounded-lg border border-transparent bg-white px-4 text-[16px] leading-[100%] font-semibold text-oxford-blue font-archivo"
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
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${displayValue === option ? "font-semibold text-oxford-blue" : "text-gray-700"
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
};

// ============= MAIN PAGE COMPONENT =============
export default function AuditLogsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [adminName, setAdminName] = useState('');
  const [actionType, setActionType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();

  // Demo data matching the image
  const auditLogs = [
    {
      id: 1,
      timestamp: '12:01:2024 06:53 PM',
      adminname: 'Alex Doe',
      action: 'Created User',
      modulearea: 'Question Bank',
      detailsdescription: 'Question ID: 1234',
      ipaddressdevice: '192.168.1.100 / Safari'
    },
    {
      id: 2,
      timestamp: '14:01:2024 11:50 AM',
      adminname: 'Alex Ibe',
      action: 'Suspended User',
      modulearea: 'User Management',
      detailsdescription: 'User ID: 0321',
      ipaddressdevice: '192.168.1.101 / Safari'
    },
    {
      id: 3,
      timestamp: '13:01:2024 11:50 PM',
      adminname: 'David Ezenest',
      action: 'Edited Question',
      modulearea: 'Question Bank',
      detailsdescription: 'Question ID:0333',
      ipaddressdevice: '192.168.1.102 / Firefox'
    },
    {
      id: 4,
      timestamp: '14:01:2024 09:30 AM',
      adminname: 'Sarah Chen',
      action: 'Login',
      modulearea: 'System',
      detailsdescription: 'Successful Login',
      ipaddressdevice: '192.168.1.103 / Chrome'
    },
    {
      id: 5,
      timestamp: '12:01:2024 03:02 PM',
      adminname: 'Alex Ibe',
      action: 'Setting Change',
      modulearea: 'Settings',
      detailsdescription: 'Updated platform name',
      ipaddressdevice: '192.168.1.104 / Safari'
    },
    {
      id: 6,
      timestamp: '11:01:2024 01:03 PM',
      adminname: 'David Ezenest',
      action: 'Added Question',
      modulearea: 'Question Bank',
      detailsdescription: 'Question ID: 4455',
      ipaddressdevice: '192.168.1.105 / Firefox'
    },
    {
      id: 7,
      timestamp: '12:01:2024 04:00 PM',
      adminname: 'Sarah Chen',
      action: 'Edited Question',
      modulearea: 'Question Bank',
      detailsdescription: 'Question ID: 2241',
      ipaddressdevice: '192.168.1.106 / Chrome'
    }
  ];

  const handleExportLog = () => {
    console.log('Export log clicked');
    alert('Export functionality to be implemented');
  };

  const handleViewDetails = (item) => {
    navigate("/admin/security/view-logs")
  };

  const filteredLogs = auditLogs;
  const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-[36px] leading-[40px] font-bold font-archivo text-oxford-blue">{t('admin.auditLogs.hero.title')}</h1>
          <button
            onClick={handleExportLog}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#ED4122] font-roboto px-5 py-2.5 text-[16px] leading-[16px] font-semibold text-white shadow-sm transition-all hover:bg-[#DC2626] active:scale-95"
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.1498 7.57819V9.02679C11.1498 9.6613 10.9262 10.212 10.479 10.6609C10.0378 11.1219 9.49645 11.3493 8.87277 11.3493H2.28291C1.65923 11.3493 1.11792 11.1219 0.664869 10.6609C0.223584 10.212 0 9.6613 0 9.02679V2.32254C0 1.68803 0.223584 1.13733 0.664869 0.688382C1.11792 0.227466 1.65923 0 2.28291 0H7.86076C7.99608 0 8.10788 0.107747 8.10788 0.257395V0.772185C8.10788 0.92782 7.99608 1.02958 7.86076 1.02958H2.28291C1.93577 1.02958 1.62981 1.16127 1.38858 1.40669C1.14146 1.6581 1.0179 1.96339 1.0179 2.31656V9.02679C1.0179 9.37996 1.14734 9.69123 1.38858 9.93665C1.6357 10.1881 1.93577 10.3138 2.28291 10.3138H8.86689C9.21403 10.3138 9.51999 10.1821 9.76122 9.93665C10.0025 9.69123 10.1319 9.37996 10.1319 9.02679V7.58418C10.1319 7.42854 10.2378 7.33277 10.3849 7.33277H10.8909C11.0498 7.33277 11.1498 7.42854 11.1498 7.57819ZM13.7916 3.51973L11.2028 6.14755C10.9968 6.37502 10.6614 6.19544 10.6614 5.92009V4.60318H9.51999C9.18461 4.60318 8.74921 4.62114 8.20202 4.64509C7.65482 4.66903 7.1194 4.7648 6.57809 4.92642C6.04855 5.08804 5.61903 5.27361 5.29542 5.48312C4.97769 5.69262 4.75411 5.90213 4.62467 6.11164C4.49522 6.31516 4.38932 6.58453 4.28341 6.92573C4.1775 7.26692 4.13043 7.60214 4.13043 7.94932C4.13043 8.13488 4.13631 8.35038 4.15396 8.58383C4.15396 8.62573 4.1775 8.77538 4.1775 8.84122C4.1775 8.937 4.11278 9.0208 4.01864 9.0208C3.95391 9.0208 3.90684 8.99087 3.87742 8.93101C3.82447 8.85918 3.73621 8.63172 3.68914 8.54193C3.25963 7.56622 3.1243 6.56657 3.29493 5.54896C3.38319 4.84861 3.73621 4.1722 4.37166 3.52572C5.40133 2.48416 7.1194 1.96339 9.51999 1.96339H10.6614V0.646481C10.6614 0.365142 10.9968 0.203522 11.2028 0.413029L13.7916 3.04684C13.9152 3.18452 13.9152 3.38804 13.7916 3.51973Z" fill="white" />
            </svg>

            Export Log
          </button>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-gray"
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
                placeholder="Search by keyword or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[48px] w-full rounded-lg border border-transparent bg-white pl-12 pr-4 text-[14px] text-oxford-blue placeholder-[#9CA3AF] shadow-filter-hover focus:outline-none focus:ring-2 focus:ring-[#ED4122]"
              />
            </div>
          </div>

          {/* Dropdowns */}
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-3">
            <Dropdown
              label="Admin Name"
              value={adminName}
              options={['Admin Name', 'Alex Doe', 'Alex Ibe', 'David Ezenest', 'Sarah Chen']}
              onChange={setAdminName}
            />
            <Dropdown
              label="Action Type"
              value={actionType}
              options={['Action Type', 'Created User', 'Suspended User', 'Edited Question', 'Login', 'Setting Change']}
              onChange={setActionType}
            />
            <Dropdown
              label="Date Range"
              value={dateRange}
              options={['Date Range', 'Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days']}
              onChange={setDateRange}
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          items={paginatedLogs}
          columns={['Timestamp', 'Admin Name', 'Action', 'Module / Area', 'Details / Description', 'IP Address / Device', 'Details']}
          page={page}
          pageSize={pageSize}
          total={filteredLogs.length}
          onPageChange={setPage}
          onView={handleViewDetails}
          emptyMessage="No audit logs found"
        />
      </div>
    </div>
  );
}