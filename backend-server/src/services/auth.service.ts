import { prisma } from '../db/prisma';
import { signJwt, comparePassword, hashPassword, sanitizeEmail, isValidEmail } from '../utils/auth';
import { createError } from '../middlewares/error';
import { User, UserRole } from '@prisma/client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    lastLogin: Date | null;
  };
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const { email, password } = data;

    if (!email || !password) {
      throw createError('Email and password are required', 400, 'MISSING_CREDENTIALS');
    }

    if (!isValidEmail(email)) {
      throw createError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { 
        email: sanitizedEmail,
        isActive: true 
      }
    });

    if (!user) {
      throw createError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw createError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Update last login
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate JWT token
    const token = signJwt({
      id: user.id,
      email: user.email,
      role: user.role
    }, '24h');

    return {
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        lastLogin: updatedUser.lastLogin
      }
    };
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    const { email, password, firstName, lastName, role = UserRole.VIEWER } = data;

    if (!email || !password || !firstName || !lastName) {
      throw createError('All fields are required', 400, 'MISSING_FIELDS');
    }

    if (!isValidEmail(email)) {
      throw createError('Invalid email format', 400, 'INVALID_EMAIL');
    }

    if (password.length < 8) {
      throw createError('Password must be at least 8 characters long', 400, 'WEAK_PASSWORD');
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (existingUser) {
      throw createError('User with this email already exists', 409, 'USER_EXISTS');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        firstName,
        lastName,
        role
      }
    });

    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id, isActive: true }
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId, isActive: true }
    });

    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      throw createError('Current password is incorrect', 400, 'INVALID_PASSWORD');
    }

    if (newPassword.length < 8) {
      throw createError('New password must be at least 8 characters long', 400, 'WEAK_PASSWORD');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }
}
