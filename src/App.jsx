import { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import LivenessStep from "./components/LivenessStep";
import FaceStep from "./components/FaceStep";
import ResultStep from "./components/ResultStep";

const STEPS = ["Liveness", "Face Match", "Result"]; // Updated steps

export default function App() {
  const [step, setStep] = useState(0);
  const [selfieFile, setSelfieFile] = useState(null);
  const [faceResult, setFaceResult] = useState(null);
  const [nin, setNin] = useState("");

  const restart = () => {
    setStep(0);
    setSelfieFile(null);
    setFaceResult(null);
    setNin("");
  };

  return (
    <main className="app">
      <header>
        <h1>QOS Merchant Verification</h1>
        <p className="muted">Liveness → Face Match</p>
      </header>

      <StepIndicator current={step} steps={STEPS} />

      {step === 0 && (
        <LivenessStep
          onDone={(selfie) => {
            setSelfieFile(selfie);
            setStep(1);
          }}
        />
      )}

      {step === 1 && (
        <FaceStep
          selfieFile={selfieFile}
          onDone={(res, submittedNin) => {
            setFaceResult(res);
            setNin(submittedNin);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <ResultStep nin={nin} faceResult={faceResult} onRestart={restart} />
      )}
    </main>
  );
}
