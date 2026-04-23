import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main
      className={cn(
        "mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8",
        "bg-blueprint min-h-screen",
        className
      )}
    >
      {children}
    </main>
  );
}
