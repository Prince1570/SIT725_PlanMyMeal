import {
  addFavourites,
  listFavourites,
  removeFromFavourites,
} from "../services/favourites.service.js";

export const favouritesList = async (req, res, next) => {
  try {
    const loggedUser = req.user; // ✅ Get user from middleware
    const favourites = await listFavourites(loggedUser.id); // ✅ Pass user ID
    res.status(200).json(favourites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToFavourites = async (req, res, next) => {
  try {
    const { mealId } = req.body;
    const loggedUser = req.user;
    const favourites = await addFavourites({ mealId, userId: loggedUser.id });
    return res.status(200).json(favourites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFavourites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await removeFromFavourites(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
