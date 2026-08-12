import { cn } from "@/lib/utils";

interface TechTagProps {
  name: string;
}

export function TechTag({ name }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1",
        "text-xs font-medium",
        "bg-brand/10 text-brand",
        "border border-brand/15",
        "transition-all duration-300 ease-[var(--ease-quart)]",
        "hover:-translate-y-0.5 hover:border-brand/35 hover:bg-brand/20",
        "hover:shadow-[0_4px_14px_-4px_rgba(var(--brand-rgb),0.45)]",
      )}
    >
      {name}
    </span>
  );
}
