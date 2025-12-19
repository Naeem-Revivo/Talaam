import { DataTable } from "../../components/admin/SystemSetting/Table";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { getAnnouncements, deleteAnnouncement, togglePublishStatus, getAnnouncementById } from "../../api/announcements";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";


// Main Component
const SiteWideAnnouncements = () => {
    const { t } = useLanguage();
    const [notificationPage, setNotificationPage] = useState(1);
    const [announcements, setAnnouncements] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);
    const pageSize = 4;
    const navigate = useNavigate();

    // Fetch announcements
    useEffect(() => {
        fetchAnnouncements();
    }, [notificationPage]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await getAnnouncements({
                page: notificationPage,
                pageSize: pageSize
            });
            if (response.success) {
                // Transform announcements to include translated target audience
                const transformedAnnouncements = (response.data.announcements || []).map(ann => ({
                    ...ann,
                    targetAudienceDisplay: getTargetAudienceLabel(ann.targetAudience)
                }));
                setAnnouncements(transformedAnnouncements);
                setTotal(response.data.pagination?.total || response.data.announcements?.length || 0);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationView = async (item) => {
        try {
            const response = await getAnnouncementById(item.id);
            if (response.success && response.data.announcement) {
                setSelectedAnnouncement(response.data.announcement);
                setShowViewModal(true);
            }
        } catch (error) {
            console.error('Error fetching announcement details:', error);
        }
    };

    const handleNotificationEdit = (item) => {
        navigate(`/admin/settings/edit-announcements?id=${item.id}`);
    };

    const handleDelete = (item) => {
        setAnnouncementToDelete(item);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (announcementToDelete) {
            try {
                await deleteAnnouncement(announcementToDelete.id);
                fetchAnnouncements();
            } catch (error) {
                console.error('Error deleting announcement:', error);
            }
        }
    };

    const handleTogglePublish = async (item) => {
        try {
            await togglePublishStatus(item.id, !item.isPublished);
            fetchAnnouncements();
        } catch (error) {
            console.error('Error toggling publish status:', error);
        }
    };

    const handleAddNew = () => {
        navigate("/admin/settings/add-announcements")
    };

    const getTargetAudienceLabel = (audience) => {
        const labels = {
            'all_users': t('admin.addNewAnnouncements.options.targetAudience.allUsers'),
            'admin_roles': t('admin.addNewAnnouncements.options.targetAudience.adminRoles'),
            'students': t('admin.addNewAnnouncements.options.targetAudience.students')
        };
        return labels[audience] || audience;
    };

    const getTypeLabel = (type) => {
        const labels = {
            'info': t('admin.addNewAnnouncements.options.type.info'),
            'warning': t('admin.addNewAnnouncements.options.type.warning'),
            'alert': t('admin.addNewAnnouncements.options.type.alert'),
            'success': t('admin.addNewAnnouncements.options.type.success')
        };
        return labels[type] || type;
    };

    return (
        <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
                <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center w-full">
                    <div>
                        <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
                            {t('admin.siteWideAnnouncements.hero.title')}
                        </h1>
                    </div>
                    <div className="flex flex-wrap lg:justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleAddNew}
                            className="h-[36px] px-5 rounded-[10px] bg-[#ED4122] text-[16px] font-archivo font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]"
                        >
                            {t('admin.siteWideAnnouncements.buttons.addNewAnnouncements')}
                        </button>
                    </div>
                </header>

                <DataTable
                    items={announcements}
                    columns={[
                        {label: t('admin.siteWideAnnouncements.table.columns.title'), key: "title"},
                        {label: t('admin.siteWideAnnouncements.table.columns.message'), key: "message"},
                        {label: t('admin.siteWideAnnouncements.table.columns.schedule'), key: "schedule"},
                        {label: t('admin.siteWideAnnouncements.table.columns.audience'), key: "targetAudienceDisplay"},
                        {label: t('admin.siteWideAnnouncements.table.columns.status'), key: "status"},
                        {label: t('admin.siteWideAnnouncements.table.columns.publish'), key: "publish"},
                        {label: t('admin.siteWideAnnouncements.table.columns.actions'), key: "actions"},
                    ]}
                    page={notificationPage}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setNotificationPage}
                    onView={handleNotificationView}
                    onEdit={handleNotificationEdit}
                    onDelete={handleDelete}
                    onTogglePublish={handleTogglePublish}
                    emptyMessage={t('admin.siteWideAnnouncements.table.emptyMessage')}
                    loading={loading}
                />
            </div>

            {/* View Modal */}
            {showViewModal && selectedAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowViewModal(false)}>
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
                            <h2 className="font-archivo text-[24px] leading-[100%] font-bold text-oxford-blue">
                                Announcement Details
                            </h2>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-oxford-blue hover:text-[#ED4122] transition"
                                aria-label="Close"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-6 space-y-4">
                            <div>
                                <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Title</label>
                                <p className="font-roboto text-[16px] text-oxford-blue">{selectedAnnouncement.title}</p>
                            </div>
                            <div>
                                <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Message</label>
                                <p className="font-roboto text-[16px] text-oxford-blue whitespace-pre-wrap">{selectedAnnouncement.message}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Target Audience</label>
                                    <p className="font-roboto text-[16px] text-oxford-blue">{getTargetAudienceLabel(selectedAnnouncement.targetAudience)}</p>
                                </div>
                                <div>
                                    <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Type</label>
                                    <p className="font-roboto text-[16px] text-oxford-blue capitalize">{getTypeLabel(selectedAnnouncement.type)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Start Date</label>
                                    <p className="font-roboto text-[16px] text-oxford-blue">
                                        {new Date(selectedAnnouncement.startDate).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">End Date</label>
                                    <p className="font-roboto text-[16px] text-oxford-blue">
                                        {new Date(selectedAnnouncement.endDate).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Status</label>
                                    <span className={`inline-block px-[12px] py-[5px] rounded-md text-[14px] font-normal font-roboto ${
                                        selectedAnnouncement.status?.toLowerCase() === 'active' ? 'bg-[#FDF0D5] text-[#ED4122]' :
                                        selectedAnnouncement.status?.toLowerCase() === 'scheduled' ? 'bg-[#ED4122] text-white' :
                                        selectedAnnouncement.status?.toLowerCase() === 'expired' ? 'bg-[#C6D8D3] text-oxford-blue' :
                                        'bg-[#C6D8D3] text-oxford-blue'
                                    }`}>
                                        {selectedAnnouncement.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Published</label>
                                    <p className="font-roboto text-[16px] text-oxford-blue">
                                        {selectedAnnouncement.isPublished ? 'Yes' : 'No'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">Created At</label>
                                <p className="font-roboto text-[16px] text-oxford-blue">
                                    {new Date(selectedAnnouncement.createdAt).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-[#E5E7EB] px-6 py-4 flex justify-end">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-6 py-2.5 font-roboto text-[16px] leading-[24px] font-medium text-oxford-blue bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setAnnouncementToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title={t('admin.siteWideAnnouncements.deleteModal.title')}
                message={announcementToDelete ? t('admin.siteWideAnnouncements.deleteModal.message').replace('{{title}}', announcementToDelete.title) : t('admin.siteWideAnnouncements.deleteConfirm')}
                subMessage={t('admin.siteWideAnnouncements.deleteModal.subMessage')}
                confirmText={t('admin.siteWideAnnouncements.deleteModal.confirmText')}
                cancelText={t('admin.siteWideAnnouncements.deleteModal.cancelText')}
            />
        </div>
    );
};

export default SiteWideAnnouncements