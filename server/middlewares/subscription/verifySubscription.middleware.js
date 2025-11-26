const Subscription = require('../../models/subscription');
const subscriptionService = require('../../services/subscription');

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
    const expiredSubscription = await Subscription.findOne({
      userId,
      isActive: true,
      expiryDate: { $lt: currentDate },
    });

    if (expiredSubscription) {
      // Auto-update expired subscription
      expiredSubscription.isActive = false;
      await expiredSubscription.save();
    }

    // Check if user has an active subscription with valid expiry date
    const subscription = await Subscription.findOne({
      userId,
      isActive: true,
      expiryDate: { $gte: currentDate },
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

