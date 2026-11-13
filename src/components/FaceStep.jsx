import { useState } from "react";
import { verifyFace } from "../api";

export default function FaceStep({ docResult, selfieFile, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!selfieFile) {
      setError("No selfie captured from liveness step.");
      return;
    }
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
      <h2>3. Face match</h2>
      <div className="face-preview">
        {docResult.face_image_b64 ? (
          <img
            src={`data:image/jpeg;base64,${docResult.face_image_b64}`}
            alt="ID face"
          />
        ) : (
          <div className="no-face">No face on document</div>
        )}
        {selfieFile && (
          <img src={URL.createObjectURL(selfieFile)} alt="Liveness selfie" />
        )}
      </div>
      <p className="muted">
        We'll compare your live selfie against the document photo.
      </p>
      {error && <p className="error">{error}</p>}
      <button
        className="primary"
        onClick={submit}
        disabled={busy || !selfieFile}
      >
        {busy ? "Comparing…" : "Confirm & Verify"}
      </button>
    </section>
  );
}
