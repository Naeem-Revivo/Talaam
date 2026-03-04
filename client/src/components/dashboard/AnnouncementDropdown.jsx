import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { markAnnouncementAsRead } from '../../api/announcements';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) {
    return 'Just now';
  } else if (diffInMins < 60) {
    return `${diffInMins} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
};

const AnnouncementDropdown = ({ announcements, isOpen, onClose, onAnnouncementRead, onMarkAllRead, className = '', unreadCount = 0 }) => {
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

  // Show all announcements (not just exam-related)
  const displayAnnouncements = announcements || [];

  const handleMarkAllRead = async () => {
    if (onMarkAllRead) {
      await onMarkAllRead();
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full right-0 mt-2 w-[380px] max-h-[500px] bg-white rounded-lg shadow-lg z-50 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-[16px] font-roboto font-semibold text-oxford-blue">
          {t('notifications.title') || 'Notifications'}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-[14px] font-roboto font-normal text-blue-600 hover:text-blue-700 hover:underline"
          >
            {t('notifications.markAllRead') || 'Mark all read'}
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="max-h-[400px] overflow-y-auto">
        {displayAnnouncements.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-[14px] text-dark-gray font-roboto">
              {t('notifications.noAnnouncements') || 'No notifications'}
            </p>
          </div>
        ) : (
          displayAnnouncements.map((announcement, index) => (
            <button
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                index < displayAnnouncements.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Blue dot indicator for unread */}
                {(!announcement.isRead || announcement.isRead === false || announcement.isRead === undefined) && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-roboto font-normal text-oxford-blue mb-1">
                    {announcement.title}
                  </h4>
                  <p className="text-[12px] font-roboto font-normal text-gray-500">
                    {formatDate(announcement.createdAt || announcement.startDate)}
                  </p>
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
