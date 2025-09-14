const express = require('express');

const router = express.Router();
const recommendationsController = require('../controllers/recommendations.controller');

// Allow both GET (for browser testing) and POST (for API clients)
router.get('/api/recommendations', recommendationsController.getRecommendations);
router.post('/api/recommendations', recommendationsController.getRecommendations);

module.exports = router;
