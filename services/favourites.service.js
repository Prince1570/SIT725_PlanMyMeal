import { Favourite } from "../models/favourites.schema.js";

export const listFavourites = async (userId) => { // ✅ Accept userId parameter
  const favourites = await Favourite.find({ userId }).populate("mealId"); // ✅ Filter by userId
  return { msg: "Favourites listed successfully.", data: favourites };
};

export const addFavourites = async (data) => {
  const { mealId, userId } = data;
  const favouriteExists = await Favourite.findOne({ userId, mealId });
  if (favouriteExists) {
    throw new Error("This meal is already in your favourite list.");
  }
  const favourites = new Favourite({
    userId,
    mealId,
  });
  await favourites.save();
  return { message: "Favourites added successful" };
};

export const removeFromFavourites = async (id) => {
  const favouriteExists = await Favourite.findById(id);
  if (!favouriteExists) {
    throw new Error("No favourites found.");
  }
  await Favourite.findByIdAndDelete(id);
  return { message: "Favourites removed successfully" };
};
