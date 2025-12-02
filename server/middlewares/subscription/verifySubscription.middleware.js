const Subscription = require('../../models/subscription');
const { prisma } = require('../../config/db/prisma');

/**
 * Middleware to verify subscription
 * Checks if logged-in user has an active subscription with valid expiry date
 * Also updates expired subscriptions automatically
 */
const verifySubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();

    // First, check if user has an expired but still active subscription
    // and update it automatically
    const expiredSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        expiryDate: { lt: currentDate },
      },
    });

    if (expiredSubscription) {
      // Auto-update expired subscription
      await Subscription.update(expiredSubscription.id, {
        isActive: false,
      });
    }

    // Check if user has an active subscription with valid expiry date
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        isActive: true,
        expiryDate: { gte: currentDate },
      },
      include: { plan: true },
    });

    if (!subscription) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: 'Please subscribe to access this feature.',
      });
    }

    // Attach subscription to request for potential use in controllers
    req.subscription = subscription;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error in subscription verification',
    });
  }
};

module.exports = verifySubscription;

