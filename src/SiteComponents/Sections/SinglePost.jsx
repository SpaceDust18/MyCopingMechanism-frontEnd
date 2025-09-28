// src/SiteComponents/Sections/SinglePost.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "dompurify";
import Comments from "../Forms/Comments";
import { API_BASE_URL } from "../../api/config";
import "./SinglePost.css";

export default function SinglePost({ authUser, token }) {
  const { id } = useParams(); // URL id (string)
  const navigate = useNavigate();

  const [post, setPost] = useState(null); // { id, title, content, author, image_url, created_at, author_id }
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // editing state
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState(""); // HTML when using TinyMCE

  const tinyKey = import.meta.env.VITE_TINYMCE_API_KEY || "no-api-key";
  const isAdmin = !!authUser && authUser.role === "admin"; // admin can edit/delete any post

  // Fetch the single post
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/posts/${id}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Failed ${res.status}`);
        }
        const data = await res.json();
        if (!alive) return;
        setPost(data);
        // seed editor drafts
        setDraftTitle(data.title || "");
        setDraftContent(data.content || "");
      } catch (e) {
        if (alive) setErr(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // Fetch comments for this post (best-effort; ignore errors)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/comments/post/${id}`);
        if (!res.ok) return; // quietly ignore for now
        const data = await res.json();
        if (alive) setComments(Array.isArray(data) ? data : []);
      } catch {
        /* ignore errors for comments */
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  async function saveEdit() {
    try {
      const cleanHtml = DOMPurify.sanitize(draftContent || "");
      const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: (draftTitle || "").trim(),
          content: cleanHtml, // store sanitized HTML
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed ${res.status}`);
      }
      const updated = await res.json();
      setPost(updated);
      setEditing(false);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  async function handleDelete() {
    const ok = window.confirm("Delete this post permanently?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed ${res.status}`);
      }

      navigate("/");
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  if (loading) return <p>Loading…</p>;

  if (err || !post) {
    return (
      <div className="not-found">
        <h2>{err || "Post not found"}</h2>
        <Link to="/" className="back-link">
          Back to Home
        </Link>
      </div>
    );
  }

  // Decide how to render content: if it looks like HTML, render sanitized HTML; else render paragraphs
  const contentLooksHtml = /<\/?[a-z][\s\S]*>/i.test(post.content || "");
  const safeHtml = DOMPurify.sanitize(post.content || "");
  const plainParagraphs = (post.content || "").trim().split(/\n{2,}/);

  return (
    <article className="single-post">
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="post-image" />
      )}

      {/* Title (editable when in edit mode) */}
      <h1 className="post-title">
        {!editing ? (
          post.title
        ) : (
          <input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Title"
            className="title-input"
          />
        )}
      </h1>

      {/* Admin controls */}
      {isAdmin && (
        <div
          className="post-actions"
          style={{ margin: "0.75rem 0", display: "flex", gap: "0.5rem" }}
        >
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          ) : (
            <div style={{ display: "grid", gap: "0.5rem", width: "100%" }}>
              {/* TinyMCE editor replaces textarea */}
              <Editor
                apiKey={tinyKey}
                value={draftContent}
                init={{
                  height: 380,
                  menubar: false,
                  skin: "oxide-dark",
                  content_css: "dark",
                  plugins:
                    "lists link code advlist autolink charmap searchreplace visualblocks fullscreen insertdatetime table",
                  toolbar:
                    "undo redo | styles | bold italic underline strikethrough | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | link | removeformat | code",
                  toolbar_sticky: false,
                  branding: false,
                  content_style: `
                    body { color:#fff; font-family: 'Inter', sans-serif; }
                    p, ul, ol, li { color:#fff; }
                    a { color:#a855f7; }
                  `,
                }}
                onEditorChange={(content) => setDraftContent(content)}
              />

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={saveEdit}>Save</button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setDraftTitle(post.title || "");
                    setDraftContent(post.content || "");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="post-meta">
        {post.author ?? "Unknown"} •{" "}
        {post.created_at
          ? new Date(post.created_at).toLocaleString()
          : "Unknown date"}
      </p>

      <div className="post-content">
        {contentLooksHtml ? (
          <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
        ) : (
          plainParagraphs.map((p, i) => <p key={i}>{p}</p>)
        )}
      </div>

      {/* Comments */}
      <Comments
        postId={post.id} // or just use id from URL
        authUser={authUser}
        token={token}
        comments={comments}
        setComments={setComments}
      />

      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
    </article>
  );
}