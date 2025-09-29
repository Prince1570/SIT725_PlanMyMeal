import llmService from '../services/llmService.js';
import { UserProfile } from '../models/userProfile.schema.js';
import { Recommendation } from '../models/recommendation.schema.js';
import jwt from 'jsonwebtoken';

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

        // Extract JWT token from Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Bearer token

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        let userId;
        try {
            // Verify and decode JWT token
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
            console.log(`Decoded JWT for userId=${userId}`);
        } catch (tokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        let user;

        // Try to get user from database using JWT userId
        if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) { // Check if it's a valid MongoDB ObjectId
            const userProfile = await UserProfile.findOne({ userId }).populate('userId');
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

        // Fallback to mock users if no database user found (for testing)
        if (!user) {
            console.warn('No user profile found in database, using mock user for testing');
            user = mockUsers[2]; // default mock user

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
