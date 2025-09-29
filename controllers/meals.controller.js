import {
  addFavourites,
  listFavourites,
  removeFromFavourites,
} from "../services/favourites.service.js";
import { listMeals } from "../services/meal.service.js";
import { addMockMeals } from "../utils/seedMeals.js";

export const addMealsData = async (req, res, next) => {
  const mockData = await addMockMeals();
  return res.json(mockData);
};

export const getAllMeals = async (req, res, next) => {
  try {
    const meals = await listMeals();
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToFavourites = async (req, res, next) => {
  const { mealId } = req.body;
  const loggedUser = req.user;
  const favourites = await addFavourites({ mealId, userId: loggedUser._id });
  return res.json({ favourites });
};

export const removeFavourites = async (req, res, next) => {
  const { id } = req.params;
  const response = await removeFromFavourites(id);
  return res.json({ response });
};
