// src/pages/ReflectionsPage.jsx
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket.js";
import "./Reflections.css";

export default function ReflectionsPage({ authUser, autoScroll = true }) {
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken") || null;
  const socket = useSocket(token);
  const API = import.meta.env.VITE_API_BASE_URL || "";

  const [daily, setDaily] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const listEndRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const d = await fetch(`${API}/api/reflections/today`).then((r) => r.json());
        if (!cancelled) setDaily(d);

        const m = await fetch(`${API}/api/reflections/today/messages`).then((r) => r.json());
        if (!cancelled) setMessages(Array.isArray(m) ? m : []);
      } catch {
        if (!cancelled) {
          setDaily(null);
          setMessages([]);
        }
      }

      if (socket) socket.emit("reflections:joinToday", {}, () => {});
    })();

    const onNew = (msg) => msg && setMessages((prev) => [...prev, msg]);
    const onUpdated = (msg) => {
      if (!msg?.id) return;
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, content: msg.content } : m))
      );
      if (editingId === msg.id) {
        setEditingId(null);
        setEditText("");
      }
    };
    const onDeleted = ({ id }) => {
      if (!id) return;
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditText("");
      }
    };

    if (socket) {
      socket.on("reflections:message:new", onNew);
      socket.on("reflections:message:updated", onUpdated);
      socket.on("reflections:message:deleted", onDeleted);
    }

    return () => {
      cancelled = true;
      if (socket) {
        socket.off("reflections:message:new", onNew);
        socket.off("reflections:message:updated", onUpdated);
        socket.off("reflections:message:deleted", onDeleted);
      }
    };
  }, [API, socket, editingId]);

  useEffect(() => {
    if (!autoScroll) return;
    listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, autoScroll]);

  const send = () => {
    const content = input.trim();
    if (!content || !socket || !authUser) return;
    socket.emit("reflections:messageToday", { content }, (ack) => {
      if (ack?.ok) setInput("");
    });
  };

  const isMine = (m) => {
    if (!authUser) return false;
    if (m.user_id != null && authUser.id != null) {
      return Number(m.user_id) === Number(authUser.id);
    }
    if (m.user_id == null && m.username && authUser.username) {
      return m.username.toLowerCase() === authUser.username.toLowerCase();
    }
    return false;
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setEditText(m.content || "");
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };
  const saveEdit = async (id) => {
    const content = editText.trim();
    if (!content || !socket) return;

    setMessages((curr) => curr.map((m) => (m.id === id ? { ...m, content } : m)));

    let socketOk = false;
    await new Promise((resolve) => {
      try {
        socket.emit("reflections:message:update", { id, content }, (ack) => {
          socketOk = !!ack?.ok;
          resolve();
        });
      } catch {
        resolve();
      }
    });

    if (!socketOk) {
      try {
        const jwt = token;
        const res = await fetch(`${API}/api/reflections/messages/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error("PATCH failed");
      } catch {
        // revert already handled by server push on failure next load; keep local as-is
      }
    }

    setEditingId(null);
    setEditText("");
  };

  const removeMsg = async (id) => {
    if (!id || !socket) return;

    setMessages((curr) => curr.filter((m) => m.id !== id));

    let socketOk = false;
    await new Promise((resolve) => {
      try {
        socket.emit("reflections:message:delete", { id }, (ack) => {
          socketOk = !!ack?.ok;
          resolve();
        });
      } catch {
        resolve();
      }
    });

    if (!socketOk) {
      try {
        const jwt = token;
        const res = await fetch(`${API}/api/reflections/messages/${id}`, {
          method: "DELETE",
          headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
        });
        if (!res.ok) throw new Error("DELETE failed");
      } catch {
        // if server delete failed, refetch happens on next mount; keep local removal
      }
    }
  };

  const canPost = !!authUser;

  return (
    <section className="reflections">
      <h1>Reflections</h1>
      <div className="prompt">{daily?.prompt?.text ?? "Loading..."}</div>

      <div className="panel">
        <div className="reflections-list">
          {messages.map((m, i) => {
            const mine = isMine(m);
            const isEditing = editingId === m.id;
            return (
              <article
                key={m.id ?? `${m.username ?? "user"}-${i}`}
                className={`reflections-item ${mine ? "mine" : ""}`}
              >
                {!isEditing ? (
                  <>
                    <div className="meta">
                      <span className="author">{m.username ?? "Anonymous"}</span>
                    </div>
                    <div className="content">{m.content}</div>
                    {mine && (
                      <div className="reflections-actions">
                        <button className="mcm-btn" type="button" onClick={() => startEdit(m)}>
                          Edit
                        </button>
                        <button className="mcm-btn ghost" type="button" onClick={() => removeMsg(m.id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                    />
                    <div className="reflections-actions">
                      <button className="mcm-btn primary" type="button" onClick={() => saveEdit(m.id)}>
                        Save
                      </button>
                      <button className="mcm-btn ghost" type="button" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
          <div ref={listEndRef} />
        </div>

        <div
          className="reflections-composer"
          aria-disabled={!canPost}
          title={canPost ? "" : "Log in to post a reflection"}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={canPost ? "Share a quick thought…" : "Log in to share a thought…"}
            rows={2}
            disabled={!canPost}
          />
          <button className="mcm-btn primary" onClick={send} disabled={!socket || !canPost}>
            Send
          </button>
        </div>
      </div>
    </section>
  );
}