import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ArrowRight, MessageCircle, Mic, Target, Zap } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Live mock interviews",
    desc: "AI reacts to what you actually said — not a static question list.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: Target,
    title: "Honest coaching",
    desc: "Know where you'd get rejected, plus one fix you can use today.",
    color: "from-coral-500 to-coral-600",
  },
  {
    icon: Mic,
    title: "Voice-first practice",
    desc: "Speak out loud. We track fillers, pacing, and STAR structure.",
    color: "from-mint-500 to-mint-600",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-lg px-4 pb-12 pt-8 sm:max-w-2xl sm:px-6">
      <header className="mb-10 flex items-center justify-between">
        <Logo />
        <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-mint-600">
          No signup to try ✨
        </span>
      </header>

      <section className="mb-10 text-center sm:text-left">
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-600">
          <Zap className="h-3.5 w-3.5" />
          Stop rehearsing in your head
        </p>
        <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          Practice interviews that{" "}
          <span className="gradient-text">actually talk back</span>
        </h1>
        <p className="mb-8 text-lg text-ink-500 leading-relaxed">
          Revarta is your AI interview coach — live follow-ups, honest scores, and
          voice practice so you don&apos;t freeze when it counts.
        </p>
        <Link href="/onboarding" className="btn-primary w-full sm:w-auto text-base">
          Start free mock interview
          <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="mt-3 text-center text-xs text-ink-400 sm:text-left">
          ~5 questions · 10 min · account optional after
        </p>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="glass-card p-5">
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mb-1 font-bold text-ink-900">{title}</h3>
            <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      <section className="glass-card p-6 text-center">
        <p className="mb-1 text-sm font-bold text-violet-600">Roles we coach</p>
        <p className="text-sm text-ink-500">
          SWE · Product · Data · Design · Marketing · Finance
        </p>
        <p className="mt-2 text-xs text-ink-400">
          Junior → Senior · Startup · Big Tech · Gov · Agency
        </p>
      </section>
    </main>
  );
}
