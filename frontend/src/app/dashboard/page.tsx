
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  Search,
  Trash2,
  LogOut,
  X,
} from "lucide-react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/services/taskService";

import { Task, TaskPriority, TaskStatus } from "@/types/task";

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueDate, setDueDate] = useState("");

  const fetchTasks = async () => {
    try {
      setError("");
      const data = await getTasks();
      setTasks(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      setError(err.response?.data?.message || "Unable to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }

    fetchTasks();
  }, [router]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setSaving(true);

      await createTask({
        title,
        description,
        priority,
        status: "todo",
        ...(dueDate && { dueDate }),
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setShowForm(false);
      setDueDate("");

      await fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || "Task creation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: TaskStatus
  ) => {
    try {
      await updateTask(id, { status });
      await fetchTasks();
    } catch {
      setError("Unable to update task status.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(id);
      setTasks((previous) => previous.filter((task) => task._id !== id));
    } catch {
      setError("Unable to delete task.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: ListTodo,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 border-r bg-white p-6 md:block">
        <h1 className="mb-10 text-2xl font-bold text-blue-600">
          TeamFlow.
        </h1>

        <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 font-medium text-blue-600">
          <LayoutDashboard size={20} />
          Dashboard
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage and track your tasks.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border bg-white p-2 text-slate-600 md:hidden"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </header>

        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <div className={`rounded-lg p-3 ${stat.color}`}>
                    <Icon size={21} />
                  </div>
                </div>

                <h3 className="mt-4 text-3xl font-bold text-slate-900">
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                My Tasks
              </h3>
              <p className="text-sm text-slate-500">
                Your tasks are synced with MongoDB.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Create Task
            </button>
          </div>

          <div className="mb-5 flex items-center gap-3 rounded-lg border px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full outline-none"
            />
          </div>

          <div className="mb-5 flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <p className="py-10 text-center text-slate-500">
              Loading tasks...
            </p>
          ) : filteredTasks.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              No tasks found. Create your first task!
            </p>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-800">
                      {task.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(
                          task._id,
                          e.target.value as TaskStatus
                        )
                      }
                      className="rounded-lg border px-3 py-2 text-sm"
                      aria-label={`Status for ${task.title}`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <p className="mt-2 text-xs text-slate-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}

                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Create New Task</h3>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                required
                minLength={3}
                maxLength={100}
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                maxLength={500}
                rows={4}
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
              />

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TaskPriority)
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border p-3"
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
