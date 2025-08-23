import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { log } from '../utils/logger';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    log('Fetching dashboard statistics');

    // Get counts from database
    const [
      totalUsers,
      totalDevices,
      activeDevices,
      totalOrganizations,
      totalPolicies,
      totalApps,
      recentCommands
    ] = await Promise.all([
      prisma.user.count(),
      prisma.device.count(),
      prisma.device.count({ where: { status: 'ENROLLED' } }),
      prisma.organization.count(),
      prisma.policy.count(),
      prisma.app.count(),
      prisma.command.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })
    ]);

    const stats = {
      users: {
        total: totalUsers,
        active: totalUsers // For now, assume all users are active
      },
      devices: {
        total: totalDevices,
        active: activeDevices,
        inactive: totalDevices - activeDevices
      },
      organizations: {
        total: totalOrganizations
      },
      policies: {
        total: totalPolicies
      },
      apps: {
        total: totalApps
      },
      commands: {
        recent: recentCommands
      },
      lastUpdated: new Date().toISOString()
    };

    log('Dashboard stats fetched successfully');
    res.json(stats);
  } catch (error) {
    log('Error fetching dashboard stats:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard statistics',
      message: 'Internal server error'
    });
  }
};
