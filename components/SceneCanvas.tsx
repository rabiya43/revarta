"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { OrbState } from "@/components/three/InterviewerOrb";

const InterviewRoomCanvas = dynamic(
  () =>
    import("@/components/three/InterviewRoomScene").then((m) => m.InterviewRoomCanvas),
  { ssr: false }
);

const HeroSceneCanvas = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroSceneCanvas),
  { ssr: false }
);

function SceneFallback({ variant }: { variant: "hero" | "room" }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-3xl ${
        variant === "room" ? "bg-ink-900" : "bg-gradient-to-br from-violet-100/80 to-coral-100/60"
      }`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,77,255,0.35),transparent_65%)]" />
      {variant === "room" && (
        <div className="absolute bottom-1/3 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-violet-500/40 blur-xl animate-pulse" />
      )}
    </div>
  );
}

export function InterviewScene({ orbState = "idle" }: { orbState?: OrbState }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <SceneFallback variant="room" />;
  }

  return (
    <div className="relative h-52 w-full overflow-hidden rounded-3xl border border-white/10 shadow-xl shadow-violet-500/10 sm:h-60">
      <InterviewRoomCanvas orbState={orbState} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-900/80 to-transparent" />
    </div>
  );
}

export function HeroScene() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <SceneFallback variant="hero" />;
  }

  return (
    <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl lg:max-w-none">
      <HeroSceneCanvas />
    </div>
  );
}
