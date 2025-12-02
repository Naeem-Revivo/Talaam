const { moyassarService } = require('../../services/payment');
const Subscription = require('../../models/subscription');

/**
 * Initiate Moyassar payment for a subscription
 * POST /api/payment/moyassar/initiate
 * Body: { subscriptionId }
 */
const initiateMoyassarPayment = async (req, res, next) => {
  try {
    const { subscriptionId } = req.body;
    const userId = req.user.id;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Subscription ID is required',
      });
    }

    // Verify subscription belongs to user
    const { prisma } = require('../../config/db/prisma');
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: userId,
      },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    if (subscription.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Subscription is already paid',
      });
    }

    // Create payment with Moyassar
    const paymentResult = await moyassarService.createSubscriptionPayment(subscriptionId);

    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        paymentId: paymentResult.paymentId,
        paymentUrl: paymentResult.paymentUrl,
        subscription: {
          id: paymentResult.subscription.id,
          paymentStatus: paymentResult.subscription.paymentStatus,
          moyassarPaymentStatus: paymentResult.subscription.moyassarPaymentStatus,
        },
      },
    });
  } catch (error) {
    if (error.message === 'Subscription not found' || 
        error.message === 'Subscription is already paid' ||
        error.message === 'Plan not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Verify Moyassar payment status
 * POST /api/payment/moyassar/verify
 * Body: { paymentId, subscriptionId }
 */
const verifyMoyassarPayment = async (req, res, next) => {
  try {
    const { paymentId, subscriptionId } = req.body;
    const userId = req.user.id;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required',
      });
    }

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Subscription ID is required',
      });
    }

    // Verify subscription belongs to user
    const { prisma } = require('../../config/db/prisma');
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: userId,
      },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    // Process payment
    const result = await moyassarService.processPayment(paymentId, subscriptionId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          subscription: {
            id: result.subscription.id,
            paymentStatus: result.subscription.paymentStatus,
            isActive: result.subscription.isActive,
            transactionId: result.subscription.transactionId,
            moyassarPaymentStatus: result.subscription.moyassarPaymentStatus,
          },
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        data: {
          subscription: {
            id: result.subscription.id,
            paymentStatus: result.subscription.paymentStatus,
            moyassarPaymentStatus: result.subscription.moyassarPaymentStatus,
          },
        },
      });
    }
  } catch (error) {
    if (error.message === 'Subscription not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Handle Moyassar webhook
 * POST /api/payment/moyassar/webhook
 * This endpoint receives payment status updates from Moyassar
 */
const handleMoyassarWebhook = async (req, res, next) => {
  try {
    // Get webhook data from request body
    const webhookData = req.body;

    // Log webhook headers and body for debugging
    console.log('🔔 Moyassar webhook received');
    console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Body:', JSON.stringify(webhookData, null, 2));

    // Process webhook
    const result = await moyassarService.handleWebhook(webhookData);

    // Return 200 to acknowledge receipt
    console.log('✅ Webhook processed successfully, returning 200');
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      data: result,
    });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
    
    // Still return 200 to prevent Moyassar from retrying
    // But log the error for investigation
    res.status(200).json({
      success: false,
      message: 'Webhook received but processing failed',
      error: error.message,
    });
  }
};

/**
 * Get payment status
 * GET /api/payment/moyassar/status/:subscriptionId
 */
const getPaymentStatus = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.id;

    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId: userId,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    let paymentDetails = null;

    // If payment was initiated with Moyassar, get latest status
    if (subscription.moyassarPaymentId) {
      try {
        const paymentResult = await moyassarService.verifyPayment(subscription.moyassarPaymentId);
        paymentDetails = paymentResult.payment;
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          paymentStatus: subscription.paymentStatus,
          isActive: subscription.isActive,
          moyassarPaymentStatus: subscription.moyassarPaymentStatus,
          paymentUrl: subscription.paymentUrl,
          transactionId: subscription.transactionId,
        },
        payment: paymentDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initiateMoyassarPayment,
  verifyMoyassarPayment,
  handleMoyassarWebhook,
  getPaymentStatus,
};

