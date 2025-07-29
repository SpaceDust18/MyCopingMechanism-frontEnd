import React from "react";
import { Link } from "react-router-dom";
import "./Posts.css";

const posts = [
  {
    id: 1,
    title: "Woke Up Depressed But Ain’t Nobody Got Time for That",
    author: "Claudia",
    date: "Jan 15, 2025",
    readTime: "5 min read",
    image: "/images/post1.jpg",
    excerpt: "Last night, I had a three-hour conversation with my mom...",
    content: "Full blog content for post 1 here..."
  },
  {
    id: 2,
    title: "Time!",
    author: "Claudia",
    date: "Jan 18, 2025",
    readTime: "3 min read",
    image: "/images/post2.jpg",
    excerpt: "It seems the older we get, the faster time passes...",
    content: "Full blog content for post 2 here..."
  },
  {
    id: 3,
    title: "Straight to the Point!",
    author: "Claudia",
    date: "Jan 20, 2025",
    readTime: "4 min read",
    image: "/images/post3.jpg",
    excerpt: "My name is Claudia. I come from a dysfunctional family...",
    content: "Full blog content for post 3 here..."
  }
];

export default function Posts() {
  return (
    <section className="posts-page">
      <h1>All Blog Posts</h1>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={post.image} alt={post.title} />
            <div className="post-content">
              <h2>{post.title}</h2>
              <p className="meta">{post.author} • {post.date} • {post.readTime}</p>
              <p>{post.excerpt}</p>
              <Link to={`/posts/${post.id}`} className="read-more">Read More</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export { posts };