import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminUsers } from "../../context/AdminUsersContext";
import { useLanguage } from "../../context/LanguageContext";
import usersAPI from "../../api/users";

const statusBadgeStyles = {
  Active: "bg-[#FDF0D5] text-[#ED4122]",
  Suspended: "bg-[#C6D8D3] text-oxford-blue",
};

const InfoField = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[16px] font-roboto font-normal leading-[100%] text-dark-gray">
        {label}
      </span>
      <span className="text-[16px] font-roboto font-normal leading-[100%] text-oxford-blue">
        {value}
      </span>
    </div>
  );
};

const activityIcons = {
  login: (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="15" cy="15" r="15" fill="#ED4122" />
      <path
        d="M20.6703 15.7339C20.6391 15.8089 20.5941 15.8764 20.5375 15.9327L16.4349 20.0067C16.3151 20.1257 16.1575 20.186 16 20.186C15.8425 20.186 15.6849 20.1265 15.5651 20.0067C15.3247 19.768 15.3247 19.3809 15.5651 19.1422L18.6174 16.1111H8.61538C8.27569 16.1111 8 15.8373 8 15.5C8 15.1627 8.27569 14.8889 8.61538 14.8889H18.6166L15.5643 11.8578C15.3239 11.6191 15.3239 11.232 15.5643 10.9933C15.8047 10.7545 16.1945 10.7545 16.4349 10.9933L20.5375 15.0673C20.5941 15.1236 20.6391 15.1911 20.6703 15.2661C20.7326 15.416 20.7326 15.584 20.6703 15.7339ZM23.3846 10C23.0449 10 22.7692 10.2738 22.7692 10.6111V20.3889C22.7692 20.7262 23.0449 21 23.3846 21C23.7243 21 24 20.7262 24 20.3889V10.6111C24 10.2738 23.7243 10 23.3846 10Z"
        fill="white"
      />
    </svg>
  ),
  update: (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="15" cy="15" r="15" fill="#FDF0D5" />
      <path
        d="M17.0559 13.6341C18.8854 13.6341 20.373 12.1458 20.373 10.3171C20.373 8.48839 18.8854 7 17.0559 7C15.2264 7 13.7388 8.48839 13.7388 10.3171C13.7388 12.1458 15.2264 13.6341 17.0559 13.6341ZM17.0559 8.17073C18.2399 8.17073 19.2023 9.13307 19.2023 10.3171C19.2023 11.5011 18.2399 12.4634 17.0559 12.4634C15.8719 12.4634 14.9095 11.5011 14.9095 10.3171C14.9095 9.13307 15.8719 8.17073 17.0559 8.17073ZM19.2975 16.0225C19.1008 15.9905 18.876 15.9756 18.6099 15.9756H15.4879C12.4104 15.9756 12.1707 18.527 12.1707 19.3083C12.1707 20.5282 12.696 21.0488 13.9269 21.0488H17.8294C18.1525 21.0488 18.4147 21.311 18.4147 21.6341C18.4147 21.9573 18.1525 22.2195 17.8294 22.2195H13.9269C12.0396 22.2195 11 21.1854 11 19.3083C11 17.2306 12.1754 14.8049 15.4879 14.8049H18.6099C18.9385 14.8049 19.2241 14.8251 19.4833 14.8673C19.8025 14.918 20.0202 15.2185 19.9679 15.5377C19.9172 15.857 19.6073 16.0732 19.2975 16.0225ZM26.5967 18.9009L26.7005 18.8431C26.8386 18.7658 26.9393 18.6363 26.9799 18.4841C27.0213 18.3311 26.9979 18.1688 26.9175 18.033L26.2026 16.8326C26.0402 16.5602 25.6929 16.4666 25.4135 16.6211L25.3096 16.6788C25.1559 16.7655 24.9631 16.7662 24.807 16.6788C24.661 16.5969 24.5705 16.447 24.5705 16.2886C24.5705 15.9015 24.2544 15.5869 23.865 15.5869H22.6755C22.286 15.5869 21.9699 15.9015 21.9699 16.2886C21.9699 16.4478 21.8793 16.5969 21.7334 16.6788C21.5781 16.7662 21.3853 16.7662 21.2308 16.6788C20.8983 16.4938 20.4737 16.607 20.2794 16.9317L19.6838 17.9315C19.5878 18.0915 19.5597 18.2874 19.6065 18.4677C19.6541 18.6488 19.7751 18.8064 19.939 18.8993C19.9445 18.9016 19.9492 18.9047 19.9547 18.9079C20.0944 18.9914 20.1802 19.1374 20.1802 19.2927C20.181 19.4527 20.0904 19.6033 19.9398 19.6876C19.7767 19.7805 19.6557 19.9374 19.6073 20.1177C19.5589 20.2995 19.5855 20.49 19.6823 20.6539L20.2801 21.6552C20.4768 21.9846 20.8936 22.0962 21.2316 21.9073C21.3853 21.8207 21.5773 21.8206 21.7334 21.9081C21.8793 21.99 21.9691 22.1391 21.9691 22.2983C21.9691 22.6854 22.2852 23 22.6739 23H23.8657C24.2544 23 24.5705 22.6854 24.5705 22.2983C24.5705 22.1391 24.661 21.99 24.807 21.9081C24.9623 21.8206 25.1551 21.8206 25.3096 21.9081C25.6429 22.093 26.0659 21.9799 26.2611 21.6552L26.8605 20.65C26.9558 20.4876 26.9814 20.298 26.933 20.1161C26.8847 19.9335 26.7661 19.7813 26.6014 19.6876C26.5967 19.6853 26.5912 19.6821 26.5865 19.6798C26.4468 19.5963 26.361 19.4495 26.361 19.2942C26.3618 19.1334 26.4523 18.9829 26.5967 18.9009ZM25.6414 20.408L25.4564 20.7187C25.0466 20.6211 24.6072 20.6772 24.2342 20.8872C23.8627 21.0964 23.5933 21.4367 23.4723 21.8293H23.0704C22.9502 21.4375 22.6809 21.0971 22.3086 20.8872C21.9364 20.6772 21.4953 20.6195 21.0864 20.7187L20.9014 20.4088C21.1887 20.1091 21.3541 19.7095 21.3526 19.2888C21.3518 18.8712 21.1855 18.4748 20.9014 18.1774L21.0864 17.8667C21.4953 17.9643 21.9356 17.9089 22.3086 17.6982C22.6802 17.489 22.9494 17.1487 23.0704 16.7561H23.4723C23.5925 17.1479 23.8627 17.4882 24.2342 17.6982C24.608 17.9089 25.0489 17.9651 25.4564 17.8667L25.6414 18.1774C25.3557 18.4763 25.1902 18.8751 25.191 19.2942C25.191 19.7125 25.3565 20.1098 25.6414 20.408ZM24.089 19.2927C24.089 19.7235 23.7401 20.0732 23.3085 20.0732C22.8776 20.0732 22.5241 19.7235 22.5241 19.2927C22.5241 18.8619 22.8698 18.5122 23.3007 18.5122H23.3085C23.7393 18.5122 24.089 18.8619 24.089 19.2927Z"
        fill="#ED4122"
      />
    </svg>
  ),
  question: (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="15" cy="15" r="15" fill="#E6F1FF" />
      <path
        d="M15 8C11.6909 8 9 10.6909 9 14C9 17.3091 11.6909 20 15 20C15.4673 20 15.9218 19.9473 16.36 19.8482L18.7 21.2C18.8127 21.2645 18.9409 21.2986 19.0714 21.2986C19.5627 21.2986 19.9309 20.8345 19.7827 20.3645L19.14 18.2C20.2855 17.2327 21 15.7018 21 14C21 10.6909 18.3091 8 15 8ZM15 18.5455C12.4964 18.5455 10.4545 16.5036 10.4545 14C10.4545 11.4964 12.4964 9.45455 15 9.45455C17.5036 9.45455 19.5455 11.4964 19.5455 14C19.5455 16.5036 17.5036 18.5455 15 18.5455ZM15.7273 16.3636H14.2727V14.9091H15.7273V16.3636ZM15.7273 13.4545H14.2727C14.2727 11.9091 16.3636 12 16.3636 10.9091C16.3636 10.3636 15.9636 9.97273 15.4091 9.97273C14.8545 9.97273 14.4545 10.3636 14.4545 10.9091H13C13 9.34545 14.1636 8.54545 15.4091 8.54545C16.6545 8.54545 17.8182 9.34545 17.8182 10.9091C17.8182 12.3455 15.7273 12.5455 15.7273 13.4545Z"
        fill="#1F82FF"
      />
    </svg>
  ),
  password: (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="15" cy="15" r="15" fill="#E6F4F1" />
      <path
        d="M19 13H11C10.4477 13 10 13.4477 10 14V20C10 20.5523 10.4477 21 11 21H19C19.5523 21 20 20.5523 20 20V14C20 13.4477 19.5523 13 19 13ZM17 14V12C17 10.3431 15.6569 9 14 9C12.3431 9 11 10.3431 11 12V14H12.5V12C12.5 11.1716 13.1716 10.5 14 10.5C14.8284 10.5 15.5 11.1716 15.5 12V14H17Z"
        fill="#0F9D76"
      />
      <path
        d="M16.2071 16.7929C16.5976 17.1834 16.5976 17.8166 16.2071 18.2071L14.7071 19.7071C14.3166 20.0976 13.6834 20.0976 13.2929 19.7071L12.5 18.9142C12.1095 18.5237 12.1095 17.8905 12.5 17.5C12.8905 17.1095 13.5237 17.1095 13.9142 17.5L14 17.5858L14.7929 16.7929C15.1834 16.4024 15.8166 16.4024 16.2071 16.7929Z"
        fill="#0F9D76"
      />
    </svg>
  ),
  fallback: (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="15" cy="15" r="15" fill="#E5E7EB" />
      <path
        d="M15 9C11.6863 9 9 11.6863 9 15C9 18.3137 11.6863 21 15 21C18.3137 21 21 18.3137 21 15C21 11.6863 18.3137 9 15 9ZM16 18H14V16H16V18ZM16.83 13.83L16.41 14.25C16.06 14.6 15.82 14.89 15.66 15.34C15.56 15.62 15.5 15.89 15.5 16H14C14 15.44 14.11 14.91 14.34 14.43C14.58 13.93 14.92 13.5 15.36 13.07L16.12 12.3C16.37 12.05 16.5 11.78 16.5 11.5C16.5 10.95 16.05 10.5 15.5 10.5C14.95 10.5 14.5 10.95 14.5 11.5H13C13 10.12 14.12 9 15.5 9C16.88 9 18 10.12 18 11.5C18 12.18 17.73 12.79 17.17 13.35L16.83 13.83Z"
        fill="#4B5563"
      />
    </svg>
  ),
};

