
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { DataTable } from "../../components/admin/SystemSetting/Table";
import plansAPI from "../../api/plans";
import { showSuccessToast, showErrorToast } from "../../utils/toastConfig";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";

const SubscriptionPlan = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const pageSize = 10;

  // Fetch plans from API
  useEffect(() => {
    fetchPlans();
  }, [statusFilter]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = statusFilter ? { status: statusFilter.toLowerCase() } : {};
      const response = await plansAPI.getAllPlans(params);
      
      if (response.success && response.data?.plans) {
        // Transform API data to match table format
        const transformedPlans = response.data.plans.map((plan) => ({
          id: plan.id,
          planname: plan.name,
          price: `$${parseFloat(plan.price).toFixed(2)}`,
          duration: plan.duration,
          subscriber: plan.subscriberCount || 0,
          status: plan.status.charAt(0).toUpperCase() + plan.status.slice(1), // Capitalize first letter
          // Keep original data for edit/delete operations
          _original: plan,
        }));
        
        setPlans(transformedPlans);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err.message || "Failed to fetch plans");
      showErrorToast(err.message || "Failed to fetch plans");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = useMemo(() => {
    return plans;
  }, [plans]);

  const paginatedPlans = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPlans.slice(start, start + pageSize);
  }, [filteredPlans, page]);

 const columns = [
  { label: t('admin.subscriptionPlans.table.columns.planName'), key: 'planname' },
  { label: t('admin.subscriptionPlans.table.columns.price'), key: 'price' },
  { label: t('admin.subscriptionPlans.table.columns.duration'), key: 'duration' },
  { label: t('admin.subscriptionPlans.table.columns.subscriber'), key: 'subscriber' },
  { label: t('admin.subscriptionPlans.table.columns.status'), key: 'status' },
  { label: t('admin.subscriptionPlans.table.columns.actions'), key: 'actions' }
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

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!planToDelete) return;

    try {
      const planId = planToDelete._original?.id || planToDelete.id;
      const response = await plansAPI.deletePlan(planId);
      
      if (response.success) {
        showSuccessToast(response.message || "Plan deleted successfully");
        // Refresh plans list
        fetchPlans();
        // Reset to first page if current page becomes empty
        if (paginatedPlans.length === 1 && page > 1) {
          setPage(page - 1);
        }
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
      showErrorToast(err.message || "Failed to delete plan");
    } finally {
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[110px]">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
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
          </div>
        </header>

        {/* Status Filter */}
        {/* <div className="w-[165px]">
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
        </div> */}

        {/* Loading State */}
        {loading && (
          <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-8 text-center">
            <p className="text-dark-gray">{t('admin.subscriptionPlans.loading') || 'Loading plans...'}</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-[12px] border border-red-300 bg-white p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPlans}
              className="h-[36px] rounded-[8px] bg-[#ED4122] px-6 font-roboto text-[16px] font-medium leading-[20px] text-white transition hover:bg-[#d43a1f]"
            >
              {t('admin.subscriptionPlans.retry') || 'Retry'}
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <DataTable
            items={paginatedPlans}
            columns={columns}
            page={page}
            pageSize={pageSize}
            total={filteredPlans.length}
            onPageChange={setPage}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            emptyMessage={t('admin.subscriptionPlans.table.emptyState')}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPlanToDelete(null);
        }}
        onConfirm={handleDelete}
        title={t('admin.subscriptionPlans.deleteModal.title') || 'Delete Plan'}
        message={planToDelete ? (t('admin.subscriptionPlans.deleteModal.message') || 'Are you sure you want to delete this plan?').replace('{{planName}}', planToDelete.planname) : (t('admin.subscriptionPlans.deleteModal.message') || 'Are you sure you want to delete this plan?')}
        subMessage={t('admin.subscriptionPlans.deleteModal.subMessage') || 'This action cannot be undone.'}
        confirmText={t('admin.subscriptionPlans.deleteModal.confirmText') || 'Delete'}
        cancelText={t('admin.subscriptionPlans.deleteModal.cancelText') || 'Cancel'}
      />
    </div>
  );
};

export default SubscriptionPlan;