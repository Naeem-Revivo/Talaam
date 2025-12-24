const { prisma } = require('../../config/db/prisma');

/**
 * Announcement Model using Prisma
 */
const Announcement = {
  // Create a new announcement
  async create(data) {
    return await prisma.announcement.create({ data });
  },

  // Find announcement by ID
  async findById(id) {
    return await prisma.announcement.findUnique({ 
      where: { id }
    });
  },

  // Find all announcements
  async findMany(options = {}) {
    return await prisma.announcement.findMany({
      ...options,
      orderBy: { createdAt: 'desc' }
    });
  },

  // Find active announcements for a specific audience
  async findActiveForAudience(targetAudience) {
    const now = new Date();
    // Normalize current date to start of day (00:00:00) for comparison
    // This ensures announcements with start date of today show at 12:00 AM on that day
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1); // 23:59:59.999 today
    
    return await prisma.announcement.findMany({
      where: {
        isPublished: true,
        // Use endOfToday to include announcements starting today at 12:00 AM
        startDate: { lte: endOfToday },
        endDate: { gte: startOfToday },
        OR: [
          { targetAudience: 'all_users' },
          { targetAudience: targetAudience }
        ]
      },
      orderBy: { createdAt: 'desc' }
    }).then(announcements => {
      // Filter to only show announcements where startDate's day is today or earlier
      // This ensures if start date is Dec 19, it shows at 12:00 AM on Dec 19, not on Dec 18
      return announcements.filter(announcement => {
        const announcementStartDate = new Date(announcement.startDate);
        const announcementStartOfDay = new Date(
          announcementStartDate.getFullYear(),
          announcementStartDate.getMonth(),
          announcementStartDate.getDate(),
          0, 0, 0, 0
        );
        // Show if start date's day is today or earlier (compare day-level only)
        return announcementStartOfDay <= startOfToday;
      });
    });
  },

  // Update announcement
  async update(id, data) {
    return await prisma.announcement.update({ where: { id }, data });
  },

  // Delete announcement
  async delete(id) {
    return await prisma.announcement.delete({ where: { id } });
  },

  // Count announcements
  async count(where = {}) {
    return await prisma.announcement.count({ where });
  },
};

module.exports = Announcement;
