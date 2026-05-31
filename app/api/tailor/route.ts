import { generateText, feedbackModel } from "@/lib/openai";
import { buildTailorPrompt } from "@/lib/prompts";
import { sanitizeUserInput } from "@/lib/sanitize";
import type { OnboardingProfile, Question } from "@/lib/types";
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
  resumeText: z.string().min(80),
  jobDescriptionText: z.string().min(80),
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "Need resume and job description (80+ chars each)." }, { status: 400 });
  }

  const resumeText = sanitizeUserInput(parsed.data.resumeText);
  const jobDescriptionText = sanitizeUserInput(parsed.data.jobDescriptionText);
  const profile = parsed.data.profile as OnboardingProfile;

  try {
    const { text } = await generateText({
      model: feedbackModel,
      prompt: buildTailorPrompt(profile, resumeText, jobDescriptionText),
      temperature: 0.4,
      maxTokens: 1200,
    });

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("bad json");

    const data = JSON.parse(match[0]) as { questions: Question[] };
    const questions = (data.questions ?? []).slice(0, 5).map((q, i) => ({
      id: q.id || `tailor-${i + 1}`,
      text: q.text,
      category: q.category ?? "behavioral",
      followUpHints: q.followUpHints ?? ["details", "impact"],
    }));

    if (questions.length < 3) {
      return Response.json({ error: "Could not build enough questions. Try again." }, { status: 502 });
    }

    return Response.json({ questions });
  } catch {
    return Response.json({ error: "Tailor failed. Retry." }, { status: 503 });
  }
}
