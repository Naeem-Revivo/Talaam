const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment');
const { authMiddleware } = require('../../middlewares/auth');
const { verifyMoyassarWebhook, validatePaymentRequest } = require('../../middlewares/payment');

// Test route to verify payment routes are loading
router.get('/test', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Payment routes are working',
    path: '/api/payment/test'
  });
});

// Public routes (no auth required)
// Webhook route (signature verified)
router.post(
  '/moyassar/webhook',
  verifyMoyassarWebhook,
  paymentController.handleMoyassarWebhook
);

// Payment callback (after user returns from Moyassar)
// Note: This should be public (no auth) since Moyassar redirects here
router.get('/moyassar/callback', paymentController.handlePaymentCallback);

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

module.exports = router;

