const announcementService = require('../../services/admin/announcement');

/**
 * Create announcement
 * Only superadmin can create announcements
 */
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, targetAudience, type, startDate, endDate, isPublished } = req.body;

    console.log('[ANNOUNCEMENT] POST /admin/announcements → requested', {
      title,
      targetAudience,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can create announcements
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can create announcements',
      });
    }

    // Validate required fields
    if (!title || !message || !targetAudience || !type || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, message, target audience, type, start date, and end date are required',
      });
    }

    // Validate target audience
    const validAudiences = ['all_users', 'students', 'admin_roles'];
    if (!validAudiences.includes(targetAudience)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid target audience. Must be one of: all_users, students, admin_roles',
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
      });
    }
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date',
      });
    }

    // Create announcement
    const announcementData = {
      title: title.trim(),
      message: message.trim(),
      targetAudience: targetAudience.trim(),
      type: type.trim().toLowerCase(),
      startDate: start,
      endDate: end,
      isPublished: isPublished === true || isPublished === 'true',
    };

    const announcement = await announcementService.createAnnouncement(announcementData);

    const response = {
      success: true,
      message: 'Announcement created successfully',
      data: {
        announcement: {
          id: announcement.id,
          title: announcement.title,
          message: announcement.message,
          targetAudience: announcement.targetAudience,
          type: announcement.type,
          startDate: announcement.startDate,
          endDate: announcement.endDate,
          isPublished: announcement.isPublished,
          status: announcementService.calculateStatus(announcement),
          createdAt: announcement.createdAt,
          updatedAt: announcement.updatedAt,
        },
      },
    };

    console.log('[ANNOUNCEMENT] POST /admin/announcements → 201 (created)', { announcementId: announcement.id });
    res.status(201).json(response);
  } catch (error) {
    console.error('[ANNOUNCEMENT] POST /admin/announcements → error', error);
    next(error);
  }
};

/**
 * Get all announcements
 * Only superadmin can access this
 */
