import { Favourite } from "../models/favourites.schema.js";

export const listFavourites = async () => {
  try {
    const favourites = await Favourite.find();

    return { msg: "Favourites listed successfully.", data: favourites };
  } catch (error) {
    throw error.message;
  }
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
  try {
    await Favourite.findByIdAndDelete(id);
    return { message: "Favourites removed successfully" };
  } catch (error) {
    return { error: error.message };
  }
};
