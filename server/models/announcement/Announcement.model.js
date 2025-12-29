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
    // Use UTC dates to avoid timezone issues between local and deployed environments
    const now = new Date();
    // Get UTC date components
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth();
    const utcDate = now.getUTCDate();
    
    // Normalize current date to start of day in UTC (00:00:00 UTC)
    // This ensures announcements with start date of today show at 12:00 AM UTC on that day
    const startOfToday = new Date(Date.UTC(utcYear, utcMonth, utcDate, 0, 0, 0, 0));
    const endOfToday = new Date(Date.UTC(utcYear, utcMonth, utcDate, 23, 59, 59, 999)); // 23:59:59.999 UTC today
    
    return await prisma.announcement.findMany({
      where: {
        isPublished: true,
        // Use endOfToday to include announcements starting today at 12:00 AM UTC
        startDate: { lte: endOfToday },
        endDate: { gte: startOfToday },
        OR: [
          { targetAudience: 'all_users' },
          { targetAudience: targetAudience }
        ]
      },
      orderBy: { createdAt: 'desc' }
    }).then(announcements => {
      // Filter to only show announcements where startDate's day is today or earlier (in UTC)
      // This ensures if start date is Dec 19, it shows at 12:00 AM UTC on Dec 19, not on Dec 18
      return announcements.filter(announcement => {
        const announcementStartDate = new Date(announcement.startDate);
        // Get UTC date components for announcement
        const annUtcYear = announcementStartDate.getUTCFullYear();
        const annUtcMonth = announcementStartDate.getUTCMonth();
        const annUtcDate = announcementStartDate.getUTCDate();
        
        // Create start of day in UTC for announcement
        const announcementStartOfDay = new Date(Date.UTC(annUtcYear, annUtcMonth, annUtcDate, 0, 0, 0, 0));
        
        // Show if start date's day is today or earlier (compare day-level only in UTC)
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
