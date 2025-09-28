import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config.js";
import "./Profile.css";

export default function Profile({ authUser }) {
  // If not logged in, bounce to login
  if (!authUser) {
    return <Navigate to="/login" />;
  }

  // Work on a local copy so we can update instantly after save
  const [user, setUser] = useState(authUser);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    name: user?.name || "",
  });

  // UX state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEditClick = () => {
    setError("");
    setSuccess("");
    setForm({
      username: user?.username || "",
      name: user?.name || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const username = form.username.trim();
    const name = form.name?.trim() || null;

    if (!username || username.length < 3 || username.length > 32) {
      return setError("Username must be between 3 and 32 characters.");
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return setError("You are not logged in. Please log in again.");
      }

      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        // nicer message for username conflict
        if (res.status === 409) {
          throw new Error(data?.error || "That username is taken. Try another.");
        }
        throw new Error(data?.error || "Update failed");
      }

      // Update local display immediately
      setUser(data);
      setSuccess("Profile updated!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="profile-section">
      <h2>My Profile</h2>

      {error && (
        <p className="error" role="alert" style={{ marginTop: ".5rem" }}>
          {error}
        </p>
      )}
      {success && (
        <p className="success" role="status" style={{ marginTop: ".5rem" }}>
          {success}
        </p>
      )}

      {!isEditing ? (
        <div className="profile-card">
          <p>
            <strong>Username:</strong> {user?.username ?? "User"}
          </p>
          <p>
            <strong>Name:</strong> {user?.name || user?.username || "—"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "—"}
          </p>
          <button className="edit-btn" onClick={handleEditClick}>
            Edit Profile
          </button>
        </div>
      ) : (
        <form className="profile-card" onSubmit={handleSave}>
          <label>
            Username
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              minLength={3}
              maxLength={32}
              required
            />
          </label>

          <label>
            Name (optional)
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your display name"
            />
          </label>

          <div className="actions" style={{ marginTop: "1rem", display: "flex", gap: ".5rem" }}>
            <button type="button" className="secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="primary">Save</button>
          </div>
        </form>
      )}
    </section>
  );
}