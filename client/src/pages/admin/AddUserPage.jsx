import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import UserForm from "../../components/admin/userManagement/UserForm";
import { useAdminUsers } from "../../context/AdminUsersContext";
import { showErrorToast, showSuccessToast } from "../../utils/toastConfig";

const AddUserPage = () => {
  const navigate = useNavigate();
  const { addUser } = useAdminUsers();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await addUser(values);
      showSuccessToast("User created successfully");
      navigate("/admin/users");
    } catch (error) {
      const errorMessage = error.message || error.response?.data?.message || "Failed to create user";
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 lg:px-8">
      <div className=" flex max-w-[1200px] mx-auto flex-col gap-6">
        <header className="space-y-3">
          <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
            {t('admin.addUser.hero.title')}
          </h1>
          <p className="font-roboto text-[18px] leading-[16px] text-[#6B7280] font-normal">
            {t('admin.addUser.hero.subtitle')}
          </p>
        </header>

        <section className="w-full max-w-[1120px] min-h-[605px] rounded-[16px] border border-[#E5E7EB] bg-white p-12 shadow-dashboard">
          <h2 className="mb-8 text-xl font-bold text-oxford-blue">
            {t('admin.addUser.form.title')}
          </h2>
          <UserForm mode="add" onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
        </section>
      </div>
    </div>
  );
};

export default AddUserPage;


