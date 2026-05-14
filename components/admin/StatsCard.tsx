import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border/30 bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10">
          <Icon className="h-5 w-5 text-brand" />
        </div>
      </div>
    </div>
  );
}
