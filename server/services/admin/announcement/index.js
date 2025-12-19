const {
  createAnnouncement,
  getAllAnnouncements,
  findAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsPaginated,
  togglePublishStatus,
  getActiveAnnouncementsForUser,
  markAnnouncementAsRead,
  getUnreadCountForUser,
  deleteAnnouncementForUser,
  calculateStatus,
} = require('./announcement.service');

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  findAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsPaginated,
  togglePublishStatus,
  getActiveAnnouncementsForUser,
  markAnnouncementAsRead,
  getUnreadCountForUser,
  deleteAnnouncementForUser,
  calculateStatus,
};
