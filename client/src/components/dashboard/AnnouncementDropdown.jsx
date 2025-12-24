import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { markAnnouncementAsRead } from '../../api/announcements';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const AnnouncementDropdown = ({ announcements, isOpen, onClose, onAnnouncementRead, className = '', unreadCount = 0 }) => {
  const { t } = useLanguage();
  const dropdownRef = useRef(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  const handleCloseModal = async () => {
    if (selectedAnnouncement && !selectedAnnouncement.isRead) {
      try {
        await markAnnouncementAsRead(selectedAnnouncement.id);
        onAnnouncementRead(selectedAnnouncement.id);
      } catch (error) {
        console.error('Error marking announcement as read:', error);
      }
    }
    setShowViewModal(false);
    setSelectedAnnouncement(null);
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

  if (!isOpen) return null;

  // Filter to show only unread announcements with "exam" in the title (case-insensitive)
  // This filter must match the count calculation in Header.jsx exactly
  const examAnnouncements = announcements.filter((announcement) => {
    if (!announcement.title) return false;
    const titleLower = announcement.title.toLowerCase();
    const isExam = titleLower.includes('exam');
    const isUnread = announcement.isRead === false || announcement.isRead === undefined;
    return isExam && isUnread;
  });

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full right-0 mt-2 w-[380px] max-h-[500px] bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
        <h3 className="text-[16px] font-archivo font-semibold text-oxford-blue">
          {t('notifications.title') || 'Notifications'}
        </h3>
        {unreadCount > 0 && (
          <span className="bg-[#ED4122] text-white text-[12px] font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-2">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      {/* Announcements List */}
      <div className="max-h-[400px] overflow-y-auto">
        {examAnnouncements.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-[14px] text-dark-gray font-roboto">
              {t('notifications.noAnnouncements') || 'No announcements'}
            </p>
          </div>
        ) : (
          examAnnouncements.map((announcement) => (
            <button
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement)}
              className="w-full px-4 py-3 text-left border-b border-[#E5E7EB] bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <h4 className={`text-[14px] font-roboto font-semibold ${
                  !announcement.isRead ? 'text-oxford-blue' : 'text-dark-gray'
                }`}>
                  {announcement.title}
                </h4>
                <div className="flex items-center gap-2">
                  {!announcement.isRead && (
                    <span className="w-2 h-2 bg-[#ED4122] rounded-full"></span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium font-roboto bg-red-100 text-red-800">
                    ALERT
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedAnnouncement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
              <h2 className="font-archivo text-[24px] leading-[100%] font-bold text-oxford-blue">
                {t('dashboard.announcements.viewTitle') || 'Announcement Details'}
              </h2>
              <button
                onClick={handleCloseModal}
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
                onClick={handleCloseModal}
                className="px-6 py-2.5 font-roboto text-[16px] leading-[24px] font-medium text-oxford-blue bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                {t('dashboard.announcements.close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementDropdown;
