import { generateText, feedbackModel } from "@/lib/ai";
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
    return friendlyError(
      "Feedback coach is warming up. Please add your API key and try again.",
      503
    );
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return friendlyError("Something went wrong. Please try again.", 400);
  }

  if (!parsed.success) {
    return friendlyError("Invalid request.", 400);
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
        "Answer is too short — interviewers will think you have no real experience to draw from.",
      ],
      strengths: [],
      coachingTip:
        "Aim for 60–90 seconds: set the scene, your role, what you did, and a quantified result.",
      strongerVersionSnippet:
        "At [Company], when [situation], I was responsible for [task]. I [specific action], which resulted in [metric].",
      pacingNote: "Too short for a behavioral question.",
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

Local analysis — STAR parts found: S=${star.hasSituation} T=${star.hasTask} A=${star.hasAction} R=${star.hasResult}. Duration: ${durationSeconds}s, WPM: ${metrics.wordsPerMinute}, Fillers: ${metrics.totalFillers}`,
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
      coachingTip: ai.coachingTip ?? "Add a specific example with measurable impact.",
      strongerVersionSnippet: ai.strongerVersionSnippet ?? "",
      pacingNote: ai.pacingNote ?? "",
    };

    return Response.json(feedback);
  } catch {
    return friendlyError(
      "Couldn't analyze that answer right now. Tap retry — your answer is saved.",
      503
    );
  }
}
