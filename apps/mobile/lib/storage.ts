import * as SecureStore from "expo-secure-store";
import type { OnboardingProfile, Question } from "@revarta/shared";

const PROFILE = "revarta_profile";
const TAILOR_Q = "revarta_tailor_q";

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
