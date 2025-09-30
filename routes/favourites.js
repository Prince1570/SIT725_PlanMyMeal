import express from "express";
import {
  addToFavourites,
  favouritesList,
  removeFavourites,
} from "../controllers/favourites.controller.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();

router.get("/", authenticateToken, favouritesList); // ✅ Add authentication middleware

router.post("/add", authenticateToken, addToFavourites);

router.delete("/:id", authenticateToken, removeFavourites);

export default router;
