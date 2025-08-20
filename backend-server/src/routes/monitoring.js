const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authorizeRole } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation schemas
const locationReportSchema = Joi.object({
  deviceId: Joi.string().uuid().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  accuracy: Joi.number().positive(),
  altitude: Joi.number(),
  speed: Joi.number().min(0),
  bearing: Joi.number().min(0).max(360),
  provider: Joi.string().valid('gps', 'network', 'passive').default('unknown'),
  recordedAt: Joi.date().default(() => new Date())
});

const complianceReportSchema = Joi.object({
  deviceId: Joi.string().uuid().required(),
  status: Joi.string().valid('compliant', 'non_compliant', 'unknown').required(),
  violations: Joi.array().items(Joi.object()).default([]),
  checksPerformed: Joi.array().items(Joi.object()).default([]),
  summary: Joi.string(),
  score: Joi.number().integer().min(0).max(100),
  checkedAt: Joi.date().default(() => new Date())
});

// POST /api/monitoring/location - Report device location
router.post('/location', asyncHandler(async (req, res) => {
  const { error, value } = locationReportSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const {
    deviceId,
    latitude,
    longitude,
    accuracy,
    altitude,
    speed,
    bearing,
    provider,
    recordedAt
  } = value;

  // Verify device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  // Insert location record
  await db('device_locations').insert({
    id: uuidv4(),
    device_id: deviceId,
    latitude,
    longitude,
    accuracy,
    altitude,
    speed,
    bearing,
    provider,
    recorded_at: recordedAt
  });

  res.json({
    message: 'Location recorded successfully'
  });
}));

// GET /api/monitoring/location/:deviceId - Get device location history
router.get('/location/:deviceId', asyncHandler(async (req, res) => {
  const deviceId = req.params.deviceId;
  const { 
    limit = 50, 
    startDate, 
    endDate,
    provider 
  } = req.query;

  // Verify device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  let query = db('device_locations')
    .where('device_id', deviceId)
    .orderBy('recorded_at', 'desc')
    .limit(parseInt(limit));

  if (startDate) {
    query = query.where('recorded_at', '>=', startDate);
  }

  if (endDate) {
    query = query.where('recorded_at', '<=', endDate);
  }

  if (provider) {
    query = query.where('provider', provider);
  }

  const locations = await query;

  res.json({
    deviceId,
    locations
  });
}));

// GET /api/monitoring/location/:deviceId/latest - Get latest device location
router.get('/location/:deviceId/latest', asyncHandler(async (req, res) => {
  const deviceId = req.params.deviceId;

  // Verify device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  const latestLocation = await db('device_locations')
    .where('device_id', deviceId)
    .orderBy('recorded_at', 'desc')
    .first();

  if (!latestLocation) {
    throw new AppError('No location data found for device', 404, 'NO_LOCATION_DATA');
  }

  res.json({
    deviceId,
    location: latestLocation
  });
}));

// POST /api/monitoring/compliance - Report compliance status
router.post('/compliance', asyncHandler(async (req, res) => {
  const { error, value } = complianceReportSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const {
    deviceId,
    status,
    violations,
    checksPerformed,
    summary,
    score,
    checkedAt
  } = value;

  // Verify device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  // Insert compliance report
  await db('compliance_reports').insert({
    id: uuidv4(),
    device_id: deviceId,
    status,
    violations,
    checks_performed: checksPerformed,
    summary,
    score,
    checked_at: checkedAt
  });

  // Update device compliance status
  await db('devices')
    .where('id', deviceId)
    .update({
      compliance_status: status,
      updated_at: new Date()
    });

  res.json({
    message: 'Compliance report recorded successfully'
  });
}));

// GET /api/monitoring/compliance/:deviceId - Get device compliance history
router.get('/compliance/:deviceId', asyncHandler(async (req, res) => {
  const deviceId = req.params.deviceId;
  const { 
    limit = 20, 
    startDate, 
    endDate,
    status 
  } = req.query;

  // Verify device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  let query = db('compliance_reports')
    .where('device_id', deviceId)
    .orderBy('checked_at', 'desc')
    .limit(parseInt(limit));

  if (startDate) {
    query = query.where('checked_at', '>=', startDate);
  }

  if (endDate) {
    query = query.where('checked_at', '<=', endDate);
  }

  if (status) {
    query = query.where('status', status);
  }

  const reports = await query;

  res.json({
    deviceId,
    complianceReports: reports
  });
}));

// GET /api/monitoring/compliance/:deviceId/latest - Get latest compliance report
router.get('/compliance/:deviceId/latest', asyncHandler(async (req, res) => {
  const deviceId = req.params.deviceId;

  // Verify device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  const latestReport = await db('compliance_reports')
    .where('device_id', deviceId)
    .orderBy('checked_at', 'desc')
    .first();

  if (!latestReport) {
    throw new AppError('No compliance data found for device', 404, 'NO_COMPLIANCE_DATA');
  }

  res.json({
    deviceId,
    complianceReport: latestReport
  });
}));

