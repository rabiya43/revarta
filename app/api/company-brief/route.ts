import { generateText, feedbackModel } from "@/lib/openai";
import { buildCompanyBriefPrompt } from "@/lib/prompts";
import { sanitizeUserInput } from "@/lib/sanitize";
import type { CompanyBrief, OnboardingProfile } from "@/lib/types";
import { z } from "zod";

export const maxDuration = 45;

const bodySchema = z.object({
  companyName: z.string().min(2).max(120),
  profile: z.object({
    role: z.enum(["swe", "product", "data", "design", "marketing", "finance"]),
    seniority: z.enum(["junior", "mid", "senior"]),
    companyType: z.enum(["startup", "big-tech", "government", "agency"]),
    inputMode: z.enum(["voice", "text"]),
    useStarScaffold: z.boolean(),
  }),
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
  const profile = parsed.data.profile as OnboardingProfile;

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
