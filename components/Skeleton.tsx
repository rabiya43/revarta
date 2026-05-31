import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-xl", className)} aria-hidden />;
}

export function FeedbackSkeleton() {
  return (
    <div className="glass-card space-y-4 p-6" aria-label="Loading feedback">
      <Skeleton className="h-6 w-40" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  );
}

export function InterviewerSkeleton() {
  return (
    <div className="glass-card p-5" aria-label="Interviewer is thinking">
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
