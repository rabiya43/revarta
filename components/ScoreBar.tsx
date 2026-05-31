import { cn } from "@/lib/utils";

export function ScoreBar({
  label,
  score,
  max = 10,
}: {
  label: string;
  score: number;
  max?: number;
}) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const color =
    score >= 7 ? "bg-mint-500" : score >= 5 ? "bg-sun-500" : "bg-coral-500";

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-ink-700">{label}</span>
        <span className="tabular-nums text-ink-500">{score}/{max}</span>
      </div>
      <div className="score-bar-track">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${score} out of ${max}`}
        />
      </div>
    </div>
  );
}
