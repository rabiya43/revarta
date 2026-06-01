"use client";

import { DocumentField } from "@/components/DocumentField";
import { Logo } from "@/components/Logo";
import { loadProfile, saveProfile, saveTailorQuestions } from "@/lib/session-storage";
import { normalizeProfile } from "@revarta/shared";
import type { OnboardingProfile, Question } from "@/lib/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MIN_CHARS = 40;

export default function PreparePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = loadProfile();
    const p = raw ? normalizeProfile(raw) : null;
    if (!p) {
      router.replace("/onboarding");
      return;
    }
    saveProfile(p);
    setProfile(p);
    if (p.tailor?.resumeText) setResume(p.tailor.resumeText);
    if (p.tailor?.jobDescriptionText) setJd(p.tailor.jobDescriptionText);
  }, [router]);

  async function buildQuestions() {
    if (!profile) return;

    const resumeText = resume.trim();
    const jobDescriptionText = jd.trim();

    if (resumeText.length < MIN_CHARS || jobDescriptionText.length < MIN_CHARS) {
      setError(
        `Add your resume and job description (${MIN_CHARS}+ characters each). Upload a PDF/DOCX or paste the text.`
      );
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
          resumeText,
          jobDescriptionText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to tailor questions");

      const questions = data.questions as Question[];
      saveTailorQuestions(questions);
      saveProfile({
        ...profile,
        tailor: {
          resumeText,
          jobDescriptionText,
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
        Upload or paste your resume and the job posting. We build interview questions from both.
        Text is not kept on our servers after this step.
      </p>

      <DocumentField
        label="Resume"
        value={resume}
        onChange={setResume}
        placeholder="Paste resume text…"
      />

      <DocumentField
        label="Job description"
        value={jd}
        onChange={setJd}
        placeholder="Paste the job posting…"
      />

      {error && <p className="mb-4 text-sm text-coral-600">{error}</p>}

      <div className="fixed bottom-0 left-0 right-0 border-t border-ink-100 bg-white/90 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={buildQuestions}
            className="btn-primary w-full"
          >
            {loading ? "Tailoring questions…" : "Tailor questions"}
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
