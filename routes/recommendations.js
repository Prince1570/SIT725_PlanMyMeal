import express from 'express';
import { getRecommendations, seedUsers } from '../controllers/recommendations.controller.js';

const router = express.Router();

// GET /api/recommendations (original route - backward compatible)
router.get('/', getRecommendations);

// GET /api/recommendations/:mood (new route with mood parameter)
router.get('/:mood', getRecommendations);

// POST /api/recommendations/seed - for testing
router.post('/seed', seedUsers);

export default router;
