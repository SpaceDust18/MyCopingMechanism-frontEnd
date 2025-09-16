// src/hooks/useSocket.js
import { useRef, useEffect } from "react";
import { io } from "socket.io-client";

export function useSocket() {
  const ref = useRef(null);
  if (!ref.current) {
    ref.current = io(import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5050", {
      withCredentials: true,
    });
  }
  useEffect(() => () => ref.current?.disconnect(), []);
  return ref.current;
}