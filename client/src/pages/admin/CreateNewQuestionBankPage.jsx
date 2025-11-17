import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const CreateNewQuestionBankPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
  });

  const [plans, setPlans] = useState([
    {
      id: 1,
      planName: "Basic Plan",
      price: "$9.99",
      duration: "Monthly",
      productId: "12345",
      priceId: "12345",
    },
    {
      id: 2,
      planName: "Premium Plan",
      price: "$29.99",
      duration: "Quarterly",
      productId: "12345",
      priceId: "12345",
    },
    {
      id: 3,
      planName: "Enterprise",
      price: "$49.99",
      duration: "Yearly",
      productId: "12345",
      priceId: "12345",
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      console.log("Files dropped:", files);
      // TODO: Handle file upload
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      console.log("Files selected:", files);
      // TODO: Handle file upload
    }
  };

  const handleAddPlan = () => {
    // TODO: Open modal or navigate to add plan page
    console.log("Add new plan");
  };

  const handleEditPlan = (planId) => {
    // TODO: Open modal or navigate to edit plan page
    console.log("Edit plan:", planId);
  };

  const handleCancel = () => {
    navigate("/admin/subscriptions");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to create the question bank
    console.log("Form submitted:", { formData, plans });
    navigate("/admin/subscriptions");
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <header className="mb-6">
          <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue mb-2">
            {t('admin.createNewQuestionBank.hero.title')}
          </h1>
          <p className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray">
            {t('admin.createNewQuestionBank.hero.subtitle')}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Details Section */}
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard p-6">
            <h2 className="font-archivo text-[20px] font-semibold leading-[100%] text-oxford-blue mb-6">
              {t('admin.createNewQuestionBank.sections.productDetails')}
            </h2>

            {/* Product Name */}
            <div className="mb-6">
              <label
                htmlFor="productName"
                className="block font-roboto text-[14px] font-medium leading-[20px] text-[#374151] mb-2"
              >
                {t('admin.createNewQuestionBank.fields.productName')}
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange}
                placeholder={t('admin.createNewQuestionBank.placeholders.productName')}
                className="w-full h-[60px] px-4 font-roboto text-[14px] font-normal leading-[20px] text-dark-gray bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none"
                style={{
                  boxShadow:
                    "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block font-roboto text-[14px] font-medium leading-[20px] text-[#374151] mb-2"
              >
                {t('admin.createNewQuestionBank.fields.description')}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 font-roboto text-[14px] font-normal leading-[20px] text-dark-gray bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none resize-none"
                style={{
                  boxShadow:
                    "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          </div>

          {/* Upload Questions Section */}
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard p-6">
            <h2 className="font-archivo text-[20px] font-semibold leading-[100%] text-oxford-blue mb-6">
              {t('admin.createNewQuestionBank.sections.uploadQuestions')}
            </h2>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[12px] p-12 text-center transition-colors ${
                isDragging
                  ? "border-[#ED4122] bg-[#FDF0D5]"
                  : "border-[#E5E7EB] bg-[#F9FAFB]"
              }`}
            >
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                onChange={handleFileInput}
                multiple
                accept=".csv,.xlsx,.xls"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-[8px] bg-[#C6D8D3] flex items-center justify-center mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray mb-1">
                  {t('admin.createNewQuestionBank.placeholders.dragAndDrop')}
                </p>
                <p className="font-roboto text-[14px] font-normal leading-[20px] text-dark-gray">
                  {t('admin.createNewQuestionBank.placeholders.orClickToBrowse')}
                </p>
              </label>
            </div>
          </div>

          {/* Subscription Plan Section */}
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-archivo text-[20px] font-semibold leading-[100%] text-oxford-blue">
                {t('admin.createNewQuestionBank.sections.subscriptionPlan')}
              </h2>
              <button
                type="button"
                onClick={handleAddPlan}
                className="h-[36px] px-4 rounded-[8px] bg-[#ED4122] font-roboto text-[14px] font-medium leading-[20px] text-white transition hover:bg-[#d43a1f] flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {t('admin.createNewQuestionBank.buttons.addPlan')}
              </button>
            </div>

            {/* Plans Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-oxford-blue">
                    <th className="px-6 py-4 text-left font-archivo text-[16px] font-medium leading-[16px] text-white">
                      {t('admin.createNewQuestionBank.table.headers.planName')}
                    </th>
                    <th className="px-6 py-4 text-left font-archivo text-[16px] font-medium leading-[16px] text-white">
                      {t('admin.createNewQuestionBank.table.headers.price')}
                    </th>
                    <th className="px-6 py-4 text-left font-archivo text-[16px] font-medium leading-[16px] text-white">
                      {t('admin.createNewQuestionBank.table.headers.duration')}
                    </th>
                    <th className="px-6 py-4 text-left font-archivo text-[16px] font-medium leading-[16px] text-white">
                      {t('admin.createNewQuestionBank.table.headers.integrationDetails')}
                    </th>
                    <th className="px-6 py-4 text-center font-archivo text-[16px] font-medium leading-[16px] text-white">
                      {t('admin.createNewQuestionBank.table.headers.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr
                      key={plan.id}
                      className="border-b border-[#E5E7EB] bg-white last:border-none"
                    >
                      <td className="px-6 py-4 font-roboto text-[14px] font-normal leading-[100%] text-oxford-blue">
                        {plan.planName}
                      </td>
                      <td className="px-6 py-4 font-roboto text-[14px] font-normal leading-[100%] text-oxford-blue">
                        {plan.price}
                      </td>
                      <td className="px-6 py-4 font-roboto text-[14px] font-normal leading-[100%] text-oxford-blue">
                        {plan.duration}
                      </td>
                      <td className="px-6 py-4 font-roboto text-[14px] font-normal leading-[100%] text-oxford-blue">
                        {t('admin.createNewQuestionBank.table.integrationDetails')
                          .replace('{{productId}}', plan.productId)
                          .replace('{{priceId}}', plan.priceId)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleEditPlan(plan.id)}
                          className="rounded-full p-2 text-oxford-blue transition hover:bg-[#F3F4F6]"
                          aria-label={t('admin.createNewQuestionBank.ariaLabels.editPlan').replace('{{planName}}', plan.planName)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.3967 6.00174C11.2376 6.00174 11.085 6.06493 10.9726 6.17742C10.8601 6.28991 10.7969 6.44248 10.7969 6.60157V10.2005C10.7969 10.3596 10.7337 10.5122 10.6212 10.6247C10.5087 10.7372 10.3561 10.8003 10.197 10.8003H1.79948C1.64039 10.8003 1.48783 10.7372 1.37534 10.6247C1.26285 10.5122 1.19965 10.3596 1.19965 10.2005V1.80296C1.19965 1.64387 1.26285 1.4913 1.37534 1.37882C1.48783 1.26633 1.64039 1.20313 1.79948 1.20313H5.39843C5.55752 1.20313 5.71009 1.13993 5.82258 1.02745C5.93507 0.914956 5.99826 0.762388 5.99826 0.603304C5.99826 0.44422 5.93507 0.291652 5.82258 0.179163C5.71009 0.0666738 5.55752 0.003478 5.39843 0.003478H1.79948C1.32223 0.003478 0.864523 0.193065 0.527055 0.530533C0.189587 0.868001 0 1.3257 0 1.80296V10.2005C0 10.6778 0.189587 11.1355 0.527055 11.4729C0.864523 11.8104 1.32223 12 1.79948 12H10.197C10.6743 12 11.132 11.8104 11.4695 11.4729C11.8069 11.1355 11.9965 10.6778 11.9965 10.2005V6.60157C11.9965 6.44248 11.9333 6.28991 11.8208 6.17742C11.7083 6.06493 11.5558 6.00174 11.3967 6.00174ZM2.3993 6.45761V9.00087C2.3993 9.15995 2.4625 9.31252 2.57499 9.42501C2.68748 9.5375 2.84005 9.6007 2.99913 9.6007H5.54239C5.62133 9.60115 5.69959 9.58602 5.77267 9.55617C5.84575 9.52632 5.91222 9.48234 5.96827 9.42675L10.1191 5.26995L11.8226 3.60243C11.8788 3.54667 11.9234 3.48033 11.9539 3.40724C11.9843 3.33414 12 3.25574 12 3.17656C12 3.09737 11.9843 3.01897 11.9539 2.94588C11.9234 2.87278 11.8788 2.80644 11.8226 2.75068L9.27931 0.177428C9.22355 0.121207 9.15721 0.0765832 9.08411 0.0461308C9.01102 0.0156784 8.93262 0 8.85343 0C8.77425 0 8.69585 0.0156784 8.62275 0.0461308C8.54966 0.0765832 8.48332 0.121207 8.42756 0.177428L6.73605 1.87494L2.57325 6.03173C2.51766 6.08778 2.47368 6.15425 2.44383 6.22733C2.41398 6.30041 2.39885 6.37867 2.3993 6.45761ZM8.85343 1.44906L10.5509 3.14657L9.69919 3.99832L8.00168 2.30081L8.85343 1.44906ZM3.59896 6.70354L7.15593 3.14657L8.85343 4.84407L5.29646 8.40104H3.59896V6.70354Z"
                              fill="#032746"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="w-[120px] h-[36px] rounded-[8px] border border-[#E5E7EB] bg-white font-roboto text-[14px] font-medium leading-[20px] text-[#374151] transition hover:bg-[#F9FAFB]"
            >
              {t('admin.createNewQuestionBank.buttons.cancel')}
            </button>
            <button
              type="submit"
              className="w-[140px] h-[36px] rounded-[8px] bg-[#ED4122] font-roboto text-[14px] font-medium leading-[20px] text-white transition hover:bg-[#d43a1f]"
            >
              {t('admin.createNewQuestionBank.buttons.createProduct')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewQuestionBankPage;

