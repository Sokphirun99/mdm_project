const express = require('express');
const Joi = require('joi');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const firebaseService = require('../services/firebaseService');
const { authorizeRole } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation schemas
const enrollDeviceSchema = Joi.object({
  deviceId: Joi.string().required(),
  deviceName: Joi.string().required(),
  model: Joi.string(),
  manufacturer: Joi.string(),
  androidVersion: Joi.string(),
  apiLevel: Joi.number().integer(),
  serialNumber: Joi.string(),
  imei: Joi.string(),
  fcmToken: Joi.string(),
  enrollmentMethod: Joi.string().valid('qr_code', 'manual', 'nfc', 'bulk').default('manual'),
  organizationId: Joi.string().uuid(),
  deviceInfo: Joi.object().default({})
});

const updateDeviceSchema = Joi.object({
  deviceName: Joi.string(),
  fcmToken: Joi.string(),
  status: Joi.string().valid('enrolled', 'pending', 'inactive', 'compromised'),
  deviceInfo: Joi.object()
});

// GET /api/devices - List all devices
router.get('/', asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    status, 
    organizationId,
    search,
    compliance 
  } = req.query;

  const offset = (page - 1) * limit;
  let query = db('devices')
    .select([
      'devices.*',
      'organizations.name as organization_name'
    ])
    .leftJoin('organizations', 'devices.organization_id', 'organizations.id');

  // Apply filters
  if (status) {
    query = query.where('devices.status', status);
  }

  if (organizationId) {
    query = query.where('devices.organization_id', organizationId);
  }

  if (compliance) {
    query = query.where('devices.compliance_status', compliance);
  }

  if (search) {
    query = query.where(function() {
      this.where('devices.device_name', 'ilike', `%${search}%`)
          .orWhere('devices.serial_number', 'ilike', `%${search}%`)
          .orWhere('devices.model', 'ilike', `%${search}%`);
    });
  }

  // Get total count
  const totalQuery = query.clone();
  const [{ count }] = await totalQuery.count('devices.id as count');

  // Get paginated results
  const devices = await query
    .orderBy('devices.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  res.json({
    devices,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit)
    }
  });
}));

// GET /api/devices/:id - Get device details
router.get('/:id', asyncHandler(async (req, res) => {
  const device = await db('devices')
    .select([
      'devices.*',
      'organizations.name as organization_name'
    ])
    .leftJoin('organizations', 'devices.organization_id', 'organizations.id')
    .where('devices.id', req.params.id)
    .first();

  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  // Get latest status
  const latestStatus = await db('device_status')
    .where('device_id', device.id)
    .orderBy('recorded_at', 'desc')
    .first();

  // Get latest location
  const latestLocation = await db('device_locations')
    .where('device_id', device.id)
    .orderBy('recorded_at', 'desc')
    .first();

  // Get recent commands
  const recentCommands = await db('commands')
    .where('device_id', device.id)
    .orderBy('created_at', 'desc')
    .limit(10);

  res.json({
    device,
    status: latestStatus,
    location: latestLocation,
    recentCommands
  });
}));

// POST /api/devices/enroll - Enroll a new device
router.post('/enroll', asyncHandler(async (req, res) => {
  const { error, value } = enrollDeviceSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const {
    deviceId,
    deviceName,
    model,
    manufacturer,
    androidVersion,
    apiLevel,
    serialNumber,
    imei,
    fcmToken,
    enrollmentMethod,
    organizationId,
    deviceInfo
  } = value;

  // Check if device already exists
  const existingDevice = await db('devices')
    .where('device_id', deviceId)
    .first();

  if (existingDevice) {
    throw new AppError('Device already enrolled', 409, 'DEVICE_EXISTS');
  }

  // Create device
  const [newDevice] = await db('devices')
    .insert({
      id: uuidv4(),
      organization_id: organizationId,
      device_id: deviceId,
      serial_number: serialNumber,
      imei,
      fcm_token: fcmToken,
      device_name: deviceName,
      model,
      manufacturer,
      android_version: androidVersion,
      api_level: apiLevel,
      enrollment_method: enrollmentMethod,
      status: 'enrolled',
      enrolled_at: new Date(),
      device_info: deviceInfo
    })
    .returning('*');

  // Send welcome notification
  if (fcmToken) {
    try {
      await firebaseService.sendToDevice(
        fcmToken,
        'Device Enrolled',
        'Your device has been successfully enrolled in the MDM system.',
        { type: 'enrollment_success' }
      );
    } catch (error) {
      console.error('Failed to send enrollment notification:', error);
    }
  }

  res.status(201).json({
    message: 'Device enrolled successfully',
    device: newDevice
  });
}));

