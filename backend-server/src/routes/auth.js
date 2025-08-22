const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { 
  generateToken, 
  hashPassword, 
  comparePassword,
  authenticateToken 
} = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  organizationId: Joi.string().uuid()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  // Debug: Log incoming request
  console.log('[DEBUG] Login attempt:', { 
    email: req.body.email, 
    passwordLength: req.body.password ? req.body.password.length : 0,
    bodyKeys: Object.keys(req.body)
  });

  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const { email, password } = value;

  // Find user
  const user = await db('users')
    .where({ email, is_active: true })
    .first();

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Update last login
  await db('users')
    .where({ id: user.id })
    .update({ last_login: new Date() });

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      lastLogin: user.last_login
    }
  });
}));

// POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const { email, password, firstName, lastName, organizationId } = value;

  // Check if user already exists
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    throw new AppError('User with this email already exists', 409, 'USER_EXISTS');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const [newUser] = await db('users')
    .insert({
      id: uuidv4(),
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: 'viewer' // Default role
    })
    .returning(['id', 'email', 'first_name', 'last_name', 'role', 'created_at']);

  // Generate token
  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role
  });

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      role: newUser.role,
      createdAt: newUser.created_at
    }
  });
}));

// POST /api/auth/change-password
router.post('/change-password', authenticateToken, asyncHandler(async (req, res) => {
  const { error, value } = changePasswordSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const { currentPassword, newPassword } = value;
  const userId = req.user.id;

  // Get current user
  const user = await db('users').where({ id: userId }).first();
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Verify current password
  const isValidPassword = await comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    throw new AppError('Current password is incorrect', 401, 'INVALID_PASSWORD');
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(newPassword);

  // Update password
  await db('users')
    .where({ id: userId })
    .update({ 
      password: hashedNewPassword,
      updated_at: new Date()
    });

  res.json({
    message: 'Password changed successfully'
  });
}));

// GET /api/auth/profile
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await db('users')
    .select('id', 'email', 'first_name', 'last_name', 'role', 'last_login', 'created_at')
    .where({ id: userId })
    .first();

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      lastLogin: user.last_login,
      createdAt: user.created_at
    }
  });
}));

// POST /api/auth/refresh
router.post('/refresh', authenticateToken, asyncHandler(async (req, res) => {
  // Generate new token
  const token = generateToken({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });

  res.json({
    message: 'Token refreshed successfully',
    token
  });
}));

module.exports = router;
