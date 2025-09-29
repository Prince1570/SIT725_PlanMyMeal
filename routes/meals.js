import express from "express";
import { addMealsData, getAllMeals } from "../controllers/meals.controller.js";
const router = express.Router();

router.post("/", addMealsData);

router.get("/", getAllMeals);

export default router;