const getAllAnnouncements = async (req, res, next) => {
  try {
    const { page, pageSize, status, targetAudience } = req.query;

    console.log('[ANNOUNCEMENT] GET /admin/announcements → requested', { 
      requestedBy: req.user.id,
      page,
      pageSize,
      status,
      targetAudience
    });

    // Ensure only superadmin can access
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can view announcements',
      });
    }

    const filter = {};
    if (targetAudience) {
      filter.targetAudience = targetAudience;
    }

    let announcements;
    let pagination;

    if (page && pageSize) {
      const result = await announcementService.getAnnouncementsPaginated(
        parseInt(page),
        parseInt(pageSize),
        filter
      );
      announcements = result.announcements;
      pagination = result.pagination;
      
      // Filter by status if provided
      if (status) {
        announcements = announcements.filter(a => a.status.toLowerCase() === status.toLowerCase());
      }
    } else {
      announcements = await announcementService.getAllAnnouncements(filter);
      
      // Filter by status if provided
      if (status) {
        announcements = announcements.filter(a => a.status.toLowerCase() === status.toLowerCase());
      }
    }

    const response = {
      success: true,
      data: {
        announcements: announcements.map((announcement) => ({
          id: announcement.id,
          title: announcement.title,
          message: announcement.message,
          targetAudience: announcement.targetAudience,
          type: announcement.type,
          startDate: announcement.startDate,
          endDate: announcement.endDate,
          isPublished: announcement.isPublished,
          status: announcement.status,
          schedule: `${new Date(announcement.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(announcement.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
          createdAt: announcement.createdAt,
          updatedAt: announcement.updatedAt,
        })),
      },
    };

    if (pagination) {
      response.data.pagination = pagination;
    }

    console.log('[ANNOUNCEMENT] GET /admin/announcements → 200 (ok)', { count: announcements.length });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANNOUNCEMENT] GET /admin/announcements → error', error);
    next(error);
  }
};

/**
 * Get single announcement by ID
 */
const getAnnouncementById = async (req, res, next) => {
  try {
    const { announcementId } = req.params;

    console.log('[ANNOUNCEMENT] GET /admin/announcements/:announcementId → requested', {
      announcementId,
      requestedBy: req.user.id,
    });

    // Ensure only superadmin can access
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can view announcements',
      });
    }

    const announcement = await announcementService.findAnnouncementById(announcementId);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    const response = {
      success: true,
      data: {
        announcement: {
          id: announcement.id,
          title: announcement.title,
          message: announcement.message,
          targetAudience: announcement.targetAudience,
          type: announcement.type,
          startDate: announcement.startDate,
          endDate: announcement.endDate,
          isPublished: announcement.isPublished,
          status: announcement.status,
          createdAt: announcement.createdAt,
          updatedAt: announcement.updatedAt,
        },
      },
    };

    console.log('[ANNOUNCEMENT] GET /admin/announcements/:announcementId → 200 (ok)', { announcementId: announcement.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANNOUNCEMENT] GET /admin/announcements/:announcementId → error', error);
    next(error);
  }
};

/**
 * Update announcement
 * Only superadmin can update announcements
 */
const updateAnnouncement = async (req, res, next) => {
  try {
    const { announcementId } = req.params;
    const { title, message, targetAudience, type, startDate, endDate, isPublished } = req.body;

    console.log('[ANNOUNCEMENT] PUT /admin/announcements/:announcementId → requested', {
      announcementId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can update
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update announcements',
      });
    }

    const announcement = await announcementService.findAnnouncementById(announcementId);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    // Update announcement
    const updateData = {};
    if (title !== undefined) {
      updateData.title = title.trim();
    }
    if (message !== undefined) {
      updateData.message = message.trim();
    }
    if (targetAudience !== undefined) {
      const validAudiences = ['all_users', 'students', 'admin_roles'];
      if (!validAudiences.includes(targetAudience)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid target audience. Must be one of: all_users, students, admin_roles',
        });
      }
      updateData.targetAudience = targetAudience.trim();
    }
    if (type !== undefined) {
      updateData.type = type.trim().toLowerCase();
    }
    if (startDate !== undefined) {
      updateData.startDate = new Date(startDate);
    }
    if (endDate !== undefined) {
      updateData.endDate = new Date(endDate);
    }
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished === true || isPublished === 'true';
    }

    // Validate dates if both are being updated
    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date',
        });
      }
    } else if (updateData.startDate && announcement.endDate) {
      if (updateData.startDate >= new Date(announcement.endDate)) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date',
        });
      }
    } else if (updateData.endDate && announcement.startDate) {
      if (new Date(announcement.startDate) >= updateData.endDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date',
        });
      }
    }

    const updatedAnnouncement = await announcementService.updateAnnouncement(announcement, updateData);

    const response = {
      success: true,
      message: 'Announcement updated successfully',
      data: {
        announcement: {
          id: updatedAnnouncement.id,
          title: updatedAnnouncement.title,
          message: updatedAnnouncement.message,
          targetAudience: updatedAnnouncement.targetAudience,
          type: updatedAnnouncement.type,
          startDate: updatedAnnouncement.startDate,
          endDate: updatedAnnouncement.endDate,
          isPublished: updatedAnnouncement.isPublished,
          status: announcementService.calculateStatus(updatedAnnouncement),
          createdAt: updatedAnnouncement.createdAt,
          updatedAt: updatedAnnouncement.updatedAt,
        },
      },
    };

    console.log('[ANNOUNCEMENT] PUT /admin/announcements/:announcementId → 200 (updated)', { announcementId: updatedAnnouncement.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANNOUNCEMENT] PUT /admin/announcements/:announcementId → error', error);
    next(error);
  }
};

/**
 * Delete announcement
 * Only superadmin can delete announcements
 */
const deleteAnnouncement = async (req, res, next) => {
  try {
    const { announcementId } = req.params;

    console.log('[ANNOUNCEMENT] DELETE /admin/announcements/:announcementId → requested', {
      announcementId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can delete
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can delete announcements',
      });
    }

    const announcement = await announcementService.findAnnouncementById(announcementId);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    await announcementService.deleteAnnouncement(announcementId);

    const response = {
      success: true,
      message: 'Announcement deleted successfully',
      data: {
        announcement: {
          id: announcement.id,
          title: announcement.title,
        },
      },
    };

    console.log('[ANNOUNCEMENT] DELETE /admin/announcements/:announcementId → 200 (deleted)', { announcementId: announcement.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANNOUNCEMENT] DELETE /admin/announcements/:announcementId → error', error);
    next(error);
  }
};

/**
 * Toggle publish status
 * Only superadmin can toggle publish status
 */
const togglePublishStatus = async (req, res, next) => {
  try {
    const { announcementId } = req.params;
    const { isPublished } = req.body;

    console.log('[ANNOUNCEMENT] PUT /admin/announcements/:announcementId/publish → requested', {
      announcementId,
      isPublished,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can toggle
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can toggle publish status',
      });
    }

    const announcement = await announcementService.findAnnouncementById(announcementId);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    const updatedAnnouncement = await announcementService.togglePublishStatus(
      announcementId,
      isPublished === true || isPublished === 'true'
    );

    const response = {
      success: true,
      message: `Announcement ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: {
        announcement: {
          id: updatedAnnouncement.id,
          title: updatedAnnouncement.title,
          isPublished: updatedAnnouncement.isPublished,
          status: announcementService.calculateStatus(updatedAnnouncement),
        },
      },
    };

    console.log('[ANNOUNCEMENT] PUT /admin/announcements/:announcementId/publish → 200 (toggled)', { announcementId: updatedAnnouncement.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANNOUNCEMENT] PUT /admin/announcements/:announcementId/publish → error', error);
    next(error);
  }
};

/**
 * Get active announcements for the current user with read status
 * Available to all authenticated users
 */
const getUserAnnouncements = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const adminRole = req.user.adminRole;

    console.log('[ANNOUNCEMENT] GET /announcements/user → requested', {
      userId,
      userRole,
      adminRole,
    });

    const announcements = await announcementService.getActiveAnnouncementsForUser(
      userId,
      userRole,
      adminRole
    );

    const response = {
      success: true,
      data: {
        announcements: announcements.map((announcement) => ({
          id: announcement.id,
          title: announcement.title,
          message: announcement.message,
          type: announcement.type,
          startDate: announcement.startDate,
          endDate: announcement.endDate,
          isRead: announcement.isRead,
          createdAt: announcement.createdAt,
        })),
      },
    };

    console.log('[ANNOUNCEMENT] GET /announcements/user → 200 (ok)', { count: announcements.length });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANNOUNCEMENT] GET /announcements/user → error', error);
    next(error);
  }
};

