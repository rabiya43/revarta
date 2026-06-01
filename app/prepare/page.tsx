"use client";

import { Logo } from "@/components/Logo";
import { loadProfile, saveProfile, saveTailorQuestions } from "@/lib/session-storage";
import type { OnboardingProfile, Question } from "@/lib/types";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreparePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      router.replace("/onboarding");
      return;
    }
    setProfile(p);
  }, [router]);

  async function buildQuestions() {
    if (!profile || resume.trim().length < 80 || jd.trim().length < 80) {
      setError("Paste at least a few lines for both resume and job description.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          resumeText: resume.trim(),
          jobDescriptionText: jd.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      const questions = data.questions as Question[];
      saveTailorQuestions(questions);
      saveProfile({
        ...profile,
        tailor: {
          resumeText: resume.trim(),
          jobDescriptionText: jd.trim(),
          generatedAt: Date.now(),
        },
      });
      router.push("/research");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  if (!profile) return null;

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 pb-28 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/onboarding" className="rounded-xl p-2 text-ink-500 hover:bg-ink-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Logo size="sm" />
        <span className="w-9" />
      </div>

      <h1 className="mb-2 text-2xl font-black">Match this job</h1>
      <p className="mb-6 text-sm text-ink-500">
        Paste your resume and the job post. We generate questions from both. Files are not stored on
        our servers after this step.
      </p>

      <label className="mb-4 block">
        <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-700">
          <FileText className="h-4 w-4" />
          Resume
        </span>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={7}
          className="w-full rounded-2xl border-2 border-ink-100 p-4 text-sm focus:border-violet-400 focus:outline-none"
          placeholder="Paste resume text..."
        />
      </label>

      <label className="mb-4 block">
        <span className="mb-2 block text-sm font-bold text-ink-700">Job description</span>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={7}
          className="w-full rounded-2xl border-2 border-ink-100 p-4 text-sm focus:border-violet-400 focus:outline-none"
          placeholder="Paste the job posting..."
        />
      </label>

      {error && <p className="mb-4 text-sm text-coral-600">{error}</p>}

      <div className="fixed bottom-0 left-0 right-0 border-t border-ink-100 bg-white/90 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={buildQuestions}
            className="btn-primary w-full"
          >
            {loading ? "Building questions..." : "Build my questions"}
            <ArrowRight className="h-5 w-5" />
          </button>
          <Link href="/research" className="btn-secondary w-full text-center text-sm">
            Skip tailoring
          </Link>
        </div>
      </div>
    </main>
  );
}
