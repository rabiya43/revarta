import Constants from "expo-constants";
import type {
  CoachingFeedback,
  CompanyBrief,
  OnboardingProfile,
  Question,
  TurnMessage,
} from "@revarta/shared";

const base =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  "http://localhost:3000";

export function getApiBase(): string {
  return base.replace(/\/$/, "");
}

export async function fetchQuestions(profile: OnboardingProfile): Promise<Question[]> {
  const params = new URLSearchParams({
    role: profile.role,
    seniority: profile.seniority,
    companyType: profile.companyType,
    count: "5",
  });
  const res = await fetch(`${getApiBase()}/api/questions?${params}`);
  const data = await res.json();
  return data.questions ?? [];
}

export async function fetchCompanyBrief(
  profile: OnboardingProfile,
  companyName: string
): Promise<CompanyBrief> {
  const res = await fetch(`${getApiBase()}/api/company-brief`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, companyName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Brief failed");
  return data.brief;
}

export async function extractDocumentText(uri: string, name: string, mimeType?: string): Promise<string> {
  const form = new FormData();
  form.append("file", {
    uri,
    name,
    type: mimeType ?? "application/octet-stream",
  } as unknown as Blob);

  const res = await fetch(`${getApiBase()}/api/extract-text`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Could not read file");
  return data.text as string;
}

export async function tailorQuestions(
  profile: OnboardingProfile,
  resumeText: string,
  jobDescriptionText: string
): Promise<Question[]> {
  const res = await fetch(`${getApiBase()}/api/tailor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, resumeText, jobDescriptionText }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Tailor failed");
  return data.questions;
}

export async function fetchFeedback(
  profile: OnboardingProfile,
  questionText: string,
  answer: string,
  durationSeconds: number
): Promise<CoachingFeedback> {
  const res = await fetch(`${getApiBase()}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, questionText, answer, durationSeconds }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Feedback failed");
  return data;
}

export type InterviewStreamParams = {
  profile: OnboardingProfile;
  question: Question;
  history: TurnMessage[];
  candidateAnswer?: string;
  isOpening: boolean;
  isLastQuestion?: boolean;
};

export async function joinWaitlist(email: string, source = "mobile"): Promise<void> {
  const res = await fetch(`${getApiBase()}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Signup failed");
}

export async function streamInterviewText(params: InterviewStreamParams): Promise<string> {
  const res = await fetch(`${getApiBase()}/api/interview?sync=1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Interview failed");
  }

  const data = (await res.json()) as { text: string };
  return data.text ?? "";
}
