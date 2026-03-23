import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { sendError } from '../utils/response';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.path} not found`, 404);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    sendError(res, 'Validation failed', 422, errors);
    return;
  }

  // Known application errors
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Prisma unique constraint violations
  if (err.message.includes('Unique constraint')) {
    sendError(res, 'A record with this value already exists', 409);
    return;
  }

  // Unknown errors - don't leak internals in production
  console.error('Unhandled error:', err);
  sendError(
    res,
    env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500
  );
}
