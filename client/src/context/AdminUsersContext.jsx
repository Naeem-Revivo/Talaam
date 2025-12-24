import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import usersAPI from "../api/users";

// Map API workflow roles to frontend format
const mapWorkflowRole = (apiRole) => {
  const roleMap = {
    gatherer: "Question Gatherer",
    creator: "Question Creator",
    processor: "Processor",
    explainer: "Question Explainer",
  };
  return roleMap[apiRole] || apiRole;
};

// Map frontend workflow roles to API format
const mapWorkflowRoleToAPI = (frontendRole) => {
  const roleMap = {
    "Question Gatherer": "gatherer",
    "Question Creator": "creator",
    Processor: "processor",
    "Question Explainer": "explainer",
  };
  return roleMap[frontendRole] || frontendRole.toLowerCase().replace(/\s+/g, '');
};

// Map API user format to frontend format
const mapApiUserToFrontend = (apiUser) => {
  // API returns workflowRole as adminRole, so check both
  const workflowRole = apiUser.workflowRole || apiUser.adminRole;
  return {
    id: apiUser.id,
    name: apiUser.username || apiUser.name || null,
    email: apiUser.email || null,
    workflowRole: workflowRole ? mapWorkflowRole(workflowRole) : null,
    status: apiUser.status ? apiUser.status.charAt(0).toUpperCase() + apiUser.status.slice(1) : null,
    // Only include fields that come from the API
    notes: apiUser.notes || null,
    // Backend uses updatedAt as proxy for lastLogin (like dashboard services)
    lastLogin: apiUser.lastLogin || apiUser.updatedAt || null,
    dateCreated: apiUser.dateCreated || apiUser.createdAt || null,
    activityLog: apiUser.activityLog || null,
  };
};

const AdminUsersContext = createContext(undefined);

export const AdminUsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getAllUsers(params);
      
      if (response.success && response.data?.admins) {
        const mappedUsers = response.data.admins.map(mapApiUserToFrontend);
        setUsers(mappedUsers);
        return { users: mappedUsers, pagination: response.data.pagination };
      }
      return { users: [], pagination: null };
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch users";
      setError(errorMessage);
      console.error("Error fetching users:", err);
      return { users: [], pagination: null };
    } finally {
      setLoading(false);
    }
  };

  // Note: Users are now fetched in components using URL params, not automatically here

  const addUser = async (payload) => {
    try {
      setError(null);
      const response = await usersAPI.createUser(payload);
      
      if (response.success && response.data?.user) {
        const newUser = mapApiUserToFrontend(response.data.user);
        
        // Only use data from API response, no hardcoded defaults
        setUsers((prev) => [newUser, ...prev]);
        return newUser;
      }
      // Create error object with full response data
      const error = new Error(response.message || "Failed to create user");
      error.response = { data: response };
      throw error;
    } catch (err) {
      // Don't set error state here - let the component handle error display
      // Just pass through the error with all its data
      throw err;
    }
  };

  const updateUser = async (id, updates) => {
    try {
      setError(null);
      
      // Prepare API update data
      const apiUpdates = {};
      if (updates.name !== undefined) apiUpdates.name = updates.name;
      if (updates.email !== undefined) apiUpdates.email = updates.email;
      if (updates.status !== undefined) apiUpdates.status = updates.status;
      if (updates.workflowRole !== undefined) {
        apiUpdates.workflowRole = mapWorkflowRoleToAPI(updates.workflowRole);
      }
      
      const response = await usersAPI.updateUser(id, apiUpdates);
      
      if (response.success && response.data?.user) {
        const updatedUser = mapApiUserToFrontend(response.data.user);
        
        // Only use data from API response, no hardcoded defaults
        setUsers((prev) =>
          prev.map((user) => (user.id === id ? updatedUser : user))
        );
        return updatedUser;
      }
      throw new Error(response.message || "Failed to update user");
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || "Failed to update user";
      setError(errorMessage);
      throw err;
    }
  };

  const getUserById = (id) => users.find((user) => user.id === id);

  const value = useMemo(
    () => ({
      users,
      loading,
      error,
      fetchUsers,
      addUser,
      updateUser,
      getUserById,
    }),
    [users, loading, error]
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


