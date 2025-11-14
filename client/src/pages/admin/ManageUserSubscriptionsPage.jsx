import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../components/admin/SystemSetting/Table";

// Mock data for user subscriptions
// DataTable converts column names to keys by: columnName.toLowerCase().replace(/ /g, "")
const allSubscriptions = [
  {
    id: 1,
    user: "John Doe",
    email: "johndoe@gmail.com",
    plan: "Premium",
    startdate: "01-15-2023",
    expirydate: "15-01-2024",
    paymentstatus: "Paid",
  },
  {
    id: 2,
    user: "Sarah Khan",
    email: "sarahkhan@gmail.com",
    plan: "Free",
    startdate: "03-20-2024",
    expirydate: "N/A",
    paymentstatus: "N/A",
  },
  {
    id: 3,
    user: "Ali Raza",
    email: "aliraza@gmail.com",
    plan: "Organization",
    startdate: "05-10-2023",
    expirydate: "05-10-2024",
    paymentstatus: "Active",
  },
  // Add more mock data
  ...Array.from({ length: 22 }, (_, i) => ({
    id: i + 4,
    user: `User ${i + 4}`,
    email: `user${i + 4}@gmail.com`,
    plan: i % 3 === 0 ? "Premium" : i % 3 === 1 ? "Free" : "Organization",
    startdate: `01-${String(i + 1).padStart(2, "0")}-2023`,
    expirydate: i % 4 === 0 ? "N/A" : `01-${String(i + 1).padStart(2, "0")}-2024`,
    paymentstatus: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Active" : "N/A",
  })),
];

