import { useState } from "react";
import { verifyFace } from "../api";

export default function FaceStep({ docResult, selfieFile, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await verifyFace(docResult.face_image_b64, selfieFile);
      onDone(res);
    } catch (err) {
      console.error(err);
      setError(err.message || "Face comparison failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>3. Face Match</h2>
      <p className="muted">
        We'll compare your live selfie against the document photo.
      </p>

      <div className="face-preview">
        {selfieFile && (
          <div>
            <p style={{ fontSize: 12, textAlign: "center" }}>Live Selfie</p>
            <img
              src={URL.createObjectURL(selfieFile)}
              alt="Liveness Selfie"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </div>
        )}

        {docResult.face_image_b64 ? (
          <div>
            <p style={{ fontSize: 12, textAlign: "center" }}>ID Document</p>
            <img
              src={`data:image/jpeg;base64,${docResult.face_image_b64}`}
              alt="ID Face"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </div>
        ) : (
          <div className="no-face">No face detected on document</div>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      <div style={{ marginTop: 16 }}>
        <button
          className="primary"
          onClick={submit}
          disabled={busy || !docResult.face_image_b64}
        >
          {busy ? "Comparing…" : "Confirm Identity"}
        </button>
      </div>
    </section>
  );
}
