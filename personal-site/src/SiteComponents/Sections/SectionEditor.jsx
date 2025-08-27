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
        setBlocks(data.blocks);
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
        const payload = { ...values, order_index: blocks.length };
        const created = await createBlock(slug, token, payload);
        setBlocks((prev) => [...prev, created]);
      } else {
        await updateBlock(slug, activeBlock.id, token, values);
        setBlocks((prev) =>
          prev.map((b) => (b.id === activeBlock.id ? { ...b, ...values } : b))
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
      setBlocks((prev) => prev.filter((x) => x.id !== b.id));
    } catch (e) {
      alert(e.message);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (err) return <p>{err}</p>;
  if (!section) return <p>Not found</p>;

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
        {blocks.map((b) => (
          <article key={b.id} className="cms-card">
            {b.image_url ? <img src={b.image_url} alt={b.title || "image"} /> : null}
            {b.title ? <h3>{b.title}</h3> : null}

            {/* Render sanitized HTML */}
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(b.body || ""),
              }}
            />

            {isAdmin && (
              <div className="cms-card-actions">
                <button className="mcm-btn" onClick={() => openEdit(b)}>
                  Edit
                </button>
                <button className="mcm-btn ghost" onClick={() => onDelete(b)}>
                  Delete
                </button>
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