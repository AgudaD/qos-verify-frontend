import { useState, useRef, useEffect } from "react";
import { verifyFace } from "../api";

export default function FaceStep({ onDone }) {
  const [userId, setUserId] = useState("user_aguda");
  const [selfie, setSelfie] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Camera states
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      setError("Could not access camera. Please check permissions.");
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setIsCameraOn(false);
    }
  };

  // Capture the photo from the video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
          setSelfie(file);
          stopCamera();
        },
        "image/jpeg",
        0.9,
      );
    }
  };

  useEffect(() => {
    return () => stopCamera(); // Cleanup on unmount
  }, []);

  const submit = async () => {
    if (!selfie) return setError("Take a selfie first.");
    setBusy(true);
    setError("");
    try {
      const res = await verifyFace(userId, selfie);
      if (!res.verified) {
        setError("Face does not match the account owner. Access denied.");
        return;
      }
      onDone(res);
    } catch (err) {
      setError(err.message || "Comparison failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>1. Identity Check</h2>
      <p className="muted">
        Take a selfie to verify you are the account owner.
      </p>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
        >
          Simulate Logged-in User:
        </label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="user_aguda">Aguda (You)</option>
          <option value="user_izik">Izik (Product Manager)</option>
        </select>
      </div>

      {/* Camera Feed or Captured Image */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        {!isCameraOn && !selfie && (
          <button className="primary" onClick={startCamera}>
            Take Picture
          </button>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            display: isCameraOn ? "block" : "none",
            width: "100%",
            borderRadius: 8,
          }}
        />

        {isCameraOn && (
          <button
            className="primary"
            onClick={capturePhoto}
            style={{ marginTop: 8 }}
          >
            Capture Photo
          </button>
        )}

        {selfie && (
          <div>
            <img
              src={URL.createObjectURL(selfie)}
              alt="Selfie"
              style={{ width: "100%", borderRadius: 8 }}
            />
            <button
              className="secondary"
              onClick={() => setSelfie(null)}
              style={{ marginTop: 8 }}
            >
              Retake
            </button>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      {error && <p className="error">{error}</p>}

      <button className="primary" onClick={submit} disabled={busy || !selfie}>
        {busy ? "Checking database..." : "Verify Face"}
      </button>
    </section>
  );
}
