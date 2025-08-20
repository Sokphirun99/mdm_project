const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const firebaseService = require('../services/firebaseService');
const { authorizeRole } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation schemas
const createAppSchema = Joi.object({
  packageName: Joi.string().required(),
  appName: Joi.string().required(),
  version: Joi.string(),
  versionCode: Joi.string(),
  description: Joi.string(),
  iconUrl: Joi.string().uri(),
  apkUrl: Joi.string().uri(),
  fileSize: Joi.number().integer().positive(),
  fileHash: Joi.string(),
  installType: Joi.string().valid('required', 'optional', 'blocked').default('optional'),
  isSystemApp: Joi.boolean().default(false),
  permissions: Joi.array().items(Joi.string()).default([]),
  organizationId: Joi.string().uuid()
});

const updateAppSchema = Joi.object({
  appName: Joi.string(),
  version: Joi.string(),
  versionCode: Joi.string(),
  description: Joi.string(),
  iconUrl: Joi.string().uri(),
  apkUrl: Joi.string().uri(),
  fileSize: Joi.number().integer().positive(),
  fileHash: Joi.string(),
  installType: Joi.string().valid('required', 'optional', 'blocked'),
  permissions: Joi.array().items(Joi.string())
});

const installAppSchema = Joi.object({
  deviceIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  silent: Joi.boolean().default(true)
});

// GET /api/apps - List all apps
router.get('/', asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    organizationId,
    installType,
    search 
  } = req.query;

  const offset = (page - 1) * limit;
  
  let query = db('apps')
    .select([
      'apps.*',
      'organizations.name as organization_name'
    ])
    .leftJoin('organizations', 'apps.organization_id', 'organizations.id');

  // Apply filters
  if (organizationId) {
    query = query.where('apps.organization_id', organizationId);
  }

  if (installType) {
    query = query.where('apps.install_type', installType);
  }

  if (search) {
    query = query.where(function() {
      this.where('apps.app_name', 'ilike', `%${search}%`)
          .orWhere('apps.package_name', 'ilike', `%${search}%`)
          .orWhere('apps.description', 'ilike', `%${search}%`);
    });
  }

  // Get total count
  const totalQuery = query.clone();
  const [{ count }] = await totalQuery.count('apps.id as count');

  // Get paginated results
  const apps = await query
    .orderBy('apps.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  // Get installation stats for each app
  const appsWithStats = await Promise.all(
    apps.map(async (app) => {
      const [
        { count: totalInstalls },
        { count: pendingInstalls },
        { count: failedInstalls }
      ] = await Promise.all([
        db('device_apps').where('app_id', app.id).count('* as count').first(),
        db('device_apps').where({ app_id: app.id, status: 'pending_install' }).count('* as count').first(),
        db('device_apps').where({ app_id: app.id, status: 'failed' }).count('* as count').first()
      ]);

      return {
        ...app,
        installStats: {
          total: parseInt(totalInstalls),
          pending: parseInt(pendingInstalls),
          failed: parseInt(failedInstalls)
        }
      };
    })
  );

  res.json({
    apps: appsWithStats,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit)
    }
  });
}));

// GET /api/apps/:id - Get app details
router.get('/:id', asyncHandler(async (req, res) => {
  const app = await db('apps')
    .select([
      'apps.*',
      'organizations.name as organization_name'
    ])
    .leftJoin('organizations', 'apps.organization_id', 'organizations.id')
    .where('apps.id', req.params.id)
    .first();

  if (!app) {
    throw new AppError('App not found', 404, 'APP_NOT_FOUND');
  }

  // Get device installations
  const deviceInstallations = await db('device_apps')
    .select([
      'device_apps.*',
      'devices.device_name',
      'devices.model',
      'devices.status as device_status'
    ])
    .join('devices', 'device_apps.device_id', 'devices.id')
    .where('device_apps.app_id', app.id);

  res.json({
    app,
    deviceInstallations
  });
}));

