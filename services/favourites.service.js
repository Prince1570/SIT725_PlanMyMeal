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
  try {
    const { mealId, userId } = data;
    const favourites = await Favourite.insertOne({ mealId, userId });
    return { message: "Favourites added successful", favourites };
  } catch (error) {
    return { error: error.message };
  }
};

export const removeFromFavourites = async (id) => {
  try {
    await Favourite.findByIdAndDelete(id);
    return { message: "Favourites removed successfully" };
  } catch (error) {
    return { error: error.message };
  }
};
