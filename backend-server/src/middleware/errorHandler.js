const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error
  let error = {
    message: 'Internal Server Error',
    status: 500,
    code: 'INTERNAL_ERROR'
  };

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401,
      code: 'INVALID_JWT'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401,
      code: 'EXPIRED_JWT'
    };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation failed',
      status: 400,
      code: 'VALIDATION_ERROR',
      details: err.details
    };
  }

  // Database errors
  if (err.code === '23505') { // PostgreSQL unique violation
    error = {
      message: 'Resource already exists',
      status: 409,
      code: 'DUPLICATE_RESOURCE'
    };
  }

  if (err.code === '23503') { // PostgreSQL foreign key violation
    error = {
      message: 'Referenced resource not found',
      status: 400,
      code: 'INVALID_REFERENCE'
    };
  }

  // Firebase errors
  if (err.code && err.code.startsWith('messaging/')) {
    error = {
      message: 'Push notification failed',
      status: 500,
      code: 'FCM_ERROR',
      details: err.message
    };
  }

  // Custom application errors
  if (err.status) {
    error.status = err.status;
    error.message = err.message;
    error.code = err.code || 'APPLICATION_ERROR';
  }

  res.status(error.status).json({
    error: error.message,
    code: error.code,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      originalError: err.message 
    })
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.status = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  asyncHandler,
  AppError
};
