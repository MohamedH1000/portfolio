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
      )}
    >
      {name}
    </span>
  );
}
