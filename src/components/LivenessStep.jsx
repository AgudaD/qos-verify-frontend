import { useState } from "react";
import { LivenessCheck } from "@kloudlot/react-liveness";

const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8001";

export default function LivenessStep({ userId, setUserId, onDone }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleComplete = async (passed, results, frame) => {
    if (!passed) {
      setError("Active challenges failed. Please try again.");
      return;
    }
    setBusy(true);
    setError("");

    try {
      const blob = await frame.blob();
      const file = new File([blob], "liveness.jpg", { type: "image/jpeg" });

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${BASE}/verify/liveness`, {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || "Liveness verification failed.");
      }

      // Pass the SAME frame up — it will be reused for face match
      onDone(file);
    } catch (err) {
      console.error("Liveness error:", err);
      setError(err.message || "Could not verify liveness.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>1. Liveness Check</h2>
      <p className="muted">
        Complete the challenges to prove you are physically present.
      </p>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
        >
          Simulate Logged-in User:
        </label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="user_aguda">Aguda (You)</option>
          <option value="user_izik">Izik (Product Manager)</option>
        </select>
      </div>

      <LivenessCheck
        numberOfChallenge={3}
        onComplete={handleComplete}
        theme={{
          primary: "#F59E0B",
          primaryText: "#ffffff",
          secondary: "#FCD34D",
          background: "#ffffff",
          text: "#1a1a1a",
        }}
      />

      {busy && (
        <p style={{ fontWeight: "bold", color: "#F59E0B", marginTop: 16 }}>
          Running server-side anti-spoofing...
        </p>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}
