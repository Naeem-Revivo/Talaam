const Announcement = require('../../../models/announcement');
const { AnnouncementRead } = require('../../../models/announcement');

/**
 * Calculate announcement status based on dates and publish status
 */
const calculateStatus = (announcement) => {
  if (!announcement.isPublished) {
    return 'inactive';
  }
  
  const now = new Date();
  const startDate = new Date(announcement.startDate);
  const endDate = new Date(announcement.endDate);
  
  if (now < startDate) {
    return 'scheduled';
  } else if (now >= startDate && now <= endDate) {
    return 'active';
  } else {
    return 'expired';
  }
};

/**
 * Create announcement
 */
const createAnnouncement = async (announcementData) => {
  return await Announcement.create(announcementData);
};

/**
 * Get all announcements
 */
const getAllAnnouncements = async (filter = {}) => {
  const announcements = await Announcement.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' }
  });
  
  // Calculate status for each announcement
  return announcements.map(announcement => ({
    ...announcement,
    status: calculateStatus(announcement)
  }));
};

/**
 * Find announcement by ID
 */
const findAnnouncementById = async (announcementId) => {
  const announcement = await Announcement.findById(announcementId);
  if (announcement) {
    return {
      ...announcement,
      status: calculateStatus(announcement)
    };
  }
  return null;
};

/**
 * Update announcement
 */
const updateAnnouncement = async (announcement, updateData) => {
  return await Announcement.update(announcement.id, updateData);
};

/**
 * Delete announcement
 */
const deleteAnnouncement = async (announcementId) => {
  return await Announcement.delete(announcementId);
};

/**
 * Get announcements with pagination
 */
const getAnnouncementsPaginated = async (page = 1, pageSize = 10, filter = {}) => {
  const skip = (page - 1) * pageSize;
  const [announcements, total] = await Promise.all([
    Announcement.findMany({
      where: filter,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    }),
    Announcement.count(filter)
  ]);

  // Calculate status for each announcement
  const announcementsWithStatus = announcements.map(announcement => ({
    ...announcement,
    status: calculateStatus(announcement)
  }));

  return {
    announcements: announcementsWithStatus,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

/**
 * Toggle publish status
 */
const togglePublishStatus = async (announcementId, isPublished) => {
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw new Error('Announcement not found');
  }
  
  return await Announcement.update(announcementId, { isPublished });
};

/**
 * Get active announcements for user (based on their role) with read status
 */
const getActiveAnnouncementsForUser = async (userId, userRole, adminRole) => {
  let targetAudience = 'all_users';
  
  if (userRole === 'student') {
    targetAudience = 'students';
  } else if (userRole === 'admin' || userRole === 'superadmin') {
    targetAudience = 'admin_roles';
  }
  
  const announcements = await Announcement.findActiveForAudience(targetAudience);
  const readAnnouncementIds = await AnnouncementRead.getReadAnnouncementIds(userId);
  const deletedAnnouncementIds = await AnnouncementRead.getDeletedAnnouncementIds(userId);
  const readSet = new Set(readAnnouncementIds);
  const deletedSet = new Set(deletedAnnouncementIds);
  
  // Filter out deleted announcements and add read status
  return announcements
    .filter(announcement => !deletedSet.has(announcement.id))
    .map(announcement => ({
      ...announcement,
      status: calculateStatus(announcement),
      isRead: readSet.has(announcement.id)
    }));
};

/**
 * Mark announcement as read for a user
 */
const markAnnouncementAsRead = async (userId, announcementId) => {
  // Verify announcement exists
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw new Error('Announcement not found');
  }
  
  return await AnnouncementRead.markAsRead(userId, announcementId);
};

/**
 * Get unread count for user
 */
const getUnreadCountForUser = async (userId, userRole, adminRole) => {
  let targetAudience = 'all_users';
  
  if (userRole === 'student') {
    targetAudience = 'students';
  } else if (userRole === 'admin' || userRole === 'superadmin') {
    targetAudience = 'admin_roles';
  }
  
  const announcements = await Announcement.findActiveForAudience(targetAudience);
  const deletedAnnouncementIds = await AnnouncementRead.getDeletedAnnouncementIds(userId);
  const deletedSet = new Set(deletedAnnouncementIds);
  
  // Filter out deleted announcements
  const visibleAnnouncementIds = announcements
    .filter(a => !deletedSet.has(a.id))
    .map(a => a.id);
  
  return await AnnouncementRead.getUnreadCount(userId, visibleAnnouncementIds);
};

/**
 * Delete announcement for user (mark as deleted)
 */
const deleteAnnouncementForUser = async (userId, announcementId) => {
  // Verify announcement exists
  const announcement = await Announcement.findById(announcementId);
  if (!announcement) {
    throw new Error('Announcement not found');
  }
  
  return await AnnouncementRead.markAsDeleted(userId, announcementId);
};

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
