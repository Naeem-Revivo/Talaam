const express = require('express');
const router = express.Router();
const planService = require('../services/admin/plan');

// Public: get active plans (no auth required)
router.get('/plans', async (req, res, next) => {
  try {
    const plans = await planService.getAllPlans({ status: 'active' });
    return res.status(200).json({
      success: true,
      data: {
        plans: plans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          price: plan.price,
          duration: plan.duration,
          description: plan.description,
          status: plan.status,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        })),
      },
    });
  } catch (error) {
    console.error('[PUBLIC] GET /public/plans → error', error);
    next(error);
  }
});

module.exports = router;

