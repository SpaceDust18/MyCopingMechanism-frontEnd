import React, { useState } from "react";
import "./Comments.css";

export default function Comments({ postId, authUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!authUser) {
      alert("You must be logged in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(), // temporary unique ID
      postId,
      author: authUser.name || "Anonymous",
      text: newComment,
      date: new Date().toLocaleString(),
    };

    setComments([...comments, commentObj]);
    setNewComment("");
  };

  return (
    <section className="comments-section">
      <h3>Comments</h3>

      {/* Comment Form */}
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={authUser ? "Write your comment..." : "Log in to comment"}
          disabled={!authUser}
        />
        <button type="submit" disabled={!authUser}>
          Add Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <p className="comment-author">{comment.author}</p>
              <p className="comment-text">{comment.text}</p>
              <span className="comment-date">{comment.date}</span>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </section>
  );
}