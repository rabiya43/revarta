import type { CompanyType, OnboardingProfile, Question, TurnMessage } from "./types";
import { getCompanyModifier } from "./question-banks";
import { ROLE_LABELS, SENIORITY_LABELS, COMPANY_LABELS } from "./types";

export function buildInterviewerSystemPrompt(profile: OnboardingProfile): string {
  return `You are Alex, a hiring manager running a mock interview for a ${SENIORITY_LABELS[profile.seniority]} ${ROLE_LABELS[profile.role]} candidate at a ${COMPANY_LABELS[profile.companyType]} company.

Ask one question at a time. Sound like a person in a real loop: short greeting, then the question. When they answer, reference something specific they said before you follow up. If the answer was thin, ask for numbers, scope, or what they personally did.

Keep replies to a few sentences unless you are asking the main question. No illegal or biased questions. ${getCompanyModifier(profile.companyType)}`;
}

export function buildOpeningUserPrompt(question: Question): string {
  return `Open the interview. Say hi briefly, then work in this question (you can rephrase):\n\n"${question.text}"`;
}

export function buildFollowUpUserPrompt(
  history: TurnMessage[],
  latestAnswer: string,
  question: Question,
  isLastQuestion: boolean
): string {
  const transcript = history
    .map((t) => `${t.role === "interviewer" ? "Interviewer" : "Candidate"}: ${t.content}`)
    .join("\n");

  const closing = isLastQuestion
    ? "Last question in the session. If they answered well enough, thank them and close."
    : "Ask a follow-up tied to their answer, or a new angle on the same topic. Do not repeat the original question word for word.";

  return `Transcript:
${transcript}

Latest answer:
${latestAnswer}

Topic: "${question.text}"
Angles you might use: ${question.followUpHints.join(", ")}

${closing}`;
}

export function buildFeedbackSystemPrompt(): string {
  return `You score mock interview answers for Revarta. Be direct: say what would hurt them in a real loop, not generic praise.

Reply with JSON only:
{
  "scores": { "structure": 0-10, "specificity": 0-10, "impactClarity": 0-10, "conciseness": 0-10, "overall": 0-10 },
  "rejectionRisks": ["..."],
  "strengths": ["..."],
  "coachingTip": "one concrete fix",
  "strongerVersionSnippet": "1-2 sentences, rewritten answer",
  "pacingNote": "short note on length"
}

Specificity = real example with names, tools, dates. Impact = metrics. Structure = clear flow. Conciseness = not rambling. If vague, say so.`;
}

export function buildTailorPrompt(
  profile: OnboardingProfile,
  resumeText: string,
  jobDescriptionText: string
): string {
  return `Write 5 interview questions for this candidate.

Role: ${ROLE_LABELS[profile.role]}, level: ${SENIORITY_LABELS[profile.seniority]}, company type: ${COMPANY_LABELS[profile.companyType]}.

Resume:
${resumeText.slice(0, 6000)}

Job description:
${jobDescriptionText.slice(0, 6000)}

Return JSON only: { "questions": [ { "id": "t1", "text": "...", "category": "behavioral|technical|situational|culture", "followUpHints": ["..."] } ] }

Questions must reference their real background and the JD. Mix behavioral and role-specific.`;
}
