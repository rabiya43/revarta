export type WaitlistPayload = {
  email: string;
  source?: string;
};

export async function registerWaitlist({ email, source }: WaitlistPayload): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const webhook = process.env.WAITLIST_WEBHOOK_URL?.trim();

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalized,
        source: source ?? "web",
        at: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      throw new Error("Waitlist webhook failed");
    }
  }

  console.log("[waitlist]", normalized, source ?? "web");
}
