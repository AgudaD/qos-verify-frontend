import { useState } from "react";
import { LivenessCheck } from "@kloudlot/react-liveness";

export default function LivenessStep({ onDone }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleComplete = async (passed, results, frame) => {
    // 1. First check if the user passed the active challenges (blinking, turning)
    if (!passed) {
      setError("Active challenges failed. Please try again.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      // 2. Convert the captured frame to a File blob
      // The library provides `frame` which has a `.blob()` method
      const blob = await frame.blob();
      const file = new File([blob], "liveness.jpg", { type: "image/jpeg" });

      // 3. Send to the Python backend for MiniFASNet verification
      const fd = new FormData();
      fd.append("file", file);

      const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
      const res = await fetch(`${BASE}/verify/liveness`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || "Server-side spoof detection failed.");
      }

      // 4. If we get here, both active and passive checks passed
      onDone();
    } catch (err) {
      console.error("Liveness check error:", err);
      setError(err.message || "Could not verify liveness.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>2. Liveness Check</h2>
      <p className="muted">
        Complete the challenges to prove you are physically here.
      </p>

      <LivenessCheck numberOfChallenge={1} onComplete={handleComplete} />

      {busy && (
        <p style={{ fontWeight: "bold", color: "#F59E0B", marginTop: 16 }}>
          Running server-side anti-spoofing...
        </p>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}
