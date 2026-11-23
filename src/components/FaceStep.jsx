import { useState, useEffect } from "react";
import { verifyFace } from "../api";

export default function FaceStep({ docResult, selfieFile, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      setError("");
      try {
        const res = await verifyFace(docResult.face_image_b64, selfieFile);
        if (cancelled) return;
        setResult(res);
        if (!res.verified) {
          setError("Face does not match the document. Access denied.");
          return;
        }
        setTimeout(() => onDone(res), 2000);
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Face comparison failed.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="card">
      <h2>3. Face Match</h2>
      <p className="muted">
        Comparing your live liveness frame against the document photo...
      </p>

      <div
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          margin: "24px 0",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: "bold",
              marginBottom: 8,
              color: "#667085",
            }}
          >
            LIVE FRAME
          </p>
          <img
            src={URL.createObjectURL(selfieFile)}
            alt="Live"
            style={{
              width: 140,
              height: 140,
              objectFit: "cover",
              borderRadius: 12,
              border: "2px solid #F59E0B",
            }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: "bold",
              marginBottom: 8,
              color: "#667085",
            }}
          >
            DOCUMENT PHOTO
          </p>
          {docResult.face_image_b64 ? (
            <img
              src={`data:image/jpeg;base64,${docResult.face_image_b64}`}
              alt="Document"
              style={{
                width: 140,
                height: 140,
                objectFit: "cover",
                borderRadius: 12,
                border: "2px solid #e2e8f0",
              }}
            />
          ) : (
            <div
              style={{
                width: 140,
                height: 140,
                background: "#f1f5f9",
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                fontSize: 12,
                color: "#64748b",
              }}
            >
              No face on doc
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", minHeight: 40 }}>
        {busy && (
          <p style={{ fontWeight: "bold", color: "#F59E0B" }}>
            Matching faces...
          </p>
        )}
        {result && result.verified && (
          <p style={{ fontWeight: "bold", color: "#065f46" }}>
            ✅ Match Confirmed (Distance: {result.distance.toFixed(4)})
          </p>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
}
