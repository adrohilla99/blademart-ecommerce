import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';

// Express Request type is extended in src/types/express.d.ts

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    sendError(res, 'Invalid or expired token', 401);
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  if (req.user.role !== 'ADMIN') {
    sendError(res, 'Admin access required', 403);
    return;
  }

  next();
}
