import React, { createContext, useContext, useMemo, useState } from "react";

const initialUsersData = [
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
        description:
          "Workflow role changed from Question Creator to Question Gatherer",
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

const AdminUsersContext = createContext(undefined);

export const AdminUsersProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsersData);

  const addUser = (payload) => {
    const { password, ...rest } = payload;
    const id = `u-${Date.now()}`;
    const createdAt = new Date();
    const newUser = {
      ...rest,
      id,
      dateCreated: createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      lastLogin: "Never",
      activityLog: [
        {
          description: "Account created",
          timestamp: createdAt.toLocaleString("en-US", {
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
    return newUser;
  };

  const updateUser = (id, updates) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              ...updates,
            }
          : user
      )
    );
  };

  const getUserById = (id) => users.find((user) => user.id === id);

  const value = useMemo(
    () => ({
      users,
      addUser,
      updateUser,
      getUserById,
    }),
    [users]
  );

  return (
    <AdminUsersContext.Provider value={value}>
      {children}
    </AdminUsersContext.Provider>
  );
};

export const useAdminUsers = () => {
  const context = useContext(AdminUsersContext);
  if (!context) {
    throw new Error("useAdminUsers must be used within an AdminUsersProvider");
  }
  return context;
};


