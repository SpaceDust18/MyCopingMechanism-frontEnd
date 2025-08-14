import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { posts } from "../../data/postsData"; // Replace this later when fetching posts from API
import Comments from "../Forms/Comments";
import { API_BASE_URL } from "../../api/config";
import "./SinglePost.css";

export default function SinglePost({ authUser, token }) {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const post = posts.find((p) => p.id === parseInt(id)); // TEMP: Replace with real post fetch later

  // Fetch comments when component mounts or id changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/comments/post/${id}`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [id]);

  if (!post) {
    return (
      <div className="not-found">
        <h2>Post not found</h2>
        <Link to="/" className="back-link">Back to Home</Link>
      </div>
    );
  }

  return (
    <article className="single-post">
      <img src={post.image} alt={post.title} className="post-image" />
      <h1 className="post-title">{post.title}</h1>
      <p className="post-meta">
        {post.author} • {post.date || "Unknown Date"} • {post.readTime}
      </p>
      <p className="post-content">
        {post.content || "Full content coming soon..."}
      </p>

      {/* Pass in postId, comments array, and setter to child component */}
      <Comments
        postId={post.id}
        authUser={authUser}
        token={token}
        comments={comments}
        setComments={setComments}
      />

      <Link to="/" className="back-link">← Back to Home</Link>
    </article>
  );
}