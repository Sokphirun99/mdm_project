const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const firebaseService = require('../services/firebaseService');
const { authorizeRole } = require('../middleware/auth');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation schemas
const sendCommandSchema = Joi.object({
  deviceIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  type: Joi.string().valid(
    'lock_device',
    'unlock_device', 
    'wipe_device',
    'reboot_device',
    'install_app',
    'uninstall_app',
    'update_policy',
    'get_location',
    'get_device_info',
    'set_password_policy',
    'disable_camera',
    'enable_camera',
    'disable_usb',
    'enable_usb',
    'custom_command'
  ).required(),
  parameters: Joi.object().default({}),
  priority: Joi.string().valid('low', 'normal', 'high', 'urgent').default('normal')
});

const commandResponseSchema = Joi.object({
  commandId: Joi.string().uuid().required(),
  status: Joi.string().valid('acknowledged', 'completed', 'failed').required(),
  response: Joi.string(),
  errorMessage: Joi.string()
});

// POST /api/commands/send - Send command to devices
router.post('/send', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { error, value } = sendCommandSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const { deviceIds, type, parameters, priority } = value;
  const issuedBy = req.user.id;

  // Validate devices exist and get FCM tokens
  const devices = await db('devices')
    .whereIn('id', deviceIds)
    .where('status', 'enrolled')
    .select('id', 'fcm_token', 'device_name');

  if (devices.length === 0) {
    throw new AppError('No valid enrolled devices found', 404, 'NO_DEVICES_FOUND');
  }

  const commands = [];
  const fcmPromises = [];

  // Create command records and prepare FCM messages
  for (const device of devices) {
    const commandId = uuidv4();
    
    // Insert command into database
    const command = {
      id: commandId,
      device_id: device.id,
      issued_by: issuedBy,
      type,
      parameters,
      status: 'pending'
    };

    commands.push(command);

    // Prepare FCM message if device has FCM token
    if (device.fcm_token) {
      const fcmPromise = firebaseService.sendCommand(
        device.fcm_token,
        type,
        {
          ...parameters,
          commandId,
          priority
        }
      ).then(() => {
        // Update command status to 'sent'
        return db('commands')
          .where('id', commandId)
          .update({ 
            status: 'sent', 
            sent_at: new Date() 
          });
      }).catch(error => {
        console.error(`Failed to send command to device ${device.id}:`, error);
        // Update command status to 'failed'
        return db('commands')
          .where('id', commandId)
          .update({ 
            status: 'failed', 
            error_message: error.message 
          });
      });

      fcmPromises.push(fcmPromise);
    }
  }

  // Insert all commands
  await db('commands').insert(commands);

  // Send FCM messages
  await Promise.allSettled(fcmPromises);

  res.json({
    message: `Commands sent to ${devices.length} device(s)`,
    commandIds: commands.map(cmd => cmd.id),
    devices: devices.map(device => ({
      id: device.id,
      name: device.device_name,
      hasFcmToken: !!device.fcm_token
    }))
  });
}));

// POST /api/commands/:id/response - Receive command response from device
router.post('/:id/response', asyncHandler(async (req, res) => {
  const { error, value } = commandResponseSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const commandId = req.params.id;
  const { status, response, errorMessage } = value;

  // Find command
  const command = await db('commands').where('id', commandId).first();
  if (!command) {
    throw new AppError('Command not found', 404, 'COMMAND_NOT_FOUND');
  }

  // Update command status
  const updateData = {
    status,
    response,
    error_message: errorMessage,
    updated_at: new Date()
  };

  if (status === 'acknowledged') {
    updateData.acknowledged_at = new Date();
  } else if (status === 'completed' || status === 'failed') {
    updateData.completed_at = new Date();
  }

  await db('commands')
    .where('id', commandId)
    .update(updateData);

  res.json({
    message: 'Command response recorded successfully'
  });
}));

