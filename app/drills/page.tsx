"use client";

import { FeedbackCard } from "@/components/FeedbackCard";
import { FeedbackSkeleton } from "@/components/Skeleton";
import { Logo } from "@/components/Logo";
import { selectQuestions } from "@/lib/question-banks";
import { loadProfile } from "@/lib/session-storage";
import type { CoachingFeedback, OnboardingProfile, Question } from "@/lib/types";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function DrillsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<CoachingFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState<number | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      router.replace("/onboarding");
      return;
    }
    setProfile(p);
    pickQuestion(p);
  }, [router]);

  const pickQuestion = (p: OnboardingProfile) => {
    const qs = selectQuestions(p.role, p.seniority, p.companyType, 8);
    setQuestion(qs[Math.floor(Math.random() * qs.length)] ?? null);
    setAnswer("");
    setFeedback(null);
    setStarted(null);
  };

  const categoryLabel = useMemo(() => question?.category ?? "", [question]);

  async function submit() {
    if (!profile || !question || !answer.trim()) return;
    const duration = started
      ? Math.round((Date.now() - started) / 1000)
      : Math.max(30, answer.split(/\s+/).length);

    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          questionText: question.text,
          answer: answer.trim(),
          durationSeconds: duration,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFeedback(data);
    } catch {
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  }

  if (!profile || !question) return null;

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 pb-12 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/progress" className="rounded-xl p-2 text-ink-500 hover:bg-ink-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Logo size="sm" />
        <span className="rounded-full bg-mint-100 px-2 py-0.5 text-xs font-bold text-mint-700">
          No timer
        </span>
      </div>

      <p className="mb-2 text-xs font-bold text-violet-600">{categoryLabel} drill</p>
      <h1 className="mb-6 text-xl font-black leading-snug">{question.text}</h1>

      {!feedback && (
        <>
          <textarea
            value={answer}
            onFocus={() => !started && setStarted(Date.now())}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
            className="mb-4 w-full rounded-2xl border-2 border-ink-100 p-4 text-sm focus:border-violet-400 focus:outline-none"
            placeholder="Work through your answer. No clock on this screen."
          />
          <button
            type="button"
            onClick={submit}
            disabled={loading || answer.trim().length < 10}
            className="btn-primary mb-3 w-full"
          >
            Get feedback
          </button>
        </>
      )}

      {loading && <FeedbackSkeleton />}
      {feedback && (
        <>
          <FeedbackCard feedback={feedback} showStarScaffold={profile.useStarScaffold} />
          <button
            type="button"
            onClick={() => pickQuestion(profile)}
            className="btn-secondary mt-4 w-full"
          >
            <RefreshCw className="h-4 w-4" />
            Next drill
          </button>
        </>
      )}
    </main>
  );
}