// GET /api/monitoring/device-status/:deviceId - Get device status history
router.get('/device-status/:deviceId', asyncHandler(async (req, res) => {
  const deviceId = req.params.deviceId;
  const { 
    limit = 20, 
    startDate, 
    endDate 
  } = req.query;

  // Verify device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  let query = db('device_status')
    .where('device_id', deviceId)
    .orderBy('recorded_at', 'desc')
    .limit(parseInt(limit));

  if (startDate) {
    query = query.where('recorded_at', '>=', startDate);
  }

  if (endDate) {
    query = query.where('recorded_at', '<=', endDate);
  }

  const statusHistory = await query;

  res.json({
    deviceId,
    statusHistory
  });
}));

// GET /api/monitoring/device-status/:deviceId/latest - Get latest device status
router.get('/device-status/:deviceId/latest', asyncHandler(async (req, res) => {
  const deviceId = req.params.deviceId;

  // Verify device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  const latestStatus = await db('device_status')
    .where('device_id', deviceId)
    .orderBy('recorded_at', 'desc')
    .first();

  if (!latestStatus) {
    throw new AppError('No status data found for device', 404, 'NO_STATUS_DATA');
  }

  res.json({
    deviceId,
    status: latestStatus
  });
}));

// GET /api/monitoring/dashboard - Get monitoring dashboard data
router.get('/dashboard', asyncHandler(async (req, res) => {
  const { organizationId } = req.query;

  // Base query for filtering by organization
  let deviceQuery = db('devices');
  if (organizationId) {
    deviceQuery = deviceQuery.where('organization_id', organizationId);
  }

  // Get device counts by status
  const deviceStats = await deviceQuery.clone()
    .select('status')
    .count('* as count')
    .groupBy('status');

  // Get compliance stats
  const complianceStats = await deviceQuery.clone()
    .select('compliance_status')
    .count('* as count')
    .groupBy('compliance_status');

  // Get devices with low battery (last 24 hours)
  const lowBatteryDevices = await db('device_status')
    .select([
      'device_status.device_id',
      'device_status.battery_level',
      'devices.device_name'
    ])
    .join('devices', 'device_status.device_id', 'devices.id')
    .where('device_status.battery_level', '<', 20)
    .where('device_status.recorded_at', '>', db.raw("NOW() - INTERVAL '24 hours'"))
    .orderBy('device_status.battery_level', 'asc')
    .limit(10);

  // Get offline devices (no checkin in last 24 hours)
  const offlineDevices = await deviceQuery.clone()
    .select(['id', 'device_name', 'last_checkin'])
    .where('last_checkin', '<', db.raw("NOW() - INTERVAL '24 hours'"))
    .orWhereNull('last_checkin')
    .limit(10);

  // Get recent commands summary
  const recentCommandStats = await db('commands')
    .select('status')
    .count('* as count')
    .where('created_at', '>', db.raw("NOW() - INTERVAL '24 hours'"))
    .groupBy('status');

  // Get non-compliant devices
  const nonCompliantDevices = await deviceQuery.clone()
    .select(['id', 'device_name', 'compliance_status'])
    .where('compliance_status', 'non_compliant')
    .limit(10);

  res.json({
    deviceStats: deviceStats.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {}),
    complianceStats: complianceStats.reduce((acc, item) => {
      acc[item.compliance_status] = parseInt(item.count);
      return acc;
    }, {}),
    lowBatteryDevices,
    offlineDevices,
    recentCommandStats: recentCommandStats.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {}),
    nonCompliantDevices
  });
}));

