import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { TextInput, PrimaryButton } from "../components/ui";

export default function LoginPage() {
  const nav = useNavigate();
  const { loginAndSaveToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });
      // backend returns { accessToken }
      loginAndSaveToken(data.accessToken);
      nav("/tasks");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6">
      <h1 className="text-xl font-semibold">Log in</h1>
      <p className="mt-1 text-sm text-slate-600">
        Need an account?{" "}
        <Link className="underline" to="/register">
          Register
        </Link>
      </p>

      {error ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <PrimaryButton disabled={loading} type="submit">
          {loading ? "Logging in..." : "Login"}
        </PrimaryButton>
      </form>
    </div>
  );
}
