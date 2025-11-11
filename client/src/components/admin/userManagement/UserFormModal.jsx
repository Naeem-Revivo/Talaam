import React, { useState, useEffect } from "react";

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

const UserFormModal = ({
  isOpen,
  mode = "add",
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState(defaultValues);

  useEffect(() => {
    if (isOpen) {
      setFormValues({ ...defaultValues, ...initialValues });
    }
  }, [initialValues, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(formValues, mode);
  };

  if (!isOpen) return null;

  const title = mode === "edit" ? "Edit User" : "Add New User";
  const primaryAction = mode === "edit" ? "Save Changes" : "Save User";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#032746]/40 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-[16px] border border-[#E5E7EB] bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-[#E5E7EB] px-8 py-6">
          <div>
            <h2 className="font-archivo text-[28px] leading-[32px] text-[#032746]">
              {title}
            </h2>
            <p className="font-roboto text-sm text-[#6B7280]">
              {mode === "edit"
                ? "Modify user details or adjust workflow access."
                : "Create a new user account with the necessary details."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#6B7280] transition hover:bg-[#F3F4F6]"
            aria-label="Close"
          >
            ✕
          </button>
        </header>
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#032746]">
                User Name *
              </span>
              <input
                required
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-sm font-roboto text-[#032746] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#FED7CC]"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#032746]">
                Email Address *
              </span>
              <input
                required
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-sm font-roboto text-[#032746] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#FED7CC]"
              />
            </label>
            {mode === "add" && (
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[#032746]">
                  Password
                </span>
                <input
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="Auto generated (Optional)"
                  className="rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-sm font-roboto text-[#032746] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#FED7CC]"
                />
              </label>
            )}
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#032746]">Status</span>
              <select
                name="status"
                value={formValues.status}
                onChange={handleChange}
                className="rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-sm font-roboto text-[#032746] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#FED7CC]"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#032746]">
                System Role
              </span>
              <select
                required
                name="systemRole"
                value={formValues.systemRole}
                onChange={handleChange}
                className="rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-sm font-roboto text-[#032746] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#FED7CC]"
              >
                <option value="">Select a system role</option>
                {systemRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-[#032746]">
                Workflow Role
              </span>
              <select
                required
                name="workflowRole"
                value={formValues.workflowRole}
                onChange={handleChange}
                className="rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-sm font-roboto text-[#032746] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#FED7CC]"
              >
                <option value="">Select a workflow role</option>
                {workflowRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[#032746]">Notes</span>
            <textarea
              name="notes"
              rows={4}
              value={formValues.notes}
              onChange={handleChange}
              placeholder="Add any relevant notes here..."
              className="rounded-[10px] border border-[#E5E7EB] px-4 py-3 text-sm font-roboto text-[#032746] focus:border-[#ED4122] focus:outline-none focus:ring-2 focus:ring-[#FED7CC]"
            />
          </label>

          <footer className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] border border-[#E5E7EB] px-6 py-3 text-sm font-semibold text-[#032746] transition hover:bg-[#F3F4F6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[10px] bg-[#ED4122] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d43a1f]"
            >
              {primaryAction}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;


