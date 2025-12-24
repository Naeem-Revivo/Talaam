import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { chevronDown } from "../../assets/svg";
import plansAPI from "../../api/plans";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";

const AddNewPlanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Check if we're in edit mode
  const editPlan = location.state?.plan;
  const isEditMode = !!editPlan;
  const planId = editPlan?._original?.id || editPlan?.id;

  const [formData, setFormData] = useState({
    planName: "",
    description: "",
    price: "",
    duration: "Annual",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with existing plan data if in edit mode
  useEffect(() => {
    if (isEditMode && editPlan) {
      const originalPlan = editPlan._original || editPlan;
      setFormData({
        planName: originalPlan.name || editPlan.planname || "",
        description: originalPlan.description || "",
        price: originalPlan.price?.toString() || editPlan.price?.replace('$', '') || "",
        duration: originalPlan.duration || editPlan.duration || "Annual",
        status: originalPlan.status?.toLowerCase() || editPlan.status?.toLowerCase() || "",
      });
    }
  }, [isEditMode, editPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Duration is already in correct format (Monthly, Quarterly, Semi-Annual, Annual)
      const duration = formData.duration;

      // Prepare API payload
      const planData = {
        name: formData.planName.trim(),
        price: formData.price,
        duration: duration,
        description: formData.description.trim() || "",
        status: formData.status || "active",
      };

      // Validate required fields
      if (!planData.name) {
        setErrors({ planName: "Plan name is required" });
        setIsSubmitting(false);
        return;
      }

      if (!planData.price || isNaN(parseFloat(planData.price)) || parseFloat(planData.price) < 0) {
        setErrors({ price: "Price must be a positive number" });
        setIsSubmitting(false);
        return;
      }

      if (!planData.status) {
        setErrors({ status: "Status is required" });
        setIsSubmitting(false);
        return;
      }

      // Call API - use update if in edit mode, otherwise create
      let response;
      if (isEditMode && planId) {
        response = await plansAPI.updatePlan(planId, planData);
        if (response.success) {
          showSuccessToast(response.message || "Plan updated successfully");
          navigate("/admin/subscriptions");
        }
      } else {
        response = await plansAPI.createPlan(planData);
        if (response.success) {
          showSuccessToast(response.message || "Plan created successfully");
          navigate("/admin/subscriptions");
        }
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} plan:`, error);
      
      // Handle validation errors from API
      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          // Map API field names to form field names
          const fieldName = err.field === "name" ? "planName" : err.field;
          fieldErrors[fieldName] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        // Show general error message
        const errorMessage = error.message || `Failed to ${isEditMode ? 'update' : 'create'} plan. Please try again.`;
        showErrorToast(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/subscriptions");
  };

  return (
    <div className="min-h-full px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto max-w-[1200px]">
        <header className="mb-6">
          <h2 className="font-archivo text-[36px] font-bold leading-[100%] text-oxford-blue mb-2">
            {isEditMode 
              ? (t('admin.addNewPlan.hero.editTitle') || 'Edit Plan')
              : t('admin.addNewPlan.hero.title')
            }
          </h2>
          <p className="font-roboto text-[18px] font-normal leading-[20px] text-dark-gray mb-3">
            {isEditMode
              ? (t('admin.addNewPlan.hero.editSubtitle') || 'Update plan details and pricing')
              : t('admin.addNewPlan.hero.subtitle')
            }
          </p>
          <div className="relative inline-block mt-4">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`appearance-none w-[165px] h-[50px] px-4 pr-8 rounded-[8px] border bg-white font-roboto text-[14px] font-normal leading-[20px] text-[#374151] outline-none cursor-pointer hover:border-[#D1D5DB] transition ${
                errors.status
                  ? "border-red-500"
                  : "border-[#E5E7EB]"
              }`}
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
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status}</p>
            )}
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
              {isEditMode
                ? (t('admin.addNewPlan.sections.editPlan') || 'Edit Plan')
                : t('admin.addNewPlan.sections.addNewPlan')
              }
            </h3>
            <div className="flex flex-col md:flex-row gap-5 md:gap-20 py-5 w-full">
              {/* Plan Name */}
              <div className="w-full">
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
                  className={`mt-1 w-full h-[60px] px-4 font-roboto text-[14px] font-normal leading-[20px] text-dark-gray bg-white border rounded-[12px] focus:outline-none shadow-input ${
                    errors.planName
                      ? "border-red-500 focus:border-red-500"
                      : "border-[rgba(3,39,70,0.2)]"
                  }`}
                />
                {errors.planName && (
                  <p className="mt-1 text-sm text-red-500">{errors.planName}</p>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block font-roboto text-[16px] font-medium leading-[20px] text-[#374151] mb-1"
                >
                  {t('admin.addNewPlan.fields.price')}
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder={t('admin.addNewPlan.placeholders.price')}
                  className={`mt-1 w-full h-[60px] px-4 font-roboto text-[16px] font-normal leading-[20px] text-dark-gray bg-white border rounded-[12px] focus:outline-none ${
                    errors.price
                      ? "border-red-500 focus:border-red-500"
                      : "border-[rgba(3,39,70,0.2)]"
                  }`}
                  style={{
                    boxShadow:
                      "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
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
                  <option value="Semi-Annual">{t('admin.addNewPlan.options.semiAnnual')}</option>
                  <option value="Annual">{t('admin.addNewPlan.options.annual')}</option>
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
                className="w-full sm:w-[120px] h-[36px] rounded-[8px] border border-[#E5E7EB] bg-white font-roboto text-[16px] font-medium leading-[20px] text-[#374151] transition hover:bg-[#F9FAFB]"
              >
                {t('admin.addNewPlan.buttons.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-[120px] h-[36px] rounded-[8px] bg-[#ED4122] font-roboto text-[16px] font-medium leading-[20px] text-white transition hover:bg-[#d43a1f] ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting 
                  ? (isEditMode ? "Updating..." : "Saving...") 
                  : (isEditMode 
                      ? (t('admin.addNewPlan.buttons.update') || 'Update') 
                      : t('admin.addNewPlan.buttons.save')
                    )
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewPlanPage;
