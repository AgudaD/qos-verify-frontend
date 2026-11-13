import { Fragment } from "react";

const REVIEW_LOW = 0.55;

function faceVerdict({ distance, verified }) {
  if (verified && distance < REVIEW_LOW) {
    return { tone: "pass", label: "Match confirmed" };
  }
  if (verified || distance <= 0.65) {
    return {
      tone: "review",
      label: "Inconclusive — manual review recommended",
    };
  }
  return { tone: "fail", label: "No match" };
}

function confidence(distance) {
  const pct = Math.max(0, Math.min(100, Math.round((1 - distance) * 100)));
  return `${pct}%`;
}

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

export default function ResultStep({ docResult, faceResult, onRestart }) {
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

  const fields = docResult.fields || {};
  const shownFields = Object.entries(fields).filter(([k]) =>
    Object.prototype.hasOwnProperty.call(FIELD_LABELS, k),
  );

  return (
    <section className="card">
      <h2>4. Result</h2>

      <div className={`verdict ${overallTone}`}>{overallLabel}</div>

      <h3>Face match</h3>
      <div className="kv">
        <dt>Confidence</dt>
        <dd>{confidence(faceResult.distance)}</dd>
        <dt>Distance</dt>
        <dd>
          {faceResult.distance.toFixed(4)} (threshold{" "}
          {faceResult.threshold.toFixed(2)})
        </dd>
        <dt>Liveness</dt>
        <dd>✅ Passed (Camera)</dd>
      </div>

      <h3>Document — {docResult.doc_type.toUpperCase()}</h3>
      <dl className="kv">
        {shownFields.map(([key, value]) => (
          <Fragment key={key}>
            <dt>{FIELD_LABELS[key]}</dt>
            <dd>{String(value ?? "—")}</dd>
          </Fragment>
        ))}
      </dl>

      <button className="primary" onClick={onRestart}>
        Start over
      </button>
    </section>
  );
}
