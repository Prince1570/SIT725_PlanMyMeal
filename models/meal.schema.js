import mongoose, { Schema } from "mongoose";
import { MealCategories } from "../common/enum/categories.enum";

const MealSchema = new Schema({
  userId: { type: ObjectId, ref: "User" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  calories: { type: Number, required: true },
  ingredients: { type: [String], required: true },
  categories: { type: String, enum: MealCategories },
});

export const MealFavourite = mongoose.model("Meal", MealSchema);
