"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function SelectionCard({
  selected,
  onClick,
  emoji,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  emoji: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98]",
        selected
          ? "border-violet-400 bg-violet-50 shadow-md shadow-violet-500/10"
          : "border-ink-100 bg-white hover:border-violet-200 hover:bg-violet-50/30"
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
          <Check className="h-4 w-4" />
        </span>
      )}
      <span className="mb-2 block text-2xl" role="img" aria-hidden>
        {emoji}
      </span>
      <span className="block font-bold text-ink-900">{title}</span>
      {subtitle && <span className="mt-0.5 block text-sm text-ink-500">{subtitle}</span>}
    </button>
  );
}
