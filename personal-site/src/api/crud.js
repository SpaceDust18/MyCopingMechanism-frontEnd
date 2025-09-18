// src/api/crud.js
import { API_BASE_URL } from "./config.js";

// Normalize base (remove trailing slashes)
const BASE = (API_BASE_URL || "http://localhost:5050").replace(/\/+$/, "");

// Helper to parse JSON safely
async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// GET a section + its blocks
export async function getSection(slug) {
  const res = await fetch(`${BASE}/api/sections/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    const data = await parseJson(res);
    throw new Error(data.error || "Failed to load section");
  }
  return res.json();
}

// CREATE a new block
export async function createBlock(slug, token, payload) {
  const res = await fetch(`${BASE}/api/sections/${encodeURIComponent(slug)}/blocks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await parseJson(res);
    throw new Error(data.error || "Create failed");
  }
  return res.json();
}

// UPDATE an existing block
export async function updateBlock(slug, id, token, payload) {
  const res = await fetch(`${BASE}/api/sections/${encodeURIComponent(slug)}/blocks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await parseJson(res);
    throw new Error(data.error || "Update failed");
  }
  return res.json();
}

// DELETE a block
export async function deleteBlock(slug, id, token) {
  const res = await fetch(`${BASE}/api/sections/${encodeURIComponent(slug)}/blocks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 204) {
    const data = await parseJson(res);
    throw new Error(data.error || "Delete failed");
  }
}