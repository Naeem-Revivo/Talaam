const processorService = require('../../services/processor');

/**
 * Get processor dashboard data
 * GET /api/processor/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    console.log('[PROCESSOR] GET /api/processor/dashboard → requested', { userId: req.user && req.user.id });
    
    const dashboardData = await processorService.getProcessorDashboard(req.user.id);

    const response = {
      success: true,
      data: {
        performance: dashboardData.performance,
        lastLogin: dashboardData.lastLogin,
        pendingTasks: dashboardData.pendingTasks,
      },
    };

    console.log('[PROCESSOR] GET /api/processor/dashboard → 200 (ok)', { userId: req.user.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[PROCESSOR] GET /api/processor/dashboard → error', error);
    if (error.message === 'User not found' || error.message === 'User is not a processor') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

module.exports = {
  getDashboard,
};

