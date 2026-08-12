"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

interface Testimonial {
  name_en: string;
  name_ar: string;
  title_en: string;
  title_ar: string;
  message_en: string;
  message_ar: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  locale: string;
}

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 60;

export function TestimonialsCarousel({ testimonials, locale }: TestimonialsCarouselProps) {
  const t = useTranslations("testimonials");
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const isAr = locale === "ar";
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const next = useCallback(
    () => setCurrent((prev) => (prev + 1) % testimonials.length),
    [testimonials.length]
  );
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length),
    [testimonials.length]
  );

  useEffect(() => {
    if (paused || reduce || testimonials.length < 2) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reduce, next, testimonials.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") isAr ? next() : prev();
    if (e.key === "ArrowRight") isAr ? prev() : next();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) isAr ? prev() : next();
    else if (info.offset.x > SWIPE_THRESHOLD) isAr ? next() : prev();
  };

  if (testimonials.length === 0) return null;

  const item = testimonials[current];

  return (
    <section className="py-24">
      <SectionHeading
        text={t("title", { highlight: t("titleHighlight") })}
        highlight={t("titleHighlight")}
      />

      <div className="mt-16 max-w-2xl mx-auto">
        <div
          ref={containerRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={t("title", { highlight: t("titleHighlight") })}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="surface-card border-gradient border-gradient-static focus-ring relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl p-8 text-center md:p-12"
        >
          <Quote className="absolute top-6 start-6 h-10 w-10 text-brand/15 rtl:-scale-x-100" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -end-16 h-48 w-48 rounded-full bg-brand/[0.07] blur-3xl"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 cursor-grab active:cursor-grabbing"
            >
              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
                &ldquo;{isAr ? item.message_ar : item.message_en}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-gradient-brand">
                  {isAr ? item.name_ar : item.name_en}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isAr ? item.title_ar : item.title_en}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="focus-ring press cursor-pointer rounded-full border border-[var(--hairline)] bg-surface-high/60 p-2.5 text-muted-foreground transition-all duration-300 ease-[var(--ease-quart)] hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`focus-ring h-2.5 cursor-pointer rounded-full transition-all duration-400 ease-[var(--ease-expo)] ${
                  i === current
                    ? "w-7 brand-gradient shadow-[var(--shadow-brand)]"
                    : "w-2.5 bg-surface-highest hover:bg-brand/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === current}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="focus-ring press cursor-pointer rounded-full border border-[var(--hairline)] bg-surface-high/60 p-2.5 text-muted-foreground transition-all duration-300 ease-[var(--ease-quart)] hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}
