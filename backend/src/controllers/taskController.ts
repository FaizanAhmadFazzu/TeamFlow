import { Request, Response } from "express";
import mongoose from "mongoose";

import Task from "../models/Task";
import { AuthRequest } from "../middleware/authMiddleware";

import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/taskValidator";

// CREATE TASK
export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const validation = createTaskSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        errors: validation.error.issues,
      });
      return;
    }

    const task = await Task.create({
      ...validation.data,
      userId: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

// GET ALL TASKS
export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

// GET SINGLE TASK
export const getTaskById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    const task = await Task.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};

// UPDATE TASK
export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    const validation = updateTaskSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        errors: validation.error.issues,
      });
      return;
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.userId,
      },
      validation.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

// DELETE TASK
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};