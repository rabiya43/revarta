import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg gap-1.5",
    md: "text-2xl gap-2",
    lg: "text-4xl gap-3",
  };

  return (
    <div className={cn("flex items-center font-bold", sizes[size], className)} style={{ fontFamily: "var(--font-display)" }}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-coral-500 text-white shadow-md shadow-violet-500/30">
        <Sparkles className="h-5 w-5" />
      </span>
      <span className="gradient-text">Revarta</span>
    </div>
  );
}
