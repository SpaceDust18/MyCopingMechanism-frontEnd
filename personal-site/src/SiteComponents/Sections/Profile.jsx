import React from "react";
import { Navigate } from "react-router-dom";
import "./Profile.css";

export default function Profile({ authUser }) {
  if (!authUser) {
    return <Navigate to="/login" />;
  }

  const handleEditClick = () => {
    alert("Edit profile feature coming soon!");
  };

  return (
    <section className="profile-section">
      <h2>My Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {authUser.name || "User"}</p>
        <p><strong>Email:</strong> {authUser.email}</p>
        <button className="edit-btn" onClick={handleEditClick}>Edit Profile</button>
      </div>
    </section>
  );
}