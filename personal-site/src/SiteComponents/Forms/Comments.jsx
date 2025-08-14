import React, { useState } from "react";
import { API_BASE_URL } from "../../api/config";
import "./Comments.css";

export default function Comments({ postId, authUser, token, comments, setComments }) {
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/comments/post/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to post comment");
      }

      const savedComment = await res.json();

      // Optimistically update UI
      setComments((prev) => [...prev, savedComment]);
      setNewComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="comments-section">
      <h3>Comments</h3>

      {comments?.length === 0 && <p>No comments yet. Be the first to comment!</p>}

      <ul className="comments-list">
        {comments.map((c) => (
          <li key={c.id}>
            <strong>{c.author || "Anonymous"}:</strong> {c.content}
          </li>
        ))}
      </ul>

      {authUser ? (
        <form onSubmit={handleSubmit} className="comment-form">
          {error && <p className="error">{error}</p>}
          <textarea
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            required
          ></textarea>
          <button type="submit">Post Comment</button>
        </form>
      ) : (
        <p className="login-to-comment">Log in to post a comment.</p>
      )}
    </section>
  );
}