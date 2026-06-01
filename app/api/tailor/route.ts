import { generateText, feedbackModel } from "@/lib/openai";
import { parseJsonFromModelText } from "@/lib/parse-model-json";
import { profileBodySchema, profileFromBody } from "@/lib/profile-schema";
import { buildTailorPrompt } from "@/lib/prompts";
import { sanitizeUserInput } from "@/lib/sanitize";
import type { OnboardingProfile, Question } from "@/lib/types";
import { normalizeProfile } from "@revarta/shared";
import { z } from "zod";

export const maxDuration = 60;

const MIN_TEXT = 40;

const bodySchema = z.object({
  profile: z.unknown(),
  resumeText: z.string().min(MIN_TEXT, "Resume text is too short."),
  jobDescriptionText: z.string().min(MIN_TEXT, "Job description is too short."),
});

function mapQuestions(raw: Question[]): Question[] {
  return raw.slice(0, 5).map((q, i) => ({
    id: q.id || `tailor-${i + 1}`,
    text: q.text,
    category: q.category ?? "behavioral",
    followUpHints: q.followUpHints ?? ["details", "impact"],
  }));
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "Server is missing OPENAI_API_KEY. Add it to .env.local and restart." },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message;
    return Response.json(
      {
        error:
          msg ??
          `Add more detail in both fields (at least ${MIN_TEXT} characters each), or upload a fuller file.`,
      },
      { status: 400 }
    );
  }

  const profileParsed = profileBodySchema.safeParse(parsed.data.profile);
  const profile =
    profileParsed.success
      ? profileFromBody(profileParsed.data)
      : normalizeProfile(parsed.data.profile);

  if (!profile) {
    return Response.json(
      { error: "Profile is missing or outdated. Go back to onboarding and start again." },
      { status: 400 }
    );
  }

  const resumeText = sanitizeUserInput(parsed.data.resumeText);
  const jobDescriptionText = sanitizeUserInput(parsed.data.jobDescriptionText);
  const fullProfile = profile as OnboardingProfile;

  if (resumeText.length < MIN_TEXT || jobDescriptionText.length < MIN_TEXT) {
    return Response.json(
      {
        error: `Need at least ${MIN_TEXT} characters of readable text in both resume and job description.`,
      },
      { status: 400 }
    );
  }

  try {
    const { text } = await generateText({
      model: feedbackModel,
      system:
        "You write interview prep questions. Reply with a single valid JSON object only — no markdown fences or commentary.",
      prompt: buildTailorPrompt(fullProfile, resumeText, jobDescriptionText),
      temperature: 0.35,
      maxTokens: 1400,
    });

    const data = parseJsonFromModelText<{ questions: Question[] }>(text);
    const questions = data?.questions ? mapQuestions(data.questions) : [];

    if (questions.length >= 3) {
      return Response.json({ questions });
    }

    const retry = await generateText({
      model: feedbackModel,
      system: "Output only valid JSON.",
      prompt: `${buildTailorPrompt(fullProfile, resumeText, jobDescriptionText)}\n\nReturn exactly 5 questions in JSON.`,
      temperature: 0.2,
      maxTokens: 1400,
    });

    const retryData = parseJsonFromModelText<{ questions: Question[] }>(retry.text);
    const retryQuestions = retryData?.questions ? mapQuestions(retryData.questions) : [];

    if (retryQuestions.length >= 3) {
      return Response.json({ questions: retryQuestions });
    }

    return Response.json(
      {
        error:
          "Could not build tailored questions from this text. Shorten very long PDFs or paste plain text and try again.",
      },
      { status: 502 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[tailor]", message);
    return Response.json(
      {
        error:
          "Tailor request failed. Check OPENAI_API_KEY and your connection, then try again.",
      },
      { status: 503 }
    );
  }
}
