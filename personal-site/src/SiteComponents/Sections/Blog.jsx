import React from "react";
import { Link } from "react-router-dom";
import { posts } from "../../data/postsData";
import "./Blog.css";

export default function Blog() {
  return (
    <section className="blog-section">
      <h1>Latest Blog Posts</h1>
      <div className="blog-container">
        {posts.slice(0, 3).map((post) => (
          <div key={post.id} className="blog-card">
            <img src={post.image} alt={post.title} loading="lazy" />
            <div className="blog-content">
              <h3>{post.title}</h3>
              <p className="meta">{post.author} • {post.date} • {post.readTime}</p>
              <p className="excerpt">{post.excerpt}</p>
              <Link to={`/posts/${post.id}`} className="read-more">Read More</Link>
              <Link to="/posts" className="view-all">View All Posts</Link> 
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
