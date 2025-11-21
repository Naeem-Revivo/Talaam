const express = require('express');
const router = express.Router();
const examController = require('../../controllers/admin/exam.controller');
const { authMiddleware, superadminMiddleware, adminOrSuperadminMiddleware } = require('../../middlewares/auth');

// Custom validation middleware for creating exam
const validateCreateExam = (req, res, next) => {
  const { name, status, type } = req.body;
  
  const errors = [];
  
  // Validate name
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({
      field: 'name',
      message: 'Exam name is required',
    });
  }
  
  // Validate status
  if (status && !['active', 'inactive'].includes(status)) {
    errors.push({
      field: 'status',
      message: 'Status must be either active or inactive',
    });
  }

  // Validate type
  if (!type || typeof type !== 'string') {
    errors.push({
      field: 'type',
      message: 'Exam type is required',
    });
  } else {
    const normalizedType = type.trim().toLowerCase();
    if (!['tahsely', 'qudrat'].includes(normalizedType)) {
      errors.push({
        field: 'type',
        message: 'Exam type must be either tahsely or qudrat',
      });
    } else {
      req.body.type = normalizedType;
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
  if (status) {
    req.body.status = status;
  }
  
  next();
};

// Custom validation middleware for updating exam
const validateUpdateExam = (req, res, next) => {
  const { name, status, type } = req.body;
  
  const errors = [];
  
  // Validate name if provided
  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    errors.push({
      field: 'name',
      message: 'Exam name cannot be empty',
    });
  }
  
  // Validate status if provided
  if (status !== undefined && !['active', 'inactive'].includes(status)) {
    errors.push({
      field: 'status',
      message: 'Status must be either active or inactive',
    });
  }

  // Validate type if provided
  if (type !== undefined) {
    if (typeof type !== 'string' || !type.trim()) {
      errors.push({
        field: 'type',
        message: 'Exam type cannot be empty',
      });
    } else {
      const normalizedType = type.trim().toLowerCase();
      if (!['tahsely', 'qudrat'].includes(normalizedType)) {
        errors.push({
          field: 'type',
          message: 'Exam type must be either tahsely or qudrat',
        });
      } else {
        req.body.type = normalizedType;
      }
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
  if (name !== undefined) {
    req.body.name = name.trim();
  }
  if (status !== undefined) {
    req.body.status = status;
  }
  
  next();
};

// Routes
// Create, Update, Delete - Only superadmin
router.post(
  '/',
  authMiddleware,
  superadminMiddleware,
  validateCreateExam,
  examController.createExam
);

// View - Both admin and superadmin
router.get(
  '/',
  authMiddleware,
  adminOrSuperadminMiddleware,
  examController.getAllExams
);

router.get(
  '/:examId',
  authMiddleware,
  adminOrSuperadminMiddleware,
  examController.getExamById
);

// Update, Delete - Only superadmin
router.put(
  '/:examId',
  authMiddleware,
  superadminMiddleware,
  validateUpdateExam,
  examController.updateExam
);

router.delete(
  '/:examId',
  authMiddleware,
  superadminMiddleware,
  examController.deleteExam
);

module.exports = router;

