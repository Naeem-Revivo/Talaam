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
  return await Plan.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' }
  });
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
  const updateDataFiltered = {};
  if (updateData.name !== undefined) {
    updateDataFiltered.name = updateData.name;
  }
  if (updateData.price !== undefined) {
    updateDataFiltered.price = updateData.price;
  }
  if (updateData.duration !== undefined) {
    updateDataFiltered.duration = updateData.duration;
  }
  if (updateData.description !== undefined) {
    updateDataFiltered.description = updateData.description;
  }
  if (updateData.status !== undefined) {
    updateDataFiltered.status = updateData.status;
  }
  return await Plan.update(plan.id, updateDataFiltered);
};

/**
 * Delete plan
 */
const deletePlan = async (planId) => {
  return await Plan.delete(planId);
};

module.exports = {
  createPlan,
  getAllPlans,
  findPlanById,
  updatePlan,
  deletePlan,
};

