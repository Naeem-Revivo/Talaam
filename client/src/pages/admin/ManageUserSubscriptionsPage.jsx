import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { DataTable } from "../../components/admin/SystemSetting/Table";
import Dropdown from "../../components/shared/Dropdown";
import adminAPI from "../../api/admin";
import { showErrorToast } from "../../utils/toastConfig";

// Custom TableRow component for subscriptions with badge support
const SubscriptionTableRow = ({ item, onView, t }) => {
  // Plan badge colors and styling
  const planBadgeColors = {
    Premium: { bg: "bg-[#FDF0D5]", text: "text-[#ED4122]" },
    Free: { bg: "bg-[#C6D8D3]", text: "text-oxford-blue" },
    Organization: { bg: "bg-[#6CA6C1]", text: "text-white" },
  };

  // Payment status badge colors
  const paymentBadgeColors = {
    Paid: { bg: "bg-[#C6D8D3]", text: "text-oxford-blue" },
    Active: { bg: "bg-[#FDF0D5]", text: "text-[#ED4122]" },
    "N/A": { bg: "bg-[#C6D8D3]", text: "text-oxford-blue" },
  };

  const planBadge = planBadgeColors[item.plan] || planBadgeColors.Free;
  const paymentBadge = paymentBadgeColors[item.paymentstatus] || paymentBadgeColors["N/A"];

  return (
    <tr className="hidden border-b border-[#E5E7EB] bg-white text-oxford-blue last:border-none md:table-row">
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-center">
        {item.user}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
        {item.email}
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={`inline-flex h-[26px] items-center justify-center rounded-[6px] py-[5px] px-[10px] font-roboto text-[14px] font-normal leading-[100%] tracking-[0%] capitalize ${planBadge.bg} ${planBadge.text}`}
        >
          {item.plan}
        </span>
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
        {item.startdate}
      </td>
      <td className="px-6 py-4 text-[14px] font-roboto font-normal leading-[100%] text-oxford-blue text-center">
        {item.expirydate}
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-[10px]">
          <span
            className={`inline-flex h-[26px] items-center justify-center rounded-[6px] py-[5px] px-[10px] font-roboto text-[14px] font-normal leading-[100%] tracking-[0%] capitalize ${paymentBadge.bg} ${paymentBadge.text}`}
          >
            {item.paymentstatus}
          </span>
          <button
            type="button"
            onClick={() => onView?.(item)}
            className="rounded-full p-1 text-oxford-blue transition hover:bg-[#F3F4F6]"
            aria-label={t('admin.manageUserSubscriptions.table.ariaLabels.view').replace('{{user}}', item.user)}
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
  const { t } = useLanguage();
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // Fetch subscriptions from API
  useEffect(() => {
    fetchSubscriptions();
  }, [planFilter, statusFilter, searchQuery, page]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pageSize,
      };
      
      if (planFilter !== "All") {
        params.plan = planFilter;
      }
      
      if (statusFilter !== "All") {
        params.status = statusFilter;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await adminAPI.getAllUserSubscriptions(params);
      
      if (response.success && response.data) {
        // Transform API data to match table format
        const transformed = response.data.subscriptions?.map((sub) => {
          const startDate = sub.startDate ? new Date(sub.startDate).toLocaleDateString('en-GB') : 'N/A';
          const expiryDate = sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString('en-GB') : 'N/A';
          
          return {
            id: sub.id,
            user: sub.userName || sub.user?.name || 'N/A',
            email: sub.user?.email || 'N/A',
            plan: sub.planName || sub.plan?.name || 'N/A',
            startdate: startDate,
            expirydate: expiryDate,
            paymentstatus: sub.paymentStatus || 'Pending',
            _original: sub,
          };
        }) || [];
        
        setSubscriptions(transformed);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      showErrorToast(error.message || "Failed to fetch subscriptions");
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions;
  }, [subscriptions]);

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
      [
        t('admin.manageUserSubscriptions.table.columns.user'),
        t('admin.manageUserSubscriptions.table.columns.email'),
        t('admin.manageUserSubscriptions.table.columns.plan'),
        t('admin.manageUserSubscriptions.table.columns.startDate'),
        t('admin.manageUserSubscriptions.table.columns.expiryDate'),
        t('admin.manageUserSubscriptions.table.columns.paymentStatus')
      ].join(","),
      ...filteredSubscriptions.map((sub) =>
        [sub.user, sub.email, sub.plan, sub.startdate, sub.expirydate, sub.paymentstatus].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = t('admin.manageUserSubscriptions.table.exportFileName');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleView = (subscription) => {
    // Navigate to subscription details page with subscription ID
    const subscriptionId = subscription._original?.id || subscription.id;
    navigate(`/admin/subscriptions/details?id=${subscriptionId}`, { state: { subscriptionId } });
  };

  const columns = [
    t('admin.manageUserSubscriptions.table.columns.user'),
    t('admin.manageUserSubscriptions.table.columns.email'),
    t('admin.manageUserSubscriptions.table.columns.plan'),
    t('admin.manageUserSubscriptions.table.columns.startDate'),
    t('admin.manageUserSubscriptions.table.columns.expiryDate'),
    t('admin.manageUserSubscriptions.table.columns.paymentStatus')
  ];

  // Get unique plans for filter
  const uniquePlans = useMemo(() => {
    const plans = [...new Set(subscriptions.map((sub) => sub.plan))];
    return ["All", ...plans.filter(p => p !== 'N/A')];
  }, [subscriptions]);

  // Custom table component that extends DataTable structure
  const CustomSubscriptionTable = () => {
    return (
      <section className="w-full overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-dashboard">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-oxford-blue text-center">
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
                  <SubscriptionTableRow key={sub.id} item={sub} onView={handleView} t={t} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-sm text-dark-gray"
                  >
                    {t('admin.manageUserSubscriptions.table.emptyState')}
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
                <div className="space-y-2 text-oxford-blue">
                  <div>
                    <span className="text-[14px] font-semibold">{t('admin.manageUserSubscriptions.table.mobileLabels.user')} </span>
                    <span className="text-[14px]">{sub.user}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold">{t('admin.manageUserSubscriptions.table.mobileLabels.email')} </span>
                    <span className="text-[14px]">{sub.email}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold">{t('admin.manageUserSubscriptions.table.mobileLabels.plan')} </span>
                    <span className="text-[14px]">{sub.plan}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold">{t('admin.manageUserSubscriptions.table.mobileLabels.startDate')} </span>
                    <span className="text-[14px]">{sub.startdate}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold">{t('admin.manageUserSubscriptions.table.mobileLabels.expiryDate')} </span>
                    <span className="text-[14px]">{sub.expirydate}</span>
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold">{t('admin.manageUserSubscriptions.table.mobileLabels.paymentStatus')} </span>
                    <span className="text-[14px]">{sub.paymentstatus}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center text-sm text-dark-gray shadow-empty">
              {t('admin.manageUserSubscriptions.table.emptyState')}
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
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t('admin.manageUserSubscriptions.hero.title')}
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
              {t('admin.manageUserSubscriptions.actions.exportBillingReports')}
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col gap-5">
          {/* Plan Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Plan Filter */}
            <div className="w-full sm:w-[165px]">
              <Dropdown
                value={planFilter}
                options={uniquePlans.map((plan) => ({
                  value: plan,
                  label: plan === "All" ? t('admin.manageUserSubscriptions.filters.plan') : plan,
                }))}
                onChange={(value) => setPlanFilter(value)}
                placeholder={t('admin.manageUserSubscriptions.filters.plan')}
                showDefaultOnEmpty={true}
                className="w-full"
                height="h-[50px]"
              />
            </div>
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto sm:flex-1 xl:w-[935px] h-[50px] xl:pl-16">
              <div className="absolute left-4 xl:left-[85px] top-1/2 transform -translate-y-1/2">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.42969 0.25C14.4866 0.25024 18.6084 4.28232 18.6084 9.25C18.6084 11.3724 17.8507 13.3211 16.5938 14.8604L20.3496 18.541C20.7482 18.9316 20.7483 19.5667 20.3496 19.957C20.1511 20.1529 19.8915 20.25 19.6338 20.25C19.3755 20.2499 19.1156 20.1526 18.918 19.959L15.1562 16.2715C13.5849 17.5066 11.5952 18.2499 9.42969 18.25C4.37258 18.25 0.25 14.2178 0.25 9.25C0.25 4.28217 4.37258 0.25 9.42969 0.25ZM9.42969 2.25C5.48306 2.25 2.28027 5.39483 2.28027 9.25C2.28027 13.1052 5.48306 16.25 9.42969 16.25C13.3761 16.2498 16.5781 13.105 16.5781 9.25C16.5781 5.39497 13.3761 2.25024 9.42969 2.25Z" fill="#032746" stroke="#032746" strokeWidth="0.5"/>
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search User"
                className="w-full h-full pl-[52px] xl:pl-[60px] pr-4 rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#E5E7EB] font-roboto font-normal text-[14px] leading-[10px] tracking-[0%] align-middle"
              />
            </div>
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
              {t('admin.manageUserSubscriptions.filters.active')}
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
              {t('admin.manageUserSubscriptions.filters.expire')}
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
              {t('admin.manageUserSubscriptions.filters.pending')}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-8 text-center">
            <p className="text-dark-gray">{t('admin.manageUserSubscriptions.loading') || 'Loading subscriptions...'}</p>
          </div>
        )}

        {/* Custom Table with badges */}
        {!loading && <CustomSubscriptionTable />}
      </div>
    </div>
  );
};

export default ManageUserSubscriptionsPage;

