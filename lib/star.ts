import type { StarAnalysis } from "./types";

const SITUATION_CUES =
  /\b(when|at\s+my|at\s+\w+|previous|former|last\s+year|quarter|team\s+was|company|project|situation|context)\b/i;
const TASK_CUES =
  /\b(my\s+role|i\s+was\s+asked|responsible|goal|objective|needed\s+to|task|challenge\s+was|problem\s+was)\b/i;
const ACTION_CUES =
  /\b(i\s+(built|created|led|designed|implemented|worked|collaborated|decided|proposed|shipped|organized|analyzed|presented)|we\s+(built|launched)|first\s+i|then\s+i)\b/i;
const RESULT_CUES =
  /\b(result|outcome|impact|increased|decreased|reduced|improved|saved|grew|%\s*|percent|revenue|users|metric|kpi|roi|delivered|achieved|as\s+a\s+result)\b/i;

export function analyzeStar(answer: string): StarAnalysis {
  const hasSituation = SITUATION_CUES.test(answer);
  const hasTask = TASK_CUES.test(answer);
  const hasAction = ACTION_CUES.test(answer);
  const hasResult = RESULT_CUES.test(answer);

  const missing: StarAnalysis["missing"] = [];
  if (!hasSituation) missing.push("situation");
  if (!hasTask) missing.push("task");
  if (!hasAction) missing.push("action");
  if (!hasResult) missing.push("result");

  const parts = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  const score = Math.round((parts / 4) * 10);

  return { hasSituation, hasTask, hasAction, hasResult, missing, score };
}

export const STAR_LABELS = {
  situation: { letter: "S", label: "Situation", hint: "Set the scene — when, where, what was going on?" },
  task: { letter: "T", label: "Task", hint: "What were YOU responsible for?" },
  action: { letter: "A", label: "Action", hint: "What specific steps did you take?" },
  result: { letter: "R", label: "Result", hint: "Quantify the outcome — numbers, %, time saved." },
} as const;
