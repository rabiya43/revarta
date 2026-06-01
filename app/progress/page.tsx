"use client";

import { Logo } from "@/components/Logo";
import { calcStreak, loadHistory } from "@/lib/progress-storage";
import { ROLE_LABELS, type SessionRecord } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProgressPage() {
  const [history, setHistory] = useState<SessionRecord[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const streak = calcStreak(history);
  const avgOverall =
    history.length > 0
      ? Math.round((history.reduce((s, r) => s + r.avgOverall, 0) / history.length) * 10) / 10
      : 0;

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 pb-12 pt-6">
      <div className="mb-8 flex items-center justify-between">
        <Logo size="sm" />
        <Link href="/onboarding" className="text-sm font-semibold text-violet-600">
          Practice
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-black">Your progress</h1>

      <div className="mb-8 grid grid-cols-3 gap-3">
        <Stat label="Sessions" value={String(history.length)} />
        <Stat label="Streak" value={`${streak}d`} />
        <Stat label="Avg score" value={history.length ? `${avgOverall}` : "-"} />
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-6 text-center text-sm text-ink-500">
          No sessions saved yet. Finish a mock interview and scores show up here.
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-ink-500">Recent sessions</h2>
          {history.map((r) => (
            <SessionRow key={r.id} record={r} />
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-2">
        <Link href="/drills" className="btn-secondary w-full text-center">
          Practice drills
        </Link>
        <Link href="/" className="text-center text-sm text-ink-400 underline">
          Home
        </Link>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white border border-ink-100 p-4 text-center">
      <p className="text-2xl font-black text-violet-600">{value}</p>
      <p className="text-xs font-medium text-ink-500">{label}</p>
    </div>
  );
}

function SessionRow({ record }: { record: SessionRecord }) {
  const date = new Date(record.completedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <article className="glass-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-bold text-ink-900">{ROLE_LABELS[record.role]}</p>
          <p className="text-xs text-ink-400">{date}</p>
        </div>
        <span className="rounded-xl bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700">
          {record.avgOverall}/10
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-ink-500">
        <Bar label="Structure" score={record.avgStructure} />
        <Bar label="Specificity" score={record.avgSpecificity} />
        <Bar label="Impact" score={record.avgImpact} />
      </div>
    </article>
  );
}

function Bar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <p className="mb-1">{label}</p>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width: `${Math.min(100, score * 10)}%` }}
        />
      </div>
    </div>
  );
}
