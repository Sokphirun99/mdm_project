const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const firebaseService = require('../services/firebaseService');
const { authorizeRole } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation schemas
const createPolicySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  type: Joi.string().valid('security', 'app', 'device', 'network').required(),
  settings: Joi.object().required(),
  organizationId: Joi.string().uuid(),
  priority: Joi.number().integer().min(0).max(100).default(0),
  isActive: Joi.boolean().default(true)
});

const updatePolicySchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().max(500),
  settings: Joi.object(),
  priority: Joi.number().integer().min(0).max(100),
  isActive: Joi.boolean()
});

const applyPolicySchema = Joi.object({
  deviceIds: Joi.array().items(Joi.string().uuid()).min(1).required()
});

// GET /api/policies - List all policies
router.get('/', asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    type, 
    organizationId,
    isActive,
    search 
  } = req.query;

  const offset = (page - 1) * limit;
  
  let query = db('policies')
    .select([
      'policies.*',
      'organizations.name as organization_name'
    ])
    .leftJoin('organizations', 'policies.organization_id', 'organizations.id');

  // Apply filters
  if (type) {
    query = query.where('policies.type', type);
  }

  if (organizationId) {
    query = query.where('policies.organization_id', organizationId);
  }

  if (isActive !== undefined) {
    query = query.where('policies.is_active', isActive === 'true');
  }

  if (search) {
    query = query.where(function() {
      this.where('policies.name', 'ilike', `%${search}%`)
          .orWhere('policies.description', 'ilike', `%${search}%`);
    });
  }

  // Get total count
  const totalQuery = query.clone();
  const [{ count }] = await totalQuery.count('policies.id as count');

  // Get paginated results
  const policies = await query
    .orderBy('policies.priority', 'desc')
    .orderBy('policies.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  // Get device count for each policy
  const policiesWithDeviceCount = await Promise.all(
    policies.map(async (policy) => {
      const [{ count: deviceCount }] = await db('device_policies')
        .where('policy_id', policy.id)
        .count('device_id as count');
      
      return {
        ...policy,
        deviceCount: parseInt(deviceCount)
      };
    })
  );

  res.json({
    policies: policiesWithDeviceCount,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit)
    }
  });
}));

// GET /api/policies/:id - Get policy details
router.get('/:id', asyncHandler(async (req, res) => {
  const policy = await db('policies')
    .select([
      'policies.*',
      'organizations.name as organization_name'
    ])
    .leftJoin('organizations', 'policies.organization_id', 'organizations.id')
    .where('policies.id', req.params.id)
    .first();

  if (!policy) {
    throw new AppError('Policy not found', 404, 'POLICY_NOT_FOUND');
  }

  // Get assigned devices
  const assignedDevices = await db('device_policies')
    .select([
      'device_policies.*',
      'devices.device_name',
      'devices.model',
      'devices.status as device_status'
    ])
    .join('devices', 'device_policies.device_id', 'devices.id')
    .where('device_policies.policy_id', policy.id);

  res.json({
    policy,
    assignedDevices
  });
}));

// POST /api/policies - Create new policy
router.post('/', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { error, value } = createPolicySchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const {
    name,
    description,
    type,
    settings,
    organizationId,
    priority,
    isActive
  } = value;

  // Validate policy settings based on type
  const validationError = validatePolicySettings(type, settings);
  if (validationError) {
    throw new AppError(validationError, 400, 'INVALID_POLICY_SETTINGS');
  }

  // Create policy
  const [newPolicy] = await db('policies')
    .insert({
      id: uuidv4(),
      organization_id: organizationId,
      name,
      description,
      type,
      settings,
      priority,
      is_active: isActive
    })
    .returning('*');

  res.status(201).json({
    message: 'Policy created successfully',
    policy: newPolicy
  });
}));

// PUT /api/policies/:id - Update policy
router.put('/:id', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { error, value } = updatePolicySchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const policyId = req.params.id;

  // Check if policy exists
  const policy = await db('policies').where('id', policyId).first();
  if (!policy) {
    throw new AppError('Policy not found', 404, 'POLICY_NOT_FOUND');
  }

  // Validate settings if provided
  if (value.settings) {
    const validationError = validatePolicySettings(policy.type, value.settings);
    if (validationError) {
      throw new AppError(validationError, 400, 'INVALID_POLICY_SETTINGS');
    }
  }

  // Update policy
  const [updatedPolicy] = await db('policies')
    .where('id', policyId)
    .update({
      ...value,
      updated_at: new Date()
    })
    .returning('*');

  // If policy is active and settings changed, notify affected devices
  if (updatedPolicy.is_active && value.settings) {
    await notifyDevicesOfPolicyUpdate(policyId);
  }

  res.json({
    message: 'Policy updated successfully',
    policy: updatedPolicy
  });
}));

