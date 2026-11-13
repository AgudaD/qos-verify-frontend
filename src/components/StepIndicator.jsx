const STEPS = ["Document", "Liveness", "Face Match", "Result"];

export default function StepIndicator({ current }) {
  return (
    <ol className="steps">
      {STEPS.map((label, i) => (
        <li
          key={label}
          className={i === current ? "active" : i < current ? "done" : ""}
        >
          <span className="num">{i + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}
