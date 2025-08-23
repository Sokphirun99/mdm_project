import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler, createError } from '../middlewares/error';
import { z } from 'zod';

const authService = new AuthService();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'VIEWER']).optional()
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError(
      validation.error.errors.map(e => e.message).join(', '), 
      400, 
      'VALIDATION_ERROR'
    );
  }

  const result = await authService.login(validation.data);
  
  res.json({
    message: 'Login successful',
    ...result
  });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const validation = createUserSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError(
      validation.error.errors.map(e => e.message).join(', '), 
      400, 
      'VALIDATION_ERROR'
    );
  }

  const user = await authService.createUser(validation.data);
  
  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  
  res.status(201).json({
    message: 'User created successfully',
    user: userWithoutPassword
  });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const validation = changePasswordSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError(
      validation.error.errors.map(e => e.message).join(', '), 
      400, 
      'VALIDATION_ERROR'
    );
  }

  const userId = (req as any).user?.id;
  if (!userId) {
    throw createError('User ID not found', 401, 'UNAUTHORIZED');
  }

  await authService.changePassword(
    userId, 
    validation.data.currentPassword, 
    validation.data.newPassword
  );
  
  res.json({
    message: 'Password changed successfully'
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) {
    throw createError('User ID not found', 401, 'UNAUTHORIZED');
  }

  const user = await authService.getUserById(userId);
  
  if (!user) {
    throw createError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  
  res.json({
    user: userWithoutPassword
  });
});
