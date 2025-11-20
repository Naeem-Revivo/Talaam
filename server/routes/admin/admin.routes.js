const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin');
const { authMiddleware, superadminMiddleware } = require('../../middlewares/auth');

// Custom validation middleware for creating admin
const validateCreateAdmin = (req, res, next) => {
  const { name, email, password, status, adminRole } = req.body;
  
  const errors = [];
  
  // Validate name
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({
      field: 'name',
      message: 'Name is required',
    });
  }
  
  // Validate email
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push({
      field: 'email',
      message: 'Email is required',
    });
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push({
        field: 'email',
        message: 'Please provide a valid email',
      });
    }
  }
  
  // Validate password (optional, but if provided must be at least 6 characters)
  if (password && (typeof password !== 'string' || password.length < 6)) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters',
    });
  }
  
  // Validate status
  if (status && !['active', 'suspended'].includes(status)) {
    errors.push({
      field: 'status',
      message: 'Status must be either active or suspended',
    });
  }
  
  // Validate adminRole (workflow role)
  if (!adminRole || typeof adminRole !== 'string' || !adminRole.trim()) {
    errors.push({
      field: 'adminRole',
      message: 'Workflow role is required',
    });
  } else {
    const validAdminRoles = ['gatherer', 'creator', 'explainer', 'processor'];
    if (!validAdminRoles.includes(adminRole.trim())) {
      errors.push({
        field: 'adminRole',
        message: 'Workflow role must be one of: gatherer, creator, explainer, processor',
      });
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
  
  // Trim and set values
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.adminRole = adminRole.trim();
  if (status) {
    req.body.status = status;
  }
  
  next();
};

// Custom validation middleware for updating user status
const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  
  if (!status || typeof status !== 'string' || !status.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          field: 'status',
          message: 'Status is required',
        },
      ],
    });
  }
  
  const trimmedStatus = status.trim().toLowerCase();
  if (!['active', 'suspended'].includes(trimmedStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          field: 'status',
          message: 'Status must be either active or suspended',
        },
      ],
    });
  }
  
  req.body.status = trimmedStatus;
  next();
};

// Routes (all require superadmin access)
router.get('/users', authMiddleware, superadminMiddleware, adminController.getAllAdmins);
router.post(
  '/create',
  authMiddleware,
  superadminMiddleware,
  validateCreateAdmin,
  adminController.createAdmin
);
router.put(
  '/status/:userId',
  authMiddleware,
  superadminMiddleware,
  validateUpdateStatus,
  adminController.updateUserStatus
);

// Import exam routes
const examRoutes = require('./exam.routes');

// Use exam routes
router.use('/exams', examRoutes);

// Import subject routes
const subjectRoutes = require('./subject.routes');

// Use subject routes
router.use('/subjects', subjectRoutes);

// Import topic routes
const topicRoutes = require('./topic.routes');

// Use topic routes
router.use('/topics', topicRoutes);

// Import question routes
const questionRoutes = require('./question.routes');

// Use question routes
router.use('/questions', questionRoutes);

module.exports = router;

