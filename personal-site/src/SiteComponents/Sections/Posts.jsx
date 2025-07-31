import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../Forms/SearchBar";
import { posts } from "../../data/postsData";
import "./Posts.css";

export default function Posts() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPosts, setFilteredPosts] = useState(posts);

    const handleSearch = () => {
        const results = posts.filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPosts(results);
    };

    return (
        <section className="posts-page">
            <h1>All Blog Posts</h1>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch}/>
            <div className="posts-grid">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div key={post.id} className="post-card">
                            <img src={post.image} alt={post.title} />
                            <div className="post-content">
                                <h2>{post.title}</h2>
                                <p className="meta">{post.author} • {post.date} • {post.readTime}</p>
                                <p>{post.excerpt}</p>
                                <Link to={`/posts/${post.id}`} className="read-more">Read More</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No posts found.</p>
                )}
            </div>
        </section>
    );
}

export { posts };