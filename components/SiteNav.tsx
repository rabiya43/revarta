import { Logo } from "@/components/Logo";
import Link from "next/link";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/">
          <Logo size="sm" />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/#how" className="hidden text-sm font-medium text-ink-500 hover:text-ink-900 sm:inline">
            How it works
          </Link>
          <Link href="/#apps" className="hidden text-sm font-medium text-ink-500 hover:text-ink-900 sm:inline">
            Apps
          </Link>
          <Link href="/drills" className="hidden text-sm font-medium text-ink-500 hover:text-ink-900 sm:inline">
            Drills
          </Link>
          <Link href="/progress" className="hidden text-sm font-medium text-ink-500 hover:text-ink-900 sm:inline">
            Progress
          </Link>
          <Link href="/onboarding" className="btn-primary py-2.5 text-sm">
            Try it free
          </Link>
        </nav>
      </div>
    </header>
  );
}
