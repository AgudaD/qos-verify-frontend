import { useState, useRef } from "react";
import { verifyFace } from "../api";

export default function FaceStep({ onDone }) {
  const [userId, setUserId] = useState("user_aguda"); // Default to you
  const [selfie, setSelfie] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

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
      <h2>2. Identity Check</h2>
      <p className="muted">
        Take a selfie to verify you are the account owner.
      </p>

      {/* DEMO DROPDOWN: Choose who is logging in */}
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

      <input
        type="file"
        accept="image/*"
        capture="user"
        ref={inputRef}
        onChange={(e) => setSelfie(e.target.files?.[0] || null)}
        style={{ display: "block", marginBottom: 16 }}
      />

      {error && <p className="error">{error}</p>}

      <button className="primary" onClick={submit} disabled={busy || !selfie}>
        {busy ? "Checking database..." : "Verify Face"}
      </button>
    </section>
  );
}
