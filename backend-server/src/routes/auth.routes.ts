import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/login', authController.login);

// Protected routes
router.use(authenticateToken);
router.get('/profile', authController.getProfile);
router.post('/change-password', authController.changePassword);

// Admin only routes
router.post('/users', authController.createUser);

export default router;
