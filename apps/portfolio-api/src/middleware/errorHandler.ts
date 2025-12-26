import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  winston.error('API Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // Determine error type and status code
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'Internal server error';

  if (err.code === 'VALIDATION_ERROR') {
    statusCode = 400;
    errorCode = err.code;
    message = err.message;
  } else if (err.code === 'UNAUTHORIZED') {
    statusCode = 401;
    errorCode = err.code;
    message = err.message;
  } else if (err.code === 'FORBIDDEN') {
    statusCode = 403;
    errorCode = err.code;
    message = err.message;
  } else if (err.code === 'NOT_FOUND') {
    statusCode = 404;
    errorCode = err.code;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Invalid input data';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Invalid data format';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown'
    }
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown'
    }
  });
};

/**
 * Async error wrapper
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
