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

  // Check if user already has a pending subscription for this plan
  // (created within the last 5 minutes to prevent duplicates from rapid clicks)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const existingPendingSubscriptions = await prisma.subscription.findMany({
    where: {
      userId: userId,
      planId: plan.id,
      paymentStatus: 'Pending',
      createdAt: {
        gte: fiveMinutesAgo
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // If there's a recent pending subscription, return it instead of creating a new one
  if (existingPendingSubscriptions.length > 0) {
    console.log(`⚠️  Found existing pending subscription for user ${userId} and plan ${planId}, returning existing subscription`);
    return existingPendingSubscriptions[0];
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
  try {
    console.log('🔍 Getting subscription for user:', userId);
    
    // Get the latest subscription (most recent first)
    const subscriptions = await Subscription.findByUserId(userId, {
      orderBy: { createdAt: 'desc' },
      take: 1
    });

    console.log('📋 Found subscriptions:', subscriptions?.length || 0);

    if (!subscriptions || subscriptions.length === 0) {
      console.log('⚠️  No subscription found for user:', userId);
      throw new Error('No subscription found');
    }

    console.log('✅ Returning subscription:', subscriptions[0].id);
    return subscriptions[0];
  } catch (error) {
    console.error('❌ Error in getMySubscription:', error);
    throw error;
  }
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

/**
 * Get user billing history (all subscriptions)
 */
const getMyBillingHistory = async (userId) => {
  // Get all subscriptions for the user, ordered by creation date (newest first)
  const subscriptions = await Subscription.findByUserId(userId, {
    orderBy: { createdAt: 'desc' }
  });

  // Transform subscriptions into billing history format
  const billingHistory = subscriptions.map((sub) => {
    // Generate invoice number (e.g., #NV-0091)
    const invoiceNumber = `#NV-${String(sub.id).slice(-4).padStart(4, '0')}`;
    
    // Get plan price - try to get from plan relation if available
    let amount = 'N/A';
    if (sub.plan && sub.plan.price) {
      amount = `${sub.plan.price} ${sub.plan.currency || 'SAR'}`;
    } else {
      // Fallback: use default price based on plan name or use 99 SAR for Qudurat
      amount = '99 SAR';
    }

    // Format date
    const date = new Date(sub.createdAt);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    return {
      id: sub.id,
      invoice: invoiceNumber,
      amount: amount,
      date: formattedDate,
      status: sub.paymentStatus || 'Pending',
      transactionId: sub.transactionId || sub.moyassarPaymentId || null,
      planName: sub.planName || 'N/A',
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
    };
  });

  return billingHistory;
};

module.exports = {
  subscribeToPlan,
  confirmPayment,
  getMySubscription,
  updateExpiredSubscriptions,
  getExpiredSubscriptionsCount,
  getMyBillingHistory,
};

