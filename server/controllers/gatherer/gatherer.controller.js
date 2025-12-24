const gathererService = require('../../services/gatherer');

/**
 * Get gatherer dashboard data
 * GET /api/gatherer/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    console.log('[GATHERER] GET /api/gatherer/dashboard → requested', { userId: req.user && req.user.id });
    
    const dashboardData = await gathererService.getGathererDashboard(req.user.id);

    const response = {
      success: true,
      data: {
        performance: dashboardData.performance,
        lastLogin: dashboardData.lastLogin,
        pendingTasks: dashboardData.pendingTasks,
      },
    };

    console.log('[GATHERER] GET /api/gatherer/dashboard → 200 (ok)', { userId: req.user.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[GATHERER] GET /api/gatherer/dashboard → error', error);
    if (error.message === 'User not found' || error.message === 'User is not a gatherer') {
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

