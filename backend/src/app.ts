import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";

import { protect } from "./middleware/authMiddleware";
import { AuthRequest } from "./middleware/authMiddleware";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TeamFlow API is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

app.get(
  "/api/protected",
  protect,
  (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: "You accessed a protected route",
      userId: req.userId,
    });
  }
);

export default app;