// GET /api/monitoring/alerts - Get monitoring alerts
router.get('/alerts', asyncHandler(async (req, res) => {
  const { organizationId, severity, limit = 20 } = req.query;

  const alerts = [];

  // Base device query
  let deviceQuery = db('devices');
  if (organizationId) {
    deviceQuery = deviceQuery.where('organization_id', organizationId);
  }

  // Critical alerts: Offline devices (no checkin in 48+ hours)
  const offlineDevices = await deviceQuery.clone()
    .select(['id', 'device_name', 'last_checkin'])
    .where('last_checkin', '<', db.raw("NOW() - INTERVAL '48 hours'"))
    .orWhereNull('last_checkin');

  offlineDevices.forEach(device => {
    alerts.push({
      id: uuidv4(),
      type: 'device_offline',
      severity: 'critical',
      title: 'Device Offline',
      message: `Device ${device.device_name} has been offline for more than 48 hours`,
      deviceId: device.id,
      deviceName: device.device_name,
      timestamp: new Date(),
      data: { lastCheckin: device.last_checkin }
    });
  });

  // High alerts: Low battery devices
  const lowBatteryQuery = db('device_status')
    .select([
      'device_status.device_id',
      'device_status.battery_level',
      'device_status.recorded_at',
      'devices.device_name'
    ])
    .join('devices', 'device_status.device_id', 'devices.id')
    .where('device_status.battery_level', '<', 10)
    .where('device_status.recorded_at', '>', db.raw("NOW() - INTERVAL '2 hours'"));

  if (organizationId) {
    lowBatteryQuery.where('devices.organization_id', organizationId);
  }

  const lowBatteryDevices = await lowBatteryQuery;

  lowBatteryDevices.forEach(status => {
    alerts.push({
      id: uuidv4(),
      type: 'low_battery',
      severity: 'high',
      title: 'Low Battery Alert',
      message: `Device ${status.device_name} has critically low battery (${status.battery_level}%)`,
      deviceId: status.device_id,
      deviceName: status.device_name,
      timestamp: status.recorded_at,
      data: { batteryLevel: status.battery_level }
    });
  });

  // Medium alerts: Non-compliant devices
  const nonCompliantDevices = await deviceQuery.clone()
    .select(['id', 'device_name', 'compliance_status', 'updated_at'])
    .where('compliance_status', 'non_compliant');

  nonCompliantDevices.forEach(device => {
    alerts.push({
      id: uuidv4(),
      type: 'compliance_violation',
      severity: 'medium',
      title: 'Compliance Violation',
      message: `Device ${device.device_name} is non-compliant`,
      deviceId: device.id,
      deviceName: device.device_name,
      timestamp: device.updated_at,
      data: { complianceStatus: device.compliance_status }
    });
  });

  // High alerts: Failed commands
  const failedCommandsQuery = db('commands')
    .select([
      'commands.id',
      'commands.type',
      'commands.error_message',
      'commands.completed_at',
      'devices.device_name',
      'devices.id as device_id'
    ])
    .join('devices', 'commands.device_id', 'devices.id')
    .where('commands.status', 'failed')
    .where('commands.completed_at', '>', db.raw("NOW() - INTERVAL '24 hours'"));

  if (organizationId) {
    failedCommandsQuery.where('devices.organization_id', organizationId);
  }

  const failedCommands = await failedCommandsQuery;

  failedCommands.forEach(command => {
    alerts.push({
      id: uuidv4(),
      type: 'command_failed',
      severity: 'high',
      title: 'Command Failed',
      message: `Command '${command.type}' failed on device ${command.device_name}`,
      deviceId: command.device_id,
      deviceName: command.device_name,
      timestamp: command.completed_at,
      data: { 
        commandType: command.type, 
        errorMessage: command.error_message 
      }
    });
  });

  // Sort alerts by severity and timestamp
  const severityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
  alerts.sort((a, b) => {
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  // Filter by severity if requested
  let filteredAlerts = alerts;
  if (severity) {
    filteredAlerts = alerts.filter(alert => alert.severity === severity);
  }

  // Apply limit
  filteredAlerts = filteredAlerts.slice(0, parseInt(limit));

  res.json({
    alerts: filteredAlerts,
    summary: {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length
    }
  });
}));

// GET /api/monitoring/reports/devices - Generate device monitoring report
router.get('/reports/devices', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { 
    organizationId,
    startDate,
    endDate,
    format = 'json'
  } = req.query;

  let deviceQuery = db('devices')
    .select([
      'devices.*',
      'organizations.name as organization_name'
    ])
    .leftJoin('organizations', 'devices.organization_id', 'organizations.id');

  if (organizationId) {
    deviceQuery = deviceQuery.where('devices.organization_id', organizationId);
  }

  const devices = await deviceQuery;

  // Get detailed stats for each device
  const deviceReports = await Promise.all(
    devices.map(async (device) => {
      const [
        latestStatus,
        latestLocation,
        latestCompliance,
        commandStats
      ] = await Promise.all([
        db('device_status')
          .where('device_id', device.id)
          .orderBy('recorded_at', 'desc')
          .first(),
        db('device_locations')
          .where('device_id', device.id)
          .orderBy('recorded_at', 'desc')
          .first(),
        db('compliance_reports')
          .where('device_id', device.id)
          .orderBy('checked_at', 'desc')
          .first(),
        db('commands')
          .select('status')
          .count('* as count')
          .where('device_id', device.id)
          .groupBy('status')
      ]);

      return {
        device,
        latestStatus,
        latestLocation,
        latestCompliance,
        commandStats: commandStats.reduce((acc, stat) => {
          acc[stat.status] = parseInt(stat.count);
          return acc;
        }, {})
      };
    })
  );

  const report = {
    generatedAt: new Date(),
    organizationId,
    dateRange: { startDate, endDate },
    summary: {
      totalDevices: devices.length,
      enrolledDevices: devices.filter(d => d.status === 'enrolled').length,
      compliantDevices: devices.filter(d => d.compliance_status === 'compliant').length,
      onlineDevices: devices.filter(d => {
        const lastCheckin = new Date(d.last_checkin);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return lastCheckin > oneDayAgo;
      }).length
    },
    devices: deviceReports
  };

  res.json(report);
}));

module.exports = router;
