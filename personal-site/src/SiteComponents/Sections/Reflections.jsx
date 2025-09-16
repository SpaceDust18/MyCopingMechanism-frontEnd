// src/pages/ReflectionsPage.jsx
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function ReflectionsPage({ authUser }) {
  const socket = useSocket();
  const API = import.meta.env.VITE_API_BASE_URL;
  const [daily, setDaily] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    (async () => {
      const d = await fetch(`${API}/api/reflections/today`).then(r => r.json());
      setDaily(d);
      const m = await fetch(`${API}/api/reflections/today/messages`).then(r => r.json());
      setMessages(m);
      socket.emit("reflections:joinToday", {}, (ack) => {
        if (!ack?.ok) console.warn(ack?.error);
      });
    })();
    const onNew = (msg) => setMessages(prev => [...prev, msg]);
    socket.on("reflections:message:new", onNew);
    return () => socket.off("reflections:message:new", onNew);
  }, [API, socket]);

  const send = () => {
    const content = input.trim();
    if (!content) return;
    socket.emit("reflections:messageToday", {
      content,
      userId: authUser?.id ?? null,
      username: authUser?.username ?? "Anonymous",
    }, (ack) => {
      if (ack?.ok) setInput("");
    });
  };

  return (
    <main>
      <h1>Reflections</h1>
      <h2>{daily?.prompt?.text ?? "Loading..."}</h2>
      <div>
        {messages.map(m => (
          <div key={m.id}><strong>{m.username}</strong>: {m.content}</div>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={send}>Send</button>
    </main>
  );
}