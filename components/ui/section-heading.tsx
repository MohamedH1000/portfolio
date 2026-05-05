interface SectionHeadingProps {
  text: string;
  highlight: string;
}

export function SectionHeading({ text, highlight }: SectionHeadingProps) {
  const parts = text.split(highlight);

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
      <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">
        {highlight}
      </span>
      {parts[1]}
    </h2>
  );
}
