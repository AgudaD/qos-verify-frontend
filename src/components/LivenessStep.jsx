import { useState } from "react";
import { LivenessCheck } from "@kloudlot/react-liveness";

export default function LivenessStep({ onDone }) {
  const [error, setError] = useState("");

  return (
    <section className="card">
      <h2>3. Liveness Check</h2>
      <p className="muted">
        Complete the challenge to prove you are physically here.
      </p>

      <LivenessCheck
        numberOfChallenge={2}
        onComplete={async (passed, results, frame) => {
          if (passed) {
            onDone();
          } else {
            setError("Liveness check failed. Please try again.");
          }
        }}
      />
      {error && <p className="error">{error}</p>}
    </section>
  );
}
