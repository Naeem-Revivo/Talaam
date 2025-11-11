import React, { useMemo, useState } from "react";
import UserSummaryCards from "../../components/admin/userManagement/UserSummaryCards";
import UserFilterBar from "../../components/admin/userManagement/UserFilterBar";
import UserTable from "../../components/admin/userManagement/UserTable";
import UserFormModal from "../../components/admin/userManagement/UserFormModal";
import UserDetailModal from "../../components/admin/userManagement/UserDetailModal";
import { headcard1, headcard2, headcard3, headcard4 } from "../../assets/svg/dashboard/admin";

const initialUsers = [
  {
    id: "u-1",
    name: "John Doe",
    email: "johndoe@gmail.com",
    workflowRole: "Question Gatherer",
    systemRole: "Admin",
    status: "Active",
    notes:
      "John plays a critical role in sourcing high-quality questions for the creation pipeline.",
    lastLogin: "Oct 12, 2025 • 10:22 AM",
    dateCreated: "Jan 15, 2023",
    activityLog: [
      {
        description: "User logged in from IP 192.168.1.1",
        timestamp: "Oct 12, 2025 • 10:22 AM",
      },
      {
        description: "Workflow role changed from Question Creator to Question Gatherer",
        timestamp: "Oct 11, 2025 • 09:45 AM",
      },
    ],
  },
  {
    id: "u-2",
    name: "Jane Smith",
    email: "janesmith@gmail.com",
    workflowRole: "Question Creator",
    systemRole: "Editor",
    status: "Suspended",
    notes:
      "Currently under review for repeated violations of content guidelines.",
    lastLogin: "Oct 08, 2025 • 04:18 PM",
    dateCreated: "Feb 02, 2023",
    activityLog: [
      {
        description: "Account suspended by Admin",
        timestamp: "Oct 10, 2025 • 08:20 AM",
      },
      {
        description: "Created new question #Q-12345",
        timestamp: "Oct 09, 2025 • 01:04 PM",
      },
    ],
  },
  {
    id: "u-3",
    name: "Mike Johnson",
    email: "mikejohnson@gmail.com",
    workflowRole: "Processor",
    systemRole: "Viewer",
    status: "Active",
    notes:
      "Mike reviews and validates processed questions before they are added to the bank.",
    lastLogin: "Oct 13, 2025 • 06:35 PM",
    dateCreated: "Mar 19, 2023",
    activityLog: [
      {
        description: "Reviewed 45 new questions",
        timestamp: "Oct 13, 2025 • 05:40 PM",
      },
      {
        description: "Password changed successfully",
        timestamp: "Oct 11, 2025 • 11:15 AM",
      },
    ],
  },
  {
    id: "u-4",
    name: "Emily Davis",
    email: "emilydavis@gmail.com",
    workflowRole: "Question Explainer",
    systemRole: "Admin",
    status: "Active",
    notes:
      "Emily has consistently delivered high-quality content explanations for the question bank.",
    lastLogin: "Oct 14, 2025 • 09:45 AM",
    dateCreated: "May 24, 2023",
    activityLog: [
      {
        description: "Published 5 new explanations",
        timestamp: "Oct 14, 2025 • 09:45 AM",
      },
    ],
  },
  {
    id: "u-5",
    name: "Jane Smith",
    email: "janesmith+gatherer@gmail.com",
    workflowRole: "Question Gatherer",
    systemRole: "Editor",
    status: "Suspended",
    notes: "Duplicate account flagged for verification.",
    lastLogin: "Sep 30, 2025 • 02:02 PM",
    dateCreated: "Jul 05, 2023",
    activityLog: [
      {
        description: "Account flagged for duplicate entries",
        timestamp: "Oct 01, 2025 • 08:15 AM",
      },
    ],
  },
];

const roleIcons = {
  "Question Gatherer": headcard1,
  "Question Creator": headcard2,
  Processor: headcard3,
  "Question Explainer": headcard4,
};

const pageSize = 5;

const UserManagementPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [formModalState, setFormModalState] = useState({
    open: false,
    mode: "add",
    user: null,
  });
  const [detailModalState, setDetailModalState] = useState({
    open: false,
    user: null,
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ? true : user.status === statusFilter;
      const matchesRole =
        roleFilter === "All" ? true : user.workflowRole === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page]);

  const summaries = useMemo(() => {
    const roles = [
      "Question Gatherer",
      "Question Creator",
      "Processor",
      "Question Explainer",
    ];

    return roles.map((role) => {
      const usersByRole = users.filter(
        (user) => user.workflowRole === role
      );
      const activeCount = usersByRole.filter(
        (user) => user.status === "Active"
      ).length;
      return {
        label: role,
        total: usersByRole.length,
        status: activeCount ? "Active" : "Suspended",
        subtext: `${activeCount} active`,
        icon: roleIcons[role],
      };
    });
  }, [users]);

  const openAddModal = () => {
    setFormModalState({ open: true, mode: "add", user: null });
  };

  const openEditModal = (user) => {
    setFormModalState({ open: true, mode: "edit", user });
  };

  const closeFormModal = () => {
    setFormModalState({ open: false, mode: "add", user: null });
  };

  const handleFormSubmit = (values, mode) => {
    const { password, ...rest } = values;
    if (mode === "edit" && formModalState.user) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === formModalState.user.id ? { ...user, ...rest } : user
        )
      );
    } else {
      const newUser = {
        ...rest,
        id: `u-${Date.now()}`,
        dateCreated: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
        lastLogin: "Never",
        activityLog: [
          {
            description: "Account created",
            timestamp: new Date().toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ],
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    closeFormModal();
  };

  const openDetailModal = (user) => {
    setDetailModalState({ open: true, user });
  };

  const closeDetailModal = () => {
    setDetailModalState({ open: false, user: null });
  };

  const handleView = (user) => {
    openDetailModal(user);
  };

  const handleEdit = (user) => {
    openEditModal(user);
  };

  const handleExport = () => {
    if (typeof window === "undefined") return;
    const csvRows = [
      ["Name", "Email", "Workflow Role", "System Role", "Status"].join(","),
      ...users.map((user) =>
        [user.name, user.email, user.workflowRole, user.systemRole, user.status].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "user-management.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-archivo text-[32px] leading-[36px] text-[#032746]">
              User Management
            </h1>
            <p className="font-roboto text-sm text-[#6B7280]">
              Manage user accounts and workflow roles.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="rounded-[10px] border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#032746] transition hover:bg-[#F3F4F6]"
            >
              Export
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-[10px] bg-[#ED4122] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d43a1f]"
            >
              + Add New User
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

      <UserFormModal
        isOpen={formModalState.open}
        mode={formModalState.mode}
        initialValues={formModalState.user}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      <UserDetailModal
        isOpen={detailModalState.open}
        user={detailModalState.user}
        onClose={closeDetailModal}
        onEdit={(user) => {
          closeDetailModal();
          openEditModal(user);
        }}
      />
    </div>
  );
};

export default UserManagementPage;