const ActivityItem = ({ icon, title, timestamp }) => {
  const match = title.match(/(#\S+)/);
  const highlightToken = match ? match[0] : null;

  const renderTitle = () => {
    if (!highlightToken) {
      return title;
    }
    const [before, after] = title.split(highlightToken);
    return (
      <>
        {before}
        <span className="text-[#ED4122]">{highlightToken}</span>
        {after}
      </>
    );
  };

  return (
    <div className="flex items-start gap-4 rounded-[16px] border border-[#E4E7EC] bg-white px-5 py-4 shadow-user-card">
      <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-roboto font-normal text-[16px] leading-5 text-black">
          {renderTitle()}
        </p>
        <span className="text-xs font-normal font-roboto text-dark-gray">
          {timestamp}
        </span>
      </div>
    </div>
  );
};

const resolveActivityVisuals = (description) => {
  const entry = description.toLowerCase();
  if (entry.includes("logged in")) {
    return { icon: activityIcons.login };
  }
  if (entry.includes("question")) {
    return { icon: activityIcons.question };
  }
  if (entry.includes("updated") || entry.includes("changed")) {
    return { icon: activityIcons.update };
  }
  if (entry.includes("password")) {
    return { icon: activityIcons.password };
  }
  return {
    icon: activityIcons.fallback,
  };
};

const UserDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getUserById } = useAdminUsers();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Try to get user from context first, if not found, fetch from API
  useEffect(() => {
    const loadUser = async () => {
      // First try to get from context
      const contextUser = getUserById(id);
      if (contextUser) {
        // Ensure lastLogin is checked from multiple possible field names
        // Backend uses updatedAt as proxy for lastLogin (like dashboard services)
        const userWithLastLogin = {
          ...contextUser,
          lastLogin: contextUser.lastLogin || contextUser.updatedAt || contextUser.lastLoginAt || contextUser.lastLoginDate || contextUser.last_login || null,
        };
        setUser(userWithLastLogin);
        setLoading(false);
        return;
      }
      
      // If not in context, fetch from API with max allowed limit
      try {
        setLoading(true);
        // Fetch users with max allowed limit (100) and search through pages if needed
        let foundUser = null;
        let page = 1;
        const maxPages = 10; // Limit search to first 10 pages (1000 users max)
        
        while (!foundUser && page <= maxPages) {
          const response = await usersAPI.getAllUsers({ page, limit: 100 });
          if (response.success && response.data?.admins) {
            foundUser = response.data.admins.find((u) => u.id === id);
            if (foundUser) {
              // Map API user to frontend format
              const workflowRole = foundUser.workflowRole || foundUser.adminRole;
              const roleMap = {
                gatherer: "Question Gatherer",
                creator: "Question Creator",
                processor: "Processor",
                explainer: "Question Explainer",
              };
              
              const mappedUser = {
                id: foundUser.id,
                name: foundUser.username || foundUser.name || null,
                email: foundUser.email || null,
                workflowRole: workflowRole ? roleMap[workflowRole] || workflowRole : null,
                status: foundUser.status ? foundUser.status.charAt(0).toUpperCase() + foundUser.status.slice(1) : null,
                notes: foundUser.notes || null,
                // Check multiple possible field names for lastLogin
                // Backend uses updatedAt as proxy for lastLogin (like dashboard services)
                lastLogin: foundUser.lastLogin || foundUser.updatedAt || foundUser.lastLoginAt || foundUser.lastLoginDate || foundUser.last_login || null,
                dateCreated: foundUser.dateCreated || foundUser.createdAt || null,
                activityLog: foundUser.activityLog || null,
              };
              setUser(mappedUser);
              break;
            }
            // Check if there are more pages
            if (!response.data.pagination || page >= response.data.pagination.totalPages) {
              break;
            }
            page++;
          } else {
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [id, getUserById]);
  
  const getStatusLabel = (status) => {
    if (status === "Active") return t('admin.userManagement.status.active');
    if (status === "Suspended") return t('admin.userManagement.status.suspended');
    return status;
  };
  
  const getRoleLabel = (role) => {
    const roleMap = {
      "Question Gatherer": t('admin.userManagement.roles.questionGatherer'),
      "Question Creator": t('admin.userManagement.roles.questionCreator'),
      "Processor": t('admin.userManagement.roles.processor'),
      "Question Explainer": t('admin.userManagement.roles.questionExplainer'),
    };
    return roleMap[role] || role;
  };
  
  // Format lastLogin date similar to gatherer dashboard
  const formatLastLogin = (dateString) => {
    if (!dateString) return "Never";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Never";
      
      const now = new Date();
      const diffInMs = now - date;
      const diffInHours = diffInMs / (1000 * 60 * 60);
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInHours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return minutes <= 1 ? "Just now" : `${minutes} minutes ago`;
      } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours);
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
      } else if (diffInDays < 2) {
        return "Yesterday";
      } else if (diffInDays < 7) {
        const days = Math.floor(diffInDays);
        return `${days} days ago`;
      } else {
        // Format as "DD/MM/YYYY at HH:MM"
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} at ${hours}:${minutes}`;
      }
    } catch (error) {
      console.error("Error formatting lastLogin:", error);
      return "Never";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F5F7FB] px-4 py-12">
        <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-12 text-center shadow-dashboard">
          <p className="text-[16px] font-roboto text-dark-gray">
            {t('admin.viewUser.loading') || 'Loading user...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F5F7FB] px-4 py-12">
        <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-12 text-center shadow-dashboard">
          <h1 className="font-archivo text-[28px] font-semibold text-oxford-blue">
            {t('admin.viewUser.errors.notFound')}
          </h1>
          <p className="mt-4 text-[16px] font-roboto text-dark-gray">
            {t('admin.viewUser.errors.notFoundDescription')}
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="mt-6 rounded-[10px] bg-[#ED4122] px-6 py-3 text-[16px] font-roboto font-medium text-white transition hover:bg-[#d43a1f]"
          >
            {t('admin.viewUser.errors.backToManagement')}
          </button>
        </div>
      </div>
    );
  }

  const badgeClass = user.status ? (statusBadgeStyles[user.status] ?? statusBadgeStyles.Active) : statusBadgeStyles.Active;

  // Build activity log - include lastLogin if it exists
  const buildActivityLog = () => {
    const log = [];

    // Add lastLogin to activity log if it exists
    if (user.lastLogin) {
      const formattedLastLogin = formatLastLogin(user.lastLogin);
      log.push({
        description: `Logged in ${formattedLastLogin}`,
        timestamp: user.lastLogin,
      });
    }
    
    // Add existing activity log items
    if (user.activityLog && Array.isArray(user.activityLog) && user.activityLog.length > 0) {
      log.push(...user.activityLog);
    }
    
    // Sort by timestamp (most recent first)
    return log.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0);
      const dateB = new Date(b.timestamp || 0);
      return dateB - dateA;
        });
  };

  const activityLog = buildActivityLog();

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6">
        <section className="flex flex-col gap-5">
          <div className="rounded-[24px] border border-[#032746]/10 bg-white px-8 py-6 shadow-modal">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] px-4 py-2 text-[14px] font-roboto font-medium text-oxford-blue transition hover:border-[#032746]/30 hover:text-[#ED4122]"
              >
                <span aria-hidden="true">←</span>
                {t('admin.viewUser.backToUsers')}
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-5 pt-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDF0D5] text-[22px] font-semibold text-[#ED4122]">
                    {user.name
                      ?.split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    {user.name && (
                      <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
                        {user.name}
                      </h1>
                    )}
                    {user.status && (
                      <span
                        className={`inline-flex h-[26px] min-w-[59px] items-center justify-center rounded-md px-3 text-sm font-roboto font-normal ${badgeClass}`}
                      >
                        {getStatusLabel(user.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                className="self-start rounded-[12px] bg-[#ED4122] px-6 py-3 text-[16px] font-roboto font-medium text-white transition hover:bg-[#d43a1f]"
              >
                {t('admin.viewUser.editUser')}
              </button>
            </div>

            <div className="mt-5 border-t border-[#E2E2E2] pt-8">
              <h2 className="text-[20px] font-archivo font-bold leading-[100%] text-oxford-blue">
                {t('admin.viewUser.sections.personalInformation')}
              </h2>
              {(user.name || user.email) && (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <InfoField label={t('admin.viewUser.fields.fullName')} value={user.name} />
                  <InfoField label={t('admin.viewUser.fields.email')} value={user.email} />
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#032746]/10 bg-white px-8 py-6 shadow-modal">
          <div className=" border-[#E2E2E2]">
                <h2 className="text-[20px] font-archivo font-bold leading-[100%] text-oxford-blue">
                  {t('admin.viewUser.sections.accountDetails')}
                </h2>
                {(user.workflowRole || user.status || user.lastLogin || user.dateCreated) && (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <InfoField label={t('admin.viewUser.fields.workflowRole')} value={user.workflowRole ? getRoleLabel(user.workflowRole) : null} />
                    <InfoField label={t('admin.viewUser.fields.status')} value={user.status ? getStatusLabel(user.status) : null} />
                    <InfoField label={t('admin.viewUser.fields.lastLogin')} value={user.lastLogin ? formatLastLogin(user.lastLogin) : "Never"} />
                    <InfoField label={t('admin.viewUser.fields.dateCreated')} value={user.dateCreated} />
                  </div>
                )}
              </div>
              </div>

          <div className="rounded-[24px] border border-[#032746]/10 bg-white py-6 shadow-modal">
            <h2 className="border-b px-8 border-[#E2E2E2] pb-5 text-[20px] font-archivo font-semibold leading-[28px] text-oxford-blue">
              {t('admin.viewUser.sections.activityLog')}
            </h2>
            {activityLog.length > 0 ? (
              <div className="mt-6 px-8 flex flex-col gap-4">
                {activityLog.map((item, index) => {
                  const visuals = resolveActivityVisuals(item.description);
                  // Format timestamp for display
                  const formatTimestamp = (timestamp) => {
                    if (!timestamp) return "";
                    try {
                      const date = new Date(timestamp);
                      if (isNaN(date.getTime())) return "";
                      return date.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    } catch (error) {
                      return timestamp;
                    }
                  };
                  return (
                    <ActivityItem
                      key={`${item.description}-${index}`}
                      icon={visuals.icon}
                      title={item.description}
                      timestamp={formatTimestamp(item.timestamp)}
                      accent={visuals.color}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 px-8">
                <p className="text-[16px] font-roboto text-dark-gray text-center py-4">
                  {t('admin.viewUser.noActivity') || "No activity log available"}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDetailPage;


