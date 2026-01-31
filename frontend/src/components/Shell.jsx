import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { cn } from "./cn";

function NavItem({ to, label }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <span className="h-2 w-2 rounded-full bg-white/80" />
      {label}
    </Link>
  );
}

export default function Shell({ children }) {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-48 left-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-4 md:grid-cols-[260px_1fr] md:p-6">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <Link to="/" className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              ✓
            </div>
            <div>
              <div className="text-sm font-semibold">Task Manager</div>
              <div className="text-xs text-white/60">Modern dashboard</div>
            </div>
          </Link>

          <div className="mt-4 space-y-1">
            <NavItem to="/tasks" label="Tasks" />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Status</div>
            <div className="mt-1 text-sm font-medium">
              {isAuthed ? "Signed in" : "Signed out"}
            </div>
            {isAuthed ? (
              <button
                onClick={onLogout}
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
                type="button"
              >
                Logout
              </button>
            ) : null}
          </div>

          <div className="mt-4 text-xs text-white/40">
            JWT expires in ~15 min; you’ll be redirected to login on 401.
          </div>
        </aside>

        {/* Content */}
        <section className="space-y-6">
          {/* Top bar */}
          <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div>
              <div className="text-sm text-white/60">Workspace</div>
              <div className="text-lg font-semibold tracking-tight">
                Your dashboard
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isAuthed ? (
                <>
                  <Link
                    to="/login"
                    className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80">
                  Authenticated
                </div>
              )}
            </div>
          </header>

          {children}
        </section>
      </div>
    </div>
  );
}
