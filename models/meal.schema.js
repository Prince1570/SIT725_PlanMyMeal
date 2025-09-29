import mongoose, { Schema } from "mongoose";
import { MealCategories } from "../common/enum/categories.enum.js";

const MealSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  calories: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  categories: { type: String, enum: MealCategories },
});

export const Meal = mongoose.model("Meal", MealSchema);
