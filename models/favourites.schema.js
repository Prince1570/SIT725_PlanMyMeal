import mongoose, { Schema } from "mongoose";

const FavouriteSchema = new Schema({
  userId: { type: ObjectId, ref: "User" },
  mealId: { type: ObjectId, ref: "Meal" },
});

export const Favourite = mongoose.model("Favourite", FavouriteSchema);
