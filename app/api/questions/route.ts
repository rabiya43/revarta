import { selectQuestions } from "@/lib/question-banks";
import { z } from "zod";

const querySchema = z.object({
  role: z.enum(["swe", "product", "data", "design", "marketing", "finance"]),
  seniority: z.enum(["junior", "mid", "senior"]),
  companyType: z.enum(["startup", "big-tech", "government", "agency"]),
  count: z.coerce.number().min(3).max(8).optional(),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    role: searchParams.get("role"),
    seniority: searchParams.get("seniority"),
    companyType: searchParams.get("companyType"),
    count: searchParams.get("count") ?? 5,
  });

  if (!parsed.success) {
    return Response.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { role, seniority, companyType, count } = parsed.data;
  const questions = selectQuestions(role, seniority, companyType, count ?? 5);

  return Response.json(
    { questions },
    {
      headers: {
        "Cache-Control": "private, max-age=60",
      },
    }
  );
}
