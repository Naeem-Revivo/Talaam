const explainerService = require('../../services/explainer');

/**
 * Get explainer dashboard data
 * GET /api/explainer/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    console.log('[EXPLAINER] GET /api/explainer/dashboard → requested', { userId: req.user && req.user.id });
    
    const dashboardData = await explainerService.getExplainerDashboard(req.user.id);

    const response = {
      success: true,
      data: {
        performance: dashboardData.performance,
        lastLogin: dashboardData.lastLogin,
        pendingTasks: dashboardData.pendingTasks,
      },
    };

    console.log('[EXPLAINER] GET /api/explainer/dashboard → 200 (ok)', { userId: req.user.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[EXPLAINER] GET /api/explainer/dashboard → error', error);
    if (error.message === 'User not found' || error.message === 'User is not an explainer') {
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

