import { UserProfile } from '../models/userProfile.schema.js';
import jwt from 'jsonwebtoken';

export const createUserProfile = async (req, res) => {
    try {
        const { dietaryType, allergies, calorieTarget } = req.body;
        const token = req.headers.authorization?.split(' ')[1]; // Bearer token

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify and decode token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        // Check if profile already exists
        const existingProfile = await UserProfile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({ error: 'User profile already exists' });
        }

        // Create new profile
        const userProfile = new UserProfile({
            userId,
            dietaryType,
            allergies: allergies || [],
            calorieTarget
        });

        await userProfile.save();

        res.status(201).json({
            message: 'User profile created successfully',
            profile: userProfile
        });
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const userProfile = await UserProfile.findOne({ userId }).populate('userId');

        if (!userProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        res.json({
            message: 'User profile retrieved successfully',
            profile: userProfile
        });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { dietaryType, allergies, calorieTarget } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const updatedProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { dietaryType, allergies, calorieTarget },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        res.json({
            message: 'User profile updated successfully',
            profile: updatedProfile
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: error.message });
    }
};