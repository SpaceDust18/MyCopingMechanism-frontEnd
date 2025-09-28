// src/hooks/useSocket.js
import { io } from "socket.io-client";

let socketInstance = null;
let currentToken = null;

/**
 * Creates (or re-creates) a Socket.IO client using the latest auth token.
 * Calls this hook with the token in state (or it will read localStorage).
 */
export function useSocket(authToken) {
  const token =
    authToken ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    null;

  // (Re)creates the socket if it doesn't exist OR the token changed
  if (!socketInstance || currentToken !== token) {
    if (socketInstance) {
      try {
        socketInstance.disconnect();
      } catch {}
    }
    currentToken = token || null;

    socketInstance = io("/", {
      path: "/socket.io",
      withCredentials: false, // matches server.credentials:false
      auth: currentToken ? { token: currentToken } : {},
      timeout: 15000,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelayMax: 5000,
    });

    // Helpful logging if auth fails (e.g., missing/expired token)
    socketInstance.on("connect_error", (err) => {
      console.warn("Socket connect_error:", err?.message || err);
    });
  }

  return socketInstance;
}

/** Optional utility to manually drop the socket */
export function disconnectSocket() {
  if (socketInstance) {
    try {
      socketInstance.disconnect();
    } catch {}
    socketInstance = null;
    currentToken = null;
  }
}