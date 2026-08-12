import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  className?: string;
}

/** Shimmering placeholder rows — replaces a bare spinner during fetches. */
export function TableSkeleton({ rows = 5, className }: TableSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "surface-card overflow-hidden rounded-2xl",
        className
      )}
    >
      <div className="flex items-center gap-4 border-b border-[var(--hairline)] bg-surface-high/40 px-4 py-3">
        <div className="shimmer h-3 w-20 rounded-full" />
        <div className="shimmer h-3 w-28 rounded-full" />
        <div className="shimmer ms-auto h-3 w-16 rounded-full" />
      </div>

      <div className="divide-y divide-[var(--hairline)]">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5"
            style={{ opacity: 1 - i * 0.12 }}
          >
            <div className="shimmer h-10 w-14 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="shimmer h-3 w-1/3 rounded-full" />
              <div className="shimmer h-2.5 w-1/5 rounded-full" />
            </div>
            <div className="shimmer hidden h-6 w-24 rounded-full md:block" />
            <div className="shimmer h-7 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
