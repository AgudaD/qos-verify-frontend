function faceVerdict({ distance, verified }) {
  if (verified && distance < 0.55)
    return { tone: "pass", label: "Match confirmed" };
  if (verified || distance <= 0.65)
    return { tone: "review", label: "Inconclusive — manual review" };
  return { tone: "fail", label: "No match" };
}

export default function ResultStep({ faceResult, onRestart }) {
  const verdict = faceVerdict(faceResult);
  const overallTone = faceResult.verified
    ? verdict.tone === "review"
      ? "review"
      : "pass"
    : "fail";
  const overallLabel =
    overallTone === "pass"
      ? "Identity Verified"
      : overallTone === "review"
        ? "Manual Review"
        : "Verification Failed";

  return (
    <section className="card">
      <h2>3. Result</h2>

      <div className={`verdict ${overallTone}`}>{overallLabel}</div>

      <dl className="kv">
        <dt>Face Match Decision</dt>
        <dd>{verdict.label}</dd>
        <dt>Distance</dt>
        <dd>{faceResult.distance.toFixed(4)}</dd>
        <dt>Threshold</dt>
        <dd>{faceResult.threshold.toFixed(2)}</dd>
        <dt>Liveness Status</dt>
        <dd>✅ Passed</dd>
      </dl>

      <button className="primary" onClick={onRestart} style={{ marginTop: 16 }}>
        Start over
      </button>
    </section>
  );
}
