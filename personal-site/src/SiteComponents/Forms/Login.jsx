import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config.js";
import "./AuthForms.css";

export default function Login({ setAuthUser, setToken, authUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If app already knows the user, bounce right away
  if (authUser) {
    return <Navigate to="/profile" replace />;
  }

  // One-time hydration: if both token & user are in storage, lift them to app state, then go to profile.
  useEffect(() => {
    const t = localStorage.getItem("token") || localStorage.getItem("authToken");
    const u = localStorage.getItem("user");
    if (t && u) {
      try {
        const parsed = JSON.parse(u);
        setToken?.(t);
        setAuthUser?.(parsed);
        navigate("/profile", { replace: true });
      } catch {
        // bad JSON, clear it
        localStorage.removeItem("user");
      }
    }
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Login failed");

      // Persist token & user (store under both keys for compatibility)
      localStorage.setItem("token", data.token);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Lift to app state so UI updates immediately
      setToken?.(data.token);
      setAuthUser?.(data.user);

      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <div className="password-field">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
}