// GET /api/commands - List commands
router.get('/', asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    deviceId, 
    type, 
    status,
    startDate,
    endDate 
  } = req.query;

  const offset = (page - 1) * limit;
  
  let query = db('commands')
    .select([
      'commands.*',
      'devices.device_name',
      'users.first_name as issuer_first_name',
      'users.last_name as issuer_last_name'
    ])
    .leftJoin('devices', 'commands.device_id', 'devices.id')
    .leftJoin('users', 'commands.issued_by', 'users.id');

  // Apply filters
  if (deviceId) {
    query = query.where('commands.device_id', deviceId);
  }

  if (type) {
    query = query.where('commands.type', type);
  }

  if (status) {
    query = query.where('commands.status', status);
  }

  if (startDate) {
    query = query.where('commands.created_at', '>=', startDate);
  }

  if (endDate) {
    query = query.where('commands.created_at', '<=', endDate);
  }

  // Get total count
  const totalQuery = query.clone();
  const [{ count }] = await totalQuery.count('commands.id as count');

  // Get paginated results
  const commands = await query
    .orderBy('commands.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  res.json({
    commands,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit)
    }
  });
}));

// GET /api/commands/:id - Get command details
router.get('/:id', asyncHandler(async (req, res) => {
  const command = await db('commands')
    .select([
      'commands.*',
      'devices.device_name',
      'devices.model',
      'users.first_name as issuer_first_name',
      'users.last_name as issuer_last_name'
    ])
    .leftJoin('devices', 'commands.device_id', 'devices.id')
    .leftJoin('users', 'commands.issued_by', 'users.id')
    .where('commands.id', req.params.id)
    .first();

  if (!command) {
    throw new AppError('Command not found', 404, 'COMMAND_NOT_FOUND');
  }

  res.json({ command });
}));

// DELETE /api/commands/:id - Cancel command
router.delete('/:id', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const commandId = req.params.id;

  const command = await db('commands').where('id', commandId).first();
  if (!command) {
    throw new AppError('Command not found', 404, 'COMMAND_NOT_FOUND');
  }

  if (!['pending', 'sent'].includes(command.status)) {
    throw new AppError('Cannot cancel command that is already processed', 400, 'CANNOT_CANCEL');
  }

  await db('commands')
    .where('id', commandId)
    .update({ 
      status: 'failed',
      error_message: 'Cancelled by user',
      completed_at: new Date(),
      updated_at: new Date()
    });

  res.json({
    message: 'Command cancelled successfully'
  });
}));

// POST /api/commands/bulk/lock - Bulk lock devices
router.post('/bulk/lock', authorizeRole(['admin', 'manager']), asyncHandler(async (req, res) => {
  const { deviceIds, message = 'Device locked by administrator' } = req.body;

  if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
    throw new AppError('Device IDs array is required', 400, 'MISSING_DEVICE_IDS');
  }

  const commandData = {
    deviceIds,
    type: 'lock_device',
    parameters: { message },
    priority: 'high'
  };

  req.body = commandData;
  
  // Reuse the send command logic
  const { error, value } = sendCommandSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const { type, parameters, priority } = value;
  const issuedBy = req.user.id;

  const devices = await db('devices')
    .whereIn('id', deviceIds)
    .where('status', 'enrolled')
    .select('id', 'fcm_token', 'device_name');

  if (devices.length === 0) {
    throw new AppError('No valid enrolled devices found', 404, 'NO_DEVICES_FOUND');
  }

  const commands = [];
  const fcmPromises = [];

  for (const device of devices) {
    const commandId = uuidv4();
    
    const command = {
      id: commandId,
      device_id: device.id,
      issued_by: issuedBy,
      type,
      parameters,
      status: 'pending'
    };

    commands.push(command);

    if (device.fcm_token) {
      const fcmPromise = firebaseService.sendCommand(
        device.fcm_token,
        type,
        { ...parameters, commandId, priority }
      ).then(() => {
        return db('commands')
          .where('id', commandId)
          .update({ status: 'sent', sent_at: new Date() });
      }).catch(error => {
        console.error(`Failed to send lock command to device ${device.id}:`, error);
        return db('commands')
          .where('id', commandId)
          .update({ status: 'failed', error_message: error.message });
      });

      fcmPromises.push(fcmPromise);
    }
  }

  await db('commands').insert(commands);
  await Promise.allSettled(fcmPromises);

  res.json({
    message: `Lock commands sent to ${devices.length} device(s)`,
    commandIds: commands.map(cmd => cmd.id)
  });
}));

