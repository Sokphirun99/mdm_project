import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { logger } from '../utils/logger';

export const getDevices = async (req: Request, res: Response) => {
  try {
    const devices = await prisma.device.findMany({
      include: {
        organization: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(devices);
  } catch (error) {
    logger.error('Error fetching devices:', error);
    res.status(500).json({
      error: 'Failed to fetch devices',
      message: 'Internal server error'
    });
  }
};

export const getDeviceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const device = await prisma.device.findUnique({
      where: { id },
      include: {
        organization: true,
        devicePolicies: {
          include: {
            policy: true
          }
        },
        deviceApps: {
          include: {
            app: true
          }
        }
      }
    });

    if (!device) {
      return res.status(404).json({
        error: 'Device not found'
      });
    }

    return res.json(device);
  } catch (error) {
    logger.error('Error fetching device:', error);
    return res.status(500).json({
      error: 'Failed to fetch device',
      message: 'Internal server error'
    });
  }
};

export const createDevice = async (req: Request, res: Response) => {
  try {
    const { deviceName, model, androidVersion, deviceId, organizationId, status = 'PENDING' } = req.body;

    const device = await prisma.device.create({
      data: {
        deviceName,
        model,
        androidVersion,
        deviceId,
        organizationId,
        status,
        lastCheckin: new Date()
      },
      include: {
        organization: {
          select: {
            name: true
          }
        }
      }
    });

    res.status(201).json(device);
  } catch (error) {
    logger.error('Error creating device:', error);
    res.status(500).json({
      error: 'Failed to create device',
      message: 'Internal server error'
    });
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const device = await prisma.device.update({
      where: { id },
      data: updateData,
      include: {
        organization: {
          select: {
            name: true
          }
        }
      }
    });

    res.json(device);
  } catch (error) {
    logger.error('Error updating device:', error);
    res.status(500).json({
      error: 'Failed to update device',
      message: 'Internal server error'
    });
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.device.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting device:', error);
    res.status(500).json({
      error: 'Failed to delete device',
      message: 'Internal server error'
    });
  }
};
