import { STAR_LABELS } from "@/lib/star";
import type { StarAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const PARTS = ["situation", "task", "action", "result"] as const;

export function StarCoach({
  star,
  showScaffold,
}: {
  star: StarAnalysis;
  showScaffold?: boolean;
}) {
  const found = {
    situation: star.hasSituation,
    task: star.hasTask,
    action: star.hasAction,
    result: star.hasResult,
  };

  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-violet-700">STAR Method</h4>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-violet-600">
          {star.score}/10
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PARTS.map((part) => {
          const ok = found[part];
          const meta = STAR_LABELS[part];
          return (
            <div
              key={part}
              className={cn(
                "flex flex-col items-center rounded-xl p-2 text-center transition",
                ok ? "bg-mint-100 text-mint-600" : "bg-white text-ink-300"
              )}
            >
              <span className="text-lg font-black">{meta.letter}</span>
              {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </div>
          );
        })}
      </div>
      {star.missing.length > 0 && (
        <p className="mt-3 text-sm text-ink-500">
          Missing:{" "}
          <span className="font-medium text-coral-600">
            {star.missing.map((m) => STAR_LABELS[m].label).join(", ")}
          </span>
        </p>
      )}
      {showScaffold && star.missing.length > 0 && (
        <ul className="mt-2 space-y-1 border-t border-violet-100 pt-2">
          {star.missing.map((m) => (
            <li key={m} className="text-xs text-ink-500">
              <strong className="text-violet-600">{STAR_LABELS[m].letter}:</strong>{" "}
              {STAR_LABELS[m].hint}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
