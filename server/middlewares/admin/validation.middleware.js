/**
 * Validation middleware for admin operations
 */

// ==================== Admin Validation ====================

/**
 * Validate create admin request
 */
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
    const trimmedEmail = email.trim();
    // More permissive email regex that handles common email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
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

/**
 * Validate update user status request
 */
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

/**
 * Validate update admin request
 */
const validateUpdateAdmin = (req, res, next) => {
  const { name, email, status, adminRole } = req.body;
  const errors = [];

  if (
    name === undefined &&
    email === undefined &&
    status === undefined &&
    adminRole === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          field: 'request',
          message: 'At least one field (name, email, status, adminRole) must be provided',
        },
      ],
    });
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      errors.push({
        field: 'name',
        message: 'Name must be a non-empty string',
      });
    } else {
      req.body.name = name.trim();
    }
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !email.trim()) {
      errors.push({
        field: 'email',
        message: 'Email must be a non-empty string',
      });
    } else {
      const trimmedEmail = email.trim();
      // More permissive email regex that handles common email formats
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        errors.push({
          field: 'email',
          message: 'Please provide a valid email',
        });
      } else {
        req.body.email = trimmedEmail.toLowerCase();
      }
    }
  }

  if (status !== undefined) {
    if (!['active', 'suspended'].includes(status)) {
      errors.push({
        field: 'status',
        message: 'Status must be either active or suspended',
      });
    } else {
      req.body.status = status;
    }
  }

  if (adminRole !== undefined) {
    if (typeof adminRole !== 'string' || !adminRole.trim()) {
      errors.push({
        field: 'adminRole',
        message: 'Workflow role must be a non-empty string',
      });
    } else {
      const validAdminRoles = ['gatherer', 'creator', 'explainer', 'processor'];
      if (!validAdminRoles.includes(adminRole.trim())) {
        errors.push({
          field: 'adminRole',
          message: 'Workflow role must be one of: gatherer, creator, explainer, processor',
        });
      } else {
        req.body.adminRole = adminRole.trim();
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

  next();
};

// ==================== Exam Validation ====================

/**
 * Validate create exam request
 */
const validateCreateExam = (req, res, next) => {
  const { name, status } = req.body;
  
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

/**
 * Validate update exam request
 */
const validateUpdateExam = (req, res, next) => {
  const { name, status } = req.body;
  
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

// ==================== Subject Validation ====================

/**
 * Validate create subject request
 */
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

/**
 * Validate update subject request
 */
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

// ==================== Topic Validation ====================

/**
 * Validate create topic request
 */
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

/**
 * Validate update topic request
 */
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

// ==================== Plan Validation ====================

/**
 * Validate create plan request
 */
const validateCreatePlan = (req, res, next) => {
  const { name, price, duration, description, status } = req.body;
  
  const errors = [];
  
  // Validate name
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({
      field: 'name',
      message: 'Plan name is required',
    });
  }
  
  // Validate price
  if (price === undefined || price === null) {
    errors.push({
      field: 'price',
      message: 'Price is required',
    });
  } else {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      errors.push({
        field: 'price',
        message: 'Price must be a positive number',
      });
    }
  }
  
  // Validate duration
  if (!duration || typeof duration !== 'string' || !duration.trim()) {
    errors.push({
      field: 'duration',
      message: 'Duration is required',
    });
  } else {
    const validDurations = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'];
    if (!validDurations.includes(duration.trim())) {
      errors.push({
        field: 'duration',
        message: 'Duration must be one of: Monthly, Quarterly, Semi-Annual, Annual',
      });
    }
  }
  
  // Validate status (required)
  if (!status || typeof status !== 'string' || !status.trim()) {
    errors.push({
      field: 'status',
      message: 'Status is required',
    });
  } else {
    const trimmedStatus = status.trim().toLowerCase();
    if (!['active', 'inactive'].includes(trimmedStatus)) {
      errors.push({
        field: 'status',
        message: 'Status must be either active or inactive',
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
  req.body.price = parseFloat(price);
  req.body.duration = duration.trim();
  if (description) {
    req.body.description = description.trim();
  }
  req.body.status = status.trim().toLowerCase();
  
  next();
};

/**
 * Validate update plan request
 */
const validateUpdatePlan = (req, res, next) => {
  const { name, price, duration, description, status } = req.body;
  
  const errors = [];
  
  // At least one field must be provided
  if (
    name === undefined &&
    price === undefined &&
    duration === undefined &&
    description === undefined &&
    status === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          field: 'request',
          message: 'At least one field (name, price, duration, description, status) must be provided',
        },
      ],
    });
  }
  
  // Validate name if provided
  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    errors.push({
      field: 'name',
      message: 'Plan name cannot be empty',
    });
  }
  
  // Validate price if provided
  if (price !== undefined) {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      errors.push({
        field: 'price',
        message: 'Price must be a positive number',
      });
    }
  }
  
  // Validate duration if provided
  if (duration !== undefined) {
    if (typeof duration !== 'string' || !duration.trim()) {
      errors.push({
        field: 'duration',
        message: 'Duration cannot be empty',
      });
    } else {
      const validDurations = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'];
      if (!validDurations.includes(duration.trim())) {
        errors.push({
          field: 'duration',
          message: 'Duration must be one of: Monthly, Quarterly, Semi-Annual, Annual',
        });
      }
    }
  }
  
  // Validate status if provided
  if (status !== undefined && !['active', 'inactive'].includes(status)) {
    errors.push({
      field: 'status',
      message: 'Status must be either active or inactive',
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
  if (price !== undefined) {
    req.body.price = parseFloat(price);
  }
  if (duration !== undefined) {
    req.body.duration = duration.trim();
  }
  if (description !== undefined) {
    req.body.description = description.trim();
  }
  if (status !== undefined) {
    req.body.status = status;
  }
  
  next();
};

/**
 * Validate update plan status request
 */
const validateUpdatePlanStatus = (req, res, next) => {
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
  if (!['active', 'inactive'].includes(trimmedStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [
        {
          field: 'status',
          message: 'Status must be either active or inactive',
        },
      ],
    });
  }
  
  req.body.status = trimmedStatus;
  next();
};

module.exports = {
  // Admin validation
  validateCreateAdmin,
  validateUpdateStatus,
  validateUpdateAdmin,
  // Exam validation
  validateCreateExam,
  validateUpdateExam,
  // Subject validation
  validateCreateSubject,
  validateUpdateSubject,
  // Topic validation
  validateCreateTopic,
  validateUpdateTopic,
  // Plan validation
  validateCreatePlan,
  validateUpdatePlan,
  validateUpdatePlanStatus,
};

