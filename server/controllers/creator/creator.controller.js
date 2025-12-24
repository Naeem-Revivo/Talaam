const creatorService = require('../../services/creator');

/**
 * Get creator dashboard data
 * GET /api/creator/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    console.log('[CREATOR] GET /api/creator/dashboard → requested', { userId: req.user && req.user.id });
    
    const dashboardData = await creatorService.getCreatorDashboard(req.user.id);

    const response = {
      success: true,
      data: {
        performance: dashboardData.performance,
        lastLogin: dashboardData.lastLogin,
        pendingTasks: dashboardData.pendingTasks,
      },
    };

    console.log('[CREATOR] GET /api/creator/dashboard → 200 (ok)', { userId: req.user.id });
    res.status(200).json(response);
  } catch (error) {
    console.error('[CREATOR] GET /api/creator/dashboard → error', error);
    if (error.message === 'User not found' || error.message === 'User is not a creator') {
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

