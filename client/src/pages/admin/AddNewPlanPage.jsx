import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddNewPlanPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName: "",
    description: "",
    price: "",
    duration: "",
    productId: "",
    priceId: "",
    currency: "USD",
    interval: "Monthly",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_6px_54px_rgba(0,0,0,0.05)] p-4 sm:p-8">
          {/* Header Section */}
          <header className="mb-6 pl-0 sm:pl-12">
            <h2 className="font-archivo text-[20px] font-semibold leading-[100%] text-[#032746] mb-2">
              Add New Plans
            </h2>
            <p className="font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] mb-3">
              Manage available plans and their pricing
            </p>
            <div className="relative inline-block">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="appearance-none w-[165px] h-[50px] px-4 pr-8 rounded-[8px] border border-[#E5E7EB] bg-white font-roboto text-[14px] font-normal leading-[20px] text-[#374151] outline-none cursor-pointer hover:border-[#D1D5DB] transition"
              >
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </header>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-8 sm:p-12 rounded-[12px]"
            style={{
              boxShadow: "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Form Title */}
            <h3 className="font-archivo text-[16px] font-semibold leading-[100%] text-[#032746] mb-4">
              Add New Plan
            </h3>

            {/* Plan Name */}
            <div>
              <label
                htmlFor="planName"
                className="block font-roboto text-[14px] font-medium leading-[20px] text-[#374151] mb-1"
              >
                Plan Name
              </label>
              <input
                id="planName"
                name="planName"
                type="text"
                value={formData.planName}
                onChange={handleChange}
                placeholder="Add plan name"
                className="mt-1 w-full h-[60px] px-4 font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none"
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
                className="block font-roboto text-[14px] font-medium leading-[20px] text-[#374151] mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description of the plan"
                rows={3}
                className="mt-1 w-full px-4 py-3 font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none resize-none"
                style={{
                  boxShadow:
                    "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>

            {/* Price + Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block font-roboto text-[14px] font-medium leading-[20px] text-[#374151] mb-1"
                >
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Add price"
                  className="mt-1 w-full h-[60px] px-4 font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none"
                  style={{
                    boxShadow:
                      "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block font-roboto text-[14px] font-medium leading-[20px] text-[#374151] mb-1"
                >
                  Duration (in days)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Add duration"
                  className="mt-1 w-full h-[60px] px-4 font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none"
                  style={{
                    boxShadow:
                      "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>
            </div>

            {/* Product ID + Price ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="productId"
                  className="block font-roboto text-[14px] font-medium leading-[20px] text-[#374151] mb-1"
                >
                  Payment gateway Product ID
                </label>
                <input
                  id="productId"
                  name="productId"
                  type="text"
                  value={formData.productId}
                  onChange={handleChange}
                  placeholder="Product"
                  className="mt-1 w-full h-[60px] px-4 font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none"
                  style={{
                    boxShadow:
                      "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="priceId"
                  className="block font-roboto text-[14px] font-medium leading-[20px] text-[#374151] mb-1"
                >
                  Payment gateway Price ID
                </label>
                <input
                  id="priceId"
                  name="priceId"
                  type="text"
                  value={formData.priceId}
                  onChange={handleChange}
                  placeholder="Price"
                  className="mt-1 w-full h-[60px] px-4 font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none"
                  style={{
                    boxShadow:
                      "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </div>
            </div>

            {/* Currency + Interval */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="currency"
                  className="block font-roboto text-[14px] font-medium leading-[20px] text-[#374151] mb-1"
                >
                  Currency
                </label>
                <div className="relative">
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="mt-1 w-full h-[60px] px-4 pr-10 font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none appearance-none cursor-pointer"
                    style={{
                      boxShadow:
                        "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#032746]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <label
                  htmlFor="interval"
                  className="block font-roboto text-[14px] font-medium leading-[20px] text-[#374151] mb-1"
                >
                  Interval
                </label>
                <div className="relative">
                  <select
                    id="interval"
                    name="interval"
                    value={formData.interval}
                    onChange={handleChange}
                    className="mt-1 w-full h-[60px] px-4 pr-10 font-roboto text-[14px] font-normal leading-[20px] text-[#6B7280] bg-white border border-[rgba(3,39,70,0.2)] rounded-[12px] focus:outline-none appearance-none cursor-pointer"
                    style={{
                      boxShadow:
                        "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#032746]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="w-[120px] h-[36px] rounded-[8px] border border-[#E5E7EB] bg-white font-roboto text-[14px] font-medium leading-[20px] text-[#374151] transition hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-[120px] h-[36px] rounded-[8px] bg-[#ED4122] font-roboto text-[14px] font-medium leading-[20px] text-white transition hover:bg-[#d43a1f]"
              >
                Add Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewPlanPage;
