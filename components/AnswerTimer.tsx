"use client";

import { getPacingStatus, pacingMessage } from "@/lib/speech-metrics";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export function AnswerTimer({ seconds, active }: { seconds: number; active: boolean }) {
  const status = getPacingStatus(seconds);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins}:${secs.toString().padStart(2, "0")}`;

  const ringColor = {
    "too-short": "text-coral-500 border-coral-300",
    ideal: "text-mint-600 border-mint-400",
    amber: "text-sun-500 border-sun-400",
    "too-long": "text-coral-600 border-coral-500",
  }[status];

  const bgColor = {
    "too-short": "bg-coral-50",
    ideal: "bg-mint-50",
    amber: "bg-amber-50",
    "too-long": "bg-coral-100",
  }[status];

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl border-2 px-3 py-2 transition-colors",
        ringColor,
        bgColor,
        active && status === "ideal" && "shadow-sm"
      )}
      title={pacingMessage(status)}
    >
      <Clock className="h-4 w-4 shrink-0" />
      <span className="font-mono text-sm font-bold tabular-nums">{display}</span>
      {active && status !== "ideal" && (
        <span className="hidden text-xs sm:inline">{pacingMessage(status)}</span>
      )}
    </div>
  );
}
