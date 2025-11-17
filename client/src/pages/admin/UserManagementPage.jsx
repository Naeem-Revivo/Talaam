import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSummaryCards from "../../components/admin/userManagement/UserSummaryCards";
import UserFilterBar from "../../components/admin/userManagement/UserFilterBar";
import UserTable from "../../components/admin/userManagement/UserTable";
import { useAdminUsers } from "../../context/AdminUsersContext";
import { useLanguage } from "../../context/LanguageContext";
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
  const { users } = useAdminUsers();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? user.status === statusFilter : true;
      const matchesRole = roleFilter ? user.workflowRole === roleFilter : true;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page]);

  const summaries = useMemo(() => {
    const roles = [
      { key: "Question Gatherer", translationKey: "questionGatherer" },
      { key: "Question Creator", translationKey: "questionCreator" },
      { key: "Processor", translationKey: "processor" },
      { key: "Question Explainer", translationKey: "questionExplainer" },
    ];

    return roles.map((role) => {
      const usersByRole = users.filter(
        (user) => user.workflowRole === role.key
      );
      const totalCount = usersByRole.length;
      const activeCount = usersByRole.filter(
        (user) => user.status === "Active"
      ).length;
      const badgeTone = activeCount ? "active" : "suspended";
      return {
        label: t(`admin.userManagement.roles.${role.translationKey}`),
        value: totalCount,
        badgeText: badgeTone === "active" ? t('admin.userManagement.status.active') : t('admin.userManagement.status.suspended'),
        badgeTone,
        icon: roleIcons[role.key],
      };
    });
  }, [users, t]);

  const handleAddUser = () => {
    navigate("/admin/users/add");
  };

  const handleView = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleEdit = (user) => {
    navigate(`/admin/users/${user.id}/edit`);
  };

  const handleExport = () => {
    if (typeof window === "undefined") return;
    const csvRows = [
      [
        t('admin.userManagement.export.headers.name'),
        t('admin.userManagement.export.headers.email'),
        t('admin.userManagement.export.headers.workflowRole'),
        t('admin.userManagement.export.headers.systemRole'),
        t('admin.userManagement.export.headers.status')
      ].join(","),
      ...users.map((user) =>
        [user.name, user.email, user.workflowRole, user.systemRole, user.status].join(",")
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
  };

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
          searchValue={search}
          statusValue={statusFilter}
          roleValue={roleFilter}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          onRoleChange={(value) => {
            setRoleFilter(value);
            setPage(1);
          }}
        />

        <UserTable
          users={paginatedUsers}
          page={page}
          pageSize={pageSize}
          total={filteredUsers.length}
          onPageChange={setPage}
          onView={handleView}
          onEdit={handleEdit}
        />
      </div>

    </div>
  );
};

export default UserManagementPage;


