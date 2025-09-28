import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "dompurify";
import "./BlockModal.css";

export default function BlockModal({
  mode = "create",
  initial = {},
  onClose,
  onSubmit,
}) {
  const [title, setTitle] = useState(initial.title ?? "");
  const [body, setBody] = useState(initial.body || ""); // HTML
  const [imageUrl, setImageUrl] = useState(initial.image_url ?? "");
  const [orderIndex, setOrderIndex] = useState(
    Number.isFinite(initial.order_index) ? initial.order_index : 0
  );
  const [published, setPublished] = useState(
    initial.published === undefined ? true : !!initial.published
  );

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(e) {
    e.preventDefault();
    const cleanHtml = DOMPurify.sanitize(body || "");
    const textOnly = cleanHtml.replace(/<[^>]*>/g, "").trim();
    if (!textOnly) return;
    onSubmit({
      title: (title || "").trim() || null,
      body: cleanHtml,
      image_url: (imageUrl || "").trim() || null,
      order_index: Number(orderIndex) || 0,
      published,
      body_format: "html",
    });
  }

  return (
    <div className="mcm-modal-backdrop" role="dialog" aria-modal="true">
      <div className="mcm-modal">
        <div className="mcm-modal-header">
          <h2>{mode === "edit" ? "Edit Block" : "Add Block"}</h2>
          <button
            type="button"
            className="mcm-icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className="mcm-form" onSubmit={submit}>
          {/* Title field */}
          <label className="mcm-field">
            <span>Title (optional)</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Intro, Welcome, …"
            />
          </label>

          {/* Body editor */}
          <div className="mcm-field">
            <span id="block-body-label">Body</span>
            <div className="mcm-editor-wrap" aria-labelledby="block-body-label">
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY} // from .env
                value={body}
                init={{
                  height: 320,
                  menubar: false,
                  skin: "oxide-dark",
                  content_css: "dark",
                  plugins:
                    "lists link code advlist autolink charmap searchreplace visualblocks fullscreen insertdatetime table",
                  toolbar:
                    "undo redo | styles | bold italic underline strikethrough | " +
                    "alignleft aligncenter alignright alignjustify | " +
                    "bullist numlist outdent indent | link | removeformat | code",
                  toolbar_sticky: false,
                  branding: false,
                  content_style: `
                    body { color:#fff; font-family: 'Inter', sans-serif; }
                    p, ul, ol, li { color:#fff; }
                    a { color:#a855f7; }
                  `,
                }}
                onEditorChange={(content) => setBody(content)}
              />
            </div>
          </div>

          {/* Image field */}
          <label className="mcm-field">
            <span>Image URL (optional)</span>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…/image.jpg"
            />
          </label>

          {/* Order + Published toggle */}
          <div className="mcm-row">
            <label className="mcm-field" style={{ flex: 1 }}>
              <span>Order</span>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                min="0"
                step="1"
              />
            </label>

            <label className="mcm-checkbox">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              <span>Published</span>
            </label>
          </div>

          {/* Actions */}
          <div className="mcm-actions">
            <button
              type="button"
              className="mcm-btn ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="mcm-btn primary">
              {mode === "edit" ? "Save Changes" : "Create Block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}