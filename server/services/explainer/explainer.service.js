const { prisma } = require('../../config/db/prisma');
const User = require('../../models/user');

/**
 * Get explainer dashboard data
 * @param {string} userId - Explainer user ID
 * @returns {Promise<Object>} Dashboard data including performance metrics, last login, and pending tasks
 */
const getExplainerDashboard = async (userId) => {
  // Verify user is an explainer
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.adminRole !== 'explainer') {
    throw new Error('User is not an explainer');
  }

  // Get last login time
  const lastLogin = user.updatedAt || user.createdAt;

  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get pending tasks (questions assigned to explainer with status pending_explainer)
  const pendingTasks = await prisma.question.count({
    where: {
      assignedExplainerId: userId,
      status: 'pending_explainer',
    },
  });

  // Get all questions assigned to explainer in the last 30 days
  const assignedQuestions = await prisma.question.findMany({
    where: {
      assignedExplainerId: userId,
      updatedAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // Get questions with explanations completed (status moved forward from pending_explainer)
  const completedExplanations = assignedQuestions.filter(q => 
    q.status !== 'pending_explainer' && q.status !== 'rejected' && q.explanation && q.explanation.trim().length > 0
  ).length;

  // Calculate performance metrics
  // Explanation completion rate: explanations completed / total assigned
  const totalAssigned = assignedQuestions.length;
  const explanationCompletionRate = totalAssigned > 0 
    ? Math.round((completedExplanations / totalAssigned) * 100) 
    : 0;

  // Quality score: based on questions that were approved after explanation (reached completed status)
  const approvedAfterExplanation = assignedQuestions.filter(q => 
    q.status === 'completed' || q.status === 'pending_processor'
  ).length;
  const qualityScore = totalAssigned > 0
    ? Math.round((approvedAfterExplanation / totalAssigned) * 100)
    : 0;

  // Drafts: questions with status pending_explainer that have some explanation started
  const drafts = await prisma.question.count({
    where: {
      assignedExplainerId: userId,
      status: 'pending_explainer',
      explanation: {
        not: '',
      },
    },
  });

  return {
    performance: {
      explaintionCompletionRate: explanationCompletionRate,
      qualityScore,
      drafts,
      daysRange: 30,
    },
    lastLogin: lastLogin,
    pendingTasks,
  };
};

module.exports = {
  getExplainerDashboard,
};

