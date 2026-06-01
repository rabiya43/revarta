import { SiteNav } from "@/components/SiteNav";
import { StoreBadges } from "@/components/StoreBadges";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  MessageSquare,
  Mic,
  Smartphone,
  Target,
} from "lucide-react";

const steps = [
  {
    title: "Set your role",
    text: "Pick function, level, and company type so questions fit the interview you are facing.",
  },
  {
    title: "Paste resume + JD",
    text: "Optional: questions built from your background and the job post.",
  },
  {
    title: "Research the company",
    text: "One-page brief on culture, news, and what interviews there are like.",
  },
  {
    title: "Run the loop",
    text: "Speak or type answers. Get scores, STAR gaps, and filler counts after each one.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-bold text-violet-600">Web + iOS + Android</p>
              <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Mock interviews built for{" "}
                <span className="gradient-text">how you actually prep</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-ink-500 leading-relaxed">
                Revarta is practice that pushes back: follow-up questions, honest scores, voice
                mode, and questions tailored to your resume and the job you want.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/onboarding" className="btn-primary text-base">
                  Start on the web
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <StoreBadges size="lg" />
              </div>
            </div>

            <div className="glass-card relative mx-auto w-full max-w-md p-6 lg:max-w-none">
              <div className="mb-4 flex items-center justify-between text-xs font-medium text-ink-400">
                <span>Live session</span>
                <span className="rounded-full bg-mint-100 px-2 py-0.5 text-mint-700">Recording</span>
              </div>
              <div className="mb-4 rounded-2xl bg-violet-50 p-4 text-sm text-ink-700">
                You mentioned cutting deploy time by half. What metric proved that, and what did you
                own versus the team?
              </div>
              <div className="mb-4 rounded-2xl border border-ink-100 bg-white p-4 text-sm text-ink-500">
                Your answer (voice or text) shows up here...
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {["Structure", "Specificity", "Impact", "Pacing"].map((label) => (
                  <div key={label} className="rounded-xl bg-ink-50 py-2 font-medium text-ink-600">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="border-t border-ink-100 bg-white px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-center text-3xl font-black sm:text-left">How it works</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step, i) => (
                <article key={step.title} className="glass-card p-6">
                  <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
            {[
              { icon: MessageSquare, title: "Real follow-ups", text: "Not a static question list." },
              { icon: Target, title: "Direct feedback", text: "Scores and what would hurt in a screen." },
              { icon: Mic, title: "Voice practice", text: "Fillers, WPM, and length cues." },
              { icon: BarChart3, title: "STAR check", text: "See which parts of the story are missing." },
              {
                icon: Smartphone,
                title: "Same flow on mobile",
                text: "iOS and Android apps share the same backend.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-ink-100 bg-white p-5">
                <Icon className="mb-3 h-6 w-6 text-violet-500" />
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-sm text-ink-500">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="apps" className="border-t border-ink-100 bg-violet-50/50 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl text-center sm:text-left">
            <h2 className="mb-4 text-3xl font-black">Get the apps</h2>
            <p className="mb-8 max-w-xl text-ink-500">
              Native builds for App Store and Google Play are in this repo under{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-sm">apps/mobile</code>. Ship with
              Expo EAS when your store accounts are ready.
            </p>
            <StoreBadges size="lg" />
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-violet-500 to-coral-500 p-8 text-center text-white sm:p-12">
            <h2 className="mb-4 text-3xl font-black">Ready for a rep?</h2>
            <p className="mb-8 text-white/90">No account required for your first session.</p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-violet-600 shadow-lg"
            >
              Start now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        <footer className="border-t border-ink-100 px-4 py-8 text-center text-sm text-ink-400 sm:px-6">
          Revarta · mock interview practice
        </footer>
      </main>
    </>
  );
}
