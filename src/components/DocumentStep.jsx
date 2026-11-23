import { useState, useRef } from "react"; // Add useRef
import { verifyDocument } from "../api";

export default function DocumentStep({ onDone }) {
  const [docType, setDocType] = useState("nin");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null); // Add this

  const handleTypeChange = (type) => {
    setDocType(type);
    setFile(null);
    setError("");
    // Reset the file input so it doesn't get stuck if they cancelled previously
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const submit = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await verifyDocument(file, docType);
      const status = res.fields?.status;
      if (status && status !== "SUCCESS") {
        setError(
          res.fields?.error ||
            res.fields?.status_message ||
            "Could not read document.",
        );
        return;
      }
      onDone(res);
    } catch (err) {
      console.error(err);
      setError(err.message || "Verification failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>1. Upload Document</h2>

      <div className="row">
        <label className={`pill ${docType === "nin" ? "selected" : ""}`}>
          <input
            type="radio"
            name="docType"
            checked={docType === "nin"}
            onChange={() => handleTypeChange("nin")}
          />
          NIN
        </label>
        <label className={`pill ${docType === "passport" ? "selected" : ""}`}>
          <input
            type="radio"
            name="docType"
            checked={docType === "passport"}
            onChange={() => handleTypeChange("passport")}
          />
          Passport
        </label>
      </div>

      <input
        ref={inputRef} // Attach the ref
        type="file"
        accept="image/*,.pdf"
        style={{ display: "block", margin: "16px 0" }}
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setError("");
        }}
      />

      {file && (
        <div className="file-preview">
          <span>📄 {file.name}</span>
          <span className="muted">({(file.size / 1024).toFixed(0)} KB)</span>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <button className="primary" onClick={submit} disabled={busy || !file}>
        {busy ? "Extracting…" : "Extract & Verify"}
      </button>
    </section>
  );
}
