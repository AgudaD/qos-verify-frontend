import { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import DocumentStep from "./components/DocumentStep";
import LivenessStep from "./components/LivenessStep";
import FaceStep from "./components/FaceStep";
import ResultStep from "./components/ResultStep";

const STEPS = ["Document", "Liveness", "Face Match", "Result"];

export default function App() {
  const [step, setStep] = useState(0);
  const [docResult, setDocResult] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [faceResult, setFaceResult] = useState(null);

  const restart = () => {
    setStep(0);
    setDocResult(null);
    setSelfieFile(null);
    setFaceResult(null);
  };

  return (
    <main className="app">
      <header>
        <h1>QOS Identity Check</h1>
        <p className="muted">Document → Liveness → Face Match</p>
      </header>

      <StepIndicator current={step} steps={STEPS} />

      {step === 0 && (
        <DocumentStep
          onDone={(res) => {
            setDocResult(res);
            setStep(1);
          }}
        />
      )}

      {step === 1 && (
        <LivenessStep
          onDone={(frameFile) => {
            setSelfieFile(frameFile);
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
