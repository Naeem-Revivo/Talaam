const planService = require('../../services/admin');
const Subscription = require('../../models/subscription');

/**
 * Create plan
 * Only superadmin can create plans
 */
const createPlan = async (req, res, next) => {
  try {
    const { name, price, duration, description, status } = req.body;

    console.log('[PLAN] POST /admin/plans → requested', {
      name,
      price,
      duration,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can create plans
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can create plans',
      });
    }

    // Create plan
    const planData = {
      name: name.trim(),
      price: parseFloat(price),
      duration: duration.trim(),
      description: description ? description.trim() : '',
      status: status.trim().toLowerCase(),
    };

    const plan = await planService.createPlan(planData);

    const response = {
      success: true,
      message: 'Plan created successfully',
      data: {
        plan: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          duration: plan.duration,
          description: plan.description,
          status: plan.status,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        },
      },
    };

    console.log('[PLAN] POST /admin/plans → 201 (created)', { planId: plan.id });
    res.status(201).json(response);
  } catch (error) {
    console.error('[PLAN] POST /admin/plans → error', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }
    if (error.name === 'DuplicatePlanName') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: [
          {
            field: error.field || 'name',
            message: 'Plan name already exists. Please choose a different name.',
          },
        ],
      });
    }
    // Handle Prisma unique constraint errors (if database has unique constraint)
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: [
          {
            field: 'name',
            message: 'Plan name already exists. Please choose a different name.',
          },
        ],
      });
    }
    next(error);
  }
};

/**
 * Get all plans
 * All admin roles and students can access this
 * Non-superadmin users only see active plans
 */
const getAllPlans = async (req, res, next) => {
  try {
    console.log('[PLAN] GET /admin/plans → requested', { requestedBy: req.user.id });

    const filter = {};

    // Superadmin can see all plans (with optional status filter)
    // Non-superadmin users (admins and students) only see active plans
    if (req.user.role === 'superadmin') {
      const { status } = req.query;
      if (status) {
        filter.status = status;
      }
    } else {
      // Only show active plans for non-superadmin users
      filter.status = 'active';
    }

    const plans = await planService.getAllPlans(filter);

    // For superadmin, include subscriber count for each plan
    let plansWithSubscribers = plans;
    if (req.user.role === 'superadmin') {
      plansWithSubscribers = await Promise.all(
        plans.map(async (plan) => {
          const { prisma } = require('../../config/db/prisma');
          const subscriberCount = await prisma.subscription.count({
            where: {
              planId: plan.id,
            },
          });
          return {
            ...plan,
            subscriberCount,
          };
        })
      );
    }

    const response = {
      success: true,
      data: {
        plans: plansWithSubscribers.map((plan) => ({
          id: plan.id,
          name: plan.name,
          price: plan.price,
          duration: plan.duration,
          description: plan.description,
          status: plan.status,
          subscriberCount: plan.subscriberCount || 0,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        })),
      },
    };

    console.log('[PLAN] GET /admin/plans → 200 (ok)', { count: plans.length });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PLAN] GET /admin/plans → error', error);
    next(error);
  }
};

/**
 * Get single plan by ID
 * All admin roles and students can access this
 * Non-superadmin users can only access active plans
 */
const getPlanById = async (req, res, next) => {
  try {
    const { planId } = req.params;

    console.log('[PLAN] GET /admin/plans/:planId → requested', {
      planId,
      requestedBy: req.user.id,
    });

    const plan = await planService.findPlanById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Non-superadmin users can only access active plans
    if (req.user.role !== 'superadmin' && plan.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    const response = {
      success: true,
      data: {
        plan: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          duration: plan.duration,
          description: plan.description,
          status: plan.status,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
        },
      },
    };

    console.log('[PLAN] GET /admin/plans/:planId → 200 (ok)', { planId: plan.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PLAN] GET /admin/plans/:planId → error', error);
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
 * Update plan
 * Only superadmin can update plans
 */
const updatePlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { name, price, duration, description, status } = req.body;

    console.log('[PLAN] PUT /admin/plans/:planId → requested', {
      planId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can update plans
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update plans',
      });
    }

    const plan = await planService.findPlanById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Update plan
    const updateData = {};
    if (name !== undefined) {
      updateData.name = name.trim();
    }
    if (price !== undefined) {
      updateData.price = parseFloat(price);
    }
    if (duration !== undefined) {
      updateData.duration = duration.trim();
    }
    if (description !== undefined) {
      updateData.description = description.trim();
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    const updatedPlan = await planService.updatePlan(plan, updateData);

    const response = {
      success: true,
      message: 'Plan updated successfully',
      data: {
        plan: {
          id: updatedPlan.id,
          name: updatedPlan.name,
          price: updatedPlan.price,
          duration: updatedPlan.duration,
          description: updatedPlan.description,
          status: updatedPlan.status,
          createdAt: updatedPlan.createdAt,
          updatedAt: updatedPlan.updatedAt,
        },
      },
    };

    console.log('[PLAN] PUT /admin/plans/:planId → 200 (updated)', { planId: updatedPlan.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PLAN] PUT /admin/plans/:planId → error', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
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
 * Update plan status
 * Only superadmin can update plan status
 */
const updatePlanStatus = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { status } = req.body;

    console.log('[PLAN] PUT /admin/plans/:planId/status → requested', {
      planId,
      status,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can update plan status
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can update plan status',
      });
    }

    const plan = await planService.findPlanById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    // Update status
    const updateData = { status };
    const updatedPlan = await planService.updatePlan(plan, updateData);

    const response = {
      success: true,
      message: 'Plan status updated successfully',
      data: {
        plan: {
          id: updatedPlan.id,
          name: updatedPlan.name,
          status: updatedPlan.status,
          updatedAt: updatedPlan.updatedAt,
        },
      },
    };

    console.log('[PLAN] PUT /admin/plans/:planId/status → 200 (status updated)', {
      planId: updatedPlan.id,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PLAN] PUT /admin/plans/:planId/status → error', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err) => ({
          field: err.path,
          message: err.message,
        })),
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
 * Delete plan
 * Only superadmin can delete plans
 */
const deletePlan = async (req, res, next) => {
  try {
    const { planId } = req.params;

    console.log('[PLAN] DELETE /admin/plans/:planId → requested', {
      planId,
      requestedBy: req.user.id,
      requesterRole: req.user.role,
    });

    // Ensure only superadmin can delete plans
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only superadmin can delete plans',
      });
    }

    const plan = await planService.findPlanById(planId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }

    await planService.deletePlan(planId);

    const response = {
      success: true,
      message: 'Plan deleted successfully',
      data: {
        plan: {
          id: plan.id,
          name: plan.name,
        },
      },
    };

    console.log('[PLAN] DELETE /admin/plans/:planId → 200 (deleted)', { planId: plan.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PLAN] DELETE /admin/plans/:planId → error', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan ID',
      });
    }
    next(error);
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  updatePlanStatus,
  deletePlan,
};

