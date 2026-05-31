export const ROLES = [
  "swe",
  "product",
  "data",
  "design",
  "marketing",
  "finance",
] as const;

export const SENIORITIES = ["junior", "mid", "senior"] as const;

export const COMPANY_TYPES = [
  "startup",
  "big-tech",
  "government",
  "agency",
] as const;

export type Role = (typeof ROLES)[number];
export type Seniority = (typeof SENIORITIES)[number];
export type CompanyType = (typeof COMPANY_TYPES)[number];

export type InputMode = "voice" | "text";

export interface OnboardingProfile {
  role: Role;
  seniority: Seniority;
  companyType: CompanyType;
  inputMode: InputMode;
  useStarScaffold: boolean;
}

export interface Question {
  id: string;
  text: string;
  category: "behavioral" | "technical" | "situational" | "culture";
  followUpHints: string[];
}

export interface TurnMessage {
  role: "interviewer" | "candidate";
  content: string;
  timestamp: number;
}

export interface AnswerMetrics {
  durationSeconds: number;
  wordCount: number;
  wordsPerMinute: number;
  fillerWords: Record<string, number>;
  totalFillers: number;
}

export interface StarAnalysis {
  hasSituation: boolean;
  hasTask: boolean;
  hasAction: boolean;
  hasResult: boolean;
  missing: ("situation" | "task" | "action" | "result")[];
  score: number;
}

export interface FeedbackScores {
  structure: number;
  specificity: number;
  impactClarity: number;
  conciseness: number;
  overall: number;
}

export interface CoachingFeedback {
  scores: FeedbackScores;
  star: StarAnalysis;
  metrics: AnswerMetrics;
  rejectionRisks: string[];
  strengths: string[];
  coachingTip: string;
  strongerVersionSnippet: string;
  pacingNote: string;
}

export interface InterviewSession {
  id: string;
  profile: OnboardingProfile;
  startedAt: number;
  updatedAt: number;
  turns: TurnMessage[];
  currentQuestionIndex: number;
  questionIds: string[];
  feedbackHistory: CoachingFeedback[];
  phase: "interviewing" | "feedback" | "complete";
}

export const ROLE_LABELS: Record<Role, string> = {
  swe: "Software Engineering",
  product: "Product Management",
  data: "Data & Analytics",
  design: "Design & UX",
  marketing: "Marketing",
  finance: "Finance",
};

export const SENIORITY_LABELS: Record<Seniority, string> = {
  junior: "Junior (0–2 yrs)",
  mid: "Mid-level (3–5 yrs)",
  senior: "Senior (6+ yrs)",
};

export const COMPANY_LABELS: Record<CompanyType, string> = {
  startup: "Startup",
  "big-tech": "Big Tech",
  government: "Government",
  agency: "Agency / Consulting",
};
