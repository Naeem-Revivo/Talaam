import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { getUserAnnouncements, deleteAnnouncementForUser, markAnnouncementAsRead } from "../../api/announcements";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const AdminAnnouncements = () => {
  const { t } = useLanguage();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await getUserAnnouncements();
      if (response.success) {
        setAnnouncements(response.data.announcements || []);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (item) => {
    try {
      // Mark as read if not already read
      if (!item.isRead) {
        try {
          await markAnnouncementAsRead(item.id);
          // Update local state to mark as read
          setAnnouncements(prev => 
            prev.map(ann => 
              ann.id === item.id ? { ...ann, isRead: true } : ann
            )
          );
        } catch (error) {
          console.error('Error marking announcement as read:', error);
        }
      }
      // Use the item directly instead of fetching again
      setSelectedAnnouncement(item);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error viewing announcement:', error);
    }
  };

  const handleDelete = (item) => {
    setAnnouncementToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;
    
    try {
      await deleteAnnouncementForUser(announcementToDelete.id);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert(t('dashboard.announcements.deleteError') || 'Error deleting announcement. Please try again.');
      // Don't close modal on error so user can try again
      return;
    }
    // Modal will close automatically via onClose callback from ConfirmationModal
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAnnouncementToDelete(null);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 xl:px-6 py-6 sm:px-6 2xl:px-[66px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center w-full">
          <div>
            <h1 className="font-archivo text-[36px] leading-[40px] font-bold text-oxford-blue">
              {t('dashboard.announcements.title') || 'Announcements'}
            </h1>
            <p className="font-roboto text-[16px] leading-[24px] text-dark-gray mt-2">
              {t('dashboard.announcements.subtitle') || 'Stay updated with the latest announcements from the platform'}
            </p>
          </div>
        </header>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-dark-gray font-roboto">{t('dashboard.announcements.loading') || 'Loading...'}</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-dark-gray font-roboto">{t('dashboard.announcements.noAnnouncements') || 'No announcements available'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-oxford-blue border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-[14px] font-archivo font-semibold text-white">
                      {t('dashboard.announcements.table.type') || 'Type'}
                    </th>
                    <th className="px-6 py-3 text-left text-[14px] font-archivo font-semibold text-white">
                      {t('dashboard.announcements.table.title') || 'Title'}
                    </th>
                    <th className="px-6 py-3 text-left text-[14px] font-archivo font-semibold text-white">
                      {t('dashboard.announcements.table.message') || 'Message'}
                    </th>
                    <th className="px-6 py-3 text-left text-[14px] font-archivo font-semibold text-white">
                      {t('dashboard.announcements.table.date') || 'Date'}
                    </th>
                    <th className="px-6 py-3 text-left text-[14px] font-archivo font-semibold text-white">
                      {t('dashboard.announcements.table.status') || 'Status'}
                    </th>
                    <th className="px-6 py-3 text-left text-[14px] font-archivo font-semibold text-white">
                      {t('dashboard.announcements.table.actions') || 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {announcements.map((announcement) => (
                    <tr key={announcement.id} className={!announcement.isRead ? 'bg-blue-50/50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[12px] font-medium font-roboto ${getTypeColor(announcement.type)}`}>
                          {announcement.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-[14px] font-roboto ${!announcement.isRead ? 'font-semibold text-oxford-blue' : 'text-dark-gray'}`}>
                          {announcement.title}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[14px] font-roboto text-dark-gray line-clamp-2 max-w-md">
                          {announcement.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[14px] font-roboto text-dark-gray">
                          {formatDate(announcement.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[12px] font-medium font-roboto ${
                          announcement.isRead 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {announcement.isRead ? t('dashboard.announcements.status.read') || 'Read' : t('dashboard.announcements.status.unread') || 'Unread'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(announcement)}
                            className="px-4 py-1.5 text-[14px] font-roboto font-medium text-oxford-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            {t('dashboard.announcements.actions.view') || 'View'}
                          </button>
                          <button
                            onClick={() => handleDelete(announcement)}
                            className="px-4 py-1.5 text-[14px] font-roboto font-medium text-[#ED4122] bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            {t('dashboard.announcements.actions.delete') || 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
              <h2 className="font-archivo text-[24px] leading-[100%] font-bold text-oxford-blue">
                {t('dashboard.announcements.viewTitle') || 'Announcement Details'}
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
                <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">
                  {t('dashboard.announcements.type') || 'Type'}
                </label>
                <span className={`inline-block px-3 py-1 rounded text-[14px] font-medium font-roboto ${getTypeColor(selectedAnnouncement.type)}`}>
                  {selectedAnnouncement.type.toUpperCase()}
                </span>
              </div>
              <div>
                <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">
                  {t('dashboard.announcements.title') || 'Title'}
                </label>
                <p className="font-roboto text-[16px] text-oxford-blue">{selectedAnnouncement.title}</p>
              </div>
              <div>
                <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">
                  {t('dashboard.announcements.message') || 'Message'}
                </label>
                <p className="font-roboto text-[16px] text-oxford-blue whitespace-pre-wrap">{selectedAnnouncement.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">
                    {t('dashboard.announcements.startDate') || 'Start Date'}
                  </label>
                  <p className="font-roboto text-[16px] text-oxford-blue">
                    {new Date(selectedAnnouncement.startDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">
                    {t('dashboard.announcements.endDate') || 'End Date'}
                  </label>
                  <p className="font-roboto text-[16px] text-oxford-blue">
                    {new Date(selectedAnnouncement.endDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div>
                <label className="block font-roboto text-[14px] font-medium text-[#6B7280] mb-2">
                  {t('dashboard.announcements.createdAt') || 'Created At'}
                </label>
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
                {t('dashboard.announcements.close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={t('dashboard.announcements.deleteModal.title') || 'Delete Announcement'}
        message={announcementToDelete ? `Are you sure you want to delete "${announcementToDelete.title}"?` : ''}
        subMessage={t('dashboard.announcements.deleteModal.subMessage') || 'This will only hide it from your view.'}
        confirmText={t('dashboard.announcements.deleteModal.confirmText') || 'Delete'}
        cancelText={t('dashboard.announcements.deleteModal.cancelText') || 'Cancel'}
      />
    </div>
  );
};

export default AdminAnnouncements;
