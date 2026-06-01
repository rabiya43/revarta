import * as SecureStore from "expo-secure-store";
import type { CompanyBrief, OnboardingProfile, Question, SessionRecord } from "@revarta/shared";

const PROFILE = "revarta_profile";
const TAILOR_Q = "revarta_tailor_q";
const BRIEF = "revarta_brief";
const HISTORY = "revarta_history";

export async function saveProfile(profile: OnboardingProfile) {
  await SecureStore.setItemAsync(PROFILE, JSON.stringify(profile));
}

export async function loadProfile(): Promise<OnboardingProfile | null> {
  const raw = await SecureStore.getItemAsync(PROFILE);
  return raw ? (JSON.parse(raw) as OnboardingProfile) : null;
}

export async function saveTailorQuestions(questions: Question[]) {
  await SecureStore.setItemAsync(TAILOR_Q, JSON.stringify(questions));
}

export async function loadTailorQuestions(): Promise<Question[] | null> {
  const raw = await SecureStore.getItemAsync(TAILOR_Q);
  return raw ? (JSON.parse(raw) as Question[]) : null;
}

export async function saveCompanyBrief(brief: CompanyBrief) {
  await SecureStore.setItemAsync(BRIEF, JSON.stringify(brief));
}

export async function loadCompanyBrief(): Promise<CompanyBrief | null> {
  const raw = await SecureStore.getItemAsync(BRIEF);
  return raw ? (JSON.parse(raw) as CompanyBrief) : null;
}

export async function appendSessionRecord(record: SessionRecord) {
  const raw = await SecureStore.getItemAsync(HISTORY);
  const list: SessionRecord[] = raw ? JSON.parse(raw) : [];
  const next = [record, ...list.filter((r) => r.id !== record.id)].slice(0, 50);
  await SecureStore.setItemAsync(HISTORY, JSON.stringify(next));
}

export async function loadSessionHistory(): Promise<SessionRecord[]> {
  const raw = await SecureStore.getItemAsync(HISTORY);
  return raw ? (JSON.parse(raw) as SessionRecord[]) : [];
}
