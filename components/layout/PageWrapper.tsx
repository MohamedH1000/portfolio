import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Blueprint texture, dissolved at the edges so it never hard-stops */}
      <div
        aria-hidden="true"
        className="bg-blueprint bg-blueprint-fade pointer-events-none absolute inset-0"
      />

      {/* Ambient brand light, anchored top-start */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 start-1/4 h-[30rem] w-[30rem] rounded-full bg-brand/[0.06] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
