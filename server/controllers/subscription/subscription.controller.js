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
    const userId = req.user?.id;
    
    if (!userId) {
      console.error('❌ No user ID in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    console.log('📞 GET /api/subscription/me - User ID:', userId);
    const subscription = await subscriptionService.getMySubscription(userId);

    console.log('✅ Subscription found, returning response');
    // Prevent cache revalidation responses (304) for subscription state.
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    });
    res.status(200).json({
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          userId: subscription.userId,
          userName: subscription.userName,
          planId: subscription.planId,
          planName: subscription.planName,
          planDuration: subscription.plan?.duration || null,
          startDate: subscription.startDate,
          expiryDate: subscription.expiryDate,
          paymentStatus: subscription.paymentStatus,
          isActive: subscription.isActive,
          transactionId: subscription.transactionId,
          moyassarPaymentId: subscription.moyassarPaymentId || null,
          moyassarPaymentStatus: subscription.moyassarPaymentStatus || null,
          paymentUrl: subscription.paymentUrl || null,
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('❌ Error in getMySubscription controller:', error);
    if (error.message === 'No subscription found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Get my billing history
 * GET /api/subscription/billing-history
 */
const getMyBillingHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const billingHistory = await subscriptionService.getMyBillingHistory(userId);

    res.status(200).json({
      success: true,
      data: {
        billingHistory,
        total: billingHistory.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel subscription
 * POST /api/subscription/cancel/:subscriptionId
 */
const cancelSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.id;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Subscription ID is required',
      });
    }

    const subscription = await subscriptionService.cancelSubscription(userId, subscriptionId);

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: {
        subscription: {
          id: subscription.id,
          userId: subscription.userId,
          planName: subscription.planName,
          paymentStatus: subscription.paymentStatus,
          isActive: subscription.isActive,
          updatedAt: subscription.updatedAt,
        },
      },
    });
  } catch (error) {
    if (error.message === 'Subscription not found' || error.message === 'Unauthorized: This subscription does not belong to you' || error.message === 'Subscription is already cancelled') {
      return res.status(error.message.includes('Unauthorized') ? 403 : 404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Renew subscription
 * POST /api/subscription/renew/:subscriptionId
 */
const renewSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.id;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Subscription ID is required',
      });
    }

    const renewalSubscription = await subscriptionService.renewSubscription(userId, subscriptionId);

    res.status(201).json({
      success: true,
      message: 'Subscription renewal created successfully. Please complete payment.',
      data: {
        subscription: {
          id: renewalSubscription.id,
          userId: renewalSubscription.userId,
          planId: renewalSubscription.planId,
          planName: renewalSubscription.planName,
          startDate: renewalSubscription.startDate,
          expiryDate: renewalSubscription.expiryDate,
          paymentStatus: renewalSubscription.paymentStatus,
          isActive: renewalSubscription.isActive,
          createdAt: renewalSubscription.createdAt,
        },
      },
    });
  } catch (error) {
    if (error.message === 'Subscription not found' || error.message === 'Unauthorized: This subscription does not belong to you' || error.message === 'Only active paid subscriptions can be renewed') {
      return res.status(error.message.includes('Unauthorized') ? 403 : error.message.includes('Only active') ? 400 : 404).json({
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
  getMyBillingHistory,
  cancelSubscription,
  renewSubscription,
};

