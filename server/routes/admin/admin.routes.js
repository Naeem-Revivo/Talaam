const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin');
const { authMiddleware, superadminMiddleware } = require('../../middlewares/auth');

// Custom validation middleware for changing admin role
const validateChangeAdminRole = (req, res, next) => {
  const { adminRole } = req.body;
  const validAdminRoles = ['gatherer', 'creator', 'explainer', 'processor', 'admin'];
  
  console.log('[DEBUG] Request body:', JSON.stringify(req.body, null, 2));
  console.log('[DEBUG] adminRole value:', adminRole);
  
  // Check if adminRole exists
  if (!adminRole) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          field: 'adminRole',
          message: 'adminRole is required',
        },
      ],
    });
  }
  
  // Check if adminRole is a string
  if (typeof adminRole !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          field: 'adminRole',
          message: 'adminRole must be a string',
        },
      ],
    });
  }
  
  // Check if adminRole is not empty after trimming
  const trimmedRole = adminRole.trim();
  if (!trimmedRole) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          field: 'adminRole',
          message: 'adminRole cannot be empty',
        },
      ],
    });
  }
  
  // Check if adminRole is in the valid list
  if (!validAdminRoles.includes(trimmedRole)) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          field: 'adminRole',
          message: 'adminRole must be one of: gatherer, creator, explainer, processor, admin',
        },
      ],
    });
  }
  
  // Set the trimmed value back to req.body for the controller
  req.body.adminRole = trimmedRole;
  next();
};

// Routes (all require superadmin access)
router.get('/users', authMiddleware, superadminMiddleware, adminController.getAllAdmins);
router.put(
  '/role/:userId',
  authMiddleware,
  superadminMiddleware,
  validateChangeAdminRole,
  adminController.changeAdminRole
);

module.exports = router;

