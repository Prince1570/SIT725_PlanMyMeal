import express from "express";
import {
  addToFavourites,
  favouritesList,
  removeFavourites,
} from "../controllers/favourites.controller.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/", favouritesList);

router.post("/add", authenticateToken, addToFavourites);

router.delete("/:id", authenticateToken, removeFavourites);

export default router;
