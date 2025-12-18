const { prisma } = require('../../config/db/prisma');
const User = require('../../models/user');

/**
 * Get creator dashboard data
 * @param {string} userId - Creator user ID
 * @returns {Promise<Object>} Dashboard data including performance metrics, last login, and pending tasks
 */
const getCreatorDashboard = async (userId) => {
  // Verify user is a creator
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.adminRole !== 'creator') {
    throw new Error('User is not a creator');
  }

  // Get last login time (using updatedAt as proxy, or we can add a lastLogin field later)
  const lastLogin = user.updatedAt || user.createdAt;

  // Calculate date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get pending tasks (questions assigned to creator with status pending_creator)
  const pendingTasks = await prisma.question.count({
    where: {
      assignedCreatorId: userId,
      status: 'pending_creator',
    },
  });

  // Get variants created by creator in the last 30 days
  const createdVariants = await prisma.question.findMany({
    where: {
      createdById: userId,
      isVariant: true,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // Calculate performance metrics
  // Variant completion rate: completed variants (status === 'completed') / total variants created
  const totalVariantsCreated = createdVariants.length;
  const completedVariants = createdVariants.filter(v => 
    v.status === 'completed'
  ).length;
  const variantCompletionRate = totalVariantsCreated > 0 
    ? Math.round((completedVariants / totalVariantsCreated) * 100) 
    : 0;

  // Sent back rate: (rejected variants + flagged variants) / total variants created
  const rejectedVariants = createdVariants.filter(v => 
    v.status === 'rejected'
  ).length;
  const flaggedVariants = createdVariants.filter(v => 
    v.isFlagged === true
  ).length;
  const sentBackVariants = rejectedVariants + flaggedVariants;
  const sentBackRate = totalVariantsCreated > 0
    ? Math.round((sentBackVariants / totalVariantsCreated) * 100)
    : 0;

  // Approved variants: variants that reached completed or pending_explainer status (approved and moved forward)
  const approvedVariants = createdVariants.filter(v => 
    v.status === 'completed' || v.status === 'pending_explainer' || v.status === 'pending_processor'
  ).length;

  return {
    performance: {
      variantCompletionRate,
      sentBackRate,
      approvedVariants,
      daysRange: 30,
    },
    lastLogin: lastLogin,
    pendingTasks,
  };
};

module.exports = {
  getCreatorDashboard,
};

