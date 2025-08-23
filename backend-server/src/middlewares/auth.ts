import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as any;
    req.user = {
      id: decoded.id || decoded.sub,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
  }
}

export function requireRole(allowedRoles: UserRole[] = [UserRole.ADMIN]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: 'Forbidden', 
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
      });
      return;
    }

    next();
  };
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  return requireRole([UserRole.ADMIN])(req, res, next);
}

export function requireManagerOrAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  return requireRole([UserRole.ADMIN, UserRole.MANAGER])(req, res, next);
}
