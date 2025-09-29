import express from 'express';
import { createUserProfile, getUserProfile, updateUserProfile } from '../controllers/userProfile.controller.js';

const router = express.Router();

// POST /api/profile - create user profile
router.post('/', createUserProfile);

// GET /api/profile - get user profile
router.get('/', getUserProfile);

// PUT /api/profile - update user profile
router.put('/', updateUserProfile);

export default router;