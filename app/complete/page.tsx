"use client";

import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ArrowRight, PartyPopper, Sparkles } from "lucide-react";
import { useState } from "react";

export default function CompletePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-coral-400 to-mint-400 text-white shadow-xl shadow-violet-500/30">
        <PartyPopper className="h-10 w-10" />
      </div>

      <Logo className="mb-4 justify-center" />

      <h1 className="mb-3 text-3xl font-black">You showed up — that counts!</h1>
      <p className="mb-8 max-w-sm text-ink-500 leading-relaxed">
        Real interviewers remember candidates who speak with clarity and proof.
        Keep practicing out loud — that&apos;s the edge.
      </p>

      {!submitted ? (
        <div className="glass-card w-full max-w-sm p-6 text-left">
          <div className="mb-3 flex items-center gap-2 text-violet-600">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold">Save your progress</span>
          </div>
          <p className="mb-4 text-sm text-ink-500">
            Sign up to unlock session history, progress charts, and personalized drills.
            (Coming in v1 — we&apos;ll email you when it&apos;s live.)
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
            Join waitlist
          </button>
          <Link
            href="/onboarding"
            className="mt-3 block text-center text-xs text-ink-400 underline"
          >
            Skip — practice again without account
          </Link>
        </div>
      ) : (
        <p className="mb-6 rounded-2xl bg-mint-50 px-4 py-3 text-sm font-medium text-mint-700">
          You&apos;re on the list! We&apos;ll ping you when dashboards land.
        </p>
      )}

      <Link href="/onboarding" className="btn-secondary mt-6">
        Another mock interview
        <ArrowRight className="h-4 w-4" />
      </Link>
    </main>
  );
}
