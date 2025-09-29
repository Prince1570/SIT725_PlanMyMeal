import mongoose, { Schema } from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const NutritionSchema = new Schema({
    kcal: { type: Number, required: true },
    protein_g: { type: Number, required: true },
    carbs_g: { type: Number, required: true },
    fat_g: { type: Number, required: true }
}, { _id: false });

const RecommendationItemSchema = new Schema({
    meal_id: { type: String, required: true },
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    nutrition: { type: NutritionSchema, required: true },
    reasons: { type: [String], required: true },
    confidence: { type: Number, required: true, min: 0, max: 1 }
}, { _id: false });

const RecommendationSchema = new Schema({
    userId: { type: ObjectId, ref: "User", required: true },
    mood: {
        type: String,
        enum: ['comforting', 'energetic', 'light', 'festive', 'quick-and-easy'],
        required: true
    },
    items: [RecommendationItemSchema],
    requestedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const Recommendation = mongoose.model("Recommendation", RecommendationSchema);