import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../Forms/SearchBar";
import { API_BASE_URL } from "../../api/config";
import "./Posts.css";

const EXCERPT_LEN = 250; 

export default function Posts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Convert possible HTML into plain text for card preview
  function htmlToText(html = "") {
    const el = document.createElement("div");
    el.innerHTML = html;
    const text = el.textContent || el.innerText || "";
    return text.replace(/\s+/g, " ").trim();
  }

  // Build a neat excerpt from content (HTML-safe), ending at a word boundary
  function excerpt(content = "", len = EXCERPT_LEN) {
    const clean = htmlToText(content);
    if (clean.length <= len) return clean;
    const cut = clean.slice(0, len);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
  }

  // Fetch posts whenever page or search changes
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
          ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
        });
        const res = await fetch(`${API_BASE_URL}/posts?${params.toString()}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed ${res.status}`);
        }
        const json = await res.json();
        if (alive) {
          setPosts(Array.isArray(json.data) ? json.data : []);
          setTotalPages(json.totalPages || 1);
        }
      } catch (e) {
        if (alive) setErr(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [page, searchQuery]);

  return (
    <section className="posts-page">
      <h1>All Blog Posts</h1>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {loading && <p style={{ margin: "1rem 0" }}>Loading…</p>}
      {err && <p className="error" style={{ margin: "1rem 0" }}>{err}</p>}

      <div className="posts-grid">
        {!loading && !err && posts.length === 0 && <p>No posts found.</p>}

        {posts.map((post) => (
          <div key={post.id} className="post-card">
            {post.image_url && <img src={post.image_url} alt={post.title} />}
            <div className="post-content">
              <h2>{post.title}</h2>
              <p className="meta">
                {(post.author ?? "Unknown")} •{" "}
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString()
                  : "—"}
              </p>

              <p className="excerpt">{excerpt(post.content, EXCERPT_LEN)}</p>

              <Link to={`/posts/${post.id}`} className="read-more">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: ".5rem",
            justifyContent: "center",
          }}
        >
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
            ‹ Prev
          </button>
          <span style={{ alignSelf: "center" }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next ›
          </button>
        </div>
      )}
    </section>
  );
}