const express = require('express');
const router = express.Router();
const topicController = require('../../controllers/admin/topic.controller');
const { authMiddleware, adminMiddleware, adminOrSuperadminMiddleware } = require('../../middlewares/auth');

// Custom validation middleware for creating topic
const validateCreateTopic = (req, res, next) => {
  const { parentSubject, name, description } = req.body;
  
  const errors = [];
  
  // Validate parent subject
  if (!parentSubject || typeof parentSubject !== 'string' || !parentSubject.trim()) {
    errors.push({
      field: 'parentSubject',
      message: 'Parent subject is required',
    });
  }
  
  // Validate name
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({
      field: 'name',
      message: 'Topic name is required',
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
  req.body.parentSubject = parentSubject.trim();
  req.body.name = name.trim();
  if (description) {
    req.body.description = description.trim();
  }
  
  next();
};

// Custom validation middleware for updating topic
const validateUpdateTopic = (req, res, next) => {
  const { parentSubject, name, description } = req.body;
  
  const errors = [];
  
  // Validate parent subject if provided
  if (parentSubject !== undefined) {
    if (typeof parentSubject !== 'string' || !parentSubject.trim()) {
      errors.push({
        field: 'parentSubject',
        message: 'Parent subject cannot be empty',
      });
    }
  }
  
  // Validate name if provided
  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    errors.push({
      field: 'name',
      message: 'Topic name cannot be empty',
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
  if (parentSubject !== undefined) {
    req.body.parentSubject = parentSubject.trim();
  }
  if (name !== undefined) {
    req.body.name = name.trim();
  }
  if (description !== undefined) {
    req.body.description = description.trim();
  }
  
  next();
};

// Routes
// Create, Update, Delete - Only admin
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validateCreateTopic,
  topicController.createTopic
);

// View - Both admin and superadmin
router.get(
  '/',
  authMiddleware,
  adminOrSuperadminMiddleware,
  topicController.getAllTopics
);

router.get(
  '/:topicId',
  authMiddleware,
  adminOrSuperadminMiddleware,
  topicController.getTopicById
);

// Update, Delete - Only admin
router.put(
  '/:topicId',
  authMiddleware,
  adminMiddleware,
  validateUpdateTopic,
  topicController.updateTopic
);

router.delete(
  '/:topicId',
  authMiddleware,
  adminMiddleware,
  topicController.deleteTopic
);

module.exports = router;

