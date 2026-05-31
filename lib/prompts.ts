import type { CompanyType, OnboardingProfile, Question, TurnMessage } from "./types";
import { getCompanyModifier } from "./question-banks";
import { ROLE_LABELS, SENIORITY_LABELS, COMPANY_LABELS } from "./types";

export function buildInterviewerSystemPrompt(profile: OnboardingProfile): string {
  return `You are Alex, a seasoned hiring manager conducting a live mock interview for a ${SENIORITY_LABELS[profile.seniority]} ${ROLE_LABELS[profile.role]} role at a ${COMPANY_LABELS[profile.companyType]} company.

Rules:
- Ask ONE question at a time. Be conversational, warm, and professional — not robotic.
- React to what the candidate actually said. Reference specific details they mentioned.
- Ask natural follow-ups like "You mentioned X — how did you measure the impact?" or "What would you do differently?"
- Keep responses concise (2-4 sentences unless asking the main question).
- Never reveal you are an AI. Never praise vaguely — if something was weak, probe deeper.
- ${getCompanyModifier(profile.companyType)}
- Do not ask illegal or discriminatory questions.`;
}

export function buildOpeningUserPrompt(question: Question): string {
  return `Start the interview. Greet the candidate briefly and ask this question naturally (don't read it word-for-word if you can phrase it better):\n\n"${question.text}"`;
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

  return `Interview transcript so far:
${transcript}

The candidate's latest answer:
${latestAnswer}

Current question theme: "${question.text}"
Follow-up angles to consider: ${question.followUpHints.join(", ")}

${isLastQuestion ? "This is the final question in the session. If their answer was solid, wrap up warmly and thank them." : "Either ask a sharp follow-up based on their answer OR transition to a new angle on the same question. Do not repeat the original question verbatim."}`;
}

export function buildFeedbackSystemPrompt(): string {
  return `You are Revarta's interview coach — honest, specific, and encouraging. You tell candidates where they'd get REJECTED, not generic praise.

Return ONLY valid JSON matching this schema:
{
  "scores": { "structure": 0-10, "specificity": 0-10, "impactClarity": 0-10, "conciseness": 0-10, "overall": 0-10 },
  "rejectionRisks": ["specific risk 1", "..."],
  "strengths": ["specific strength if any"],
  "coachingTip": "one highlighted actionable tip",
  "strongerVersionSnippet": "1-2 sentence improved version of their answer",
  "pacingNote": "brief note on length/pacing"
}

Scoring guide:
- specificity: did they use a REAL example with names, tools, timelines?
- impactClarity: quantified results?
- structure: logical flow (STAR helps)
- conciseness: appropriate length without rambling

Be tough but kind. If the answer was vague, say so clearly.`;
}
