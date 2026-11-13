import { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import LivenessStep from "./components/LivenessStep";
import DocumentStep from "./components/DocumentStep";
import FaceStep from "./components/FaceStep";
import ResultStep from "./components/ResultStep";

const STEPS = ["Liveness", "Document", "Face Match", "Result"];

export default function App() {
  const [step, setStep] = useState(0);
  const [selfieFile, setSelfieFile] = useState(null);
  const [docResult, setDocResult] = useState(null);
  const [faceResult, setFaceResult] = useState(null);

  const restart = () => {
    setStep(0);
    setSelfieFile(null);
    setDocResult(null);
    setFaceResult(null);
  };

  return (
    <main className="app">
      <header>
        <h1>QOS Identity Verification</h1>
        <p className="muted">Liveness → Document → Match</p>
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
        <DocumentStep
          onDone={(res) => {
            setDocResult(res);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <FaceStep
          docResult={docResult}
          selfieFile={selfieFile}
          onDone={(res) => {
            setFaceResult(res);
            setStep(3);
          }}
        />
      )}

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
