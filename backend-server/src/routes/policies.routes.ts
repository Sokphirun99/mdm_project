import { Router } from 'express';
import { getPolicies, createPolicy, updatePolicy, deletePolicy, getPolicyById } from '../controllers/policies.controller';

const router = Router();

// Get all policies
router.get('/', getPolicies);

// Get policy by ID
router.get('/:id', getPolicyById);

// Create new policy
router.post('/', createPolicy);

// Update policy
router.put('/:id', updatePolicy);

// Delete policy
router.delete('/:id', deletePolicy);

export default router;
