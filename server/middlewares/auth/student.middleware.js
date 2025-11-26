/**
 * Middleware to check if user is a student
 * Must be used after authMiddleware
 */
const studentMiddleware = async (req, res, next) => {
  try {
    // Check if user is authenticated (authMiddleware should have run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Student privileges required.',
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

module.exports = studentMiddleware;


