/**
 * Middleware to check if user is superadmin
 * Must be used after authMiddleware
 */
const superadminMiddleware = async (req, res, next) => {
  try {
    // Check if user is authenticated (authMiddleware should have run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user is superadmin
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Superadmin privileges required.',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error in authorization',
    });
  }
};

module.exports = superadminMiddleware;

