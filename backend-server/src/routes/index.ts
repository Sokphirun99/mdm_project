import { Router } from 'express';
import authRoutes from './auth.routes';
import deviceRoutes from './device.routes';
import dashboardRoutes from './dashboard.routes';
import policiesRoutes from './policies.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    service: 'MDM Backend API'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/devices', deviceRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/policies', policiesRoutes);

export default router;
