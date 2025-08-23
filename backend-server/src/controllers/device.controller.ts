import { Request, Response } from 'express';
import { DeviceService } from '../services/device.service';
import { asyncHandler, createError } from '../middlewares/error';
import { AuthenticatedRequest } from '../middlewares/auth';
import { z } from 'zod';

const deviceService = new DeviceService();

// Validation schemas
const createDeviceSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  deviceName: z.string().min(1, 'Device name is required'),
  fcmToken: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  androidVersion: z.string().optional(),
  apiLevel: z.number().int().positive().optional(),
  deviceInfo: z.record(z.any()).optional(),
  organizationId: z.string().uuid().optional()
});

const updateDeviceSchema = z.object({
  deviceName: z.string().min(1).optional(),
  fcmToken: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  androidVersion: z.string().optional(),
  apiLevel: z.number().int().positive().optional(),
  status: z.enum(['ENROLLED', 'PENDING', 'INACTIVE', 'COMPROMISED']).optional(),
  deviceInfo: z.record(z.any()).optional()
});

const listDevicesSchema = z.object({
  status: z.enum(['ENROLLED', 'PENDING', 'INACTIVE', 'COMPROMISED']).optional(),
  organizationId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.string().optional()
});

const commandSchema = z.object({
  confirmation: z.boolean().optional()
});

export const listDevices = asyncHandler(async (req: Request, res: Response) => {
  const validation = listDevicesSchema.safeParse(req.query);
  
  if (!validation.success) {
    throw createError(
      validation.error.errors.map(e => e.message).join(', '), 
      400, 
      'VALIDATION_ERROR'
    );
  }

  const result = await deviceService.listDevices(validation.data);
  
  res.json(result);
});

export const getDevice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw createError('Device ID is required', 400, 'MISSING_DEVICE_ID');
  }

  const device = await deviceService.getDeviceById(id);
  
  res.json({ device });
});

export const createDevice = asyncHandler(async (req: Request, res: Response) => {
  const validation = createDeviceSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError(
      validation.error.errors.map(e => e.message).join(', '), 
      400, 
      'VALIDATION_ERROR'
    );
  }

  const device = await deviceService.createDevice(validation.data);
  
  res.status(201).json({
    message: 'Device created successfully',
    device
  });
});

export const updateDevice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw createError('Device ID is required', 400, 'MISSING_DEVICE_ID');
  }

  const validation = updateDeviceSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError(
      validation.error.errors.map(e => e.message).join(', '), 
      400, 
      'VALIDATION_ERROR'
    );
  }

  const device = await deviceService.updateDevice(id, validation.data);
  
  res.json({
    message: 'Device updated successfully',
    device
  });
});

export const deleteDevice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw createError('Device ID is required', 400, 'MISSING_DEVICE_ID');
  }

  await deviceService.deleteDevice(id);
  
  res.json({
    message: 'Device deleted successfully'
  });
});

export const wipeDevice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw createError('Device ID is required', 400, 'MISSING_DEVICE_ID');
  }

  const validation = commandSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw createError(
      validation.error.errors.map(e => e.message).join(', '), 
      400, 
      'VALIDATION_ERROR'
    );
  }

  const { confirmation } = validation.data;

  const command = await deviceService.wipeDevice(id, confirmation);
  
  res.json({
    message: 'Wipe command sent successfully',
    command
  });
});

export const lockDevice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw createError('Device ID is required', 400, 'MISSING_DEVICE_ID');
  }

  const command = await deviceService.lockDevice(id);
  
  res.json({
    message: 'Lock command sent successfully',
    command
  });
});

export const unlockDevice = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    throw createError('Device ID is required', 400, 'MISSING_DEVICE_ID');
  }

  const command = await deviceService.unlockDevice(id);
  
  res.json({
    message: 'Unlock command sent successfully',
    command
  });
});

export const getDeviceCommands = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.query;
  
  if (!id) {
    throw createError('Device ID is required', 400, 'MISSING_DEVICE_ID');
  }

  const commands = await deviceService.getDeviceCommands(id, status as any);
  
  res.json({
    commands
  });
});

export const updateLastCheckin = asyncHandler(async (req: Request, res: Response) => {
  const { deviceId } = req.params;
  
  if (!deviceId) {
    throw createError('Device ID is required', 400, 'MISSING_DEVICE_ID');
  }

  await deviceService.updateLastCheckin(deviceId);
  
  res.json({
    message: 'Last checkin updated successfully'
  });
});
