const express = require('express');
const router = express.Router();
const subjectController = require('../../controllers/admin/subject.controller');
const { authMiddleware, superadminMiddleware, adminOrSuperadminMiddleware } = require('../../middlewares/auth');

// Custom validation middleware for creating subject
const validateCreateSubject = (req, res, next) => {
  const { name } = req.body;
  
  const errors = [];
  
  // Validate name
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({
      field: 'name',
      message: 'Subject name is required',
    });
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
  
  next();
};

// Custom validation middleware for updating subject
const validateUpdateSubject = (req, res, next) => {
  const { name } = req.body;
  
  const errors = [];
  
  // Validate name if provided
  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    errors.push({
      field: 'name',
      message: 'Subject name cannot be empty',
    });
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
  
  next();
};

// Routes
// Create, Update, Delete - Only superadmin
router.post(
  '/',
  authMiddleware,
  superadminMiddleware,
  validateCreateSubject,
  subjectController.createSubject
);

// View - Both admin and superadmin
router.get(
  '/',
  authMiddleware,
  adminOrSuperadminMiddleware,
  subjectController.getAllSubjects
);

router.get(
  '/:subjectId',
  authMiddleware,
  adminOrSuperadminMiddleware,
  subjectController.getSubjectById
);

// Update, Delete - Only superadmin
router.put(
  '/:subjectId',
  authMiddleware,
  superadminMiddleware,
  validateUpdateSubject,
  subjectController.updateSubject
);

router.delete(
  '/:subjectId',
  authMiddleware,
  superadminMiddleware,
  subjectController.deleteSubject
);

module.exports = router;