// DELETE /api/policies/:id - Delete policy
router.delete('/:id', authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const policyId = req.params.id;

  // Check if policy exists
  const policy = await db('policies').where('id', policyId).first();
  if (!policy) {
    throw new AppError('Policy not found', 404, 'POLICY_NOT_FOUND');
  }

  // Remove policy from all devices first
  await db('device_policies').where('policy_id', policyId).del();

  // Delete policy
  await db('policies').where('id', policyId).del();

  res.json({
    message: 'Policy deleted successfully'
  });
}));

// POST /api/policies/:id/apply - Apply policy to devices
router.post('/:id/apply', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { error, value } = applyPolicySchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const policyId = req.params.id;
  const { deviceIds } = value;

  // Check if policy exists and is active
  const policy = await db('policies').where('id', policyId).first();
  if (!policy) {
    throw new AppError('Policy not found', 404, 'POLICY_NOT_FOUND');
  }

  if (!policy.is_active) {
    throw new AppError('Cannot apply inactive policy', 400, 'POLICY_INACTIVE');
  }

  // Validate devices exist and are enrolled
  const devices = await db('devices')
    .whereIn('id', deviceIds)
    .where('status', 'enrolled')
    .select('id', 'fcm_token', 'device_name');

  if (devices.length === 0) {
    throw new AppError('No valid enrolled devices found', 404, 'NO_DEVICES_FOUND');
  }

  // Apply policy to devices
  const devicePolicyRecords = devices.map(device => ({
    device_id: device.id,
    policy_id: policyId,
    status: 'pending'
  }));

  // Use upsert to handle existing records
  await db.transaction(async (trx) => {
    for (const record of devicePolicyRecords) {
      await trx('device_policies')
        .insert(record)
        .onConflict(['device_id', 'policy_id'])
        .merge({
          status: 'pending',
          applied_at: null,
          error_message: null,
          updated_at: trx.fn.now()
        });
    }
  });

  // Send policy update command to devices
  const commandPromises = devices.map(async (device) => {
    if (device.fcm_token) {
      try {
        await firebaseService.sendCommand(
          device.fcm_token,
          'update_policy',
          {
            policyId: policy.id,
            policyType: policy.type,
            settings: policy.settings
          }
        );
      } catch (error) {
        console.error(`Failed to send policy update to device ${device.id}:`, error);
      }
    }
  });

  await Promise.allSettled(commandPromises);

  res.json({
    message: `Policy applied to ${devices.length} device(s)`,
    appliedDevices: devices.map(device => ({
      id: device.id,
      name: device.device_name
    }))
  });
}));

// DELETE /api/policies/:id/remove/:deviceId - Remove policy from device
router.delete('/:id/remove/:deviceId', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { id: policyId, deviceId } = req.params;

  // Check if assignment exists
  const devicePolicy = await db('device_policies')
    .where({ policy_id: policyId, device_id: deviceId })
    .first();

  if (!devicePolicy) {
    throw new AppError('Policy assignment not found', 404, 'ASSIGNMENT_NOT_FOUND');
  }

  // Remove assignment
  await db('device_policies')
    .where({ policy_id: policyId, device_id: deviceId })
    .del();

  // Get device FCM token and notify
  const device = await db('devices')
    .where('id', deviceId)
    .select('fcm_token', 'device_name')
    .first();

  if (device && device.fcm_token) {
    try {
      await firebaseService.sendCommand(
        device.fcm_token,
        'remove_policy',
        { policyId }
      );
    } catch (error) {
      console.error(`Failed to send policy removal to device ${deviceId}:`, error);
    }
  }

  res.json({
    message: 'Policy removed from device successfully'
  });
}));

