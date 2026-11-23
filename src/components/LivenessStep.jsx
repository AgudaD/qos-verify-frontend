import { useState } from "react";
import { LivenessCheck } from "@kloudlot/react-liveness";

const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8001";

const SLOW_CHALLENGES = [
  {
    type: "BLINK",
    label: "Blink",
    instruction: "Blink both eyes slowly",
    icon: "👁️",
    timeoutMs: 8000,
    blendshapes: [
      { key: "eyeBlinkLeft", threshold: 0.5 },
      { key: "eyeBlinkRight", threshold: 0.5 },
    ],
  },
  {
    type: "SMILE",
    label: "Smile",
    instruction: "Give us a big smile",
    icon: "😊",
    timeoutMs: 8000,
    blendshapes: [
      { key: "mouthSmileLeft", threshold: 0.4 },
      { key: "mouthSmileRight", threshold: 0.4 },
    ],
  },
  {
    type: "TURN_LEFT",
    label: "Turn Left",
    instruction: "Slowly turn your head left",
    icon: "👈",
    timeoutMs: 8000,
    blendshapes: [{ key: "headYaw", threshold: 0.3 }],
  },
  {
    type: "TURN_RIGHT",
    label: "Turn Right",
    instruction: "Slowly turn your head right",
    icon: "👉",
    timeoutMs: 8000,
    blendshapes: [{ key: "headYaw", threshold: -0.3 }],
  },
];

export default function LivenessStep({ onDone }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleComplete = async (passed, results, frame) => {
    if (!passed) return setError("Active challenges failed. Please try again.");
    setBusy(true);
    setError("");

    try {
      const blob = await frame.blob();
      const file = new File([blob], "liveness.jpg", { type: "image/jpeg" });

      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(
        `${BASE}/verify/liveness?ngrok-skip-browser-warning=true`,
        {
          method: "POST",
          body: fd,
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.detail || "Liveness verification failed.");

      onDone(file);
    } catch (err) {
      setError(err.message || "Could not verify liveness.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>2. Liveness Check</h2>
      <p className="muted">
        Complete the challenges to prove you are physically present.
      </p>

      <LivenessCheck
        numberOfChallenge={3}
        challengePool={SLOW_CHALLENGES}
        onComplete={handleComplete}
        theme={{
          primary: "#F59E0B",
          primaryText: "#ffffff",
          secondary: "#FCD34D",
          background: "#1a1a1a",
          text: "#ffffff",
          textColor: "#ffffff",
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