// POST /api/commands/bulk/wipe - Bulk wipe devices
router.post('/bulk/wipe', authorizeRole(['admin']), asyncHandler(async (req, res) => {
  const { deviceIds, confirmText } = req.body;

  // Require confirmation for wipe command
  if (confirmText !== 'CONFIRM_WIPE') {
    throw new AppError('Wipe confirmation required', 400, 'WIPE_CONFIRMATION_REQUIRED');
  }

  if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
    throw new AppError('Device IDs array is required', 400, 'MISSING_DEVICE_IDS');
  }

  const commandData = {
    deviceIds,
    type: 'wipe_device',
    parameters: { confirmed: true },
    priority: 'urgent'
  };

  req.body = commandData;
  
  const { error, value } = sendCommandSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');
  }

  const { type, parameters, priority } = value;
  const issuedBy = req.user.id;

  const devices = await db('devices')
    .whereIn('id', deviceIds)
    .where('status', 'enrolled')
    .select('id', 'fcm_token', 'device_name');

  if (devices.length === 0) {
    throw new AppError('No valid enrolled devices found', 404, 'NO_DEVICES_FOUND');
  }

  const commands = [];
  const fcmPromises = [];

  for (const device of devices) {
    const commandId = uuidv4();
    
    const command = {
      id: commandId,
      device_id: device.id,
      issued_by: issuedBy,
      type,
      parameters,
      status: 'pending'
    };

    commands.push(command);

    if (device.fcm_token) {
      const fcmPromise = firebaseService.sendCommand(
        device.fcm_token,
        type,
        { ...parameters, commandId, priority }
      ).then(() => {
        return db('commands')
          .where('id', commandId)
          .update({ status: 'sent', sent_at: new Date() });
      }).catch(error => {
        console.error(`Failed to send wipe command to device ${device.id}:`, error);
        return db('commands')
          .where('id', commandId)
          .update({ status: 'failed', error_message: error.message });
      });

      fcmPromises.push(fcmPromise);
    }
  }

  await db('commands').insert(commands);
  await Promise.allSettled(fcmPromises);

  res.json({
    message: `Wipe commands sent to ${devices.length} device(s)`,
    commandIds: commands.map(cmd => cmd.id),
    warning: 'This action cannot be undone'
  });
}));

// GET /api/commands/stats - Get command statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const { deviceId, startDate, endDate } = req.query;

  let query = db('commands');
  
  if (deviceId) {
    query = query.where('device_id', deviceId);
  }

  if (startDate) {
    query = query.where('created_at', '>=', startDate);
  }

  if (endDate) {
    query = query.where('created_at', '<=', endDate);
  }

  const [
    totalCommands,
    pendingCommands,
    completedCommands,
    failedCommands,
    commandsByType
  ] = await Promise.all([
    query.clone().count('* as count').first(),
    query.clone().where('status', 'pending').count('* as count').first(),
    query.clone().where('status', 'completed').count('* as count').first(),
    query.clone().where('status', 'failed').count('* as count').first(),
    query.clone()
      .select('type')
      .count('* as count')
      .groupBy('type')
  ]);

  res.json({
    totalCommands: parseInt(totalCommands.count),
    pendingCommands: parseInt(pendingCommands.count),
    completedCommands: parseInt(completedCommands.count),
    failedCommands: parseInt(failedCommands.count),
    commandsByType: commandsByType.reduce((acc, item) => {
      acc[item.type] = parseInt(item.count);
      return acc;
    }, {})
  });
}));

module.exports = router;
