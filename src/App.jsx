import { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import DocumentStep from "./components/DocumentStep";
import LivenessStep from "./components/LivenessStep";
import FaceStep from "./components/FaceStep";
import ResultStep from "./components/ResultStep";

export default function App() {
  const [step, setStep] = useState(0);
  const [docResult, setDocResult] = useState(null);
  const [livenessDone, setLivenessDone] = useState(false);
  const [faceResult, setFaceResult] = useState(null);
  const [livenessSelfie, setLivenessSelfie] = useState(null);

  const restart = () => {
    setStep(0);
    setDocResult(null);
    setLivenessDone(false);
    setFaceResult(null);
  };

  return (
    <main className="app">
      <header>
        <h1>QOS Identity Verification</h1>
        <p className="muted">NIN / Passport · Liveness · Face match</p>
      </header>

      <StepIndicator current={step} />

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
          onDone={(selfieFile) => {
            setLivenessSelfie(selfieFile);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <FaceStep
          docResult={docResult}
          onDone={(res) => {
            setFaceResult(res);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <ResultStep
          docResult={docResult}
          livenessDone={livenessDone}
          faceResult={faceResult}
          onRestart={restart}
        />
      )}
    </main>
  );
}
