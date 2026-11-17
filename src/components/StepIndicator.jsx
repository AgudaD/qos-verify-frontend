export default function StepIndicator({ current, steps }) {
  return (
    <ol className="steps">
      {steps.map((label, i) => (
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