// POST /api/apps - Create new app
router.post('/', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { error, value } = createAppSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const {
    packageName,
    appName,
    version,
    versionCode,
    description,
    iconUrl,
    apkUrl,
    fileSize,
    fileHash,
    installType,
    isSystemApp,
    permissions,
    organizationId
  } = value;

  // Check if app with same package name exists in organization
  const existingApp = await db('apps')
    .where({ package_name: packageName, organization_id: organizationId })
    .first();

  if (existingApp) {
    throw new AppError('App with this package name already exists', 409, 'APP_EXISTS');
  }

  // Create app
  const [newApp] = await db('apps')
    .insert({
      id: uuidv4(),
      organization_id: organizationId,
      package_name: packageName,
      app_name: appName,
      version,
      version_code: versionCode,
      description,
      icon_url: iconUrl,
      apk_url: apkUrl,
      file_size: fileSize,
      file_hash: fileHash,
      install_type: installType,
      is_system_app: isSystemApp,
      permissions
    })
    .returning('*');

  res.status(201).json({
    message: 'App created successfully',
    app: newApp
  });
}));

// PUT /api/apps/:id - Update app
router.put('/:id', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { error, value } = updateAppSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const appId = req.params.id;

  // Check if app exists
  const app = await db('apps').where('id', appId).first();
  if (!app) {
    throw new AppError('App not found', 404, 'APP_NOT_FOUND');
  }

  // Update app
  const [updatedApp] = await db('apps')
    .where('id', appId)
    .update({
      ...value,
      updated_at: new Date()
    })
    .returning('*');

  res.json({
    message: 'App updated successfully',
    app: updatedApp
  });
}));

// DELETE /api/apps/:id - Delete app
router.delete('/:id', authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const appId = req.params.id;

  // Check if app exists
  const app = await db('apps').where('id', appId).first();
  if (!app) {
    throw new AppError('App not found', 404, 'APP_NOT_FOUND');
  }

  // Remove app from all devices first
  await db('device_apps').where('app_id', appId).del();

  // Delete app
  await db('apps').where('id', appId).del();

  res.json({
    message: 'App deleted successfully'
  });
}));

// POST /api/apps/:id/install - Install app on devices
router.post('/:id/install', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { error, value } = installAppSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const appId = req.params.id;
  const { deviceIds, silent } = value;

  // Check if app exists
  const app = await db('apps').where('id', appId).first();
  if (!app) {
    throw new AppError('App not found', 404, 'APP_NOT_FOUND');
  }

  // Validate devices exist and are enrolled
  const devices = await db('devices')
    .whereIn('id', deviceIds)
    .where('status', 'enrolled')
    .select('id', 'fcm_token', 'device_name');

  if (devices.length === 0) {
    throw new AppError('No valid enrolled devices found', 404, 'NO_DEVICES_FOUND');
  }

  // Create device app records
  const deviceAppRecords = devices.map(device => ({
    id: uuidv4(),
    device_id: device.id,
    app_id: appId,
    status: 'pending_install'
  }));

  // Use upsert to handle existing records
  await db.transaction(async (trx) => {
    for (const record of deviceAppRecords) {
      await trx('device_apps')
        .insert(record)
        .onConflict(['device_id', 'app_id'])
        .merge({
          status: 'pending_install',
          installed_at: null,
          error_message: null,
          updated_at: trx.fn.now()
        });
    }
  });

  // Send install commands to devices
  const commandPromises = devices.map(async (device) => {
    if (device.fcm_token) {
      try {
        await firebaseService.sendCommand(
          device.fcm_token,
          'install_app',
          {
            packageName: app.package_name,
            appName: app.app_name,
            apkUrl: app.apk_url,
            fileSize: app.file_size,
            fileHash: app.file_hash,
            silent,
            permissions: app.permissions
          }
        );
      } catch (error) {
        console.error(`Failed to send install command to device ${device.id}:`, error);
        // Update status to failed
        await db('device_apps')
          .where({ device_id: device.id, app_id: appId })
          .update({
            status: 'failed',
            error_message: error.message,
            updated_at: new Date()
          });
      }
    }
  });

  await Promise.allSettled(commandPromises);

  res.json({
    message: `App installation initiated on ${devices.length} device(s)`,
    targetDevices: devices.map(device => ({
      id: device.id,
      name: device.device_name
    }))
  });
}));

