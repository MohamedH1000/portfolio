"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

export function TestimonialsCarousel({ testimonials, locale }: TestimonialsCarouselProps) {
  const t = useTranslations("testimonials");
  const [current, setCurrent] = useState(0);
  const isAr = locale === "ar";

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  const item = testimonials[current];

  return (
    <section className="py-20">
      <SectionHeading
        text={t("title", { highlight: t("titleHighlight") })}
        highlight={t("titleHighlight")}
      />

      <div className="mt-16 max-w-2xl mx-auto">
        <div className="relative bg-surface-low rounded-xl p-8 md:p-12 min-h-[200px] flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-6">
                &ldquo;{isAr ? item.message_ar : item.message_en}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-brand">
                  {isAr ? item.name_ar : item.name_en}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isAr ? item.title_ar : item.title_en}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prev}
            className="p-2 rounded-full bg-surface-high hover:bg-surface-bright transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-brand" : "bg-surface-high"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2 rounded-full bg-surface-high hover:bg-surface-bright transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