// PUT /api/devices/:id - Update device
router.put('/:id', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { error, value } = updateDeviceSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const deviceId = req.params.id;

  // Check if device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  // Update device
  const [updatedDevice] = await db('devices')
    .where('id', deviceId)
    .update({
      ...value,
      updated_at: new Date()
    })
    .returning('*');

  res.json({
    message: 'Device updated successfully',
    device: updatedDevice
  });
}));

// DELETE /api/devices/:id - Remove device
router.delete('/:id', authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const deviceId = req.params.id;

  // Check if device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  // Send unenrollment notification before deletion
  if (device.fcm_token) {
    try {
      await firebaseService.sendToDevice(
        device.fcm_token,
        'Device Unenrolled',
        'Your device has been removed from the MDM system.',
        { type: 'unenrollment' }
      );
    } catch (error) {
      console.error('Failed to send unenrollment notification:', error);
    }
  }

  // Delete device (cascade will handle related records)
  await db('devices').where('id', deviceId).del();

  res.json({
    message: 'Device removed successfully'
  });
}));

// POST /api/devices/:id/checkin - Device check-in
router.post('/:id/checkin', asyncHandler(async (req, res) => {
  const deviceId = req.params.id;
  const { 
    batteryLevel,
    isCharging,
    networkType,
    wifiSsid,
    availableStorage,
    totalStorage,
    availableRam,
    totalRam,
    cpuUsage,
    isRooted,
    isScreenLocked,
    lastBoot,
    installedApps = [],
    runningApps = [],
    location
  } = req.body;

  // Update last checkin
  await db('devices')
    .where('id', deviceId)
    .update({ 
      last_checkin: new Date(),
      updated_at: new Date()
    });

  // Record device status
  await db('device_status').insert({
    id: uuidv4(),
    device_id: deviceId,
    battery_level: batteryLevel,
    is_charging: isCharging,
    network_type: networkType,
    wifi_ssid: wifiSsid,
    available_storage: availableStorage,
    total_storage: totalStorage,
    available_ram: availableRam,
    total_ram: totalRam,
    cpu_usage: cpuUsage,
    is_rooted: isRooted,
    is_screen_locked: isScreenLocked,
    last_boot: lastBoot,
    installed_apps: installedApps,
    running_apps: runningApps,
    recorded_at: new Date()
  });

  // Record location if provided
  if (location && location.latitude && location.longitude) {
    await db('device_locations').insert({
      id: uuidv4(),
      device_id: deviceId,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      altitude: location.altitude,
      speed: location.speed,
      bearing: location.bearing,
      provider: location.provider || 'unknown',
      recorded_at: new Date()
    });
  }

  // Check for pending commands
  const pendingCommands = await db('commands')
    .where({
      device_id: deviceId,
      status: 'pending'
    })
    .orderBy('created_at', 'asc');

  res.json({
    message: 'Check-in successful',
    pendingCommands: pendingCommands.map(cmd => ({
      id: cmd.id,
      type: cmd.type,
      parameters: cmd.parameters
    }))
  });
}));

// GET /api/devices/enrollment/qr-code - Generate enrollment QR code
router.get('/enrollment/qr-code', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { organizationId } = req.query;

  const enrollmentData = {
    action: 'enroll',
    serverUrl: process.env.SERVER_URL || 'https://your-mdm-server.com',
    organizationId,
    enrollmentToken: uuidv4(),
    timestamp: Date.now()
  };

  const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(enrollmentData));

  res.json({
    qrCode: qrCodeDataURL,
    enrollmentData
  });
}));

// GET /api/devices/stats - Get device statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const { organizationId } = req.query;

  let query = db('devices');
  if (organizationId) {
    query = query.where('organization_id', organizationId);
  }

  const [
    totalDevices,
    enrolledDevices,
    pendingDevices,
    inactiveDevices,
    compliantDevices,
    nonCompliantDevices
  ] = await Promise.all([
    query.clone().count('* as count').first(),
    query.clone().where('status', 'enrolled').count('* as count').first(),
    query.clone().where('status', 'pending').count('* as count').first(),
    query.clone().where('status', 'inactive').count('* as count').first(),
    query.clone().where('compliance_status', 'compliant').count('* as count').first(),
    query.clone().where('compliance_status', 'non_compliant').count('* as count').first()
  ]);

  res.json({
    totalDevices: parseInt(totalDevices.count),
    enrolledDevices: parseInt(enrolledDevices.count),
    pendingDevices: parseInt(pendingDevices.count),
    inactiveDevices: parseInt(inactiveDevices.count),
    compliantDevices: parseInt(compliantDevices.count),
    nonCompliantDevices: parseInt(nonCompliantDevices.count)
  });
}));

module.exports = router;
