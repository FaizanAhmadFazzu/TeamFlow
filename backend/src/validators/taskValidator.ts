import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(3).max(100),

  description: z.string().trim().max(500).optional(),

  status: z
    .enum(["todo", "in-progress", "completed"])
    .optional(),

  priority: z
    .enum(["low", "medium", "high"])
    .optional(),

  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required"
  );