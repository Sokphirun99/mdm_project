import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export function createError(message: string, status: number = 500, code?: string): AppError {
  const error = new Error(message) as AppError;
  error.status = status;
  error.code = code;
  return error;
}

export function notFound(req: Request, res: Response, next: NextFunction): void {
  const error = createError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
  next(error);
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Don't respond if response already sent
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  // Log error details in development/staging
  if (env.nodeEnv !== 'production') {
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  } else {
    // Log minimal info in production
    console.error(`${status} ${message} - ${req.method} ${req.originalUrl} - ${req.ip}`);
  }

  // Send error response
  res.status(status).json({
    error: message,
    code,
    ...(env.nodeEnv !== 'production' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
}

// Async error wrapper
export function asyncHandler<T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<any>
) {
  return (req: T, res: U, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Validation error helper
export function validationError(message: string, field?: string): AppError {
  const error = createError(message, 400, 'VALIDATION_ERROR');
  if (field) {
    (error as any).field = field;
  }
  return error;
}
