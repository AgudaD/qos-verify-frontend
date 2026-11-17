import { useState, useEffect } from "react";
import { verifyFace } from "../api";

export default function FaceStep({ userId, selfieFile, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setBusy(true);
      setError("");
      try {
        const res = await verifyFace(userId, selfieFile);
        if (cancelled) return;
        if (!res.verified) {
          setError("Face does not match the account owner. Access denied.");
          return;
        }
        onDone(res);
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
        Comparing the live frame from liveness against the database record...
      </p>

      {busy && (
        <p style={{ fontWeight: "bold", color: "#F59E0B", marginTop: 16 }}>
          Matching faces...
        </p>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}
