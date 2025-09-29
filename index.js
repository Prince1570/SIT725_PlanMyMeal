import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import recommendationsRouter from "./routes/recommendations.js";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
// const express = require("express"
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.static('public'));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// routes - mount with proper base paths
app.use('/api/recommendations', recommendationsRouter);
app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