// Custom TableRow component for subscriptions with badge support
const SubscriptionTableRow = ({ item, onView }) => {
  // Plan badge colors and styling
  const planBadgeColors = {
    Premium: { bg: "bg-[#FDF0D5]", text: "text-[#ED4122]" },
    Free: { bg: "bg-[#C6D8D3]", text: "text-[#032746]" },
    Organization: { bg: "bg-[#6CA6C1]", text: "text-white" },
  };

  // Payment status badge colors
  const paymentBadgeColors = {
    Paid: { bg: "bg-[#C6D8D3]", text: "text-[#032746]" },
    Active: { bg: "bg-[#FDF0D5]", text: "text-[#ED4122]" },
    "N/A": { bg: "bg-[#C6D8D3]", text: "text-[#032746]" },
  };

  const planBadge = planBadgeColors[item.plan] || planBadgeColors.Free;
  const paymentBadge = paymentBadgeColors[item.paymentstatus] || paymentBadgeColors["N/A"];

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-[#032746] last:border-none md:table-row">
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
        {item.user}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-[#032746] text-center">
        {item.email}
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex h-[26px] items-center justify-center rounded-[6px] py-[5px] px-[10px] font-roboto text-[14px] font-normal leading-[100%] tracking-[0%] ${planBadge.bg} ${planBadge.text}`}
          style={{ textTransform: 'capitalize' }}
        >
          {item.plan}
        </span>
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-[#032746] text-center">
        {item.startdate}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-[#032746] text-center">
        {item.expirydate}
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-[10px]">
          <span
            className={`inline-flex h-[26px] items-center justify-center rounded-[6px] py-[5px] px-[10px] font-roboto text-[14px] font-normal leading-[100%] tracking-[0%] ${paymentBadge.bg} ${paymentBadge.text}`}
            style={{ textTransform: 'capitalize' }}
          >
            {item.paymentstatus}
          </span>
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="rounded-full p-1 text-[#032746] transition hover:bg-[#F3F4F6]"
            aria-label={`View ${item.user}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

const ManageUserSubscriptionsPage = () => {
  const navigate = useNavigate();
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Active");

  const filteredSubscriptions = useMemo(() => {
    return allSubscriptions.filter((sub) => {
      const matchesPlan = planFilter === "All" || sub.plan === planFilter;
      const matchesStatus = statusFilter === "All" || 
        (statusFilter === "Active" && sub.paymentstatus === "Active") ||
        (statusFilter === "Expire" && sub.expirydate !== "N/A" && new Date(sub.expirydate.split("-").reverse().join("-")) < new Date()) ||
        (statusFilter === "Pending" && sub.paymentstatus === "Pending");
      return matchesPlan && matchesStatus;
    });
  }, [planFilter, statusFilter]);

  // Transform data for DataTable - it expects lowercase keys without spaces
  const transformedSubscriptions = useMemo(() => {
    return filteredSubscriptions.map((sub) => ({
      id: sub.id,
      user: sub.user,
      email: sub.email,
      plan: sub.plan,
      startdate: sub.startdate,
      expirydate: sub.expirydate,
      paymentstatus: sub.paymentstatus,
    }));
  }, [filteredSubscriptions]);

  const handleExport = () => {
    if (typeof window === "undefined") return;
    const csvRows = [
      ["User", "Email", "Plan", "Start Date", "Expiry Date", "Payment Status"].join(","),
      ...filteredSubscriptions.map((sub) =>
        [sub.user, sub.email, sub.plan, sub.startdate, sub.expirydate, sub.paymentstatus].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "billing-reports.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleView = (subscription) => {
    // Navigate to subscription details page with subscription data
    navigate("/admin/subscriptions/details", { state: { subscription } });
  };

  const columns = ["USER", "EMAIL", "PLAN", "START DATE", "EXPIRY DATE", "PAYMENT STATUS"];

  // Get unique plans for filter
  const uniquePlans = useMemo(() => {
    const plans = [...new Set(allSubscriptions.map((sub) => sub.plan))];
    return ["All", ...plans];
  }, []);

  // Custom table component that extends DataTable structure
  const CustomSubscriptionTable = () => {
    return (
      <section className="w-full overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_6px_54px_rgba(0,0,0,0.05)]">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-[#032746] text-center">
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transformedSubscriptions.length ? (
                transformedSubscriptions.map((sub) => (
                  <SubscriptionTableRow key={sub.id} item={sub} onView={handleView} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-sm text-[#6B7280]"
                  >
                    No subscriptions match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile view - can be added later if needed */}
        <div className="flex flex-col gap-4 p-2 md:hidden">
          {transformedSubscriptions.length ? (
            transformedSubscriptions.map((sub) => (
              <div key={sub.id} className="rounded-[12px] border border-[#E5E7EB] bg-white p-4 shadow-sm">
                <div className="space-y-2 text-[#032746]">
                  <div>
                    <span className="text-[14px] font-semibold">User: </span>
                    <span className="text-[14px]">{sub.user}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold">Email: </span>
                    <span className="text-[14px]">{sub.email}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold">Plan: </span>
                    <span className="text-[14px]">{sub.plan}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold">Start Date: </span>
                    <span className="text-[14px]">{sub.startdate}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold">Expiry Date: </span>
                    <span className="text-[14px]">{sub.expirydate}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold">Payment Status: </span>
                    <span className="text-[14px]">{sub.paymentstatus}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-[#6B7280] shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
              No subscriptions match the current filters.
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-[#032746]">
              Manage User Subscriptions
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 ">
            <button
              type="button"
              onClick={handleExport}
              className="h-[36px] w-[230px] rounded-[10px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f] flex items-center justify-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.10357 3.51181C4.86316 3.2714 4.86316 2.88163 5.10357 2.64122L7.5651 0.179682C7.62172 0.123067 7.68994 0.0779487 7.76542 0.0467692C7.91558 -0.0155898 8.08542 -0.0155898 8.23558 0.0467692C8.31106 0.0779487 8.37908 0.123067 8.4357 0.179682L10.8972 2.64122C11.1376 2.88163 11.1376 3.2714 10.8972 3.51181C10.7774 3.63161 10.6199 3.6923 10.4623 3.6923C10.3048 3.6923 10.1472 3.63243 10.0274 3.51181L8.61619 2.10051V11.2821C8.61619 11.6217 8.34049 11.8974 8.0008 11.8974C7.66111 11.8974 7.38542 11.6217 7.38542 11.2821V2.10131L5.97416 3.51262C5.73293 3.75221 5.34398 3.75223 5.10357 3.51181ZM12.9231 5.74359C12.5834 5.74359 12.3077 6.01928 12.3077 6.35897C12.3077 6.69866 12.5834 6.97436 12.9231 6.97436C14.217 6.97436 14.7692 7.52656 14.7692 8.82051V12.9231C14.7692 14.217 14.217 14.7692 12.9231 14.7692H3.07692C1.78297 14.7692 1.23077 14.217 1.23077 12.9231V8.82051C1.23077 7.52656 1.78297 6.97436 3.07692 6.97436C3.41662 6.97436 3.69231 6.69866 3.69231 6.35897C3.69231 6.01928 3.41662 5.74359 3.07692 5.74359C1.09292 5.74359 0 6.83651 0 8.82051V12.9231C0 14.9071 1.09292 16 3.07692 16H12.9231C14.9071 16 16 14.9071 16 12.9231V8.82051C16 6.83651 14.9071 5.74359 12.9231 5.74359Z"
                  fill="white"
                />
              </svg>
              Export Billing Reports
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col gap-5">
          {/* Plan Filter */}
          <div className="relative">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="appearance-none h-[50px] w-[165px] rounded-[8px] border border-[#E5E7EB] bg-white px-4 pr-8 font-roboto text-[14px] font-normal leading-[20px] text-[#374151] outline-none cursor-pointer hover:border-[#D1D5DB] transition"
            >
              {uniquePlans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan === "All" ? "Plan: All" : plan}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute left-32 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]"
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

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStatusFilter("Active")}
              className={`py-2 px-6 rounded-[8px] font-roboto text-[16px] font-medium leading-[20px] transition ${
                statusFilter === "Active"
                  ? "bg-[#ED4122] text-white"
                  : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("Expire")}
              className={`py-2 px-6 rounded-[8px] font-roboto text-[16px] font-medium leading-[20px] transition ${
                statusFilter === "Expire"
                  ? "bg-[#ED4122] text-white"
                  : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
              }`}
            >
              Expire
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("Pending")}
              className={`py-2 px-6 rounded-[8px] font-roboto text-[16px] font-medium leading-[20px] transition ${
                statusFilter === "Pending"
                  ? "bg-[#ED4122] text-white"
                  : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Custom Table with badges */}
        <CustomSubscriptionTable />
      </div>
    </div>
  );
};

export default ManageUserSubscriptionsPage;

