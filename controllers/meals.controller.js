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
