import React, { useEffect, useState } from "react";

const defaultValues = {
  name: "",
  email: "",
  password: "",
  status: "Active",
  systemRole: "",
  workflowRole: "",
  notes: "",
};

const systemRoles = ["Admin", "Editor", "Viewer"];
const workflowRoles = [
  "Question Gatherer",
  "Question Creator",
  "Processor",
  "Question Explainer",
];
const statusOptions = ["Active", "Suspended"];

const UserForm = ({
  mode = "add",
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const [formValues, setFormValues] = useState({
    ...defaultValues,
    ...initialValues,
  });

  useEffect(() => {
    setFormValues({ ...defaultValues, ...initialValues });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(formValues);
  };

  const actionLabel =
    submitLabel || (mode === "edit" ? "Save Changes" : "Save User");

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-7 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[16px] font-roboto font-normal text-[#032746]">
            User Name <span className="text-[#ED4122]">*</span>
          </span>
          <input
            required
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="h-[59px] w-full max-w-[476px] rounded-[12px] border border-[#032746]/20 bg-white px-4 text-[14px] font-roboto text-[#032746] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] outline-none"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[16px] font-roboto font-normal text-[#032746]">
            Email Address <span className="text-[#ED4122]">*</span>
          </span>
          <input
            required
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="h-[59px] w-full max-w-[476px] rounded-[12px] border border-[#032746]/20 bg-white px-4 text-[14px] font-roboto text-[#032746] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] outline-none"
          />
        </label>
        {mode === "add" && (
          <label className="flex flex-col gap-2">
            <span className="text-[16px] font-roboto font-normal text-[#032746]">
              Password
            </span>
            <input
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Auto generated (Optional)"
              className="h-[59px] w-full max-w-[476px] rounded-[12px] border border-[#032746]/20 bg-white px-4 text-[14px] font-roboto text-[#032746] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] outline-none"
            />
          </label>
        )}
        <label className="flex flex-col gap-2">
          <span className="text-[16px] font-roboto font-normal text-[#032746]">Status</span>
          <div className="relative w-full max-w-[476px]">
            <select
              name="status"
              value={formValues.status}
              onChange={handleChange}
              className="h-[59px] w-full appearance-none rounded-[12px] border border-[#032746]/20 bg-white px-4 pr-10 text-[14px] font-roboto text-[#032746] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <svg
              width="15"
              height="9"
              viewBox="0 0 15 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            >
              <path
                d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562"
                stroke="#032746"
                strokeWidth="2"
              />
            </svg>
          </div>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[16px] font-roboto font-normal text-[#032746]">
            System Role <span className="text-[#ED4122]">*</span>
          </span>
          <div className="relative w-full max-w-[476px]">
            <select
              required
              name="systemRole"
              value={formValues.systemRole}
              onChange={handleChange}
              className="h-[59px] w-full appearance-none rounded-[12px] border border-[#032746]/20 bg-white px-4 pr-10 text-[14px] font-roboto text-[#032746] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] outline-none"
            >
              <option value="">Select a system role</option>
              {systemRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <svg
              width="15"
              height="9"
              viewBox="0 0 15 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            >
              <path
                d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562"
                stroke="#032746"
                strokeWidth="2"
              />
            </svg>
          </div>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[16px] font-roboto font-normal text-[#032746]">
            Workflow Role <span className="text-[#ED4122]">*</span>
          </span>
          <div className="relative w-full max-w-[476px]">
            <select
              required
              name="workflowRole"
              value={formValues.workflowRole}
              onChange={handleChange}
              className="h-[59px] w-full appearance-none rounded-[12px] border border-[#032746]/20 bg-white px-4 pr-10 text-[14px] font-roboto text-[#032746] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] outline-none"
            >
              <option value="">Select a workflow role</option>
              {workflowRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <svg
              width="15"
              height="9"
              viewBox="0 0 15 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            >
              <path
                d="M0.6875 0.726562L7.00848 6.71211L13.3295 0.726562"
                stroke="#032746"
                strokeWidth="2"
              />
            </svg>
          </div>
        </label>
      </div>

      <footer className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-[44px] rounded-[10px] border border-[#E5E7EB] px-6 text-[16px] font-roboto font-medium leading-[24px] text-[#032746] transition hover:bg-[#F3F4F6]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-[44px] rounded-[10px] bg-[#ED4122] px-6 text-[16px] font-roboto font-medium leading-[24px] text-white transition hover:bg-[#d43a1f]"
        >
          {actionLabel}
        </button>
      </footer>
    </form>
  );
};

export default UserForm;


