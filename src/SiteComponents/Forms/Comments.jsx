// src/SiteComponents/Forms/Comments.jsx
import React, { useState } from "react";
import { API_BASE_URL } from "../../api/config";
import "./Comments.css";

export default function Comments({ postId, authUser, token, comments, setComments }) {
  const [content, setContent] = useState("");
  const [err, setErr] = useState("");

  const isLoggedIn = !!token;

  async function add(e) {
    e.preventDefault();
    setErr("");
    try {
      if (!isLoggedIn) throw new Error("You must be logged in to comment.");

      const res = await fetch(`${API_BASE_URL}/api/comments/post/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed ${res.status}`);

      setComments(prev => [...prev, data]);
      setContent("");
    } catch (e) {
      setErr(e.message);
    }
  }

  async function removeComment(id) {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed ${res.status}`);

      setComments(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  function canDelete(c) {
    if (!authUser) return false;
    // author may delete; admin may delete if backend change (step 1) is applied
    return authUser.id === c.user_id || authUser.role === "admin";
  }

  return (
    <section style={{ marginTop: "2rem" }}>
      <h3>Comments</h3>
      {err && <p className="error">{err}</p>}

      <div style={{ display: "grid", gap: ".75rem", marginBottom: "1rem" }}>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map(c => (
          <div key={c.id} style={{ background: "rgba(255,255,255,.05)", padding: ".75rem", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <strong>{c.author ?? "Anonymous"}</strong>
              <span style={{ opacity: .7, fontSize: ".85rem" }}>
                {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
              </span>
              {canDelete(c) && (
                <button
                  onClick={() => removeComment(c.id)}
                  style={{ marginLeft: "auto" }}
                  className="mcm-btn ghost"
                >
                  Delete
                </button>
              )}
            </div>
            <p style={{ margin: ".5rem 0 0" }}>{c.content}</p>
          </div>
        ))}
      </div>

      {isLoggedIn ? (
        <form onSubmit={add} style={{ display: "grid", gap: ".5rem" }}>
          <textarea
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write a comment…"
            required
          />
          <button type="submit" className="mcm-btn primary">Add Comment</button>
        </form>
      ) : (
        <p style={{ opacity: .8 }}>Log in to add a comment.</p>
      )}
    </section>
  );
}