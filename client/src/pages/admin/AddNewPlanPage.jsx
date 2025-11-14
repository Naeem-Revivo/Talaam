import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddNewPlanPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    price: '',
    duration: '',
    productId: '',
    priceId: '',
    currency: 'USD',
    interval: 'Monthly',
    status: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Add API call to save the plan
    // After successful save, navigate back to subscriptions page
    navigate('/admin/subscriptions');
  };

  const handleCancel = () => {
    navigate('/admin/subscriptions');
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 py-6 sm:px-6 lg:px-6 xl:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
        <header className="space-y-3">
          <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-[#032746]">
            Add New Plans
          </h1>
          <p className="font-roboto text-[18px] leading-[28px] text-[#6B7280]">
            Manage available plans and their pricing
          </p>
        </header>

        <div className="rounded-[12px] bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-4 sm:p-6 lg:p-8">
          {/* Status Filter at top */}
          <div className="mb-6">
            <div className="relative inline-block">
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="appearance-none h-[50px] w-[165px] rounded-[8px] border border-[#E5E7EB] bg-white px-4 pr-8 font-roboto text-[14px] font-normal leading-[20px] text-[#374151] outline-none cursor-pointer hover:border-[#D1D5DB] transition"
              >
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title on top of form */}
            <h2 className="text-[20px] font-archivo font-semibold text-[#032746] mb-6">
              Add New Plan
            </h2>

            {/* Plan Name */}
            <div>
              <label htmlFor="planName" className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] mb-2">
                Plan Name
              </label>
              <input
                id="planName"
                name="planName"
                type="text"
                value={formData.planName}
                onChange={handleChange}
                placeholder="Add plan name"
                className="w-full lg:w-[990px] h-[50px] sm:h-[60px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] outline-none hover:border-[#03274666] transition"
                style={{ boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description of the plan"
                rows={3}
                className="w-full lg:w-[990px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 py-3 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] outline-none hover:border-[#03274666] transition resize-none"
                style={{ boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
            </div>

            {/* Price + Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
              <div>
                <label htmlFor="price" className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] mb-2">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Add price"
                  className="w-full lg:w-[475px] h-[50px] sm:h-[60px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] outline-none hover:border-[#03274666] transition"
                  style={{ boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </div>

              <div>
                <label htmlFor="duration" className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] mb-2">
                  Duration (in days)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Add duration"
                  className="w-full lg:w-[475px] h-[50px] sm:h-[60px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] outline-none hover:border-[#03274666] transition"
                  style={{ boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </div>
            </div>

            {/* Product + Price ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
              <div>
                <label htmlFor="productId" className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] mb-2">
                  Payment gateway Product ID
                </label>
                <input
                  id="productId"
                  name="productId"
                  type="text"
                  value={formData.productId}
                  onChange={handleChange}
                  placeholder="Product ID"
                  className="w-full lg:w-[475px] h-[50px] sm:h-[60px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] outline-none hover:border-[#03274666] transition"
                  style={{ boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </div>

              <div>
                <label htmlFor="priceId" className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] mb-2">
                  Payment gateway Price ID
                </label>
                <input
                  id="priceId"
                  name="priceId"
                  type="text"
                  value={formData.priceId}
                  onChange={handleChange}
                  placeholder="Price ID"
                  className="w-full lg:w-[475px] h-[50px] sm:h-[60px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] outline-none hover:border-[#03274666] transition"
                  style={{ boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
              </div>
            </div>

            {/* Currency + Interval */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10">
              <div>
                <label htmlFor="currency" className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] mb-2">
                  Currency
                </label>
                <div className="relative">
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="appearance-none w-full lg:w-[475px] h-[50px] sm:h-[60px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 pr-10 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] outline-none cursor-pointer hover:border-[#03274666] transition"
                    style={{ boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 lg:right-20 top-1/2 h-5 w-5 -translate-y-1/2 text-[#032746]"
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
                <label htmlFor="interval" className="block font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] mb-2">
                  Interval
                </label>
                <div className="relative">
                  <select
                    id="interval"
                    name="interval"
                    value={formData.interval}
                    onChange={handleChange}
                    className="appearance-none w-full lg:w-[475px] h-[50px] sm:h-[60px] rounded-[12px] border border-[rgba(3,39,70,0.2)] bg-white px-4 pr-10 font-roboto text-[14px] sm:text-[16px] font-normal leading-[20px] text-[#032746] outline-none cursor-pointer hover:border-[#03274666] transition"
                    style={{ boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 lg:right-20 top-1/2 h-5 w-5 -translate-y-1/2 text-[#032746]"
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
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 lg:mr-20">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center rounded-[8px] border border-[#03274633] bg-white px-4 sm:px-6 py-2.5 sm:py-3 font-roboto text-[14px] sm:text-[16px] font-medium leading-[20px] text-[#032746] transition hover:bg-[#F9FAFB] w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center justify-center rounded-[8px] bg-[#ED4122] px-4 sm:px-6 py-2.5 sm:py-3 font-roboto text-[14px] sm:text-[16px] font-semibold leading-[20px] text-white transition hover:bg-[#d43a1f] w-full sm:w-auto"
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

