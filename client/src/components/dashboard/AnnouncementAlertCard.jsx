import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { markAnnouncementAsRead } from '../../api/announcements';

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${minutes}`;
};

const AnnouncementAlertCard = ({ announcement, onClose, onRead }) => {
  const { t } = useLanguage();

  const getTypeStyles = (type) => {
    switch (type) {
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'bg-blue-100',
          iconColor: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700',
        };
      case 'alert':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'bg-red-100',
          iconColor: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700',
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'bg-green-100',
          iconColor: 'text-green-600',
          button: 'bg-green-600 hover:bg-green-700',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'bg-gray-100',
          iconColor: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700',
        };
    }
  };

  const styles = getTypeStyles(announcement.type);

  const handleClose = async () => {
    try {
      await markAnnouncementAsRead(announcement.id);
      if (onRead) {
        onRead(announcement.id);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error marking announcement as read:', error);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className={`fixed top-[70px] left-1/2 transform -translate-x-1/2 w-[90%] max-w-[600px] ${styles.bg} ${styles.border} border-2 rounded-lg shadow-lg z-50 p-4 animate-slide-down`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${styles.icon} ${styles.iconColor} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[16px] font-archivo font-bold text-oxford-blue">
              {announcement.title}
            </h3>
            <button
              onClick={handleClose}
              className="text-dark-gray hover:text-oxford-blue transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-[14px] text-dark-gray font-roboto mb-2">
            {announcement.message}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-dark-gray font-roboto opacity-70">
              {formatDateTime(announcement.createdAt)}
            </p>
            <button
              onClick={handleClose}
              className={`${styles.button} text-white text-[12px] font-roboto font-medium px-4 py-1.5 rounded-md transition-colors`}
            >
              {t('notifications.dismiss') || 'Dismiss'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementAlertCard;
