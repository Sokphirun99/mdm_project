import { Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { logger } from '../utils/logger';

export const getPolicies = async (req: Request, res: Response) => {
  try {
    const policies = await prisma.policy.findMany({
      include: {
        _count: {
          select: {
            devicePolicies: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the response to match frontend expectations
    const transformedPolicies = policies.map(policy => ({
      id: policy.id,
      name: policy.name,
      description: policy.description,
      type: policy.type.toLowerCase(),
      status: policy.isActive ? 'active' : 'inactive',
      deviceCount: policy._count.devicePolicies,
      createdAt: policy.createdAt,
      updatedAt: policy.updatedAt
    }));

    res.json(transformedPolicies);
  } catch (error) {
    logger.error('Error fetching policies:', error);
    res.status(500).json({
      error: 'Failed to fetch policies',
      message: 'Internal server error'
    });
  }
};

export const getPolicyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        devicePolicies: {
          include: {
            device: {
              select: {
                id: true,
                deviceName: true,
                model: true,
                status: true
              }
            }
          }
        }
      }
    });

    if (!policy) {
      return res.status(404).json({
        error: 'Policy not found'
      });
    }

    return res.json(policy);
  } catch (error) {
    logger.error('Error fetching policy:', error);
    return res.status(500).json({
      error: 'Failed to fetch policy',
      message: 'Internal server error'
    });
  }
};

export const createPolicy = async (req: Request, res: Response) => {
  try {
    const { name, description, type, settings, isActive = true } = req.body;

    const policy = await prisma.policy.create({
      data: {
        name,
        description,
        type: type.toUpperCase(),
        settings: settings || {},
        isActive
      }
    });

    res.status(201).json(policy);
  } catch (error) {
    logger.error('Error creating policy:', error);
    res.status(500).json({
      error: 'Failed to create policy',
      message: 'Internal server error'
    });
  }
};

export const updatePolicy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert type to uppercase if provided
    if (updateData.type) {
      updateData.type = updateData.type.toUpperCase();
    }

    const policy = await prisma.policy.update({
      where: { id },
      data: updateData
    });

    res.json(policy);
  } catch (error) {
    logger.error('Error updating policy:', error);
    res.status(500).json({
      error: 'Failed to update policy',
      message: 'Internal server error'
    });
  }
};

export const deletePolicy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // First, remove any device associations
    await prisma.devicePolicy.deleteMany({
      where: { policyId: id }
    });

    // Then delete the policy
    await prisma.policy.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting policy:', error);
    res.status(500).json({
      error: 'Failed to delete policy',
      message: 'Internal server error'
    });
  }
};
