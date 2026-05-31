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
import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLE_BADGE: Record<Role, string> = {
  swe: "SW",
  product: "PM",
  data: "DA",
  design: "UX",
  marketing: "MK",
  finance: "FN",
};

const COMPANY_BADGE: Record<CompanyType, string> = {
  startup: "ST",
  "big-tech": "BT",
  government: "GV",
  agency: "AG",
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
          <h1 className="mb-2 text-2xl font-black">Your role</h1>
          <p className="mb-6 text-ink-500">Questions depend on this.</p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <SelectionCard
                key={r}
                badge={ROLE_BADGE[r]}
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
          <h1 className="mb-2 text-2xl font-black">Experience</h1>
          <p className="mb-6 text-ink-500">Rough years in role.</p>
          <div className="space-y-3">
            {SENIORITIES.map((s) => (
              <SelectionCard
                key={s}
                badge={s === "junior" ? "JR" : s === "mid" ? "MD" : "SR"}
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
          <h1 className="mb-2 text-2xl font-black">Company type</h1>
          <p className="mb-6 text-ink-500">Where you are interviewing.</p>
          <div className="grid grid-cols-2 gap-3">
            {COMPANY_TYPES.map((c) => (
              <SelectionCard
                key={c}
                badge={COMPANY_BADGE[c]}
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
          <h1 className="mb-2 text-2xl font-black">Input</h1>
          <p className="mb-6 text-ink-500">Mic is closer to a real interview.</p>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <SelectionCard
              icon={<Mic className="h-5 w-5" />}
              title="Voice"
              subtitle="Speak answers"
              selected={inputMode === "voice"}
              onClick={() => setInputMode("voice")}
            />
            <SelectionCard
              icon={<Keyboard className="h-5 w-5" />}
              title="Text"
              subtitle="Type answers"
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
              <span className="font-bold text-ink-900">STAR hints</span>
              <p className="text-sm text-ink-500">
                After each answer, show what was missing from Situation, Task, Action, Result.
              </p>
            </div>
          </label>
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 border-t border-ink-100 bg-white/90 p-4 backdrop-blur-md">
        <div className="mx-auto max-w-lg">
          {step === "mode" ? (
            <button type="button" onClick={startInterview} className="btn-primary w-full">
              Start interview
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
