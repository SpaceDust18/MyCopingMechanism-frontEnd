// src/pages/ReflectionsPage.jsx
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../hooks/useSocket.js";

export default function ReflectionsPage({ authUser }) {
  // Passes the latest token so the hook can (re)connect with auth
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

        const m = await fetch(`${API}/api/reflections/today/messages`).then((r) =>
          r.json()
        );
        if (!cancelled) setMessages(Array.isArray(m) ? m : []);
      } catch {
        if (!cancelled) {
          setDaily(null);
          setMessages([]);
        }
      }

      if (socket) {
        socket.emit("reflections:joinToday", {}, () => {});
      }
    })();

    const onNew = (msg) => {
      if (msg && typeof msg === "object") {
        setMessages((prev) => [...prev, msg]);
      }
    };

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
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Send new message — requires login (server enforces; UI gated too)
  const send = () => {
    const content = input.trim();
    if (!content || !socket || !authUser) return;
    socket.emit("reflections:messageToday", { content }, (ack) => {
      if (ack?.ok) setInput("");
    });
  };

  // Ownership check
  const isMine = (m) => {
    if (!authUser) return false;

    // Prefer strong check by user_id (coerce to numbers to avoid "1" !== 1)
    if (m.user_id != null && authUser.id != null) {
      const a = Number(m.user_id);
      const b = Number(authUser.id);
      if (!Number.isNaN(a) && !Number.isNaN(b)) return a === b;
    }

    // Legacy fallback only when user_id is null
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

    const prev = messages;
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
        setMessages(prev);
        return;
      }
    }

    setEditingId(null);
    setEditText("");
  };

  const removeMsg = async (id) => {
    if (!id || !socket) return;
    const prev = messages;
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
        setMessages(prev);
      }
    }
  };

  const canPost = !!authUser;

  return (
    <main>
      <h1>Reflections</h1>

      <h2>{daily?.prompt?.text ?? "Loading..."}</h2>

      <div
        style={{
          display: "grid",
          gap: ".5rem",
          maxHeight: "60vh",
          overflow: "auto",
          paddingBlock: ".5rem",
        }}
      >
        {messages.map((m) => {
          const mine = isMine(m);
          const isEditing = editingId === m.id;
          return (
            <div
              key={m.id ?? `${m.username}-${Math.random()}`}
              style={{
                display: "grid",
                gap: ".35rem",
                padding: ".5rem .75rem",
                borderRadius: 8,
                background: mine ? "rgba(120,120,255,.08)" : "rgba(255,255,255,.04)",
              }}
            >
              {!isEditing ? (
                <>
                  <div>
                    <strong>{m.username ?? "Anonymous"}</strong>: {m.content}
                  </div>
                  {mine && (
                    <div style={{ display: "flex", gap: ".5rem" }}>
                      <button type="button" onClick={() => startEdit(m)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMsg(m.id)}
                        style={{ opacity: 0.85 }}
                      >
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        saveEdit(m.id);
                      }
                    }}
                    rows={2}
                    style={{ width: "100%", resize: "vertical" }}
                  />
                  <div style={{ display: "flex", gap: ".5rem" }}>
                    <button type="button" onClick={() => saveEdit(m.id)}>
                      Save
                    </button>
                    <button type="button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        <div ref={listEndRef} />
      </div>

      {/* Composer - disabled if not logged in */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: ".5rem",
          marginTop: ".75rem",
          opacity: canPost ? 1 : 0.6,
        }}
        title={canPost ? "" : "Log in to post a reflection"}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canPost) send();
            }
          }}
          placeholder={canPost ? "Share a quick thought…" : "Log in to share a thought…"}
          rows={2}
          style={{ width: "100%", resize: "vertical" }}
          disabled={!canPost}
        />
        <button onClick={send} disabled={!socket || !canPost}>
          Send
        </button>
      </div>
    </main>
  );
}