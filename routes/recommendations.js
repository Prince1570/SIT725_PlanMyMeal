import express from 'express';
import { getRecommendations, seedUsers, getUserRecommendations } from '../controllers/recommendations.controller.js';

const router = express.Router();

// GET /api/recommendations (get recommendations for authenticated user)
router.get('/', getRecommendations);

// GET /api/recommendations/:mood (get recommendations with mood for authenticated user)
router.get('/:mood', getRecommendations);

// POST /api/recommendations/seed - for testing
router.post('/seed', seedUsers);

// GET /api/recommendations/user/:userId - get recommendations history for a specific user (for admin/testing)
router.get("/user/:userId", getUserRecommendations);

export default router;
