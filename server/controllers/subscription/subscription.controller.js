const subscriptionService = require('../../services/subscription');

/**
 * Subscribe to a plan
 * POST /api/subscription/subscribe
 * Body: { planId }
 */
const subscribeToPlan = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'Plan ID is required',
      });
    }

    const subscription = await subscriptionService.subscribeToPlan(userId, planId);

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: {
        subscription: {
          id: subscription.id,
          userId: subscription.userId,
          userName: subscription.userName,
          planId: subscription.planId,
          planName: subscription.planName,
          startDate: subscription.startDate,
          expiryDate: subscription.expiryDate,
          paymentStatus: subscription.paymentStatus,
          isActive: subscription.isActive,
          transactionId: subscription.transactionId || null,
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
        },
      },
    });
  } catch (error) {
    if (error.message === 'Plan not found' || error.message === 'User not found' || error.message === 'This plan is not available for subscription') {
      return res.status(error.message === 'Plan not found' || error.message === 'User not found' ? 404 : 400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan ID',
      });
    }
    next(error);
  }
};

/**
 * Confirm payment
 * POST /api/subscription/payment/confirm
 * Body: { subscriptionId, transactionId }
 */
const confirmPayment = async (req, res, next) => {
  try {
    const { subscriptionId, transactionId } = req.body;
    const userId = req.user.id;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Subscription ID is required',
      });
    }

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required',
      });
    }

    const subscription = await subscriptionService.confirmPayment(userId, subscriptionId, transactionId);

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        subscription: {
          id: subscription.id,
          userId: subscription.userId,
          userName: subscription.userName,
          planId: subscription.planId,
          planName: subscription.planName,
          startDate: subscription.startDate,
          expiryDate: subscription.expiryDate,
          paymentStatus: subscription.paymentStatus,
          isActive: subscription.isActive,
          transactionId: subscription.transactionId,
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
        },
      },
    });
  } catch (error) {
    if (error.message === 'Subscription not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription ID',
      });
    }
    next(error);
  }
};

/**
 * Get my subscription
 * GET /api/subscription/me
 */
const getMySubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const subscription = await subscriptionService.getMySubscription(userId);

    res.status(200).json({
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          userId: subscription.userId,
          userName: subscription.userName,
          planId: subscription.planId,
          planName: subscription.planName,
          startDate: subscription.startDate,
          expiryDate: subscription.expiryDate,
          paymentStatus: subscription.paymentStatus,
          isActive: subscription.isActive,
          transactionId: subscription.transactionId,
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
        },
      },
    });
  } catch (error) {
    if (error.message === 'No subscription found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

module.exports = {
  subscribeToPlan,
  confirmPayment,
  getMySubscription,
};

