"use client";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";
import { Keyboard, Mic, MicOff, Square } from "lucide-react";

export function VoiceInput({
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
  const speech = useSpeechRecognition();

  const displayText = speech.isListening ? speech.transcript || value : value;

  const handleMicToggle = () => {
    if (speech.isListening) {
      speech.stop();
      if (speech.transcript) onChange(speech.transcript);
    } else {
      speech.reset();
      speech.start();
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "min-h-[120px] rounded-2xl border-2 bg-white p-4 text-sm leading-relaxed text-ink-700 transition",
          speech.isListening ? "border-violet-400 ring-2 ring-violet-200" : "border-ink-100"
        )}
      >
        {displayText || (
          <span className="text-ink-300">
            {speech.isListening
              ? "Listening..."
              : "Tap the mic and answer out loud."}
          </span>
        )}
      </div>

      {speech.error && <p className="text-sm text-coral-600">{speech.error}</p>}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          disabled={disabled || !speech.isSupported}
          onClick={handleMicToggle}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition",
            speech.isListening
              ? "bg-coral-500 text-white shadow-coral-500/40 mic-pulse"
              : "bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-violet-500/40 hover:scale-105",
            disabled && "opacity-50"
          )}
          aria-label={speech.isListening ? "Stop recording" : "Start recording"}
        >
          {speech.isListening ? (
            <Square className="h-6 w-6 fill-current" />
          ) : speech.isSupported ? (
            <Mic className="h-7 w-7" />
          ) : (
            <MicOff className="h-7 w-7" />
          )}
        </button>

        <button
          type="button"
          onClick={onModeSwitch}
          className="btn-secondary text-sm"
          disabled={disabled}
        >
          <Keyboard className="h-4 w-4" />
          Type instead
        </button>
      </div>
    </div>
  );
}
