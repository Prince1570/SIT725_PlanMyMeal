import bcrypt from 'bcrypt';
import { User } from '../models/users.schema.js';
import { UserProfile } from '../models/userProfile.schema.js';
import { Gender } from '../common/enum/gender.enum.js';

const mockUsersData = [
    {
        email: 'user1@test.com',
        username: 'vegetarian_user',
        password: 'password123',
        gender: Gender.FEMALE,
        profile: {
            dietaryType: 'vegetarian',
            allergies: ['peanut', 'shrimp'],
            calorieTarget: 600
        }
    },
    {
        email: 'user2@test.com',
        username: 'vegan_user',
        password: 'password123',
        gender: Gender.MALE,
        profile: {
            dietaryType: 'vegan',
            allergies: ['dairy', 'egg'],
            calorieTarget: 500
        }
    },
    {
        email: 'user3@test.com',
        username: 'omnivore_user',
        password: 'password123',
        gender: Gender.MALE,
        profile: {
            dietaryType: 'omnivore',
            allergies: [],
            calorieTarget: 750
        }
    },
    {
        email: 'user4@test.com',
        username: 'pescatarian_user',
        password: 'password123',
        gender: Gender.FEMALE,
        profile: {
            dietaryType: 'pescatarian',
            allergies: ['shellfish'],
            calorieTarget: 650
        }
    },
    {
        email: 'user5@test.com',
        username: 'keto_user',
        password: 'password123',
        gender: Gender.MALE,
        profile: {
            dietaryType: 'keto',
            allergies: ['wheat'],
            calorieTarget: 800
        }
    }
];

export async function seedMockUsers() {
    try {
        // Clear existing test users
        await User.deleteMany({ email: { $regex: '@test.com$' } });
        await UserProfile.deleteMany({});

        for (const userData of mockUsersData) {
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Create user
            const user = new User({
                email: userData.email,
                username: userData.username,
                password: hashedPassword,
                gender: userData.gender,
                dateOfBirth: new Date('1990-01-01') // Default date
            });

            const savedUser = await user.save();

            // Create user profile
            const userProfile = new UserProfile({
                userId: savedUser._id,
                dietaryType: userData.profile.dietaryType,
                allergies: userData.profile.allergies,
                calorieTarget: userData.profile.calorieTarget
            });

            await userProfile.save();
            console.log(`Seeded user: ${userData.username}`);
        }

        console.log('All mock users seeded successfully!');
        return { success: true, message: 'Mock users seeded successfully' };
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
}