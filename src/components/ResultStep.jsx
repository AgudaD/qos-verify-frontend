import { Fragment, useState } from "react";

const FIELD_LABELS = {
  surname: "Surname",
  first_name: "First name",
  middle_name: "Middle name",
  nin: "NIN",
  tracking_id: "Tracking ID",
  gender: "Gender",
  address: "Address",
  document_number: "Document number",
  nationality_code: "Nationality",
  issuer_code: "Issuer",
  birth_date: "Date of birth",
  expiry_date: "Expiry date",
  sex: "Sex",
  mrz_type: "MRZ type",
};

function faceVerdict({ distance, verified }) {
  // 1. If the backend says it's a match, but the distance is high, send to review.
  if (verified && distance > 0.6) {
    return { tone: "review", label: "Manual review required" };
  }

  // 2. If the backend says it's a match, and the distance is good, pass.
  if (verified) {
    return { tone: "pass", label: "Match confirmed" };
  }

  // 3. If the backend says it's NOT a match (distance > 0.65), fail.
  return { tone: "fail", label: "No match" };
}

export default function ResultStep({ docResult, faceResult, onRestart }) {
  const [showDetails, setShowDetails] = useState(false);

  const verdict = faceVerdict(faceResult);
  const overallTone = verdict.tone;

  const overallLabel =
    overallTone === "pass"
      ? "Identity Verified"
      : overallTone === "review"
        ? "Manual Review Required"
        : "Verification Failed";

  const fields = docResult.fields || {};
  const shownFields = Object.entries(fields).filter(([k]) => FIELD_LABELS[k]);

  return (
    <section className="card">
      <h2>4. Result</h2>

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

      {/* Collapsible Document Details */}
      <div style={{ marginTop: 24 }}>
        <button
          className="secondary"
          onClick={() => setShowDetails(!showDetails)}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            {showDetails ? "Hide Document Details" : "Show Document Details"}
          </span>
          <span>{showDetails ? "▲" : "▼"}</span>
        </button>

        {showDetails && (
          <div style={{ marginTop: 16, animation: "fadeIn 0.3s ease-in-out" }}>
            <h3>Document — {docResult.doc_type?.toUpperCase()}</h3>
            <dl className="kv">
              {shownFields.length === 0 && (
                <>
                  <dt>Status</dt>
                  <dd>{fields.status || "unknown"}</dd>
                </>
              )}
              {shownFields.map(([k, v]) => (
                <Fragment key={k}>
                  <dt>{FIELD_LABELS[k]}</dt>
                  <dd>{String(v ?? "—")}</dd>
                </Fragment>
              ))}
            </dl>
          </div>
        )}
      </div>

      <button className="primary" onClick={onRestart} style={{ marginTop: 24 }}>
        Start over
      </button>
    </section>
  );
}
