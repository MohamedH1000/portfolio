"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  text: string;
  highlight: string;
}

export function SectionHeading({ text, highlight }: SectionHeadingProps) {
  const parts = text.split(highlight);

  const underline = (
    <motion.span
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="brand-gradient mt-4 block h-1 w-16 origin-start rounded-full"
    />
  );

  if (parts.length === 1) {
    return (
      <div>
        <h2 className="section-heading text-foreground">{text}</h2>
        {underline}
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-heading text-foreground">
        {parts[0]}
        <span className="text-gradient-brand">{highlight}</span>
        {parts[1]}
      </h2>
      {underline}
    </div>
  );
}
