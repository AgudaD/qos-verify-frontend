import { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import DocumentStep from "./components/DocumentStep";
import FaceStep from "./components/FaceStep";
import LivenessStep from "./components/LivenessStep";
import ResultStep from "./components/ResultStep";

// New Order based on PM feedback
const STEPS = ["Upload ID", "Face Check", "Liveness", "Result"];

export default function App() {
  const [step, setStep] = useState(0);
  const [docResult, setDocResult] = useState(null);
  const [faceResult, setFaceResult] = useState(null);

  const restart = () => {
    setStep(0);
    setDocResult(null);
    setFaceResult(null);
  };

  return (
    <main className="app">
      <header>
        <h1>QOS Identity Check</h1>
        <p className="muted">Identity Match → Liveness</p>
      </header>

      <StepIndicator current={step} steps={STEPS} />

      {/* Step 1: Upload ID to simulate DB fetch */}
      {step === 0 && (
        <DocumentStep
          onDone={(res) => {
            setDocResult(res);
            setStep(1);
          }}
        />
      )}

      {/* Step 2: Take a selfie and compare to ID */}
      {step === 1 && (
        <FaceStep
          docResult={docResult}
          onDone={(res) => {
            if (!res.verified) {
              // If face doesn't match, we don't proceed to liveness!
              // You can add a "Failed" screen here later.
              alert("Face does not match the database record. Access denied.");
              return;
            }
            setFaceResult(res);
            setStep(2); // Only proceed if face matches
          }}
        />
      )}

      {/* Step 3: Liveness Check */}
      {step === 2 && (
        <LivenessStep
          onDone={() => {
            setStep(3);
          }}
        />
      )}

      {/* Step 4: Final Result */}
      {step === 3 && (
        <ResultStep
          docResult={docResult}
          faceResult={faceResult}
          onRestart={restart}
        />
      )}
    </main>
  );
}
