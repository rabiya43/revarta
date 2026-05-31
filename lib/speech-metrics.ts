import type { AnswerMetrics } from "./types";

const FILLER_PATTERNS: { word: string; regex: RegExp }[] = [
  { word: "um", regex: /\bum\b/gi },
  { word: "uh", regex: /\buh\b/gi },
  { word: "like", regex: /\blike\b/gi },
  { word: "you know", regex: /\byou know\b/gi },
  { word: "sort of", regex: /\bsort of\b/gi },
  { word: "kind of", regex: /\bkind of\b/gi },
  { word: "basically", regex: /\bbasically\b/gi },
  { word: "actually", regex: /\bactually\b/gi },
];

export function analyzeAnswerSpeech(
  transcript: string,
  durationSeconds: number
): AnswerMetrics {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.max(durationSeconds / 60, 0.01);
  const wordsPerMinute = Math.round(wordCount / minutes);

  const fillerWords: Record<string, number> = {};
  let totalFillers = 0;

  for (const { word, regex } of FILLER_PATTERNS) {
    const matches = transcript.match(regex);
    const count = matches?.length ?? 0;
    if (count > 0) fillerWords[word] = count;
    totalFillers += count;
  }

  return {
    durationSeconds,
    wordCount,
    wordsPerMinute,
    fillerWords,
    totalFillers,
  };
}

export type PacingStatus = "too-short" | "ideal" | "amber" | "too-long";

export function getPacingStatus(durationSeconds: number): PacingStatus {
  if (durationSeconds < 60) return "too-short";
  if (durationSeconds <= 150) return "ideal";
  if (durationSeconds <= 180) return "amber";
  return "too-long";
}

export function pacingMessage(status: PacingStatus): string {
  switch (status) {
    case "too-short":
      return "A bit short — behavioral answers usually need 60–90 seconds of real detail.";
    case "ideal":
      return "Nice pacing — you're in the sweet spot.";
    case "amber":
      return "Getting long — start wrapping up with your result.";
    case "too-long":
      return "Over 3 minutes — interviewers lose focus. Trim setup, keep the impact.";
  }
}
