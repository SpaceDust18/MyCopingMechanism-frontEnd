import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/config";

export default function NewPost({ token, authUser }) {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [err, setErr] = useState("");

  if (!authUser || authUser.role !== "admin") {
    return <p>You must be an admin to create posts.</p>;
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          image_url: imageUrl.trim() || null
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed ${res.status}`);
      }
      const post = await res.json();
      nav(`/posts/${post.id}`); // go see it
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 700, margin: "2rem auto" }}>
      <h2>New Post</h2>
      {err && <p className="error">{err}</p>}
      <label>Title</label>
      <input value={title} onChange={e=>setTitle(e.target.value)} required />
      <label>Image URL (optional)</label>
      <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
      <label>Content</label>
      <textarea rows="10" value={content} onChange={e=>setContent(e.target.value)} required />
      <button type="submit">Publish</button>
    </form>
  );
}