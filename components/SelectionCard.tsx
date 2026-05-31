"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

export function SelectionCard({
  selected,
  onClick,
  badge,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  badge?: string;
  icon?: ReactNode;
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
      {(badge || icon) && (
        <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
          {icon ?? (
            <span className="text-xs font-bold tracking-tight">{badge}</span>
          )}
        </span>
      )}
      <span className="block font-bold text-ink-900">{title}</span>
      {subtitle && <span className="mt-0.5 block text-sm text-ink-500">{subtitle}</span>}
    </button>
  );
}
