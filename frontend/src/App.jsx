import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";
import Shell from "./components/Shell";

export default function App() {
  const { isAuthed } = useAuth();

  return (
    <Shell>
      <Routes>
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
        <Route path="*" element={<div className="text-white/70">Not found</div>} />
      </Routes>
    </Shell>
  );
}
