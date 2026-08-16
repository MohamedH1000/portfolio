"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/hooks";

interface TextGenerateProps {
  words: string;
  className?: string;
}

export function TextGenerate({ words, className }: TextGenerateProps) {
  const hydrated = useHydrated();
  const wordList = words.split(" ");

  // The server renders the plain sentence, so the copy is in the HTML rather
  // than hidden behind a per-word opacity animation.
  if (!hydrated) {
    return <div className={cn(className)}>{words}</div>;
  }

  return (
    <div className={cn(className)}>
      {wordList.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            delay: i * 0.08,
            ease: "easeOut",
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}
