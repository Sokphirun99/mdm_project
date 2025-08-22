const express = require('express');
const db = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', asyncHandler(async (req, res) => {
  // Get device counts
  const deviceStats = await db('devices')
    .select(
      db.raw('COUNT(*) as total_devices'),
      db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as online_devices', ['online']),
      db.raw('COUNT(CASE WHEN status = ? THEN 1 END) as offline_devices', ['offline'])
    )
    .first();

  // Get pending commands
  const commandStats = await db('commands')
    .where('status', 'pending')
    .count('* as pending_commands')
    .first();

  // Get active policies
  const policyStats = await db('policies')
    .where('is_active', true)
    .count('* as active_policies')
    .first();

  const stats = {
    totalDevices: parseInt(deviceStats?.total_devices) || 0,
    onlineDevices: parseInt(deviceStats?.online_devices) || 0,
    offlineDevices: parseInt(deviceStats?.offline_devices) || 0,
    pendingCommands: parseInt(commandStats?.pending_commands) || 0,
    activePolicies: parseInt(policyStats?.active_policies) || 0
  };

  res.json({
    success: true,
    data: stats
  });
}));

module.exports = router;
