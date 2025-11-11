import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../../components/admin/userManagement/UserForm";
import { useAdminUsers } from "../../context/AdminUsersContext";

const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getUserById, updateUser } = useAdminUsers();
  const user = getUserById(id);

  const handleSubmit = (values) => {
    updateUser(id, values);
    navigate("/admin/users");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!user) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F5F7FB] px-4 py-12">
        <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-12 text-center shadow-[0_6px_54px_rgba(0,0,0,0.05)]">
          <h1 className="font-archivo text-2xl text-[#032746]">
            User not found
          </h1>
          <p className="mt-4 font-roboto text-sm text-[#6B7280]">
            We could not locate the requested user. Please return to the user
            management screen.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="mt-6 rounded-[10px] bg-[#ED4122] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d43a1f]"
          >
            Go back to User Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 lg:px-8">
      <div className="flex max-w-[1120px] flex-col gap-6">
        <header className="space-y-2">
          <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-[#032746]">
            Edit User
          </h1>
          <p className="font-roboto text-[18px] leading-[16px] text-[#6B7280]">
            Modify user details or change workflow access.
          </p>
        </header>

        <section className="w-full max-w-[1120px] min-h-[605px] rounded-[16px] border border-[#E5E7EB] bg-white p-12 shadow-[0_6px_54px_rgba(0,0,0,0.05)]">
          <h2 className="mb-6 text-lg font-semibold text-[#032746]">
            Edit User
          </h2>
          <UserForm
            mode="edit"
            initialValues={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </section>
      </div>
    </div>
  );
};

export default EditUserPage;


