/**
 * Middleware to check if user has a specific admin role
 * Must be used after authMiddleware
 */
const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated (authMiddleware should have run first)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      // SuperAdmin always has access to all workflow roles
      if (req.user.role === 'superadmin') {
        return next();
      }

      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.',
        });
      }

      // Check if user has the required adminRole
      if (!req.user.adminRole || !allowedRoles.includes(req.user.adminRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
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
};

/**
 * Middleware for Gatherer role
 */
const gathererMiddleware = roleMiddleware(['gatherer']);

/**
 * Middleware for Creator role
 */
const creatorMiddleware = roleMiddleware(['creator']);

/**
 * Middleware for Explainer role
 */
const explainerMiddleware = roleMiddleware(['explainer']);

/**
 * Middleware for Processor role
 */
const processorMiddleware = roleMiddleware(['processor']);

/**
 * Middleware for multiple roles (Gatherer, Creator, Explainer, Processor)
 */
const workflowRoleMiddleware = roleMiddleware(['gatherer', 'creator', 'explainer', 'processor']);

module.exports = {
  roleMiddleware,
  gathererMiddleware,
  creatorMiddleware,
  explainerMiddleware,
  processorMiddleware,
  workflowRoleMiddleware,
};

