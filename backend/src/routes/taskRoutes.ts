import { Router } from "express";

import { protect } from "../middleware/authMiddleware";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const router = Router();

// All task routes require authentication
router.use(protect);

router.post("/", createTask);

router.get("/", getTasks);

router.get("/:id", getTaskById);

router.patch("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;