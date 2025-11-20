/**
 * Middleware to check if user is admin (not superadmin)
 * Must be used after authMiddleware
 */
const adminMiddleware = async (req, res, next) => {
  try {
    // Check if user is authenticated (authMiddleware should have run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user is admin (not superadmin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
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

module.exports = adminMiddleware;

