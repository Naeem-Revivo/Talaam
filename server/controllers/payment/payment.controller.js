const { moyassarService } = require('../../services/payment');
const Subscription = require('../../models/subscription');

/**
 * Initiate Moyassar payment for a subscription
 * POST /api/payment/moyassar/initiate
 * Body: { subscriptionId }
 */
const initiateMoyassarPayment = async (req, res, next) => {
  try {
    const { subscriptionId, success_url, back_url } = req.body;
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

    // If subscription already has a Moyassar payment ID and payment URL, return existing payment
    if (subscription.moyassarPaymentId && subscription.paymentUrl) {
      console.log('⚠️  Subscription already has payment initiated, returning existing payment URL');
      return res.status(200).json({
        success: true,
        message: 'Payment already initiated',
        data: {
          paymentId: subscription.moyassarPaymentId,
          paymentUrl: subscription.paymentUrl,
          subscription: {
            id: subscription.id,
            paymentStatus: subscription.paymentStatus,
            moyassarPaymentStatus: subscription.moyassarPaymentStatus,
          },
        },
      });
    }

    // Create payment with Moyassar
    const paymentResult = await moyassarService.createSubscriptionPayment(subscriptionId, {
      success_url,
      back_url,
    });

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

    // Check if webhook was processed successfully
    if (result.success === false && result.message) {
      // Webhook received but couldn't process (e.g., subscription not found)
      // Still return 200 to prevent Moyassar from retrying
      // Payment will be synced when user returns from payment page
      console.log('⚠️  Webhook received but not fully processed:', result.message);
      return res.status(200).json({
        success: true,
        message: 'Webhook received. Payment will be synced on user return.',
        data: result,
      });
    }

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
    // Payment can still be synced when user returns from payment page
    res.status(200).json({
      success: false,
      message: 'Webhook received but processing failed. Payment will be synced on user return.',
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
    const { sync = 'false' } = req.query; // Optional sync parameter

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

    let paymentDetails = null;
    let wasSynced = false;

    // If payment was initiated with Moyassar, get latest status
    if (subscription.moyassarPaymentId) {
      try {
        const paymentResult = await moyassarService.verifyPayment(subscription.moyassarPaymentId);
        paymentDetails = paymentResult.payment;

        // If sync is requested and payment is paid in Moyassar but not in DB, sync it
        if (sync === 'true' || sync === true) {
          const syncResult = await moyassarService.syncPaymentStatus(subscriptionId);
          if (syncResult.wasUpdated) {
            wasSynced = true;
            // Re-fetch subscription to get updated status
            const updatedSubscription = await prisma.subscription.findFirst({
              where: { id: subscriptionId },
            });
            return res.status(200).json({
              success: true,
              message: 'Payment status synced successfully',
              data: {
                subscription: {
                  id: updatedSubscription.id,
                  paymentStatus: updatedSubscription.paymentStatus,
                  isActive: updatedSubscription.isActive,
                  moyassarPaymentStatus: updatedSubscription.moyassarPaymentStatus,
                  paymentUrl: updatedSubscription.paymentUrl,
                  transactionId: updatedSubscription.transactionId,
                },
                payment: paymentDetails,
                synced: true,
              },
            });
          }
        }
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
        synced: wasSynced,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle payment callback after user returns from Moyassar
 * GET /api/payment/moyassar/callback?subscriptionId=xxx&paymentId=xxx
 * Note: This endpoint should be accessible without auth since Moyassar redirects here
 */
const handlePaymentCallback = async (req, res, next) => {
  try {
    const { subscriptionId, paymentId, id, status, success_url, back_url } = req.query;
    
    // Get payment/invoice ID from query (Moyassar may send it as 'id')
    const moyassarPaymentId = paymentId || id;

    if (!subscriptionId && !moyassarPaymentId) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/dashboard/subscription-billings?error=missing_params`);
    }

    // If we have payment ID but no subscription ID, try to find subscription by payment ID
    let finalSubscriptionId = subscriptionId;
    if (!finalSubscriptionId && moyassarPaymentId) {
      const { prisma } = require('../../config/db/prisma');
      const subscription = await prisma.subscription.findFirst({
        where: {
          OR: [
            { moyassarPaymentId: moyassarPaymentId },
            { transactionId: moyassarPaymentId }
          ]
        },
      });
      if (subscription) {
        finalSubscriptionId = subscription.id;
      }
    }

    if (!finalSubscriptionId) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/dashboard/subscription-billings?error=subscription_not_found`);
    }

    // Sync payment status immediately
    console.log('🔄 Syncing payment status on callback:', { subscriptionId: finalSubscriptionId, moyassarPaymentId });
    const syncResult = await moyassarService.syncPaymentStatus(finalSubscriptionId);

    // Get success_url and back_url from query params (passed from payment initiation via callback URL)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const defaultSuccessUrl = `${frontendUrl}/moyassar-payment?subscriptionId=${finalSubscriptionId}&payment=success`;
    const defaultBackUrl = `${frontendUrl}/dashboard/subscription-billings`;
    
    // Check if payment was successful
    if (syncResult.wasUpdated && syncResult.subscription.paymentStatus === 'Paid') {
      // Payment successful - use success_url from query params if available, otherwise default
      const successUrl = success_url ? decodeURIComponent(success_url) : defaultSuccessUrl;
      return res.redirect(successUrl);
    } else {
      // Payment still pending or failed - check if user cancelled (back_url)
      // Moyassar may send a status parameter indicating cancellation
      if (status === 'cancelled' || status === 'canceled' || req.query.cancelled === 'true') {
        const backUrl = back_url ? decodeURIComponent(back_url) : defaultBackUrl;
        return res.redirect(`${backUrl}?payment=cancelled`);
      }
      
      // Payment pending or failed - redirect to default success URL with status
      const paymentStatus = syncResult.subscription?.paymentStatus || 'pending';
      return res.redirect(`${frontendUrl}/moyassar-payment?subscriptionId=${finalSubscriptionId}&payment=${paymentStatus.toLowerCase()}`);
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/dashboard/subscription-billings?error=callback_failed`);
  }
};

module.exports = {
  initiateMoyassarPayment,
  verifyMoyassarPayment,
  handleMoyassarWebhook,
  getPaymentStatus,
  handlePaymentCallback,
};

