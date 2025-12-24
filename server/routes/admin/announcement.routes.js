const express = require('express');
const router = express.Router();
const announcementController = require('../../controllers/admin/announcement.controller');
const { authMiddleware, superadminMiddleware } = require('../../middlewares/auth');

// User routes - accessible to all authenticated users
// These must be defined before the /:announcementId route to avoid conflicts
router.get(
  '/user',
  authMiddleware,
  announcementController.getUserAnnouncements
);

router.get(
  '/unread-count',
  authMiddleware,
  announcementController.getUnreadCount
);

router.post(
  '/:announcementId/read',
  authMiddleware,
  announcementController.markAsRead
);

router.delete(
  '/:announcementId/user',
  authMiddleware,
  announcementController.deleteForUser
);

// Admin routes - require superadmin access
router.post(
  '/',
  authMiddleware,
  superadminMiddleware,
  announcementController.createAnnouncement
);

router.get(
  '/',
  authMiddleware,
  superadminMiddleware,
  announcementController.getAllAnnouncements
);

router.get(
  '/:announcementId',
  authMiddleware,
  superadminMiddleware,
  announcementController.getAnnouncementById
);

router.put(
  '/:announcementId',
  authMiddleware,
  superadminMiddleware,
  announcementController.updateAnnouncement
);

router.delete(
  '/:announcementId',
  authMiddleware,
  superadminMiddleware,
  announcementController.deleteAnnouncement
);

router.put(
  '/:announcementId/publish',
  authMiddleware,
  superadminMiddleware,
  announcementController.togglePublishStatus
);

module.exports = router;
