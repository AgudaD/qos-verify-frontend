import { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import LivenessStep from "./components/LivenessStep";
import FaceStep from "./components/FaceStep";
import ResultStep from "./components/ResultStep";

const STEPS = ["Liveness", "Face Match", "Result"];

export default function App() {
  const [step, setStep] = useState(0);
  const [selfieFile, setSelfieFile] = useState(null);
  const [faceResult, setFaceResult] = useState(null);
  const [userId, setUserId] = useState("user_aguda");

  const restart = () => {
    setStep(0);
    setSelfieFile(null);
    setFaceResult(null);
  };

  return (
    <main className="app">
      <header>
        <h1>QOS Identity Check</h1>
        <p className="muted">Liveness → Face Match</p>
      </header>

      <StepIndicator current={step} steps={STEPS} />

      {step === 0 && (
        <LivenessStep
          userId={userId}
          setUserId={setUserId}
          onDone={(frameFile) => {
            setSelfieFile(frameFile);
            setStep(1);
          }}
        />
      )}

      {step === 1 && (
        <FaceStep
          userId={userId}
          selfieFile={selfieFile}
          onDone={(res) => {
            setFaceResult(res);
            setStep(2);
          }}
        />
      )}

      {step === 2 && <ResultStep faceResult={faceResult} onRestart={restart} />}
    </main>
  );
}
