import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';

const router = Router();

// GET /api/dashboard/stats - temporarily remove auth for testing
router.get('/stats', getDashboardStats);

export default router;
