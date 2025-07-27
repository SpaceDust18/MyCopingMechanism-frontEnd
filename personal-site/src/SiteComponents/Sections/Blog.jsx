import React from "react";
import "./Blog.css";

const posts = [
  {
    id: 1,
    title: "Woke Up Depressed But Ain’t Nobody Got Time for That",
    author: "Claudia",
    date: "March 10, 2024",
    readTime: "5 min read",
    image: "/images/post1.jpg",
    excerpt: "Last night, I had a three-hour conversation with my mom, the strongest yet most traumatized person I know. This morning, I woke up drained, but reminded myself why I started this blog...",
  },
  {
    id: 2,
    title: "Time!",
    author: "Claudia",
    date: "March 8, 2024",
    readTime: "3 min read",
    image: "/public/time.jpg",
    excerpt: "It seems the older we get, the faster time passes. As children, we live in the moment, but adulthood brings struggles that steal that joy...",
  },
  {
    id: 3,
    title: "Straight to the Point!",
    author: "Claudia",
    date: "March 1, 2024",
    readTime: "4 min read",
    image: "/images/post3.jpg",
    excerpt: "My name is Claudia. I come from a dysfunctional family, survived abuse, an earthquake, and years of trauma. This blog is my journey...",
  }
];

export default function Blog() {
  return (
    <section className="blog-section">
      <h2>Latest Blog Posts</h2>
      <div className="blog-container">
        {posts.map((post) => (
          <div key={post.id} className="blog-card">
            <img src={post.image} alt={post.title} loading="lazy" />
            <div className="blog-content">
              <h3>{post.title}</h3>
              <p className="meta">{post.author} • {post.date} • {post.readTime}</p>
              <p className="excerpt">{post.excerpt}</p>
              <button className="read-more">Read More</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}