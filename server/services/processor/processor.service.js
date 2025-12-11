const { prisma } = require('../../config/db/prisma');
const User = require('../../models/user');

/**
 * Get processor dashboard data
 * @param {string} userId - Processor user ID
 * @returns {Promise<Object>} Dashboard data including performance metrics, last login, and pending tasks
 */
const getProcessorDashboard = async (userId) => {
  // Verify user is a processor
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.adminRole !== 'processor') {
    throw new Error('User is not a processor');
  }

  // Get last login time
  const lastLogin = user.updatedAt || user.createdAt;

  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get pending tasks (questions assigned to processor with status pending_processor)
  const pendingTasks = await prisma.question.count({
    where: {
      assignedProcessorId: userId,
      status: 'pending_processor',
    },
  });

  // Get all questions assigned to processor in the last 30 days
  const assignedQuestions = await prisma.question.findMany({
    where: {
      assignedProcessorId: userId,
      updatedAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // Calculate performance metrics
  // Approval rate: questions approved (moved forward) / total processed
  const totalProcessed = assignedQuestions.length;
  const approvedQuestions = assignedQuestions.filter(q => 
    q.status === 'pending_creator' || 
    q.status === 'pending_explainer' || 
    q.status === 'completed'
  ).length;
  const approvalRate = totalProcessed > 0 
    ? Math.round((approvedQuestions / totalProcessed) * 100) 
    : 0;

  // Feedback accuracy: questions that were not sent back after approval / total approved
  // This is calculated as questions that reached completed status after approval
  const completedAfterApproval = assignedQuestions.filter(q => 
    q.status === 'completed'
  ).length;
  const feedbackAccuracy = approvedQuestions > 0
    ? Math.round((completedAfterApproval / approvedQuestions) * 100)
    : 0;

  // Returned cases: questions that were sent back (status is pending_processor after being processed)
  const returnedCases = await prisma.question.count({
    where: {
      assignedProcessorId: userId,
      status: 'pending_processor',
      updatedAt: {
        gte: thirtyDaysAgo,
      },
      rejectionReason: {
        not: null,
      },
    },
  });

  return {
    performance: {
      approval: approvalRate,
      feedback: feedbackAccuracy,
      cases: returnedCases,
      daysRange: 30,
    },
    lastLogin: lastLogin,
    pendingTasks,
  };
};

module.exports = {
  getProcessorDashboard,
};

