import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

import { protect, AuthRequest } from "./middleware/authMiddleware";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware";

const app = express();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

// Security middleware
app.use(helmet());

// CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://team-flow-nu-two.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser - only once
app.use(express.json({ limit: "10kb" }));

// Health route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TeamFlow API is running",
  });
});

// API routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/tasks", taskRoutes);

// Protected test route
app.get("/api/protected", protect, (req: AuthRequest, res) => {
  res.status(200).json({
    success: true,
    message: "You accessed a protected route",
    userId: req.userId,
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;