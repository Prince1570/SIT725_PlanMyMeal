import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const UserProfileSchema = new Schema({
    userId: { type: ObjectId, ref: "User", required: true, unique: true },
    dietaryType: {
        type: String,
        enum: ['vegetarian', 'vegan', 'omnivore', 'pescatarian', 'keto', 'paleo'],
        required: true
    },
    allergies: { type: [String], default: [] },
    calorieTarget: { type: Number, required: true, min: 0, max: 5000 },
}, {
    timestamps: true
});

export const UserProfile = mongoose.model("UserProfile", UserProfileSchema);