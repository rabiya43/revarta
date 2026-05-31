"use client";

import type { CoachingFeedback } from "@/lib/types";
import { ScoreBar } from "./ScoreBar";
import { StarCoach } from "./StarCoach";
import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";

export function FeedbackCard({
  feedback,
  showStarScaffold,
}: {
  feedback: CoachingFeedback;
  showStarScaffold?: boolean;
}) {
  const { scores, metrics } = feedback;

  return (
    <div className="glass-card space-y-5 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink-900">Feedback</h3>
        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-coral-500 px-3 py-1.5 text-lg font-black text-white shadow-md">
          {scores.overall}/10
        </div>
      </div>

      <div className="space-y-3">
        <ScoreBar label="Structure" score={scores.structure} />
        <ScoreBar label="Specificity" score={scores.specificity} />
        <ScoreBar label="Impact" score={scores.impactClarity} />
        <ScoreBar label="Conciseness" score={scores.conciseness} />
      </div>

      <StarCoach star={feedback.star} showScaffold={showStarScaffold} />

      {(metrics.totalFillers > 0 || metrics.wordsPerMinute > 0) && (
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-ink-100 px-3 py-1 font-medium text-ink-600">
            {metrics.wordsPerMinute} wpm
          </span>
          {metrics.totalFillers > 0 && (
            <span className="rounded-full bg-coral-100 px-3 py-1 font-medium text-coral-600">
              {metrics.totalFillers} filler{metrics.totalFillers > 1 ? "s" : ""}
              {Object.keys(metrics.fillerWords).length > 0 &&
                ` (${Object.entries(metrics.fillerWords)
                  .map(([w, c]) => `${w} x${c}`)
                  .join(", ")})`}
            </span>
          )}
          <span className="rounded-full bg-ink-100 px-3 py-1 text-ink-500">
            {Math.round(metrics.durationSeconds)}s
          </span>
        </div>
      )}

      {feedback.rejectionRisks.length > 0 && (
        <div className="rounded-2xl border border-coral-200 bg-coral-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-coral-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-bold">Likely pushback</span>
          </div>
          <ul className="space-y-1.5">
            {feedback.rejectionRisks.map((risk, i) => (
              <li key={i} className="text-sm text-coral-800">
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.strengths.length > 0 && (
        <div className="rounded-2xl border border-mint-200 bg-mint-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-mint-700">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-bold">Worked</span>
          </div>
          <ul className="space-y-1">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm text-mint-800">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/80 p-4">
        <div className="mb-2 flex items-center gap-2 text-violet-700">
          <Lightbulb className="h-5 w-5" />
          <span className="font-bold">Main fix</span>
        </div>
        <p className="text-sm leading-relaxed text-ink-700">{feedback.coachingTip}</p>
      </div>

      {feedback.strongerVersionSnippet && (
        <div className="rounded-2xl bg-ink-100/60 p-4">
          <p className="mb-2 text-xs font-bold text-ink-500">Try saying</p>
          <p className="text-sm italic leading-relaxed text-ink-700">
            &ldquo;{feedback.strongerVersionSnippet}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
