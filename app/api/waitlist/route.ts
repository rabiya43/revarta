import { registerWaitlist } from "@/lib/waitlist";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(64).optional(),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  if (!parsed.success) {
    return Response.json({ error: "Enter a valid email." }, { status: 400 });
  }

  try {
    await registerWaitlist(parsed.data);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not save signup. Try again." }, { status: 502 });
  }
}