// POST /api/apps/:id/uninstall - Uninstall app from devices
router.post('/:id/uninstall', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { error, value } = installAppSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const appId = req.params.id;
  const { deviceIds } = value;

  // Check if app exists
  const app = await db('apps').where('id', appId).first();
  if (!app) {
    throw new AppError('App not found', 404, 'APP_NOT_FOUND');
  }

  // Validate devices exist and are enrolled
  const devices = await db('devices')
    .whereIn('id', deviceIds)
    .where('status', 'enrolled')
    .select('id', 'fcm_token', 'device_name');

  if (devices.length === 0) {
    throw new AppError('No valid enrolled devices found', 404, 'NO_DEVICES_FOUND');
  }

  // Update device app records to pending_uninstall
  await db('device_apps')
    .whereIn('device_id', deviceIds)
    .where('app_id', appId)
    .update({
      status: 'pending_uninstall',
      updated_at: new Date()
    });

  // Send uninstall commands to devices
  const commandPromises = devices.map(async (device) => {
    if (device.fcm_token) {
      try {
        await firebaseService.sendCommand(
          device.fcm_token,
          'uninstall_app',
          {
            packageName: app.package_name,
            appName: app.app_name
          }
        );
      } catch (error) {
        console.error(`Failed to send uninstall command to device ${device.id}:`, error);
        // Update status to failed
        await db('device_apps')
          .where({ device_id: device.id, app_id: appId })
          .update({
            status: 'failed',
            error_message: error.message,
            updated_at: new Date()
          });
      }
    }
  });

  await Promise.allSettled(commandPromises);

  res.json({
    message: `App uninstallation initiated on ${devices.length} device(s)`,
    targetDevices: devices.map(device => ({
      id: device.id,
      name: device.device_name
    }))
  });
}));

// POST /api/apps/installation-status - Update app installation status (called by device)
router.post('/installation-status', asyncHandler(async (req, res) => {
  const {
    deviceId,
    packageName,
    status,
    installedVersion,
    errorMessage
  } = req.body;

  if (!deviceId || !packageName || !status) {
    throw new AppError('Device ID, package name, and status are required', 400, 'MISSING_FIELDS');
  }

  // Find the app
  const app = await db('apps').where('package_name', packageName).first();
  if (!app) {
    throw new AppError('App not found', 404, 'APP_NOT_FOUND');
  }

  // Update device app status
  const updateData = {
    status,
    error_message: errorMessage,
    updated_at: new Date()
  };

  if (status === 'installed') {
    updateData.installed_at = new Date();
    updateData.installed_version = installedVersion;
  }

  await db('device_apps')
    .where({ device_id: deviceId, app_id: app.id })
    .update(updateData);

  res.json({
    message: 'Installation status updated successfully'
  });
}));

// GET /api/apps/device/:deviceId - Get apps for specific device
router.get('/device/:deviceId', asyncHandler(async (req, res) => {
  const deviceId = req.params.deviceId;

  // Check if device exists
  const device = await db('devices').where('id', deviceId).first();
  if (!device) {
    throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
  }

  const deviceApps = await db('device_apps')
    .select([
      'device_apps.*',
      'apps.package_name',
      'apps.app_name',
      'apps.version',
      'apps.icon_url',
      'apps.install_type'
    ])
    .join('apps', 'device_apps.app_id', 'apps.id')
    .where('device_apps.device_id', deviceId)
    .orderBy('device_apps.updated_at', 'desc');

  res.json({
    deviceId,
    apps: deviceApps
  });
}));

// GET /api/apps/stats - Get app statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const { organizationId } = req.query;

  let query = db('apps');
  if (organizationId) {
    query = query.where('organization_id', organizationId);
  }

  const [
    totalApps,
    requiredApps,
    optionalApps,
    blockedApps,
    appsByType
  ] = await Promise.all([
    query.clone().count('* as count').first(),
    query.clone().where('install_type', 'required').count('* as count').first(),
    query.clone().where('install_type', 'optional').count('* as count').first(),
    query.clone().where('install_type', 'blocked').count('* as count').first(),
    query.clone()
      .select('install_type')
      .count('* as count')
      .groupBy('install_type')
  ]);

  // Get installation statistics
  const installationStats = await db('device_apps')
    .select('status')
    .count('* as count')
    .groupBy('status');

  res.json({
    totalApps: parseInt(totalApps.count),
    requiredApps: parseInt(requiredApps.count),
    optionalApps: parseInt(optionalApps.count),
    blockedApps: parseInt(blockedApps.count),
    appsByType: appsByType.reduce((acc, item) => {
      acc[item.install_type] = parseInt(item.count);
      return acc;
    }, {}),
    installationStats: installationStats.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {})
  });
}));

module.exports = router;
