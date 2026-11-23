import { useState } from "react";
import { LivenessCheck } from "@kloudlot/react-liveness";
import { verifyLiveness } from "../api";

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
          You'll be asked to perform 3 quick challenges (blink, smile, or turn
          your head). Each has up to 8 seconds. Read the instruction that
          appears on screen, then perform the action clearly.
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
      <p className="muted">
        Follow the on-screen prompts. Hold your face inside the circle.
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
