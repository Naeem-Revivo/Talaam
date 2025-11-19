import React, { useState, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { DataTable } from "../../components/admin/SystemSetting/Table";
import basePaymentsData from "../../data/paymentHistoryData.json";

// Mock data for payment history
const allPayments = [
  ...basePaymentsData,
  // Add more mock data
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 6,
    invoiceid: `Inv-${String(i + 6).padStart(3, "0")}`,
    user: `User ${i + 6}`,
    plan: i % 3 === 0 ? "Premium" : i % 3 === 1 ? "Basic" : "Organization",
    amount: `$${(Math.random() * 100 + 10).toFixed(2)}`,
    date: `01-${String((i % 12) + 1).padStart(2, "0")}-2024`,
    paymentmethod: i % 3 === 0 ? "Credit Card" : i % 3 === 1 ? "Bank Transfer" : "Paypal",
    status: i % 2 === 0 ? "Paid" : "Pending",
  })),
];

// Custom TableRow component for payments with badge support
const PaymentTableRow = ({ item, t }) => {
  // Status badge colors
  const statusBadgeColors = {
    Paid: { bg: "bg-[#FDF0D5]", text: "text-[#ED4122]" },
    Pending: { bg: "bg-[#C6D8D3]", text: "text-oxford-blue" },
  };

  const statusBadge = statusBadgeColors[item.status] || statusBadgeColors.Pending;

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row">
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
        {item.invoiceid}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
        {item.user}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
        {item.plan}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
        {item.amount}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
        {item.date}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
        {item.paymentmethod}
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex h-[26px] items-center justify-center rounded-[6px] py-[5px] px-[10px] font-roboto text-[14px] font-normal leading-[100%] tracking-[0%] ${statusBadge.bg} ${statusBadge.text}`}
          style={{ textTransform: "capitalize" }}
        >
          {item.status}
        </span>
      </td>
    </tr>
  );
};

const PaymentHistoryPage = () => {
  const { t } = useLanguage();
  const [dateRangeFilter, setDateRangeFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [page, setPage] = useState(1);
  const pageSize = 3;

  const filteredPayments = useMemo(() => {
    return allPayments.filter((payment) => {
      const matchesDateRange = dateRangeFilter === "All" || true; // Date range logic can be added
      const matchesPlan = planFilter === "All" || payment.plan === planFilter;
      const matchesPaymentStatus = paymentStatusFilter === "All" || payment.status === paymentStatusFilter;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && payment.status === "Paid") ||
        (statusFilter === "Expire" && payment.status === "Pending") ||
        (statusFilter === "Pending" && payment.status === "Pending");
      return matchesDateRange && matchesPlan && matchesPaymentStatus && matchesStatus;
    });
  }, [dateRangeFilter, planFilter, paymentStatusFilter, statusFilter]);

  const paginatedPayments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPayments.slice(start, start + pageSize);
  }, [filteredPayments, page]);

  // Transform data for table
  const transformedPayments = useMemo(() => {
    return paginatedPayments.map((payment) => ({
      id: payment.id,
      invoiceid: payment.invoiceid,
      user: payment.user,
      plan: payment.plan,
      amount: payment.amount,
      date: payment.date,
      paymentmethod: payment.paymentmethod,
      status: payment.status,
    }));
  }, [paginatedPayments]);

  const handleExport = () => {
    if (typeof window === "undefined") return;
    const csvRows = [
      ["Invoice ID", "User", "Plan", "Amount", "Date", "Payment Method", "Status"].join(","),
      ...filteredPayments.map((payment) =>
        [
          payment.invoiceid,
          payment.user,
          payment.plan,
          payment.amount,
          payment.date,
          payment.paymentmethod,
          payment.status,
        ].join(",")
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

  // Updated columns with label and key structure
  const columns = [
    { label: t('admin.paymentHistory.table.columns.invoiceId'), key: 'invoiceid' },
    { label: t('admin.paymentHistory.table.columns.user'), key: 'user' },
    { label: t('admin.paymentHistory.table.columns.plan'), key: 'plan' },
    { label: t('admin.paymentHistory.table.columns.amount'), key: 'amount' },
    { label: t('admin.paymentHistory.table.columns.date'), key: 'date' },
    { label: t('admin.paymentHistory.table.columns.paymentMethod'), key: 'paymentmethod' },
    { label: t('admin.paymentHistory.table.columns.status'), key: 'status' }
  ];

  // Get unique plans for filter
  const uniquePlans = useMemo(() => {
    const plans = [...new Set(allPayments.map((payment) => payment.plan))];
    return ["All", ...plans];
  }, []);

  // Custom table component
  const CustomPaymentTable = () => {
    const totalPages = Math.ceil(filteredPayments.length / pageSize);
    const firstItem = filteredPayments.length ? (page - 1) * pageSize + 1 : 0;
    const lastItem = filteredPayments.length
      ? Math.min(page * pageSize, filteredPayments.length)
      : 0;

    return (
      <section className="w-full overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-oxford-blue text-center">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-[16px] font-archivo font-medium leading-[16px] text-white"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transformedPayments.length ? (
                transformedPayments.map((payment) => (
                  <PaymentTableRow key={payment.id} item={payment} t={t} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-sm text-dark-gray"
                  >
                    {t('admin.paymentHistory.table.emptyMessage')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile view */}
        <div className="flex flex-col gap-4 p-2 md:hidden">
          {transformedPayments.length ? (
            transformedPayments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-[12px] border border-[#E5E7EB] bg-white p-4 shadow-sm"
              >
                <div className="space-y-2 text-oxford-blue">
                  {columns.map((column) => (
                    <div key={column.key}>
                      <span className="text-[14px] font-semibold">{column.label}: </span>
                      <span className="text-[14px]">{payment[column.key]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-dark-gray shadow-empty">
              {t('admin.paymentHistory.table.emptyMessage')}
            </div>
          )}
        </div>
        {/* Pagination */}
        <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-oxford-blue px-6 py-4 text-white md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] font-roboto font-medium leading-[18px] tracking-[3%]">
            {t('admin.paymentHistory.table.pagination.showing')
              .replace('{{first}}', firstItem)
              .replace('{{last}}', lastItem)
              .replace('{{total}}', filteredPayments.length)}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              disabled={page === 1}
              className={`flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-normal leading-[16px] transition-colors ${
                page === 1
                  ? "cursor-not-allowed border-transparent bg-white/20 text-white/70"
                  : "border-white bg-transparent text-white hover:bg-white/10"
              }`}
            >
              {t('admin.paymentHistory.table.pagination.previous')}
            </button>
            {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`flex h-8 w-8 items-center justify-center rounded border text-[14px] font-archivo font-semibold leading-[16px] transition-colors ${
                  pageNumber === page
                    ? "border-[#ED4122] bg-[#ED4122] text-white"
                    : "border-[#032746] bg-transparent text-white hover:bg-white/10"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(page < totalPages ? page + 1 : page)}
              disabled={page === totalPages}
              className={`flex h-[27.16px] w-[78px] items-center justify-center rounded border text-[14px] font-archivo font-normal leading-[16px] transition-colors ${
                page === totalPages
                  ? "cursor-not-allowed border-transparent bg-white/20 text-white/70"
                  : "border-white bg-transparent text-white hover:bg-white/10"
              }`}
            >
              {t('admin.paymentHistory.table.pagination.next')}
            </button>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-full bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t('admin.paymentHistory.hero.title')}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
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
              {t('admin.paymentHistory.buttons.exportBilling')}
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col gap-5">
          {/* Dropdown Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Date Range Picker */}
            <div className="relative">
              <select
                value={dateRangeFilter}
                onChange={(e) => {
                  setDateRangeFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none h-[50px] w-[165px] rounded-[8px] border border-[#E5E7EB] bg-white px-4 pr-8 font-roboto text-[14px] font-normal leading-[20px] text-[#374151] outline-none cursor-pointer hover:border-[#D1D5DB] transition"
              >
                <option value="All">{t('admin.paymentHistory.filters.dateRange')}</option>
                <option value="Last 7 days">{t('admin.paymentHistory.filters.dateOptions.last7Days')}</option>
                <option value="Last 30 days">{t('admin.paymentHistory.filters.dateOptions.last30Days')}</option>
                <option value="Last 90 days">{t('admin.paymentHistory.filters.dateOptions.last90Days')}</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-gray"
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

            {/* Plan Filter */}
            <div className="relative">
              <select
                value={planFilter}
                onChange={(e) => {
                  setPlanFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none h-[50px] w-[165px] rounded-[8px] border border-[#E5E7EB] bg-white px-4 pr-8 font-roboto text-[14px] font-normal leading-[20px] text-[#374151] outline-none cursor-pointer hover:border-[#D1D5DB] transition"
              >
                <option value="All">{t('admin.paymentHistory.filters.plan')}</option>
                {uniquePlans.filter(plan => plan !== "All").map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-gray"
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

            {/* Payment Status Filter */}
            <div className="relative">
              <select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none h-[50px] w-[165px] rounded-[8px] border border-[#E5E7EB] bg-white px-4 pr-8 font-roboto text-[14px] font-normal leading-[20px] text-[#374151] outline-none cursor-pointer hover:border-[#D1D5DB] transition"
              >
                <option value="All">{t('admin.paymentHistory.filters.paymentStatus')}</option>
                <option value="Paid">{t('admin.paymentHistory.filters.paymentOptions.paid')}</option>
                <option value="Pending">{t('admin.paymentHistory.filters.paymentOptions.pending')}</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-gray"
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

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2">
            {['Active', 'Expire', 'Pending'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`py-2 px-6 rounded-[8px] font-roboto text-[16px] font-medium leading-[20px] transition ${
                  statusFilter === status
                    ? "bg-[#ED4122] text-white"
                    : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-50"
                }`}
              >
                {t(`admin.paymentHistory.filters.status.${status.toLowerCase()}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Table */}
        <CustomPaymentTable />
      </div>
    </div>
  );
};

export default PaymentHistoryPage;