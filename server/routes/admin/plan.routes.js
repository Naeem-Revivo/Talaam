const express = require('express');
const router = express.Router();
const planController = require('../../controllers/admin/plan.controller');
const { authMiddleware, superadminMiddleware } = require('../../middlewares/auth');
const { validateCreatePlan, validateUpdatePlan, validateUpdatePlanStatus } = require('../../middlewares/admin');

// Routes
// Create - Only superadmin
router.post(
  '/',
  authMiddleware,
  superadminMiddleware,
  validateCreatePlan,
  planController.createPlan
);

// View - All admin roles and students
router.get(
  '/',
  authMiddleware,
  planController.getAllPlans
);

router.get(
  '/:planId',
  authMiddleware,
  planController.getPlanById
);

// Update - Only superadmin
router.put(
  '/:planId',
  authMiddleware,
  superadminMiddleware,
  validateUpdatePlan,
  planController.updatePlan
);

// Update Status - Only superadmin
router.put(
  '/:planId/status',
  authMiddleware,
  superadminMiddleware,
  validateUpdatePlanStatus,
  planController.updatePlanStatus
);

// Delete - Only superadmin
router.delete(
  '/:planId',
  authMiddleware,
  superadminMiddleware,
  planController.deletePlan
);

module.exports = router;

