import { prisma } from '../db/prisma';
import { createError } from '../middlewares/error';
import { Device, DeviceStatus, CommandType, CommandStatus } from '@prisma/client';

export interface CreateDeviceRequest {
  deviceId: string;
  deviceName: string;
  fcmToken?: string;
  model?: string;
  manufacturer?: string;
  androidVersion?: string;
  apiLevel?: number;
  deviceInfo?: any;
  organizationId?: string;
}

export interface UpdateDeviceRequest {
  deviceName?: string;
  fcmToken?: string;
  model?: string;
  manufacturer?: string;
  androidVersion?: string;
  apiLevel?: number;
  status?: DeviceStatus;
  deviceInfo?: any;
}

export interface DeviceListQuery {
  status?: DeviceStatus;
  organizationId?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface DeviceListResponse {
  devices: Device[];
  total: number;
  limit: number;
  offset: number;
}

export class DeviceService {
  async createDevice(data: CreateDeviceRequest): Promise<Device> {
    const { deviceId, deviceName, fcmToken, model, manufacturer, androidVersion, apiLevel, deviceInfo, organizationId } = data;

    if (!deviceId || !deviceName) {
      throw createError('Device ID and name are required', 400, 'MISSING_FIELDS');
    }

    // Check if device already exists
    const existingDevice = await prisma.device.findUnique({
      where: { deviceId }
    });

    if (existingDevice) {
      throw createError('Device with this ID already exists', 409, 'DEVICE_EXISTS');
    }

    // Create device
    const device = await prisma.device.create({
      data: {
        deviceId,
        deviceName,
        fcmToken,
        model,
        manufacturer,
        androidVersion,
        apiLevel,
        deviceInfo: deviceInfo || {},
        organizationId,
        status: DeviceStatus.ENROLLED,
        enrolledAt: new Date(),
        lastCheckin: new Date()
      }
    });

    return device;
  }

  async getDeviceById(id: string): Promise<Device> {
    const device = await prisma.device.findUnique({
      where: { id },
      include: {
        organization: true,
        devicePolicies: {
          include: {
            policy: true
          }
        },
        commands: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!device) {
      throw createError('Device not found', 404, 'DEVICE_NOT_FOUND');
    }

    return device;
  }

  async getDeviceByDeviceId(deviceId: string): Promise<Device> {
    const device = await prisma.device.findUnique({
      where: { deviceId }
    });

    if (!device) {
      throw createError('Device not found', 404, 'DEVICE_NOT_FOUND');
    }

    return device;
  }

  async listDevices(query: DeviceListQuery): Promise<DeviceListResponse> {
    const { status, organizationId, limit = 20, offset = 0, search } = query;

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (search) {
      where.OR = [
        { deviceName: { contains: search, mode: 'insensitive' } },
        { deviceId: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count
    const total = await prisma.device.count({ where });

    // Get devices with pagination
    const devices = await prisma.device.findMany({
      where,
      orderBy: { lastCheckin: 'desc' },
      take: Math.min(limit, 100), // Max 100 per page
      skip: offset,
      include: {
        organization: {
          select: { id: true, name: true }
        }
      }
    });

    return {
      devices,
      total,
      limit,
      offset
    };
  }

  async updateDevice(id: string, data: UpdateDeviceRequest): Promise<Device> {
    const device = await this.getDeviceById(id);

    const updatedDevice = await prisma.device.update({
      where: { id },
      data: {
        ...data,
        ...(data.status && { lastCheckin: new Date() })
      }
    });

    return updatedDevice;
  }

  async updateLastCheckin(deviceId: string): Promise<void> {
    await prisma.device.update({
      where: { deviceId },
      data: { lastCheckin: new Date() }
    });
  }

  async deleteDevice(id: string): Promise<void> {
    const device = await this.getDeviceById(id);

    await prisma.device.delete({
      where: { id }
    });
  }

  async sendCommand(deviceId: string, commandType: CommandType, payload: any = {}): Promise<any> {
    const device = await this.getDeviceById(deviceId);

    if (!device.fcmToken) {
      throw createError('Device has no FCM token', 400, 'NO_FCM_TOKEN');
    }

    // Create command record
    const command = await prisma.command.create({
      data: {
        deviceId,
        type: commandType,
        payload,
        status: CommandStatus.PENDING,
        scheduledAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    // TODO: Send FCM message
    // This would integrate with Firebase Admin SDK
    console.log(`Sending ${commandType} command to device ${device.deviceId}`, { payload });

    // Update command status to sent
    await prisma.command.update({
      where: { id: command.id },
      data: { status: CommandStatus.SENT }
    });

    return command;
  }

  async wipeDevice(deviceId: string, confirmation: boolean = false): Promise<any> {
    if (!confirmation) {
      throw createError('Wipe confirmation required', 400, 'CONFIRMATION_REQUIRED');
    }

    return this.sendCommand(deviceId, CommandType.WIPE, { confirmation: true });
  }

  async lockDevice(deviceId: string): Promise<any> {
    return this.sendCommand(deviceId, CommandType.LOCK);
  }

  async unlockDevice(deviceId: string): Promise<any> {
    return this.sendCommand(deviceId, CommandType.UNLOCK);
  }

  async getDeviceCommands(deviceId: string, status?: CommandStatus): Promise<any[]> {
    const where: any = { deviceId };
    
    if (status) {
      where.status = status;
    }

    return prisma.command.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  async updateCommandStatus(commandId: string, status: CommandStatus, result?: any): Promise<void> {
    const updateData: any = { 
      status,
      ...(result && { result })
    };

    if (status === CommandStatus.COMPLETED || status === CommandStatus.FAILED) {
      updateData.executedAt = new Date();
    }

    await prisma.command.update({
      where: { id: commandId },
      data: updateData
    });
  }
}
