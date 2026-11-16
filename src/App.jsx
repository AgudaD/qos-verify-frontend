import { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import FaceStep from "./components/FaceStep";
import LivenessStep from "./components/LivenessStep";
import ResultStep from "./components/ResultStep";

const STEPS = ["Identity Check", "Liveness", "Result"];

export default function App() {
  const [step, setStep] = useState(0);
  const [faceResult, setFaceResult] = useState(null);

  const restart = () => {
    setStep(0);
    setFaceResult(null);
  };

  return (
    <main className="app">
      <header>
        <h1 style={{ color: "#F59E0B" }}>QOS Identity Check</h1>
        <p className="muted">Identity Match → Liveness</p>
      </header>

      <StepIndicator current={step} steps={STEPS} />

      {/* Step 1: Identity Check (Face Match against Mock DB) */}
      {step === 0 && (
        <FaceStep
          onDone={(res) => {
            if (!res.verified) {
              // If face doesn't match, we don't proceed to liveness
              alert("Face does not match the account owner. Access denied.");
              return;
            }
            setFaceResult(res);
            setStep(1); // Only proceed if face matches
          }}
        />
      )}

      {/* Step 2: Liveness Check */}
      {step === 1 && (
        <LivenessStep
          onDone={() => {
            setStep(2);
          }}
        />
      )}

      {/* Step 3: Final Result */}
      {step === 2 && <ResultStep faceResult={faceResult} onRestart={restart} />}
    </main>
  );
}
