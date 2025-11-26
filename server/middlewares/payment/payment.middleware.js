const crypto = require('crypto');
const { MOYASSAR_CONFIG } = require('../../config/moyassar');

/**
 * Verify Moyassar webhook signature
 * Note: Moyassar may send webhooks with signatures for verification
 * This middleware verifies the webhook authenticity
 */
const verifyMoyassarWebhook = (req, res, next) => {
  try {
    // If webhook secret is configured, verify signature
    if (MOYASSAR_CONFIG.webhookSecret) {
      const signature = req.headers['x-moyassar-signature'] || 
                       req.headers['moyassar-signature'] ||
                       req.headers['signature'];

      if (!signature) {
        console.warn('⚠️  Webhook signature missing');
        // Continue anyway - some webhook implementations don't use signatures
        return next();
      }

      // Create expected signature
      const payload = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', MOYASSAR_CONFIG.webhookSecret)
        .update(payload)
        .digest('hex');

      // Compare signatures
      if (signature !== expectedSignature) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({
          success: false,
          message: 'Invalid webhook signature',
        });
      }
    }

    next();
  } catch (error) {
    console.error('Webhook verification error:', error);
    next(error);
  }
};

/**
 * Validate payment initiation request
 */
const validatePaymentRequest = (req, res, next) => {
  const { subscriptionId } = req.body;

  if (!subscriptionId) {
    return res.status(400).json({
      success: false,
      message: 'Subscription ID is required',
    });
  }

  next();
};

module.exports = {
  verifyMoyassarWebhook,
  validatePaymentRequest,
};

