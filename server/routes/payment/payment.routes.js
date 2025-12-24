const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment');
const { authMiddleware } = require('../../middlewares/auth');
const { verifyMoyassarWebhook, validatePaymentRequest } = require('../../middlewares/payment');

// Public route for webhook (no auth, but signature verified)
router.post(
  '/moyassar/webhook',
  verifyMoyassarWebhook,
  paymentController.handleMoyassarWebhook
);

// Protected routes (require authentication)
router.use(authMiddleware);

// Initiate payment
router.post(
  '/moyassar/initiate',
  validatePaymentRequest,
  paymentController.initiateMoyassarPayment
);

// Verify payment
router.post('/moyassar/verify', paymentController.verifyMoyassarPayment);

// Get payment status
router.get('/moyassar/status/:subscriptionId', paymentController.getPaymentStatus);

// Payment callback (after user returns from Moyassar)
// Note: This should be public (no auth) since Moyassar redirects here
router.get('/moyassar/callback', paymentController.handlePaymentCallback);

module.exports = router;

