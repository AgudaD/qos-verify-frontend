import { useState } from "react";
import { LivenessCheck } from "@kloudlot/react-liveness";
import { verifyLiveness } from "../api";

export default function LivenessStep({ onDone }) {
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleComplete = async (passed, results, frame) => {
    if (!passed) {
      setError("Challenges failed. Please try again.");
      return;
    }
    setBusy(true);
    setError("");

    try {
      const blob = await frame.blob();
      const file = new File([blob], "liveness.jpg", { type: "image/jpeg" });
      await verifyLiveness(file);
      onDone(file);
    } catch (err) {
      setError(err.message || "Could not verify liveness.");
    } finally {
      setBusy(false);
    }
  };

  if (!started) {
    return (
      <section className="card">
        <h2>2. Liveness Check</h2>
        <p className="muted">
          You'll be asked to perform a few quick challenges. Read each prompt
          and follow it clearly.
        </p>
        <button className="primary" onClick={() => setStarted(true)}>
          Start Liveness Check
        </button>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>2. Liveness Check</h2>
      <p className="muted">Follow the on-screen prompts.</p>

      <LivenessCheck numberOfChallenge={3} onComplete={handleComplete} />

      {busy && (
        <p style={{ fontWeight: "bold", color: "#F59E0B", marginTop: 16 }}>
          Running server-side anti-spoofing...
        </p>
      )}
      {error && <p className="error">{error}</p>}
    </section>
  );
}
