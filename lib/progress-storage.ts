import type { CoachingFeedback, InterviewSession, SessionRecord } from "./types";

const HISTORY_KEY = "revarta_session_history";
const MAX_RECORDS = 50;

export function saveSessionToHistory(session: InterviewSession): void {
  if (typeof window === "undefined" || session.feedbackHistory.length === 0) return;

  const history = loadHistory();
  const fb = session.feedbackHistory;
  const avg = (key: keyof CoachingFeedback["scores"]) =>
    Math.round((fb.reduce((s, f) => s + f.scores[key], 0) / fb.length) * 10) / 10;

  const record: SessionRecord = {
    id: session.id,
    completedAt: Date.now(),
    role: session.profile.role,
    seniority: session.profile.seniority,
    companyType: session.profile.companyType,
    questionsAnswered: fb.length,
    avgOverall: avg("overall"),
    avgStructure: avg("structure"),
    avgSpecificity: avg("specificity"),
    avgImpact: avg("impactClarity"),
  };

  const next = [record, ...history.filter((r) => r.id !== record.id)].slice(0, MAX_RECORDS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function loadHistory(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as SessionRecord[]) : [];
  } catch {
    return [];
  }
}

export function calcStreak(records: SessionRecord[]): number {
  if (records.length === 0) return 0;

  const days = new Set(
    records.map((r) => new Date(r.completedAt).toISOString().slice(0, 10))
  );
  const sorted = [...days].sort().reverse();

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (sorted.includes(expectedStr)) streak++;
    else break;
  }
  return streak;
}
