import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ArrowRight, MessageCircle, Mic, Target } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Live mock interviews",
    desc: "Follow-ups based on what you said, not a fixed script.",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: Target,
    title: "Straight feedback",
    desc: "Scores plus what would hurt you in a real screen.",
    color: "from-coral-500 to-coral-600",
  },
  {
    icon: Mic,
    title: "Voice practice",
    desc: "Talk through answers. We count fillers and pacing.",
    color: "from-mint-500 to-mint-600",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-lg px-4 pb-12 pt-8 sm:max-w-2xl sm:px-6">
      <header className="mb-10 flex items-center justify-between">
        <Logo />
        <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-bold text-mint-600">
          No account needed
        </span>
      </header>

      <section className="mb-10 text-center sm:text-left">
        <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          Mock interviews that{" "}
          <span className="gradient-text">talk back</span>
        </h1>
        <p className="mb-8 text-lg text-ink-500 leading-relaxed">
          Revarta runs a short practice loop: questions for your role, follow-ups,
          and notes on structure and impact. Use your mic or type.
        </p>
        <Link href="/onboarding" className="btn-primary w-full sm:w-auto text-base">
          Start a session
          <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="mt-3 text-center text-xs text-ink-400 sm:text-left">
          About 5 questions, ~10 minutes. Sign up optional after.
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
        <p className="mb-1 text-sm font-bold text-violet-600">Roles</p>
        <p className="text-sm text-ink-500">
          SWE, Product, Data, Design, Marketing, Finance
        </p>
        <p className="mt-2 text-xs text-ink-400">
          Junior through senior. Startup, big tech, government, agency.
        </p>
      </section>
    </main>
  );
}
