import { API_BASE_URL } from "./config";

// GET a section + its blocks
export async function getSection(slug) {
  const res = await fetch(`${API_BASE_URL}/sections/${slug}`);
  if (!res.ok) throw new Error("Failed to load section");
  return res.json();
}

// CREATE a new block
export async function createBlock(slug, token, payload) {
  const res = await fetch(`${API_BASE_URL}/sections/${slug}/blocks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Create failed");
  }
  return res.json();
}

// UPDATE an existing block
export async function updateBlock(slug, id, token, payload) {
  const res = await fetch(`${API_BASE_URL}/sections/${slug}/blocks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Update failed");
  }
  return res.json();
}

// DELETE a block
export async function deleteBlock(slug, id, token) {
  const res = await fetch(`${API_BASE_URL}/sections/${slug}/blocks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Delete failed");
  }
}