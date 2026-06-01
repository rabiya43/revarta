import { generateText, feedbackModel } from "@/lib/openai";
import { profileBodySchema, profileFromBody } from "@/lib/profile-schema";
import { buildCompanyBriefPrompt } from "@/lib/prompts";
import { sanitizeUserInput } from "@/lib/sanitize";
import type { CompanyBrief, OnboardingProfile } from "@/lib/types";
import { normalizeProfile } from "@revarta/shared";
import { z } from "zod";

export const maxDuration = 45;

const bodySchema = z.object({
  companyName: z.string().min(2).max(120),
  profile: z.unknown(),
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "Need a company name." }, { status: 400 });
  }

  const companyName = sanitizeUserInput(parsed.data.companyName);
  const profileParsed = profileBodySchema.safeParse(parsed.data.profile);
  const profile = (
    profileParsed.success
      ? profileFromBody(profileParsed.data)
      : normalizeProfile(parsed.data.profile)
  ) as OnboardingProfile | null;

  if (!profile) {
    return Response.json({ error: "Profile outdated. Redo onboarding." }, { status: 400 });
  }

  try {
    const { text } = await generateText({
      model: feedbackModel,
      prompt: buildCompanyBriefPrompt(companyName, profile),
      temperature: 0.35,
      maxTokens: 900,
    });

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("bad json");

    const data = JSON.parse(match[0]) as Omit<CompanyBrief, "companyName" | "generatedAt">;

    const brief: CompanyBrief = {
      companyName,
      overview: data.overview ?? "",
      culture: data.culture ?? "",
      recentNews: data.recentNews ?? "",
      interviewStyle: data.interviewStyle ?? "",
      commonQuestions: data.commonQuestions ?? [],
      generatedAt: Date.now(),
    };

    return Response.json({ brief });
  } catch {
    return Response.json({ error: "Brief failed. Retry." }, { status: 503 });
  }
}
