import { Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { isAuthed, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <Link to="/" className="font-semibold">
            Task Manager
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            {!isAuthed ? (
              <>
                <Link className="hover:underline" to="/login">
                  Login
                </Link>
                <Link className="hover:underline" to="/register">
                  Register
                </Link>
              </>
            ) : (
              <button
                className="hover:underline"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            )}

            <Link className="hover:underline" to="/tasks">
              Tasks
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4">
        <Routes>
          {/* Default route: if logged in go to tasks, otherwise go to login */}
          <Route
            path="/"
            element={<Navigate to={isAuthed ? "/tasks" : "/login"} replace />}
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </main>
    </div>
  );
}
