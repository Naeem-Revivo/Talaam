const Plan = require('../../../models/plan');

/**
 * Create plan
 */
const createPlan = async (planData) => {
  return await Plan.create(planData);
};

/**
 * Get all plans
 */
const getAllPlans = async (filter = {}) => {
  return await Plan.find(filter).sort({ createdAt: -1 });
};

/**
 * Find plan by ID
 */
const findPlanById = async (planId) => {
  return await Plan.findById(planId);
};

/**
 * Update plan
 */
const updatePlan = async (plan, updateData) => {
  if (updateData.name !== undefined) {
    plan.name = updateData.name;
  }
  if (updateData.price !== undefined) {
    plan.price = updateData.price;
  }
  if (updateData.duration !== undefined) {
    plan.duration = updateData.duration;
  }
  if (updateData.description !== undefined) {
    plan.description = updateData.description;
  }
  if (updateData.status !== undefined) {
    plan.status = updateData.status;
  }
  return await plan.save();
};

/**
 * Delete plan
 */
const deletePlan = async (planId) => {
  return await Plan.findByIdAndDelete(planId);
};

module.exports = {
  createPlan,
  getAllPlans,
  findPlanById,
  updatePlan,
  deletePlan,
};

