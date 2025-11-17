import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { chevronDown } from "../../assets/svg";

const AddNewPlanPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    planName: "",
    description: "",
    price: "",
    duration: "Yearly",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to save the plan
    console.log("Form submitted:", formData);
    navigate("/admin/subscriptions");
  };

  const handleCancel = () => {
    navigate("/admin/subscriptions");
  };

  return (
    <div className="min-h-full px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-6">
          <h2 className="font-archivo text-[36px] font-bold leading-[100%] text-oxford-blue mb-2">
            {t('admin.addNewPlan.hero.title')}
          </h2>
          <p className="font-roboto text-[18px] font-normal leading-[20px] text-dark-gray mb-3">
            {t('admin.addNewPlan.hero.subtitle')}
          </p>
          <div className="relative inline-block mt-4">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="appearance-none w-[165px] h-[50px] px-4 pr-8 rounded-[8px] border border-[#E5E7EB] bg-white font-roboto text-[14px] font-normal leading-[20px] text-[#374151] outline-none cursor-pointer hover:border-[#D1D5DB] transition"
            >
              <option value="">{t('admin.addNewPlan.options.status')}</option>
              <option value="active">{t('admin.addNewPlan.options.active')}</option>
              <option value="inactive">{t('admin.addNewPlan.options.inactive')}</option>
            </select>
            <img 
              src={chevronDown} 
              alt=""
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
            />
          </div>
        </header>
        <div className="bg-white rounded-[12px]">
          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-8 sm:p-12 rounded-[12px] shadow-input"
          >
            {/* Form Title */}
            <h3 className="font-archivo text-[20px] font-bold leading-[100%] text-oxford-blue mb-4">
              {t('admin.addNewPlan.sections.addNewPlan')}
            </h3>
            <div className="flex gap-20 py-5">
              {/* Plan Name */}
              <div>
                <label
                  htmlFor="planName"
                  className="block font-roboto text-[16px] font-medium leading-[20px] text-[#374151] mb-1"
                >
                  {t('admin.addNewPlan.fields.planName')}
                </label>
                <input
                  id="planName"
                  name="planName"
                  type="text"
                  value={formData.planName}
                  onChange={handleChange}
                  placeholder={t('admin.addNewPlan.placeholders.planName')}
                  className="mt-1 w-[475px] h-[60px] px-4 font-roboto text-[14px] font-normal leading-[20px] text-dark-gray bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none shadow-input"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block font-roboto text-[16px] font-medium leading-[20px] text-[#374151] mb-1"
                >
                  {t('admin.addNewPlan.fields.price')}
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder={t('admin.addNewPlan.placeholders.price')}
                  className="mt-1 w-[475px] h-[60px] px-4 font-roboto text-[16px] font-normal leading-[20px] text-dark-gray bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none"
                  style={{
                    boxShadow:
                      "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>
            </div>
            {/* Duration */}
            <div>
              <label
                htmlFor="duration"
                className="block font-roboto text-[16px] font-medium leading-[20px] text-[#374151] mb-1"
              >
                {t('admin.addNewPlan.fields.duration')}
              </label>
              <div className="relative">
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="mt-1 w-full h-[60px] px-4 pr-10 font-roboto text-[16px] font-normal leading-[20px] text-dark-gray bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none appearance-none cursor-pointer shadow-input"
                >
                  <option value="Monthly">{t('admin.addNewPlan.options.monthly')}</option>
                  <option value="Quarterly">{t('admin.addNewPlan.options.quarterly')}</option>
                  <option value="Yearly">{t('admin.addNewPlan.options.yearly')}</option>
                </select>
                <img 
                  src={chevronDown} 
                  alt=""
                  className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2"
                />
              </div>
            </div>

            {/* Description */}
            <div className="py-5">
              <label
                htmlFor="description"
                className="block font-roboto text-[16px] font-medium leading-[20px] text-[#374151] mb-1"
              >
                {t('admin.addNewPlan.fields.description')}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('admin.addNewPlan.placeholders.description')}
                rows={6}
                className="mt-1 w-full px-4 py-3 font-roboto text-[16px] font-normal leading-[20px] text-dark-gray bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none resize-none shadow-input"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="w-[120px] h-[36px] rounded-[8px] border border-[#E5E7EB] bg-white font-roboto text-[16px] font-medium leading-[20px] text-[#374151] transition hover:bg-[#F9FAFB]"
              >
                {t('admin.addNewPlan.buttons.cancel')}
              </button>
              <button
                type="submit"
                className="w-[120px] h-[36px] rounded-[8px] bg-[#ED4122] font-roboto text-[16px] font-medium leading-[20px] text-white transition hover:bg-[#d43a1f]"
              >
                {t('admin.addNewPlan.buttons.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewPlanPage;
