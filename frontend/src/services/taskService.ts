import api from "./api";
import { CreateTaskPayload, Task, TaskStatus } from "@/types/task";

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");

  // Supports either { tasks: [...] } or a direct array response
  return Array.isArray(response.data)
    ? response.data
    : response.data.tasks;
};

export const createTask = async (
  data: CreateTaskPayload
): Promise<Task> => {
  const response = await api.post("/tasks", data);
  return response.data.task;
};

export const updateTask = async (
  id: string,
  data: Partial<CreateTaskPayload>
): Promise<Task> => {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data.task;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};