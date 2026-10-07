import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-sm bg-surface-muted", className)} aria-hidden />;
}

export function ArticleListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="divide-y divide-line" role="status" aria-label="Loading results">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex gap-5 py-6">
          <Skeleton className="aspect-[3/2] w-32 shrink-0 sm:w-56" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}
