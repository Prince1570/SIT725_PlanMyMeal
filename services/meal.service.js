import { Meal } from "../models/meal.schema.js";

export const listMeals = async () => {
  const meals = await Meal.find();
  return { msg: "Meals listed successfully.", data: meals };
};
