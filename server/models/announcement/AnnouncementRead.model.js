const { prisma } = require('../../config/db/prisma');

/**
 * AnnouncementRead Model using Prisma
 */
const AnnouncementRead = {
  // Mark announcement as read for a user
  async markAsRead(userId, announcementId) {
    return await prisma.announcementRead.upsert({
      where: {
        userId_announcementId: {
          userId,
          announcementId,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        userId,
        announcementId,
      },
    });
  },

  // Check if announcement is read by user
  async isReadByUser(userId, announcementId) {
    const read = await prisma.announcementRead.findUnique({
      where: {
        userId_announcementId: {
          userId,
          announcementId,
        },
      },
    });
    return !!read;
  },

  // Get all read announcement IDs for a user (excluding deleted)
  async getReadAnnouncementIds(userId) {
    const reads = await prisma.announcementRead.findMany({
      where: { userId, isDeleted: false },
      select: { announcementId: true },
    });
    return reads.map(r => r.announcementId);
  },

  // Get deleted announcement IDs for a user
  async getDeletedAnnouncementIds(userId) {
    const reads = await prisma.announcementRead.findMany({
      where: { userId, isDeleted: true },
      select: { announcementId: true },
    });
    return reads.map(r => r.announcementId);
  },

  // Mark announcement as deleted for a user
  async markAsDeleted(userId, announcementId) {
    // First try to update existing record
    const existing = await prisma.announcementRead.findUnique({
      where: {
        userId_announcementId: {
          userId,
          announcementId,
        },
      },
    });

    if (existing) {
      return await prisma.announcementRead.update({
        where: {
          userId_announcementId: {
            userId,
            announcementId,
          },
        },
        data: {
          isDeleted: true,
        },
      });
    } else {
      // Create new record with isDeleted = true
      return await prisma.announcementRead.create({
        data: {
          userId,
          announcementId,
          isDeleted: true,
        },
      });
    }
  },

  // Get unread count for user
  async getUnreadCount(userId, announcementIds) {
    if (announcementIds.length === 0) return 0;
    
    const readIds = await this.getReadAnnouncementIds(userId);
    const readSet = new Set(readIds);
    
    return announcementIds.filter(id => !readSet.has(id)).length;
  },
};

module.exports = AnnouncementRead;
