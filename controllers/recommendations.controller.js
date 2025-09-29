import llmService from '../services/llmService.js';
import { UserProfile } from '../models/userProfile.schema.js';
import { Recommendation } from '../models/recommendation.schema.js';

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
    try {
        const { mood } = req.params; // Get mood from URL parameter
        const requestedId = (req.query && req.query.userId) || (req.body && req.body.userId);

        let user;

        // Try to get user from database first
        if (requestedId && requestedId.match(/^[0-9a-fA-F]{24}$/)) { // Check if it's a valid MongoDB ObjectId
            const userProfile = await UserProfile.findOne({ userId: requestedId }).populate('userId');
            if (userProfile) {
                user = {
                    userId: userProfile.userId._id,
                    dietaryType: userProfile.dietaryType,
                    allergies: userProfile.allergies,
                    calorieTarget: userProfile.calorieTarget,
                    mood: mood || 'light' // Use mood from URL or default
                };
            }
        }

        // Fallback to mock users if no database user found
        if (!user) {
            if (requestedId) {
                user = mockUsers.find(u => u.userId === requestedId);
                if (!user) user = mockUsers[2]; // fallback
            } else {
                user = mockUsers[2]; // default
            }

            // Override mood if provided in URL
            if (mood) {
                user = { ...user, mood: mood };
            }
        }

        console.log(`recommendations: using user=${user.userId} dietaryType=${user.dietaryType} mood=${user.mood}`);

        const prompt = llmService.buildPrompt(user);
        const raw = await llmService.callGroqAPI(prompt);
        const parsed = llmService.parseResponse(raw);

        // Save to database if user is from database (has ObjectId)
        if (user.userId && user.userId.toString().match(/^[0-9a-fA-F]{24}$/)) {
            try {
                const recommendation = new Recommendation({
                    userId: user.userId,
                    mood: user.mood,
                    items: parsed.items
                });
                await recommendation.save();
                console.log('Recommendation saved to database');
            } catch (dbError) {
                console.warn('Failed to save recommendation to database:', dbError.message);
                // Continue without saving to DB
            }
        }

        return res.json(parsed);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

// Function to seed mock users (for testing)
async function seedUsers(req, res) {
    try {
        const { seedMockUsers } = await import('../utils/seedUsers.js');
        const result = await seedMockUsers();
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Add this new controller function
export const getUserRecommendations = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const recommendations = await llmService.getUserRecommendationsByUserId(userId);

        return res.json(recommendations);
    } catch (error) {
        console.error("Error getting user recommendations:", error);
        return res.status(500).json({
            error: "Failed to retrieve user recommendations"
        });
    }
};

export {
    getRecommendations,
    seedUsers
};
