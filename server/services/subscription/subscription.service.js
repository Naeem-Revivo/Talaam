const Subscription = require('../../models/subscription');
const Plan = require('../../models/plan');
const User = require('../../models/user');
const { prisma } = require('../../config/db/prisma');

/**
 * Helper function: Convert plan duration to days
 */
const getDurationInDays = (duration) => {
  const durationMap = {
    Monthly: 30,
    Quarterly: 90,
    'Semi-Annual': 180,
    Annual: 365,
  };
  return durationMap[duration] || 30; // Default to 30 days if unknown
};

/**
 * Subscribe to a plan
 */
const subscribeToPlan = async (userId, planId) => {
  // Fetch the plan
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new Error('Plan not found');
  }

  // Check if plan is active
  if (plan.status !== 'active') {
    throw new Error('This plan is not available for subscription');
  }

  // Fetch the user to get their name
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Get user name (prefer fullName, fallback to name, then email)
  const userName = user.fullName || user.name || user.email;

  // Calculate dates
  const startDate = new Date();
  const durationInDays = getDurationInDays(plan.duration);
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + durationInDays);

  // Create subscription
  const subscription = await Subscription.create({
    userId,
    planId: plan.id,
    userName,
    planName: plan.name,
    startDate,
    expiryDate,
    paymentStatus: 'Pending',
    isActive: false,
    transactionId: null, // Explicitly set to null for pending subscriptions
  });

  return subscription;
};

/**
 * Confirm payment
 */
const confirmPayment = async (userId, subscriptionId, transactionId) => {
  // Find subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      id: subscriptionId,
      userId: userId,
    },
  });

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  // Update subscription
  const updatedSubscription = await Subscription.update(subscriptionId, {
    paymentStatus: 'Paid',
    isActive: true,
    transactionId: transactionId,
  });

  return updatedSubscription;
};

/**
 * Get my subscription
 */
const getMySubscription = async (userId) => {
  // Get the latest subscription (most recent first)
  const subscriptions = await Subscription.findByUserId(userId, {
    orderBy: { createdAt: 'desc' },
    take: 1
  });

  if (!subscriptions || subscriptions.length === 0) {
    throw new Error('No subscription found');
  }

  return subscriptions[0];
};

/**
 * Update expired subscriptions
 * Sets isActive to false for subscriptions that have passed their expiry date
 * @returns {Promise<Object>} Result with count of updated subscriptions
 */
const updateExpiredSubscriptions = async () => {
  try {
    const currentDate = new Date();

    // Find all active subscriptions that have expired
    const result = await prisma.subscription.updateMany({
      where: {
        isActive: true,
        expiryDate: { lt: currentDate },
      },
      data: {
        isActive: false,
      },
    });

    return {
      success: true,
      updatedCount: result.count,
      message: `Updated ${result.count} expired subscription(s)`,
    };
  } catch (error) {
    console.error('Error updating expired subscriptions:', error);
    return {
      success: false,
      updatedCount: 0,
      error: error.message,
    };
  }
};

/**
 * Get expired subscriptions count
 * @returns {Promise<number>} Count of expired subscriptions
 */
const getExpiredSubscriptionsCount = async () => {
  try {
    const currentDate = new Date();
    const count = await prisma.subscription.count({
      where: {
        isActive: true,
        expiryDate: { lt: currentDate },
      },
    });
    return count;
  } catch (error) {
    console.error('Error counting expired subscriptions:', error);
    return 0;
  }
};

module.exports = {
  subscribeToPlan,
  confirmPayment,
  getMySubscription,
  updateExpiredSubscriptions,
  getExpiredSubscriptionsCount,
};

