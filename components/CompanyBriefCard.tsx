"use client";

import type { CompanyBrief } from "@/lib/types";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function CompanyBriefCard({ brief, compact }: { brief: CompanyBrief; compact?: boolean }) {
  const [open, setOpen] = useState(!compact);

  if (compact) {
    return (
      <div className="mb-4 rounded-2xl border border-violet-100 bg-violet-50/60">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-violet-700">
            <Building2 className="h-4 w-4" />
            {brief.companyName} notes
          </span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {open && <BriefBody brief={brief} className="border-t border-violet-100 px-4 pb-4" />}
      </div>
    );
  }

  return (
    <div className="glass-card space-y-4 p-5">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Building2 className="h-5 w-5 text-violet-500" />
        {brief.companyName}
      </h2>
      <BriefBody brief={brief} />
    </div>
  );
}

function BriefBody({ brief, className = "" }: { brief: CompanyBrief; className?: string }) {
  return (
    <div className={`space-y-4 text-sm text-ink-700 ${className}`}>
      <Section title="What they do" text={brief.overview} />
      <Section title="Culture" text={brief.culture} />
      <Section title="Recent news" text={brief.recentNews} />
      <Section title="Interview style" text={brief.interviewStyle} />
      {brief.commonQuestions.length > 0 && (
        <div>
          <p className="mb-2 font-bold text-ink-900">Questions they often ask</p>
          <ul className="space-y-1.5 text-ink-600">
            {brief.commonQuestions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <div>
      <p className="mb-1 font-bold text-ink-900">{title}</p>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}
