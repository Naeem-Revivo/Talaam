import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import UserForm from "../../components/admin/userManagement/UserForm";
import { useAdminUsers } from "../../context/AdminUsersContext";

const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getUserById, updateUser } = useAdminUsers();
  const { t } = useLanguage();
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
          />
        </section>
      </div>
    </div>
  );
};

export default EditUserPage;


