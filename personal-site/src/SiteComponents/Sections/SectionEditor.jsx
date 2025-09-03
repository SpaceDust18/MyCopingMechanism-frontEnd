import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { getSection, createBlock, updateBlock, deleteBlock } from "../../api/crud.js";
import BlockModal from "./BlockModal";
import "./SectionEditor.css";

export default function SectionEditor({ slug, authUser, token, className = "" }) {
  const [section, setSection] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [activeBlock, setActiveBlock] = useState(null);

  const isAdmin = !!authUser && authUser.role === "admin";

  // load section + blocks
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await getSection(slug);
        if (!alive) return;
        setSection(data.section);
        setBlocks(data.blocks || []);
      } catch (e) {
        if (alive) setErr(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  function openCreate() {
    setActiveBlock(null);
    setModalMode("create");
    setModalOpen(true);
  }

  function openEdit(block) {
    setActiveBlock(block);
    setModalMode("edit");
    setModalOpen(true);
  }

  async function handleSubmit(values) {
    try {
      if (modalMode === "create") {
        // put new blocks at the end
        const lastIndex =
          blocks.length ? Math.max(...blocks.map(b => b.order_index ?? 0)) : -1;
        const payload = { ...values, order_index: lastIndex + 1 };
        const created = await createBlock(slug, token, payload);
        setBlocks(prev => [...prev, created]);
      } else {
        await updateBlock(slug, activeBlock.id, token, values);
        setBlocks(prev =>
          prev.map(b => (b.id === activeBlock.id ? { ...b, ...values } : b))
        );
      }
      setModalOpen(false);
      setActiveBlock(null);
    } catch (e) {
      alert(e.message);
    }
  }

  async function onDelete(b) {
    if (!window.confirm("Delete this block?")) return;
    try {
      await deleteBlock(slug, b.id, token);
      setBlocks(prev => prev.filter(x => x.id !== b.id));
    } catch (e) {
      alert(e.message);
    }
  }

  // --- helpers: sorting + reordering ---
  function sortByOrder(arr) {
    return [...arr].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }

  async function moveBlock(block, direction) {
    const sorted = sortByOrder(blocks);
    const idx = sorted.findIndex(x => x.id === block.id);
    const swapWith = direction === "up" ? sorted[idx - 1] : sorted[idx + 1];
    if (!swapWith) return;

    // swap locally for instant feedback
    const aNew = { ...block, order_index: swapWith.order_index ?? 0 };
    const bNew = { ...swapWith, order_index: block.order_index ?? 0 };

    setBlocks(prev =>
      prev.map(x => (x.id === aNew.id ? aNew : x.id === bNew.id ? bNew : x))
    );

    // persist both updates
    try {
      await Promise.all([
        updateBlock(slug, aNew.id, token, { order_index: aNew.order_index }),
        updateBlock(slug, bNew.id, token, { order_index: bNew.order_index })
      ]);
    } catch (e) {
      alert("Reorder failed; reloading latest order.");
      try {
        const data = await getSection(slug);
        setBlocks(data.blocks || []);
      } catch {
        /* ignore */
      }
    }
  }

  if (loading) return <p>Loading…</p>;
  if (err) return <p>{err}</p>;
  if (!section) return <p>Not found</p>;

  // Only show published to non-admin; admins see all
  const visibleBlocks = isAdmin ? blocks : blocks.filter(b => b.published !== false);
  const sortedBlocks = sortByOrder(visibleBlocks);

  return (
    <section className={`cms-section ${className}`}>
  
      {isAdmin && (
        <div className="cms-actions">
          <button className="mcm-btn primary" onClick={openCreate}>
            Add Block
          </button>
        </div>
      )}

      <div className="cms-grid">
        {sortedBlocks.map((b, i) => (
          <article key={b.id} className="cms-card">
            {b.image_url ? <img src={b.image_url} alt={b.title || "image"} /> : null}

            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
              {b.title ? <h3 style={{ margin: 0 }}>{b.title}</h3> : null}
              {isAdmin && b.published === false && (
                <span
                  style={{
                    fontSize: ".75rem",
                    padding: ".15rem .4rem",
                    borderRadius: "6px",
                    background: "rgba(255,0,0,.12)",
                    color: "#ff6b6b"
                  }}
                >
                  Draft
                </span>
              )}
            </div>

            {/* Render sanitized HTML */}
            <div
              className="cms-body"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(b.body || ""),
              }}
            />

            {isAdmin && (
              <div className="cms-card-actions" style={{ alignItems: "center" }}>
                <button className="mcm-btn" onClick={() => openEdit(b)}>
                  Edit
                </button>
                <button className="mcm-btn ghost" onClick={() => onDelete(b)}>
                  Delete
                </button>

                {/* Reorder controls */}
                <div style={{ marginLeft: "auto", display: "flex", gap: ".25rem" }}>
                  <button
                    className="mcm-btn"
                    onClick={() => moveBlock(b, "up")}
                    disabled={i === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    className="mcm-btn"
                    onClick={() => moveBlock(b, "down")}
                    disabled={i === sortedBlocks.length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {modalOpen && (
        <BlockModal
          mode={modalMode}
          initial={activeBlock || {}}
          onClose={() => {
            setModalOpen(false);
            setActiveBlock(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}