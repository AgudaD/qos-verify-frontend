import { useState, useEffect } from "react";
import { verifyFace } from "../api";

export default function FaceStep({ userId, selfieFile, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Determine which DB image to show based on the user ID
  const dbImageSrc = userId === "user_izik" ? "/izik.jpeg" : "/aguda.jpeg";

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setBusy(true);
      setError("");
      try {
        const res = await verifyFace(userId, selfieFile);
        if (cancelled) return;
        setResult(res);

        if (!res.verified) {
          setError("Face does not match the account owner. Access denied.");
          return;
        }
        // Wait 2 seconds so the user can see the comparison before moving on
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
      <h2>2. Face Match</h2>
      <p className="muted">
        Comparing the live liveness frame against the database record...
      </p>

      {/* VISUAL COMPARISON: LIVE FRAME vs DATABASE */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          justifyContent: "center",
          margin: "24px 0",
        }}
      >
        {/* 1. The Captured Liveness Frame */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#667085",
            }}
          >
            LIVE LIVENESS FRAME
          </p>
          {selfieFile ? (
            <img
              src={URL.createObjectURL(selfieFile)}
              alt="Live Liveness"
              style={{
                width: "140px",
                height: "140px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "2px solid #F59E0B",
              }}
            />
          ) : (
            <div
              style={{
                width: "140px",
                height: "140px",
                background: "#f1f5f9",
                borderRadius: "12px",
                display: "grid",
                placeItems: "center",
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              No frame captured
            </div>
          )}
        </div>

        {/* 2. The Database Image */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#667085",
            }}
          >
            DATABASE RECORD
          </p>
          <img
            src={dbImageSrc}
            alt="Database Record"
            style={{
              width: "140px",
              height: "140px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
            }}
          />
        </div>
      </div>

      {/* Status / Result */}
      <div style={{ textAlign: "center", minHeight: "40px" }}>
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
