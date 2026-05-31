"use client";

import { Mic } from "lucide-react";

export function TextInput({
  value,
  onChange,
  onModeSwitch,
  disabled,
}: {
  value: string;
  onChange: (text: string) => void;
  onModeSwitch: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer here — pretend you're speaking to a real interviewer."
        rows={6}
        className="w-full resize-none rounded-2xl border-2 border-ink-100 bg-white p-4 text-sm leading-relaxed text-ink-700 placeholder:text-ink-300 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:opacity-50"
      />
      <button
        type="button"
        onClick={onModeSwitch}
        className="btn-secondary w-full text-sm"
        disabled={disabled}
      >
        <Mic className="h-4 w-4" />
        Switch to voice mode
      </button>
    </div>
  );
}
