import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import UserForm from "../../components/admin/userManagement/UserForm";
import { useAdminUsers } from "../../context/AdminUsersContext";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig";
import usersAPI from "../../api/users";

const EditUserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { getUserById, updateUser } = useAdminUsers();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Try to get user from navigation state, context, or API
  useEffect(() => {
    const loadUser = async () => {
      // First try to get from navigation state (most efficient)
      if (location.state?.user && location.state.user.id === id) {
        setUser(location.state.user);
        setLoading(false);
        return;
      }
      
      // Second, try to get from context
      const contextUser = getUserById(id);
      if (contextUser) {
        setUser(contextUser);
        setLoading(false);
        return;
      }
      
      // If not in context or state, fetch from API with max allowed limit
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
                lastLogin: foundUser.lastLogin || null,
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
  }, [id, getUserById, location.state]);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await updateUser(id, values);
      showSuccessToast("User updated successfully");
      navigate("/admin/users");
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || "Failed to update user";
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F5F7FB] px-4 py-12">
        <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-12 text-center shadow-dashboard">
          <p className="font-roboto text-sm text-dark-gray">
            {t('admin.editUser.loading') || 'Loading user...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F5F7FB] px-4 py-12">
        <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-12 text-center shadow-dashboard">
          <h1 className="font-archivo text-2xl text-oxford-blue">
            {t('admin.editUser.errors.notFound')}
          </h1>
          <p className="mt-4 font-roboto text-sm text-dark-gray">
            {t('admin.editUser.errors.notFoundDescription')}
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="mt-6 rounded-[10px] bg-[#ED4122] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d43a1f]"
          >
            {t('admin.editUser.errors.goBack')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 lg:px-8">
      <div className="flex max-w-[1200px] mx-auto flex-col gap-6">
        <header className="space-y-2">
          <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
            {t('admin.editUser.hero.title')}
          </h1>
          <p className="font-roboto text-[18px] leading-[16px] text-dark-gray">
            {t('admin.editUser.hero.subtitle')}
          </p>
        </header>

        <section className="w-full max-w-[1120px] min-h-[605px] rounded-[16px] border border-[#E5E7EB] bg-white p-12 shadow-dashboard">
          <h2 className="mb-6 text-lg font-semibold text-oxford-blue">
            {t('admin.editUser.form.title')}
          </h2>
          <UserForm
            mode="edit"
            initialValues={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </section>
      </div>
    </div>
  );
};

export default EditUserPage;


