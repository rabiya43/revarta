"use client";

import { AnswerTimer } from "@/components/AnswerTimer";
import { FeedbackCard } from "@/components/FeedbackCard";
import { Logo } from "@/components/Logo";
import { FeedbackSkeleton, InterviewerSkeleton } from "@/components/Skeleton";
import { TextInput } from "@/components/TextInput";
import { VoiceInput } from "@/components/VoiceInput";
import { useInterviewerStream } from "@/hooks/useInterviewerStream";
import { CompanyBriefCard } from "@/components/CompanyBriefCard";
import { saveSessionToHistory } from "@/lib/progress-storage";
import {
  clearSession,
  createSession,
  loadCompanyBrief,
  loadProfile,
  loadSession,
  loadTailorQuestions,
  saveSession,
} from "@/lib/session-storage";
import type {
  CoachingFeedback,
  CompanyBrief,
  InterviewSession,
  OnboardingProfile,
  Question,
  TurnMessage,
} from "@/lib/types";
import { InterviewScene } from "@/components/SceneCanvas";
import type { OrbState } from "@/components/three/InterviewerOrb";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Send, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Phase = "loading" | "interviewer" | "answering" | "feedback" | "complete";

export default function InterviewPage() {
  const router = useRouter();
  const interviewer = useInterviewerStream();

  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [answer, setAnswer] = useState("");
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [feedback, setFeedback] = useState<CoachingFeedback | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [companyBrief, setCompanyBrief] = useState<CompanyBrief | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initRef = useRef(false);

  const currentQuestion = questions[session?.currentQuestionIndex ?? 0];
  const isLastQuestion =
    (session?.currentQuestionIndex ?? 0) >= questions.length - 1;

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const persistSession = useCallback((s: InterviewSession) => {
    setSession(s);
    saveSession(s);
  }, []);

  const askInterviewer = useCallback(
    async (
      s: InterviewSession,
      qs: Question[],
      opts: {
        isOpening: boolean;
        candidateAnswer?: string;
        history?: TurnMessage[];
      }
    ) => {
      const q = qs[s.currentQuestionIndex];
      if (!q) return;

      setPhase("interviewer");
      interviewer.reset();

      const full = await interviewer.stream({
        profile: s.profile,
        question: q,
        history: opts.history ?? s.turns,
        candidateAnswer: opts.candidateAnswer,
        isOpening: opts.isOpening,
        isLastQuestion: s.currentQuestionIndex >= qs.length - 1 && followUpCount >= 1,
      });

      const interviewerTurn: TurnMessage = {
        role: "interviewer",
        content: full,
        timestamp: Date.now(),
      };

      const updated: InterviewSession = {
        ...s,
        turns: [...s.turns, interviewerTurn],
        updatedAt: Date.now(),
      };
      persistSession(updated);
      setPhase("answering");
      setTimerSeconds(0);
      setTimerActive(true);
    },
    [interviewer, followUpCount, persistSession]
  );

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const p = loadProfile();
    if (!p) {
      router.replace("/onboarding");
      return;
    }
    setProfile(p);
    setInputMode(p.inputMode);
    setCompanyBrief(loadCompanyBrief() ?? p.companyBrief ?? null);

    const existing = loadSession();
    if (existing && existing.profile.role === p.role) {
      setSession(existing);
      fetchQuestions(p).then((qs) => {
        setQuestions(qs);
        setPhase("answering");
        setFollowUpCount(0);
      });
      return;
    }

    fetchQuestions(p).then(async (qs) => {
      setQuestions(qs);
      const s = createSession(
        p,
        qs.map((q) => q.id)
      );
      persistSession(s);
      try {
        await askInterviewer(s, qs, { isOpening: true });
      } catch {
        setPhase("interviewer");
      }
    });
  }, [router, askInterviewer, persistSession]);

  async function fetchQuestions(p: OnboardingProfile): Promise<Question[]> {
    const tailored = loadTailorQuestions();
    if (tailored && tailored.length > 0) return tailored;

    const params = new URLSearchParams({
      role: p.role,
      seniority: p.seniority,
      companyType: p.companyType,
      count: "5",
    });
    const res = await fetch(`/api/questions?${params}`);
    const data = await res.json();
    return data.questions ?? [];
  }

  async function submitAnswer() {
    if (!session || !profile || !currentQuestion || !answer.trim()) return;

    setTimerActive(false);
    const candidateTurn: TurnMessage = {
      role: "candidate",
      content: answer.trim(),
      timestamp: Date.now(),
    };
    const withAnswer: InterviewSession = {
      ...session,
      turns: [...session.turns, candidateTurn],
      updatedAt: Date.now(),
    };
    persistSession(withAnswer);
    setPhase("feedback");
    setFeedbackLoading(true);
    setFeedbackError(null);
    setFeedback(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          questionText: currentQuestion.text,
          answer: answer.trim(),
          durationSeconds: timerSeconds,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Feedback failed");
      }

      const fb: CoachingFeedback = await res.json();
      setFeedback(fb);
      persistSession({
        ...withAnswer,
        feedbackHistory: [...withAnswer.feedbackHistory, fb],
      });
    } catch (e) {
      setFeedbackError(
        e instanceof Error ? e.message : "Feedback failed. Retry."
      );
    } finally {
      setFeedbackLoading(false);
    }
  }

  async function continueAfterFeedback() {
    if (!session || !profile) return;

    const current = loadSession() ?? session;

    const maxFollowUps = 1;
    if (followUpCount < maxFollowUps && !isLastQuestion) {
      setFollowUpCount((c) => c + 1);
      setAnswer("");
      setFeedback(null);
      try {
        await askInterviewer(current, questions, {
          isOpening: false,
          candidateAnswer: current.turns.filter((t) => t.role === "candidate").at(-1)?.content,
          history: current.turns,
        });
      } catch {}
      return;
    }

    const nextIndex = current.currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      const nextSession: InterviewSession = {
        ...current,
        currentQuestionIndex: nextIndex,
        updatedAt: Date.now(),
      };
      persistSession(nextSession);
      setFollowUpCount(0);
      setAnswer("");
      setFeedback(null);
      try {
        await askInterviewer(nextSession, questions, { isOpening: true });
      } catch {}
    } else {
      const saved = loadSession() ?? current;
      if (feedback && !saved.feedbackHistory.some((f) => f.coachingTip === feedback.coachingTip)) {
        saved.feedbackHistory = [...saved.feedbackHistory, feedback];
      }
      saveSessionToHistory(saved);
      clearSession();
      router.push("/complete");
    }
  }

  if (!profile) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-4">
        <InterviewerSkeleton />
      </main>
    );
  }

  const lastInterviewerMsg = [...(session?.turns ?? [])]
    .reverse()
    .find((t) => t.role === "interviewer");

  const displayInterviewerText =
    interviewer.isStreaming ? interviewer.text : lastInterviewerMsg?.content ?? interviewer.text;

  const orbState = useMemo<OrbState>(() => {
    if (phase === "answering") return "listening";
    if (phase === "feedback") return feedbackLoading ? "thinking" : "idle";
    if (phase === "interviewer" || phase === "loading") {
      return interviewer.isStreaming ? "speaking" : "thinking";
    }
    return "idle";
  }, [phase, interviewer.isStreaming, feedbackLoading]);

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 pb-32 pt-4">
      <header className="mb-4 flex items-center justify-between">
        <Logo size="sm" />
        <span className="text-xs font-bold text-ink-400">
          Q{(session?.currentQuestionIndex ?? 0) + 1}/{questions.length || 5}
        </span>
      </header>

      <InterviewScene orbState={orbState} />

      {companyBrief && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <CompanyBriefCard brief={companyBrief} compact />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
      {(phase === "interviewer" || phase === "loading") && (
        <motion.div
          key="interviewer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {interviewer.isStreaming || !displayInterviewerText ? (
            <InterviewerSkeleton />
          ) : null}
          {displayInterviewerText && (
            <div className="glass-card mb-4 mt-4 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-coral-500 text-white text-sm font-bold">
                  A
                </div>
                <span className="text-sm font-bold text-ink-500">Alex</span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                {displayInterviewerText}
                {interviewer.isStreaming && (
                  <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-violet-400" />
                )}
              </p>
            </div>
          )}
          {interviewer.error && (
            <div className="mb-4 rounded-2xl bg-coral-50 p-4 text-center">
              <p className="mb-3 text-sm text-coral-700">{interviewer.error}</p>
              <button
                type="button"
                className="btn-secondary text-sm"
                onClick={() =>
                  session &&
                  askInterviewer(session, questions, {
                    isOpening: session.turns.length === 0,
                  })
                }
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          )}
        </motion.div>
      )}

      {phase === "answering" && (
        <motion.div
          key="answering"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="glass-card mb-4 mt-4 p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-coral-500 text-white text-sm font-bold">
                A
              </div>
              <span className="text-sm font-bold text-ink-500">Alex</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
              {displayInterviewerText}
            </p>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-ink-500">
              <User className="h-4 w-4" />
              Your answer
            </div>
            <AnswerTimer seconds={timerSeconds} active={timerActive} />
          </div>

          {inputMode === "voice" ? (
            <VoiceInput
              value={answer}
              onChange={setAnswer}
              onModeSwitch={() => setInputMode("text")}
            />
          ) : (
            <TextInput
              value={answer}
              onChange={setAnswer}
              onModeSwitch={() => setInputMode("voice")}
            />
          )}

          <button
            type="button"
            onClick={submitAnswer}
            disabled={!answer.trim()}
            className="btn-primary mt-4 w-full"
          >
            <Send className="h-5 w-5" />
            Submit answer
          </button>
        </motion.div>
      )}

      {phase === "feedback" && (
        <motion.div
          key="feedback"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-4 space-y-4"
        >
          {feedbackLoading && <FeedbackSkeleton />}
          {feedbackError && (
            <div className="rounded-2xl bg-coral-50 p-4 text-center">
              <p className="mb-3 text-sm text-coral-700">{feedbackError}</p>
              <button type="button" className="btn-secondary text-sm" onClick={submitAnswer}>
                <RefreshCw className="h-4 w-4" />
                Retry feedback
              </button>
            </div>
          )}
          {feedback && (
            <FeedbackCard feedback={feedback} showStarScaffold={profile.useStarScaffold} />
          )}
          {feedback && !feedbackLoading && (
            <button type="button" onClick={continueAfterFeedback} className="btn-primary w-full">
              {isLastQuestion && followUpCount >= 1
                ? "Finish session"
                : followUpCount < 1
                  ? "Continue"
                  : "Next question"}
            </button>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      <p className="mt-6 text-center text-xs text-ink-300">
        <Link href="/" className="underline">
          Exit
        </Link>
        {" | "}
        Saves locally for 24h
      </p>
    </main>
  );
}
