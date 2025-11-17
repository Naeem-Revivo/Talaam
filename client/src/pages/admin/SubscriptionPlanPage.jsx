
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { DataTable } from "../../components/admin/SystemSetting/Table";
import basePlansData from "../../data/subscriptionPlansData.json";
import Dropdown from "../../components/shared/Dropdown";

// Mock data for subscription plans
// DataTable converts column names to keys by: columnName.toLowerCase().replace(/ /g, "")
// So "PLAN NAME" becomes "planname", "PRICE" becomes "price", etc.
const allPlans = [
    ...basePlansData,
    // Add more mock data to reach 25 total
    ...Array.from({ length: 22 }, (_, i) => ({
      id: i + 4,
      planname: `Plan ${i + 4}`,
      price: `$${((i + 4) * 10).toFixed(2)}`,
      duration: i % 2 === 0 ? "Monthly" : "Yearly",
      subscriber: Math.floor(Math.random() * 300) + 10,
      status: i % 3 === 0 ? "Inactive" : "Active",
    })),
];

const SubscriptionPlan = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;


  const filteredPlans = useMemo(() => {
    return allPlans.filter((plan) => {
      return statusFilter ? plan.status === statusFilter : true;
    });
  }, [statusFilter]);

  const paginatedPlans = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPlans.slice(start, start + pageSize);
  }, [filteredPlans, page]);

  const columns = [
    t('admin.subscriptionPlans.table.columns.planName'),
    t('admin.subscriptionPlans.table.columns.price'),
    t('admin.subscriptionPlans.table.columns.duration'),
    t('admin.subscriptionPlans.table.columns.subscriber'),
    t('admin.subscriptionPlans.table.columns.status'),
    t('admin.subscriptionPlans.table.columns.actions')
  ];

  const handleExport = () => {
    if (typeof window === "undefined") return;
    const csvRows = [
      [
        t('admin.subscriptionPlans.table.columns.planName'),
        t('admin.subscriptionPlans.table.columns.price'),
        t('admin.subscriptionPlans.table.columns.duration'),
        t('admin.subscriptionPlans.table.columns.subscriber'),
        t('admin.subscriptionPlans.table.columns.status')
      ].join(","),
      ...filteredPlans.map((plan) =>
        [
          plan.planname,
          plan.price,
          plan.duration,
          plan.subscriber,
          plan.status,
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = t('admin.subscriptionPlans.table.exportFileName');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleAddNew = () => {
    navigate("/admin/subscriptions/add-plan");
  };

  const handleEdit = (plan) => {
    navigate("/admin/subscriptions/edit-plan", { state: { plan } });
  };

  const handleDelete = (plan) => {
    // Handle delete plan (using onView prop from DataTable)
    if (window.confirm(t('admin.subscriptionPlans.table.deleteConfirm').replace('{{planName}}', plan.planname))) {
      console.log("Delete plan:", plan);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t('admin.subscriptionPlans.hero.title')}
            </h1>
            <p className="font-roboto text-[18px] leading-[28px] text-dark-gray">
              {t('admin.subscriptionPlans.hero.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="h-[36px] w-[124px] rounded-[10px] border border-[#E5E7EB] bg-white text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6] flex items-center justify-center gap-2"
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
                  fill="#032746"
                />
              </svg>
              {t('admin.subscriptionPlans.actions.export')}
            </button>
            <button
              type="button"
              onClick={handleAddNew}
              className="h-[36px] w-[180px] rounded-[10px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
            >
              {t('admin.subscriptionPlans.actions.addNewPlan')}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/subscriptions/new-plan")}
              className="h-[36px] w-[160px] rounded-[10px] border border-[#E5E7EB] bg-white text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6]"
            >
              {t('admin.subscriptionPlans.actions.newPlan')}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/subscriptions/manage-users")}
              className="h-[36px] w-[160px] rounded-[10px] border border-[#E5E7EB] bg-white text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6]"
            >
              {t('admin.subscriptionPlans.actions.manageUser')}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/subscriptions/payment-history")}
              className="h-[36px] w-[160px] rounded-[10px] border border-[#E5E7EB] bg-white text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6]"
            >
              {t('admin.subscriptionPlans.actions.paymentHistory')}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/subscriptions/new-question-bank")}
              className="h-[36px] w-[160px] rounded-[10px] border border-[#E5E7EB] bg-white text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue transition hover:bg-[#F3F4F6]"
            >
              {t('admin.subscriptionPlans.actions.newQuestion')}
            </button>
          </div>
        </header>

        {/* Status Filter */}
        <div style={{ width: "165px" }}>
          <Dropdown
            value={statusFilter || ""}
            options={[
              { value: "", label: t('admin.subscriptionPlans.filters.all') },
              { value: "Active", label: t('admin.subscriptionPlans.filters.active') },
              { value: "Inactive", label: t('admin.subscriptionPlans.filters.inactive') },
            ]}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            placeholder={t('admin.subscriptionPlans.filters.status')}
            showDefaultOnEmpty={false}
            className="w-full"
            height="h-[50px]"
          />
        </div>

        {/* Table */}
        <DataTable
          items={paginatedPlans}
          columns={columns}
          page={page}
          pageSize={pageSize}
          total={filteredPlans.length}
          onPageChange={setPage}
          onEdit={handleEdit}
          onView={handleDelete}
          emptyMessage={t('admin.subscriptionPlans.table.emptyState')}
        />
      </div>
    </div>
  );
};

export default SubscriptionPlan;