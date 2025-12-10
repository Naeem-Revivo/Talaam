const express = require('express');
const router = express.Router();
const subscriptionController = require('../../controllers/subscription');
const { authMiddleware } = require('../../middlewares/auth');
const { verifySubscription } = require('../../middlewares/subscription');

// All routes require authentication
router.use(authMiddleware);

// Subscription routes
router.post('/subscribe', subscriptionController.subscribeToPlan);
router.post('/payment/confirm', subscriptionController.confirmPayment);
router.get('/me', subscriptionController.getMySubscription);
router.get('/billing-history', subscriptionController.getMyBillingHistory);

// Example protected route using verifySubscription middleware
router.get('/exam/:id', verifySubscription, (req, res) => {
  res.send('Exam data...');
});

module.exports = router;

