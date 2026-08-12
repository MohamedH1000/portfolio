import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8"
    >
      <Skeleton className="mb-3 h-10 w-56" />
      <Skeleton className="mb-10 h-1 w-16 rounded-full" />
      <Skeleton className="mb-10 h-64 w-full rounded-2xl" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="space-y-4"
            style={{ opacity: 1 - i * 0.15 }}
          >
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
