import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";
import "./AuthForms.css";

export default function Login({ setAuthUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

      // Persist token and (optionally) user
      localStorage.setItem("token", data.token);
      // You can store minimal user in localStorage too if you like:
      // localStorage.setItem("user", JSON.stringify(data.user));

      // Lift user to app state so UI updates immediately
      if (typeof setAuthUser === "function") {
        setAuthUser(data.user);
      }

      navigate("/profile");
    } catch (err) {
      setError(err.message);
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