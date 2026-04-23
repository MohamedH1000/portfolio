import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  text: string;
  highlight: string;
}

export function SectionHeading({ text, highlight }: SectionHeadingProps) {
  const parts = text.split(highlight);

  // If the highlight string is not found, render the full text
  if (parts.length === 1) {
    return (
      <h2 className="section-heading text-foreground">
        {text}
      </h2>
    );
  }

  return (
    <h2 className="section-heading text-foreground">
      {parts[0]}
      <span className="text-brand">{highlight}</span>
      {parts[1]}
    </h2>
  );
}
