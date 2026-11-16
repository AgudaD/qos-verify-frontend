import { useState } from "react";
import { verifyFace } from "../api";

export default function FaceStep({ selfieFile, onDone }) {
  const [nin, setNin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!nin || nin.length < 11) {
      setError("Please enter a valid 11-digit NIN.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await verifyFace(nin, selfieFile);
      onDone(res, nin);
    } catch (err) {
      console.error(err);
      setError(err.message || "Face comparison failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>2. Merchant Face Match</h2>
      <p className="muted">
        Enter the merchant's NIN to verify against their onboarding record.
      </p>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="e.g. 12345678901"
          value={nin}
          onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))}
          maxLength={11}
          style={{
            padding: "12px",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      <div className="face-preview">
        {selfieFile && (
          <div>
            <p style={{ fontSize: 12, textAlign: "center", marginBottom: 4 }}>
              Live Liveness Capture
            </p>
            <img
              src={URL.createObjectURL(selfieFile)}
              alt="Selfie"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 8,
                border: "2px solid #22c55e",
              }}
            />
          </div>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      <button
        className="primary"
        onClick={submit}
        disabled={busy || !selfieFile || nin.length !== 11}
      >
        {busy ? "Searching DB & Matching…" : "Verify Identity"}
      </button>
    </section>
  );
}
