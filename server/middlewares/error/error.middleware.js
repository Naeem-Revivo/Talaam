const errorHandler = (err, req, res, next) => {
  const logError = (status, payload) => {
    try {
      console.error(`[ERROR] ${req.method} ${req.originalUrl} → ${status}`, {
        message: payload && payload.message,
        errors: payload && payload.errors,
      });
    } catch (_) {}
  };
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error) => error.message);
    const payload = {
      success: false,
      message: 'Validation error',
      errors,
    };
    logError(400, payload);
    return res.status(400).json(payload);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const payload = {
      success: false,
      message: `${field} already exists`,
    };
    logError(400, payload);
    return res.status(400).json(payload);
  }

  // Express validator errors
  if (err.name === 'ValidationError' || err.array) {
    const payload = {
      success: false,
      message: 'Validation error',
      errors: err.array ? err.array() : [err.message],
    };
    logError(400, payload);
    return res.status(400).json(payload);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const payload = {
      success: false,
      message: 'Invalid token',
    };
    logError(401, payload);
    return res.status(401).json(payload);
  }

  if (err.name === 'TokenExpiredError') {
    const payload = {
      success: false,
      message: 'Token expired',
    };
    logError(401, payload);
    return res.status(401).json(payload);
  }

  // Default error
  const status = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };
  logError(status, payload);
  res.status(status).json(payload);
};

module.exports = errorHandler;

