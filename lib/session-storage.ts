import type { InterviewSession, OnboardingProfile } from "./types";
import { generateId } from "./utils";

const SESSION_KEY = "revarta_active_session";
const PROFILE_KEY = "revarta_profile";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function saveProfile(profile: OnboardingProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfile(): OnboardingProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as OnboardingProfile) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: InterviewSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ ...session, updatedAt: Date.now() })
  );
}

export function loadSession(): InterviewSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as InterviewSession;
    if (Date.now() - session.updatedAt > SESSION_TTL_MS) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function createSession(
  profile: OnboardingProfile,
  questionIds: string[]
): InterviewSession {
  const now = Date.now();
  return {
    id: generateId(),
    profile,
    startedAt: now,
    updatedAt: now,
    turns: [],
    currentQuestionIndex: 0,
    questionIds,
    feedbackHistory: [],
    phase: "interviewing",
  };
}
