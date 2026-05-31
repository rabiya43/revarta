"use client";

import { Logo } from "@/components/Logo";
import { SelectionCard } from "@/components/SelectionCard";
import {
  COMPANY_LABELS,
  COMPANY_TYPES,
  ROLE_LABELS,
  ROLES,
  SENIORITIES,
  SENIORITY_LABELS,
  type CompanyType,
  type OnboardingProfile,
  type Role,
  type Seniority,
} from "@/lib/types";
import { saveProfile } from "@/lib/session-storage";
import { ArrowLeft, ArrowRight, Keyboard, Mic } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLE_EMOJI: Record<Role, string> = {
  swe: "💻",
  product: "📦",
  data: "📊",
  design: "🎨",
  marketing: "📣",
  finance: "💰",
};

const COMPANY_EMOJI: Record<CompanyType, string> = {
  startup: "🚀",
  "big-tech": "🏢",
  government: "🏛️",
  agency: "🤝",
};

const STEPS = ["role", "level", "company", "mode"] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [seniority, setSeniority] = useState<Seniority | null>(null);
  const [companyType, setCompanyType] = useState<CompanyType | null>(null);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [useStarScaffold, setUseStarScaffold] = useState(true);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const goNext = () => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  };

  const goBack = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
    else router.push("/");
  };

  const canContinue =
    (step === "role" && role) ||
    (step === "level" && seniority) ||
    (step === "company" && companyType) ||
    step === "mode";

  const startInterview = () => {
    if (!role || !seniority || !companyType) return;
    const profile: OnboardingProfile = {
      role,
      seniority,
      companyType,
      inputMode,
      useStarScaffold,
    };
    saveProfile(profile);
    router.push("/interview");
  };

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 pb-10 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <button type="button" onClick={goBack} className="rounded-xl p-2 text-ink-500 hover:bg-ink-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Logo size="sm" />
        <span className="w-9 text-right text-xs font-bold text-ink-400">
          {stepIndex + 1}/{STEPS.length}
        </span>
      </div>

      <div className="mb-8 h-2 overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-coral-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {step === "role" && (
        <section>
          <h1 className="mb-2 text-2xl font-black">What&apos;s your role?</h1>
          <p className="mb-6 text-ink-500">We&apos;ll pick questions that match your lane.</p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <SelectionCard
                key={r}
                emoji={ROLE_EMOJI[r]}
                title={ROLE_LABELS[r]}
                selected={role === r}
                onClick={() => setRole(r)}
              />
            ))}
          </div>
        </section>
      )}

      {step === "level" && (
        <section>
          <h1 className="mb-2 text-2xl font-black">Experience level?</h1>
          <p className="mb-6 text-ink-500">Questions scale with seniority.</p>
          <div className="space-y-3">
            {SENIORITIES.map((s) => (
              <SelectionCard
                key={s}
                emoji={s === "junior" ? "🌱" : s === "mid" ? "⚡" : "👑"}
                title={SENIORITY_LABELS[s]}
                selected={seniority === s}
                onClick={() => setSeniority(s)}
              />
            ))}
          </div>
        </section>
      )}

      {step === "company" && (
        <section>
          <h1 className="mb-2 text-2xl font-black">Company type?</h1>
          <p className="mb-6 text-ink-500">Interview style changes a lot by context.</p>
          <div className="grid grid-cols-2 gap-3">
            {COMPANY_TYPES.map((c) => (
              <SelectionCard
                key={c}
                emoji={COMPANY_EMOJI[c]}
                title={COMPANY_LABELS[c]}
                selected={companyType === c}
                onClick={() => setCompanyType(c)}
              />
            ))}
          </div>
        </section>
      )}

      {step === "mode" && (
        <section>
          <h1 className="mb-2 text-2xl font-black">How do you want to practice?</h1>
          <p className="mb-6 text-ink-500">Voice is recommended — that&apos;s where people freeze.</p>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <SelectionCard
              emoji="🎤"
              title="Voice mode"
              subtitle="Speak your answers"
              selected={inputMode === "voice"}
              onClick={() => setInputMode("voice")}
            />
            <SelectionCard
              emoji="⌨️"
              title="Text mode"
              subtitle="Type instead"
              selected={inputMode === "text"}
              onClick={() => setInputMode("text")}
            />
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-violet-100 bg-violet-50/50 p-4">
            <input
              type="checkbox"
              checked={useStarScaffold}
              onChange={(e) => setUseStarScaffold(e.target.checked)}
              className="mt-1 h-4 w-4 rounded accent-violet-500"
            />
            <div>
              <span className="font-bold text-ink-900">STAR coach for beginners</span>
              <p className="text-sm text-ink-500">
                Show hints for Situation → Task → Action → Result after each answer.
              </p>
            </div>
          </label>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ink-400">
            <span className="flex items-center gap-1">
              <Mic className="h-3 w-3" /> fillers tracked
            </span>
            <span className="flex items-center gap-1">
              <Keyboard className="h-3 w-3" /> switch anytime
            </span>
          </div>
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 border-t border-ink-100 bg-white/90 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-lg">
          {step === "mode" ? (
            <button type="button" onClick={startInterview} className="btn-primary w-full">
              Let&apos;s go — start interview
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue}
              className="btn-primary w-full"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
