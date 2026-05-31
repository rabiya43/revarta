import { generateText, feedbackModel } from "@/lib/openai";
import { buildFeedbackSystemPrompt } from "@/lib/prompts";
import { analyzeStar } from "@/lib/star";
import { analyzeAnswerSpeech } from "@/lib/speech-metrics";
import { sanitizeUserInput, wrapUserContentForPrompt } from "@/lib/sanitize";
import type { CoachingFeedback, OnboardingProfile } from "@/lib/types";
import { z } from "zod";

export const maxDuration = 45;

const bodySchema = z.object({
  profile: z.object({
    role: z.enum(["swe", "product", "data", "design", "marketing", "finance"]),
    seniority: z.enum(["junior", "mid", "senior"]),
    companyType: z.enum(["startup", "big-tech", "government", "agency"]),
    inputMode: z.enum(["voice", "text"]),
    useStarScaffold: z.boolean(),
  }),
  questionText: z.string(),
  answer: z.string(),
  durationSeconds: z.number().min(0).max(600),
});

function friendlyError(message: string, status = 500) {
  return Response.json({ error: message }, { status });
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return friendlyError("Missing OPENAI_API_KEY in server env.", 503);
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return friendlyError("Bad request.", 400);
  }

  if (!parsed.success) {
    return friendlyError("Bad request.", 400);
  }

  const { profile, questionText, answer, durationSeconds } = parsed.data;
  const sanitized = sanitizeUserInput(answer);

  if (sanitized.length < 20) {
    return Response.json({
      scores: {
        structure: 2,
        specificity: 1,
        impactClarity: 1,
        conciseness: 3,
        overall: 2,
      },
      star: analyzeStar(sanitized),
      metrics: analyzeAnswerSpeech(sanitized, durationSeconds),
      rejectionRisks: [
        "Too short. Interviewers will assume you do not have a real example ready.",
      ],
      strengths: [],
      coachingTip:
        "Aim for 60-90 seconds: context, your role, what you did, and a result with a number if you can.",
      strongerVersionSnippet:
        "At [company], when [situation], I owned [task]. I [action], which led to [metric].",
      pacingNote: "Under a minute for a behavioral question.",
    } satisfies CoachingFeedback);
  }

  const metrics = analyzeAnswerSpeech(sanitized, durationSeconds);
  const star = analyzeStar(sanitized);

  try {
    const { text } = await generateText({
      model: feedbackModel,
      system: buildFeedbackSystemPrompt(),
      prompt: `Role: ${profile.role}, Level: ${profile.seniority}
Question: ${questionText}

${wrapUserContentForPrompt(sanitized)}

STAR flags: S=${star.hasSituation} T=${star.hasTask} A=${star.hasAction} R=${star.hasResult}. ${durationSeconds}s, ${metrics.wordsPerMinute} wpm, ${metrics.totalFillers} fillers.`,
      temperature: 0.3,
      maxTokens: 700,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON");

    const ai = JSON.parse(jsonMatch[0]) as {
      scores: CoachingFeedback["scores"];
      rejectionRisks: string[];
      strengths: string[];
      coachingTip: string;
      strongerVersionSnippet: string;
      pacingNote: string;
    };

    const feedback: CoachingFeedback = {
      scores: ai.scores,
      star,
      metrics,
      rejectionRisks: ai.rejectionRisks ?? [],
      strengths: ai.strengths ?? [],
      coachingTip: ai.coachingTip ?? "Add a concrete example with a measurable result.",
      strongerVersionSnippet: ai.strongerVersionSnippet ?? "",
      pacingNote: ai.pacingNote ?? "",
    };

    return Response.json(feedback);
  } catch {
    return friendlyError("Feedback failed. Retry.", 503);
  }
}
