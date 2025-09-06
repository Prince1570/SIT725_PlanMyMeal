const llmService = require('../services/llmService');

const mockUsers = [
    {
        userId: 'u1',
        dietaryType: 'vegetarian',
        allergies: ['peanut', 'shrimp'],
        calorieTarget: 600,
        mood: 'comforting'
    },
    {
        userId: 'u2',
        dietaryType: 'vegan',
        allergies: ['dairy', 'egg'],
        calorieTarget: 500,
        mood: 'energetic'
    },
    {
        userId: 'u3',
        dietaryType: 'omnivore',
        allergies: [],
        calorieTarget: 750,
        mood: 'light'
    },
    {
        userId: 'u4',
        dietaryType: 'pescatarian',
        allergies: ['shellfish'],
        calorieTarget: 650,
        mood: 'festive'
    },
    {
        userId: 'u5',
        dietaryType: 'keto',
        allergies: ['wheat'],
        calorieTarget: 800,
        mood: 'quick-and-easy'
    }
];

async function getRecommendations(req, res) {
    // Allow selecting a mock user for testing via query param or request body.
    // Example: GET /api/recommendations?userId=u2
    const requestedId = (req.query && req.query.userId) || (req.body && req.body.userId);
    let user;
    if (requestedId) {
        user = mockUsers.find(u => u.userId === requestedId);
        if (!user) user = mockUsers[1]; // fallback
    } else {
        // For now, default to mockUsers[3]
        user = mockUsers[1];
    }

    console.log(`recommendations: using user=${user.userId} dietaryType=${user.dietaryType} mood=${user.mood}`);

    try {
        const prompt = llmService.buildPrompt(user);
        const raw = await llmService.callGroqAPI(prompt);
        const parsed = llmService.parseResponse(raw);

        return res.json(parsed);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getRecommendations
};
