import { Router } from 'express';
import * as deviceController from '../controllers/device.controller';
import { authenticateToken, requireAdmin, requireManagerOrAdmin } from '../middlewares/auth';

const router = Router();

// All device routes require authentication
router.use(authenticateToken);

// Device management
router.get('/', deviceController.listDevices);
router.get('/:id', deviceController.getDevice);
router.post('/', requireManagerOrAdmin, deviceController.createDevice);
router.put('/:id', requireManagerOrAdmin, deviceController.updateDevice);
router.delete('/:id', requireAdmin, deviceController.deleteDevice);

// Device commands (admin only)
router.post('/:id/wipe', requireAdmin, deviceController.wipeDevice);
router.post('/:id/lock', requireAdmin, deviceController.lockDevice);
router.post('/:id/unlock', requireAdmin, deviceController.unlockDevice);

// Device command history
router.get('/:id/commands', deviceController.getDeviceCommands);

// Device checkin (used by Android agents)
router.post('/:deviceId/checkin', deviceController.updateLastCheckin);

export default router;
