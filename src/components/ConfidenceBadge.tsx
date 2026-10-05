interface Props {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function ConfidenceBadge({ score, size = "md" }: Props) {
  const { bg, text, dot } =
    score >= 85
      ? { bg: "#d1fae5", text: "#059669", dot: "#34d399" }
      : score >= 70
      ? { bg: "#fef9c3", text: "#ca8a04", dot: "#fbbf24" }
      : { bg: "#fee2e2", text: "#dc2626", dot: "#f87171" };

  const label = score >= 85 ? "High" : score >= 70 ? "Moderate" : "Low";

  const sizeClass =
    size === "sm" ? "px-2 py-0.5 text-[11px]"
    : size === "lg" ? "px-4 py-2 text-base"
    : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClass}`}
      style={{ background: bg, color: text }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
      {score}% · {label}
    </span>
  );
}
