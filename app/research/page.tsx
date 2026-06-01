"use client";

import { CompanyBriefCard } from "@/components/CompanyBriefCard";
import { Logo } from "@/components/Logo";
import {
  loadCompanyBrief,
  loadProfile,
  saveCompanyBrief,
  saveProfile,
} from "@/lib/session-storage";
import type { CompanyBrief, OnboardingProfile } from "@/lib/types";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResearchPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [company, setCompany] = useState("");
  const [brief, setBrief] = useState<CompanyBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      router.replace("/onboarding");
      return;
    }
    setProfile(p);
    const saved = loadCompanyBrief() ?? p.companyBrief ?? null;
    if (saved) {
      setBrief(saved);
      setCompany(saved.companyName);
    }
  }, [router]);

  async function generate() {
    if (!profile || company.trim().length < 2) {
      setError("Enter the company name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/company-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: company.trim(), profile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");

      const b = data.brief as CompanyBrief;
      setBrief(b);
      saveCompanyBrief(b);
      saveProfile({ ...profile, companyBrief: b });
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
        <Link href="/prepare" className="rounded-xl p-2 text-ink-500 hover:bg-ink-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Logo size="sm" />
        <span className="w-9" />
      </div>

      <h1 className="mb-2 text-2xl font-black">Company research</h1>
      <p className="mb-6 text-sm text-ink-500">
        One page on what they do, culture, and what interviews there tend to look like.
      </p>

      {!brief && (
        <>
          <label className="mb-4 block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-700">
              <Search className="h-4 w-4" />
              Company name
            </span>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-2xl border-2 border-ink-100 px-4 py-3 text-sm focus:border-violet-400 focus:outline-none"
              placeholder="e.g. Stripe, NHS, Acme Corp"
            />
          </label>
          {error && <p className="mb-4 text-sm text-coral-600">{error}</p>}
        </>
      )}

      {brief && <CompanyBriefCard brief={brief} />}

      <div className="fixed bottom-0 left-0 right-0 border-t border-ink-100 bg-white/90 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          {!brief ? (
            <button
              type="button"
              disabled={loading}
              onClick={generate}
              className="btn-primary w-full"
            >
              {loading ? "Building brief..." : "Generate brief"}
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <Link href="/interview" className="btn-primary flex w-full items-center justify-center gap-2">
              Start interview
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
          <Link href="/interview" className="btn-secondary w-full text-center text-sm">
            {brief ? "Continue without re-reading" : "Skip"}
          </Link>
        </div>
      </div>
    </main>
  );
}
