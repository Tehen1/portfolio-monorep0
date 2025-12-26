import { Request, Response, NextFunction } from 'express';

// Simple request logger (replace with winston in production)
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${req.ip} - User: ${req.user?.id || 'anonymous'}`);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};
