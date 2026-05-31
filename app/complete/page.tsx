"use client";

import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function CompletePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <Logo className="mb-8 justify-center" />

      <h1 className="mb-3 text-3xl font-black">Session done</h1>
      <p className="mb-8 max-w-sm text-ink-500 leading-relaxed">
        Doing these out loud matters more than reading questions in your head.
        Run another round when you can.
      </p>

      {!submitted ? (
        <div className="glass-card w-full max-w-sm p-6 text-left">
          <p className="mb-1 font-bold text-ink-900">Save progress (soon)</p>
          <p className="mb-4 text-sm text-ink-500">
            History and charts are not built yet. Leave your email if you want a
            heads up when that ships.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="mb-3 w-full rounded-xl border-2 border-ink-100 px-4 py-3 text-sm focus:border-violet-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => email.includes("@") && setSubmitted(true)}
            className="btn-primary w-full text-sm"
            disabled={!email.includes("@")}
          >
            Notify me
          </button>
          <Link
            href="/onboarding"
            className="mt-3 block text-center text-xs text-ink-400 underline"
          >
            Skip, start another session
          </Link>
        </div>
      ) : (
        <p className="mb-6 rounded-2xl bg-mint-50 px-4 py-3 text-sm font-medium text-mint-700">
          Got it. We will email you when accounts are ready.
        </p>
      )}

      <Link href="/onboarding" className="btn-secondary mt-6">
        New session
        <ArrowRight className="h-4 w-4" />
      </Link>
    </main>
  );
}
