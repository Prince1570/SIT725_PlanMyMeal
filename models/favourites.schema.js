import mongoose, { Schema } from "mongoose";

const FavouriteSchema = new Schema({
  userId: { type: mongoose.ObjectId, ref: "User" },
  mealId: { type: mongoose.ObjectId, ref: "Meal" },
});

export const Favourite = mongoose.model("Favourite", FavouriteSchema);
