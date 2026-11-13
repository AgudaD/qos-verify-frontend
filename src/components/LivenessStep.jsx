import { useState } from "react";
import { LivenessCheck } from "@kloudlot/react-liveness";

export default function LivenessStep({ onDone }) {
  const [error, setError] = useState("");

  return (
    <section className="card">
      <h2>2. Liveness check</h2>
      <p className="muted">
        Follow the on-screen instructions. You'll be asked to perform a few
        random actions.
      </p>

      <LivenessCheck
        challengeCount={3}
        onComplete={async (passed, results, frame) => {
          if (passed && frame) {
            // Convert the captured frame to a File for your existing verifyFace API
            const blob = await frame.blob();
            const selfieFile = new File([blob], "selfie.jpg", {
              type: "image/jpeg",
            });
            onDone(selfieFile);
          } else {
            setError("Liveness check failed. Please try again.");
          }
        }}
        onCancel={() => setError("Liveness check cancelled.")}
      />

      {error && <p className="error">{error}</p>}
    </section>
  );
}
