import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTask, deleteTask, getTasks, updateTask } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { cn } from "../components/cn";

const STATUS = ["pending", "in_progress", "completed"];

function tone(status) {
  if (status === "pending") return "bg-amber-500/15 text-amber-200 border-amber-500/20";
  if (status === "in_progress") return "bg-sky-500/15 text-sky-200 border-sky-500/20";
  if (status === "completed") return "bg-emerald-500/15 text-emerald-200 border-emerald-500/20";
  return "bg-white/10 text-white/70 border-white/10";
}

function label(status) {
  return status.replace("_", " ");
}

function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="text-xs text-white/60">{title}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {hint ? <div className="mt-1 text-xs text-white/40">{hint}</div> : null}
    </div>
  );
}

export default function TasksPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [creating, setCreating] = useState(false);

  const stats = useMemo(() => {
    const s = { total: tasks.length, pending: 0, in_progress: 0, completed: 0 };
    for (const t of tasks) s[t.status] = (s[t.status] || 0) + 1;
    return s;
  }, [tasks]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAuth(err) {
    if (err?.status === 401) {
      logout();
      navigate("/login");
      return true;
    }
    return false;
  }

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      if (!handleAuth(err)) setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    setError("");
    try {
      const created = await createTask({ title: title.trim(), status });
      setTasks((prev) => [...prev, created]);
      setTitle("");
      setStatus("pending");
    } catch (err) {
      if (!handleAuth(err)) setError(err.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  }

  async function onChangeStatus(id, nextStatus) {
    try {
      const updated = await updateTask(id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      if (!handleAuth(err)) setError(err.message || "Failed to update task");
    }
  }

  async function onDelete(id) {
    const ok = confirm("Delete this task?");
    if (!ok) return;

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      if (!handleAuth(err)) setError(err.message || "Failed to delete task");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-white/60">Tasks</div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Focus on what matters
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Create, update, and track your tasks — synced to your account.
            </p>
          </div>

          <button
            onClick={load}
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15"
            type="button"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <StatCard title="Total" value={stats.total} />
          <StatCard title="Pending" value={stats.pending} />
          <StatCard title="In progress" value={stats.in_progress} />
          <StatCard title="Completed" value={stats.completed} />
        </div>
      </div>

      {/* Create bar */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-[1fr_180px_120px]">
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              +
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none focus:border-white/20"
          >
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>

          <button
            disabled={creating}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
            type="submit"
          >
            {creating ? "Adding…" : "Add"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="text-sm font-medium text-white/80">Your list</div>
          <div className="text-xs text-white/40">Hover a row for actions</div>
        </div>

        {loading ? (
          <div className="p-8 text-sm text-white/50">Loading…</div>
        ) : tasks.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-xl">
              ✨
            </div>
            <div className="mt-4 text-base font-semibold">No tasks yet</div>
            <div className="mt-1 text-sm text-white/50">
              Add your first task above to get started.
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="group flex items-center gap-4 px-5 py-4 transition hover:bg-white/[0.04]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                        tone(t.status)
                      )}
                    >
                      {label(t.status)}
                    </div>
                    <div className="truncate text-sm font-semibold text-white/90">
                      {t.title}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-white/35">Task #{t.id}</div>
                </div>

                <select
                  value={t.status}
                  onChange={(e) => onChangeStatus(t.id, e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {label(s)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => onDelete(t.id)}
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 opacity-0 transition hover:bg-red-500/10 hover:text-red-200 group-hover:opacity-100"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
