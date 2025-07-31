import React from "react";
import { useParams, Link } from "react-router-dom";
import { posts } from "../../data/postsData";
import "./SinglePost.css";

export default function SinglePost() {
  const { id } = useParams();
  const post = posts.find((p) => p.id === parseInt(id));

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
      <Link to="/" className="back-link">← Back to Home</Link>
    </article>
  );
}