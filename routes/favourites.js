import express from "express";
import {
  addToFavourites,
  favouritesList,
  removeFavourites,
} from "../controllers/favourites.controller.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/api/favourites", favouritesList);

router.post("/api/addToFavourites", authenticateToken, addToFavourites);

router.delete("/api/favourites/:id", authenticateToken, removeFavourites);

export default router;
