const { prisma } = require('../../config/db/prisma');
const User = require('../../models/user');

/**
 * Get gatherer dashboard data
 * @param {string} userId - Gatherer user ID
 * @returns {Promise<Object>} Dashboard data including performance metrics, last login, and pending tasks
 */
const getGathererDashboard = async (userId) => {
  // Verify user is a gatherer
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.adminRole !== 'gatherer') {
    throw new Error('User is not a gatherer');
  }

  // Get last login time
  const lastLogin = user.updatedAt || user.createdAt;

  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get pending tasks (questions created by gatherer with status pending_processor or pending_gatherer)
  const pendingTasks = await prisma.question.count({
    where: {
      createdById: userId,
      status: {
        in: ['pending_processor', 'pending_gatherer'],
      },
    },
  });

  // Get all questions created by gatherer in the last 30 days
  const createdQuestions = await prisma.question.findMany({
    where: {
      createdById: userId,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // Calculate performance metrics
  // Acceptance rate: questions that were approved (status = completed or moved forward) / total created
  const totalCreated = createdQuestions.length;
  const acceptedQuestions = createdQuestions.filter(q => 
    q.status === 'completed' || 
    q.status === 'pending_creator' || 
    q.status === 'pending_explainer' ||
    (q.status === 'pending_processor' && q.assignedProcessorId !== null)
  ).length;
  const acceptanceRate = totalCreated > 0 
    ? Math.round((acceptedQuestions / totalCreated) * 100) 
    : 0;

  // Rejection rate: questions that were rejected / total created
  const rejectedQuestions = createdQuestions.filter(q => 
    q.status === 'rejected'
  ).length;
  const rejectionRate = totalCreated > 0
    ? Math.round((rejectedQuestions / totalCreated) * 100)
    : 0;

  return {
    performance: {
      acceptanceRate,
      rejectionRate,
      daysRange: 30,
    },
    lastLogin: lastLogin,
    pendingTasks,
  };
};

module.exports = {
  getGathererDashboard,
};

