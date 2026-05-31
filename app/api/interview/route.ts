import { streamText } from "@/lib/ai";
import { interviewModel } from "@/lib/ai";
import {
  buildFollowUpUserPrompt,
  buildInterviewerSystemPrompt,
  buildOpeningUserPrompt,
} from "@/lib/prompts";
import { sanitizeUserInput } from "@/lib/sanitize";
import type { OnboardingProfile, Question, TurnMessage } from "@/lib/types";
import { z } from "zod";

export const maxDuration = 60;

const bodySchema = z.object({
  profile: z.object({
    role: z.enum(["swe", "product", "data", "design", "marketing", "finance"]),
    seniority: z.enum(["junior", "mid", "senior"]),
    companyType: z.enum(["startup", "big-tech", "government", "agency"]),
    inputMode: z.enum(["voice", "text"]),
    useStarScaffold: z.boolean(),
  }),
  question: z.object({
    id: z.string(),
    text: z.string(),
    category: z.string(),
    followUpHints: z.array(z.string()),
  }),
  history: z.array(
    z.object({
      role: z.enum(["interviewer", "candidate"]),
      content: z.string(),
      timestamp: z.number(),
    })
  ),
  candidateAnswer: z.string().optional(),
  isOpening: z.boolean(),
  isLastQuestion: z.boolean().optional(),
});

function friendlyError(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return friendlyError(
      "Interview coach is warming up. Please add your API key and try again.",
      503
    );
  }

  let parsed;
  try {
    const json = await req.json();
    parsed = bodySchema.safeParse(json);
  } catch {
    return friendlyError("Something went wrong. Please try again.", 400);
  }

  if (!parsed.success) {
    return friendlyError("Invalid request. Please refresh and try again.", 400);
  }

  const { profile, question, history, candidateAnswer, isOpening, isLastQuestion } =
    parsed.data;

  const system = buildInterviewerSystemPrompt(profile as OnboardingProfile);

  let userPrompt: string;
  if (isOpening) {
    userPrompt = buildOpeningUserPrompt(question as Question);
  } else {
    const answer = sanitizeUserInput(candidateAnswer ?? "");
    if (!answer) {
      return friendlyError("Please share your answer before continuing.", 400);
    }
    userPrompt = buildFollowUpUserPrompt(
      history as TurnMessage[],
      answer,
      question as Question,
      isLastQuestion ?? false
    );
  }

  try {
    const result = streamText({
      model: interviewModel,
      system,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 400,
    });

    return result.toDataStreamResponse();
  } catch {
    return friendlyError(
      "Our interviewer stepped out for a moment. Tap retry in a few seconds.",
      503
    );
  }
}
