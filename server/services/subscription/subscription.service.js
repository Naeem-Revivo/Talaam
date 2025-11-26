const Subscription = require('../../models/subscription');
const Plan = require('../../models/plan');
const User = require('../../models/user');

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
    planId: plan._id,
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
  const subscription = await Subscription.findOne({
    _id: subscriptionId,
    userId: userId,
  });

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  // Update subscription
  subscription.paymentStatus = 'Paid';
  subscription.isActive = true;
  subscription.transactionId = transactionId;
  await subscription.save();

  return subscription;
};

/**
 * Get my subscription
 */
const getMySubscription = async (userId) => {
  // Get the latest subscription (most recent first)
  const subscription = await Subscription.findOne({ userId })
    .sort({ createdAt: -1 })
    .populate('planId', 'name price duration description status')
    .lean();

  if (!subscription) {
    throw new Error('No subscription found');
  }

  return subscription;
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
    const result = await Subscription.updateMany(
      {
        isActive: true,
        expiryDate: { $lt: currentDate },
      },
      {
        $set: {
          isActive: false,
        },
      }
    );

    return {
      success: true,
      updatedCount: result.modifiedCount,
      message: `Updated ${result.modifiedCount} expired subscription(s)`,
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
    const count = await Subscription.countDocuments({
      isActive: true,
      expiryDate: { $lt: currentDate },
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

