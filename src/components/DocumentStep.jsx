import { useRef, useState } from "react";
import { verifyDocument } from "../api";

const HINTS = {
  nin: "Place your NIN slip or card flat. Ensure the text is sharp, well-lit, and the whole card is in frame.",
  passport:
    "Photograph the passport's identity page. The two MRZ lines at the bottom must be fully in frame, well-lit, and not angled.",
};

export default function DocumentStep({ onDone }) {
  const [docType, setDocType] = useState("nin");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const pick = (f) => {
    setFile(f);
    setError("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pick(f);
  };

  const submit = async () => {
    if (!file) {
      setError("Choose a document image first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await verifyDocument(file, docType);
      const status = res.fields?.status;
      if (status && status !== "SUCCESS") {
        const detail =
          res.fields?.error ||
          res.fields?.status_message ||
          "We could not read this document.";
        console.error("Document extraction failed:", res.fields);
        setError(`${detail} — ${HINTS[docType]}`);
        return;
      }
      onDone(res);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Document verification failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>1. Upload identity document</h2>

      <div className="row">
        <label className={`pill ${docType === "nin" ? "selected" : ""}`}>
          <input
            type="radio"
            name="docType"
            checked={docType === "nin"}
            onChange={() => setDocType("nin")}
          />
          NIN
        </label>
        <label className={`pill ${docType === "passport" ? "selected" : ""}`}>
          <input
            type="radio"
            name="docType"
            checked={docType === "passport"}
            onChange={() => setDocType("passport")}
          />
          Passport
        </label>
      </div>

      <div
        className={`dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <p>
          <strong>Drop your image here</strong> or click to browse
        </p>
        <p className="muted">JPG, PNG, or PDF. Single page for PDFs.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          style={{ display: "none" }}
          onChange={(e) => pick(e.target.files?.[0] || null)}
        />
      </div>

      {file && (
        <div className="file-preview">
          <span>📄 {file.name}</span>
          <span className="muted">({(file.size / 1024).toFixed(0)} KB)</span>
          <button
            className="secondary"
            style={{ marginLeft: "auto" }}
            onClick={() => pick(null)}
            type="button"
          >
            Change
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div style={{ marginTop: 16 }}>
        <button className="primary" onClick={submit} disabled={busy || !file}>
          {busy ? "Extracting…" : "Extract & Verify"}
        </button>
      </div>
    </section>
  );
}
