import { z } from "zod";

export const profileBodySchema = z.object({
  role: z.enum(["swe", "product", "data", "design", "marketing", "finance"]),
  seniority: z.enum(["junior", "mid", "senior"]),
  companyType: z.enum(["startup", "big-tech", "government", "agency"]),
  inputMode: z.enum(["voice", "text"]).optional(),
  useStarScaffold: z.boolean().optional(),
});

export type ProfileBody = z.infer<typeof profileBodySchema>;

export function profileFromBody(body: ProfileBody) {
  return {
    role: body.role,
    seniority: body.seniority,
    companyType: body.companyType,
    inputMode: body.inputMode === "text" ? ("text" as const) : ("voice" as const),
    useStarScaffold: body.useStarScaffold !== false,
  };
}
