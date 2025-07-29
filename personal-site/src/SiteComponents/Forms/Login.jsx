import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthForms.css";

export default function Login({ setAuthUser, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login for now
    const mockUser = { email, name: "Claudia" };
    localStorage.setItem("authToken", "dummyToken");
    localStorage.setItem("user", JSON.stringify(mockUser));
    setToken("dummyToken");
    setAuthUser(mockUser);
    navigate("/"); // Redirect to home after login
  };

  return (
    <section className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="submit-btn">Login</button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </section>
  );
}