// GET /api/policies/templates - Get policy templates
router.get('/templates/list', asyncHandler(async (req, res) => {
  const templates = {
    security: [
      {
        name: 'Password Policy',
        description: 'Enforce strong password requirements',
        settings: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          maxFailedAttempts: 5,
          lockoutDuration: 300
        }
      },
      {
        name: 'Device Restrictions',
        description: 'Restrict device features for security',
        settings: {
          disableCamera: false,
          disableUSB: false,
          disablePlayStore: false,
          disableScreenshot: false,
          disableBluetooth: false,
          disableWifi: false
        }
      }
    ],
    app: [
      {
        name: 'App Whitelist',
        description: 'Allow only specific applications',
        settings: {
          mode: 'whitelist',
          allowedApps: [
            'com.android.chrome',
            'com.microsoft.office.outlook',
            'com.zoom.us'
          ]
        }
      },
      {
        name: 'App Blacklist',
        description: 'Block specific applications',
        settings: {
          mode: 'blacklist',
          blockedApps: [
            'com.facebook.katana',
            'com.instagram.android',
            'com.snapchat.android'
          ]
        }
      }
    ],
    device: [
      {
        name: 'Device Configuration',
        description: 'Configure device settings',
        settings: {
          autoUpdateApps: true,
          autoUpdateSystem: false,
          allowFactoryReset: false,
          allowSafeBoot: false,
          maxScreenIdleTime: 300
        }
      }
    ],
    network: [
      {
        name: 'WiFi Configuration',
        description: 'Configure WiFi settings',
        settings: {
          allowedNetworks: ['CompanyWiFi'],
          blockedNetworks: ['GuestNetwork'],
          requireCertificate: true
        }
      }
    ]
  };

  res.json({ templates });
}));

// GET /api/policies/stats - Get policy statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const { organizationId } = req.query;

  let query = db('policies');
  if (organizationId) {
    query = query.where('organization_id', organizationId);
  }

  const [
    totalPolicies,
    activePolicies,
    inactivePolicies,
    policiesByType
  ] = await Promise.all([
    query.clone().count('* as count').first(),
    query.clone().where('is_active', true).count('* as count').first(),
    query.clone().where('is_active', false).count('* as count').first(),
    query.clone()
      .select('type')
      .count('* as count')
      .groupBy('type')
  ]);

  res.json({
    totalPolicies: parseInt(totalPolicies.count),
    activePolicies: parseInt(activePolicies.count),
    inactivePolicies: parseInt(inactivePolicies.count),
    policiesByType: policiesByType.reduce((acc, item) => {
      acc[item.type] = parseInt(item.count);
      return acc;
    }, {})
  });
}));

// Helper function to validate policy settings
function validatePolicySettings(type, settings) {
  switch (type) {
    case 'security':
      if (settings.minLength && (settings.minLength < 4 || settings.minLength > 32)) {
        return 'Password minimum length must be between 4 and 32';
      }
      if (settings.maxFailedAttempts && (settings.maxFailedAttempts < 1 || settings.maxFailedAttempts > 20)) {
        return 'Max failed attempts must be between 1 and 20';
      }
      break;
    
    case 'app':
      if (settings.mode && !['whitelist', 'blacklist'].includes(settings.mode)) {
        return 'App mode must be either whitelist or blacklist';
      }
      break;
    
    case 'device':
      if (settings.maxScreenIdleTime && (settings.maxScreenIdleTime < 30 || settings.maxScreenIdleTime > 3600)) {
        return 'Screen idle time must be between 30 seconds and 1 hour';
      }
      break;
    
    case 'network':
      // Add network-specific validations
      break;
  }
  
  return null; // No validation errors
}

// Helper function to notify devices of policy updates
async function notifyDevicesOfPolicyUpdate(policyId) {
  const devicePolicies = await db('device_policies')
    .select([
      'device_policies.device_id',
      'devices.fcm_token',
      'policies.type',
      'policies.settings'
    ])
    .join('devices', 'device_policies.device_id', 'devices.id')
    .join('policies', 'device_policies.policy_id', 'policies.id')
    .where('device_policies.policy_id', policyId)
    .where('devices.status', 'enrolled');

  const notificationPromises = devicePolicies.map(async (devicePolicy) => {
    if (devicePolicy.fcm_token) {
      try {
        await firebaseService.sendCommand(
          devicePolicy.fcm_token,
          'update_policy',
          {
            policyId,
            policyType: devicePolicy.type,
            settings: devicePolicy.settings
          }
        );
      } catch (error) {
        console.error(`Failed to notify device ${devicePolicy.device_id} of policy update:`, error);
      }
    }
  });

  await Promise.allSettled(notificationPromises);
}

module.exports = router;
