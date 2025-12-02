import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserSummaryCards from "../../components/admin/userManagement/UserSummaryCards";
import UserFilterBar from "../../components/admin/userManagement/UserFilterBar";
import UserTable from "../../components/admin/userManagement/UserTable";
import { useLanguage } from "../../context/LanguageContext";
import usersAPI from "../../api/users";
import useDebounce from "../../hooks/useDebounce";
import {
  usermanage1,
  usermanage2,
  usermanage3,
  usermanage4,
} from "../../assets/svg/dashboard/admin";

const roleIcons = {
  "Question Gatherer": usermanage1,
  "Question Creator": usermanage2,
  Processor: usermanage3,
  "Question Explainer": usermanage4,
};

const pageSize = 5;

const UserManagementPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Local state for all filters and pagination (not stored in URL to prevent page refresh)
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  
  // Debounce the search input (500ms delay) - only for API calls, not URL
  const debouncedSearch = useDebounce(searchInput, 500);
  
  // Use ref to track previous values and prevent unnecessary API calls
  // Initialize with null to ensure first load runs
  const prevParamsRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Load statistics (only once on mount)
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setStatsLoading(true);
        const response = await usersAPI.getUserManagementStatistics();
        if (response.success && response.data?.statistics) {
          setStatistics(response.data.statistics);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStatistics();
  }, []);

  // Load users based on URL params and debounced search
  useEffect(() => {
    // Check if this is the first load
    const isFirstLoad = prevParamsRef.current === null;
    
    // Check if params actually changed to prevent unnecessary calls
    const paramsChanged = isFirstLoad ||
      prevParamsRef.current.page !== page ||
      prevParamsRef.current.statusFilter !== statusFilter ||
      prevParamsRef.current.roleFilter !== roleFilter ||
      prevParamsRef.current.debouncedSearch !== debouncedSearch;
    
    if (!paramsChanged) {
      return; // Skip if nothing changed
    }
    
    // Check if this is a filter-only change (search, status, or role) - no page number change
    // Also check if it's a page-only change (pagination)
    const isFilterOnly = !isFirstLoad && 
                         prevParamsRef.current.page === page &&
                         (prevParamsRef.current.debouncedSearch !== debouncedSearch ||
                          prevParamsRef.current.statusFilter !== statusFilter ||
                          prevParamsRef.current.roleFilter !== roleFilter);
    
    const isPageOnly = !isFirstLoad &&
                       prevParamsRef.current.page !== page &&
                       prevParamsRef.current.debouncedSearch === debouncedSearch &&
                       prevParamsRef.current.statusFilter === statusFilter &&
                       prevParamsRef.current.roleFilter === roleFilter;
    
    // Update ref with current values
    prevParamsRef.current = { page, statusFilter, roleFilter, debouncedSearch };
    
    const loadUsers = async () => {
      try {
        // Only show loading for initial load, not for filter or page-only updates
        if (!isFilterOnly && !isPageOnly) {
          setLoading(true);
        }
        
        // Map frontend role values to API format
        const roleMapToAPI = {
          "Question Gatherer": "gatherer",
          "Question Creator": "creator",
          "Processor": "processor",
          "Question Explainer": "explainer",
        };
        
        // When any filter is active (search, status, or role), reset to page 1
        // Otherwise use the current page state
        const currentPage = (debouncedSearch || statusFilter || roleFilter) ? 1 : page;
        
        const params = {
          page: currentPage,
          limit: pageSize,
          ...(statusFilter && { status: statusFilter.toLowerCase() }),
          ...(roleFilter && { adminRole: roleMapToAPI[roleFilter] || roleFilter.toLowerCase().replace(/\s+/g, '') }),
          ...(debouncedSearch && { search: debouncedSearch }),
        };
        
        const response = await usersAPI.getAllUsers(params);
        
        if (response.success && response.data?.admins) {
          const mappedUsers = response.data.admins.map((apiUser) => {
            const workflowRole = apiUser.workflowRole || apiUser.adminRole;
            const roleMap = {
              gatherer: "Question Gatherer",
              creator: "Question Creator",
              processor: "Processor",
              explainer: "Question Explainer",
            };
            
            return {
              id: apiUser.id,
              name: apiUser.username || apiUser.name || "N/A",
              email: apiUser.email,
              workflowRole: roleMap[workflowRole] || workflowRole,
              status: apiUser.status ? apiUser.status.charAt(0).toUpperCase() + apiUser.status.slice(1) : "Active",
            };
          });
          
          // Update state smoothly without causing visual refresh
          setUsers(mappedUsers);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
        setPagination(null);
      } finally {
        // Only set loading to false if we set it to true
        if (!isFilterOnly && !isPageOnly) {
          setLoading(false);
        }
      }
    };
    
    loadUsers();
  }, [page, statusFilter, roleFilter, debouncedSearch]); // debouncedSearch triggers API call but not URL update

  const summaries = useMemo(() => {
    const roles = [
      { key: "Question Gatherer", translationKey: "questionGatherer", apiKey: "totalGatherer" },
      { key: "Question Creator", translationKey: "questionCreator", apiKey: "totalCreator" },
      { key: "Processor", translationKey: "processor", apiKey: "totalProcessor" },
      { key: "Question Explainer", translationKey: "questionExplainer", apiKey: "totalExplainer" },
    ];

    return roles.map((role) => {
      const totalCount = statistics ? (statistics[role.apiKey] || 0) : 0;

      return {
        label: t(`admin.userManagement.roles.${role.translationKey}`),
        value: totalCount,
        icon: roleIcons[role.key],
      };
    });
  }, [statistics, t]);

  const handleAddUser = () => {
    navigate("/admin/users/add");
  };

  const handleView = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleEdit = (user) => {
    // Pass user data through navigation state to avoid API call
    navigate(`/admin/users/${user.id}/edit`, { state: { user } });
  };

  const handleExport = async () => {
    if (typeof window === "undefined") return;
    try {
      // Fetch all users for export (with pagination, max 100 per page)
      const allUsers = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const params = {
          page,
          limit: 100, // Max allowed limit
          ...(statusFilter && { status: statusFilter.toLowerCase() }),
          ...(roleFilter && { adminRole: roleFilter.toLowerCase().replace(/\s+/g, '') }),
          ...(debouncedSearch && { search: debouncedSearch }),
        };
        
        const response = await usersAPI.getAllUsers(params);
        if (response.success && response.data?.admins) {
          const pageUsers = response.data.admins.map((apiUser) => {
            const workflowRole = apiUser.workflowRole || apiUser.adminRole;
            const roleMap = {
              gatherer: "Question Gatherer",
              creator: "Question Creator",
              processor: "Processor",
              explainer: "Question Explainer",
            };
            return {
              name: apiUser.username || apiUser.name || "N/A",
              email: apiUser.email,
              workflowRole: roleMap[workflowRole] || workflowRole,
              status: apiUser.status ? apiUser.status.charAt(0).toUpperCase() + apiUser.status.slice(1) : "Active",
            };
          });
          allUsers.push(...pageUsers);
          
          // Check if there are more pages
          if (response.data.pagination && page < response.data.pagination.totalPages) {
            page++;
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      // Create CSV from all collected users
      const csvRows = [
        [
          t('admin.userManagement.export.headers.name'),
          t('admin.userManagement.export.headers.email'),
          t('admin.userManagement.export.headers.workflowRole'),
          t('admin.userManagement.export.headers.status')
        ].join(","),
        ...allUsers.map((user) =>
          [user.name, user.email, user.workflowRole, user.status].join(",")
        ),
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = t('admin.userManagement.export.fileName');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting users:", error);
    }
  };

  if (loading || statsLoading) {
    return (
      <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6  2xl:px-[66px]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-center h-64">
          <p className="text-oxford-blue">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6  2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t('admin.userManagement.hero.title')}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t('admin.userManagement.hero.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="h-[36px] w-[124px] rounded-[10px] border border-[#E5E7EB] bg-white text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6] flex items-center justify-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.10357 3.51181C4.86316 3.2714 4.86316 2.88163 5.10357 2.64122L7.5651 0.179682C7.62172 0.123067 7.68994 0.0779487 7.76542 0.0467692C7.91558 -0.0155898 8.08542 -0.0155898 8.23558 0.0467692C8.31106 0.0779487 8.37908 0.123067 8.4357 0.179682L10.8972 2.64122C11.1376 2.88163 11.1376 3.2714 10.8972 3.51181C10.7774 3.63161 10.6199 3.6923 10.4623 3.6923C10.3048 3.6923 10.1472 3.63243 10.0274 3.51181L8.61619 2.10051V11.2821C8.61619 11.6217 8.34049 11.8974 8.0008 11.8974C7.66111 11.8974 7.38542 11.6217 7.38542 11.2821V2.10131L5.97416 3.51262C5.73293 3.75221 5.34398 3.75223 5.10357 3.51181ZM12.9231 5.74359C12.5834 5.74359 12.3077 6.01928 12.3077 6.35897C12.3077 6.69866 12.5834 6.97436 12.9231 6.97436C14.217 6.97436 14.7692 7.52656 14.7692 8.82051V12.9231C14.7692 14.217 14.217 14.7692 12.9231 14.7692H3.07692C1.78297 14.7692 1.23077 14.217 1.23077 12.9231V8.82051C1.23077 7.52656 1.78297 6.97436 3.07692 6.97436C3.41662 6.97436 3.69231 6.69866 3.69231 6.35897C3.69231 6.01928 3.41662 5.74359 3.07692 5.74359C1.09292 5.74359 0 6.83651 0 8.82051V12.9231C0 14.9071 1.09292 16 3.07692 16H12.9231C14.9071 16 16 14.9071 16 12.9231V8.82051C16 6.83651 14.9071 5.74359 12.9231 5.74359Z"
                  fill="#032746"
                />
              </svg>
              {t('admin.userManagement.actions.export')}
            </button>
            <button
              type="button"
              onClick={handleAddUser}
              className="h-[36px] w-[180px] rounded-[10px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
            >
              {t('admin.userManagement.actions.addNewUser')}
            </button>
          </div>
        </header>

        <UserSummaryCards summaries={summaries} />

        <UserFilterBar
          searchValue={searchInput}
          statusValue={statusFilter}
          roleValue={roleFilter}
          onSearchChange={(value) => {
            setSearchInput(value);
            // Page will reset to 1 in API call when filter is active
          }}
          onStatusChange={(value) => {
            setStatusFilter(value);
            // Page will reset to 1 in API call when filter is active
          }}
          onRoleChange={(value) => {
            setRoleFilter(value);
            // Page will reset to 1 in API call when filter is active
          }}
        />

        <UserTable
          users={users}
          page={page}
          pageSize={pageSize}
          total={pagination?.totalItems || 0}
          onPageChange={(newPage) => {
            setPage(newPage);
          }}
          onView={handleView}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default UserManagementPage;

