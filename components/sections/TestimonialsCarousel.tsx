"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { Pause, Play, Quote } from "lucide-react";
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

/** Seconds per card — the track's duration scales with its content so the
 *  drift reads at the same speed whether there are three quotes or thirty. */
const SECONDS_PER_CARD = 9;

export function TestimonialsCarousel({ testimonials, locale }: TestimonialsCarouselProps) {
  const t = useTranslations("testimonials");
  const isAr = locale === "ar";
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);

  if (testimonials.length === 0) return null;

  // The track carries the list twice; translating it by half its width loops
  // seamlessly, so the duplicate is what makes the marquee continuous.
  const track = [...testimonials, ...testimonials];

  // Arabic reads right to left, so the drift has to travel the other way.
  const duration = testimonials.length * SECONDS_PER_CARD;
  const trackStyle = reduce
    ? undefined
    : {
        animation: `${isAr ? "marquee-reverse" : "marquee-forward"} ${duration}s linear infinite`,
        animationPlayState: paused ? ("paused" as const) : ("running" as const),
      };

  return (
    <section className="section-y">
      <SectionHeading
        text={t("title", { highlight: t("titleHighlight") })}
        highlight={t("titleHighlight")}
      />

      <div
        className="marquee relative mt-12 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="marquee-track gap-5 px-3 py-2" style={trackStyle}>
          {track.map((item, i) => (
            <figure
              key={i}
              // The duplicated half is decorative: a screen reader should hear
              // each quote once, not twice.
              aria-hidden={i >= testimonials.length ? "true" : undefined}
              className="surface-card border-gradient relative flex w-[19rem] shrink-0 flex-col gap-4 rounded-2xl p-5 sm:w-[23rem]"
            >
              <Quote
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-brand/25 rtl:-scale-x-100"
              />

              <blockquote className="text-sm leading-relaxed text-foreground/90">
                &ldquo;{isAr ? item.message_ar : item.message_en}&rdquo;
              </blockquote>

              <figcaption className="mt-auto">
                <p className="text-sm font-medium text-foreground">
                  {isAr ? item.name_ar : item.name_en}
                </p>
                <p className="mt-1 text-[10px] tracking-[0.18em] text-brand uppercase">
                  {isAr ? item.title_ar : item.title_en}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* A marquee has no pages, so the only control is stop and start. */}
      {!reduce && testimonials.length > 1 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? t("play") : t("pause")}
            className="focus-ring btn-outline press inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg"
          >
            {paused ? (
              <Play className="h-4 w-4 rtl:-scale-x-100" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}
