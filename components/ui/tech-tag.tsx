import { cn } from "@/lib/utils";

interface TechTagProps {
  name: string;
}

export function TechTag({ name }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5",
        "text-xs font-medium",
        "bg-surface-high text-muted-foreground",
      )}
    >
      {name}
    </span>
  );
}
