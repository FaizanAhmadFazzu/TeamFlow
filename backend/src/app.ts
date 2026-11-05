import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

import { protect } from "./middleware/authMiddleware";
import { AuthRequest } from "./middleware/authMiddleware";
import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

const app = express();


app.use(express.json());

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TeamFlow API is running",
  });
});

// Authentication routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);

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

app.use(notFound);
app.use(errorHandler);

export default app;