/**
 * Mark announcement as read for the current user
 * Available to all authenticated users
 */
const markAsRead = async (req, res, next) => {
  try {
    const { announcementId } = req.params;
    const userId = req.user.id;

    console.log('[ANNOUNCEMENT] POST /announcements/:announcementId/read → requested', {
      announcementId,
      userId,
    });

    await announcementService.markAnnouncementAsRead(userId, announcementId);

    const response = {
      success: true,
      message: 'Announcement marked as read',
    };

    console.log('[ANNOUNCEMENT] POST /announcements/:announcementId/read → 200 (ok)');
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANNOUNCEMENT] POST /announcements/:announcementId/read → error', error);
    if (error.message === 'Announcement not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Get unread count for the current user
 * Available to all authenticated users
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const adminRole = req.user.adminRole;

    console.log('[ANNOUNCEMENT] GET /announcements/unread-count → requested', {
      userId,
      userRole,
      adminRole,
    });

    const count = await announcementService.getUnreadCountForUser(
      userId,
      userRole,
      adminRole
    );

    const response = {
      success: true,
      data: {
        unreadCount: count,
      },
    };

    console.log('[ANNOUNCEMENT] GET /announcements/unread-count → 200 (ok)', { count });
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANNOUNCEMENT] GET /announcements/unread-count → error', error);
    next(error);
  }
};

/**
 * Delete announcement for the current user (mark as deleted)
 * Available to all authenticated users
 */
const deleteForUser = async (req, res, next) => {
  try {
    const { announcementId } = req.params;
    const userId = req.user.id;

    console.log('[ANNOUNCEMENT] DELETE /announcements/:announcementId/user → requested', {
      announcementId,
      userId,
    });

    await announcementService.deleteAnnouncementForUser(userId, announcementId);

    const response = {
      success: true,
      message: 'Announcement deleted successfully',
    };

    console.log('[ANNOUNCEMENT] DELETE /announcements/:announcementId/user → 200 (ok)');
    res.status(200).json(response);
  } catch (error) {
    console.error('[ANNOUNCEMENT] DELETE /announcements/:announcementId/user → error', error);
    if (error.message === 'Announcement not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  togglePublishStatus,
  getUserAnnouncements,
  markAsRead,
  getUnreadCount,
  deleteForUser,
};
