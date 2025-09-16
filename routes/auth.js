import { register } from "../controllers/auth.controller.js";
import express from "express";
const router = express.Router();
// const recommendationsController = require('../controllers/recommendations.controller');

router.post("/api/auth/register", register);

export default router;
