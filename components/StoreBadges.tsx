import Link from "next/link";

export function StoreBadges({ size = "md" }: { size?: "md" | "lg" }) {
  const pad = size === "lg" ? "px-5 py-3 text-sm" : "px-4 py-2.5 text-xs";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
      <Link
        href="#apps"
        className={`inline-flex items-center gap-2 rounded-xl bg-ink-900 font-semibold text-white ${pad}`}
      >
        <span aria-hidden></span>
        App Store
        <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-normal">soon</span>
      </Link>
      <Link
        href="#apps"
        className={`inline-flex items-center gap-2 rounded-xl border-2 border-ink-200 bg-white font-semibold text-ink-900 ${pad}`}
      >
        <span aria-hidden>▶</span>
        Google Play
        <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-normal">soon</span>
      </Link>
    </div>
  );
}
