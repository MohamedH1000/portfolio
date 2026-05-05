"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

interface AboutPreviewProps {
  locale: string;
}

export function AboutPreview({ locale }: AboutPreviewProps) {
  const t = useTranslations("about");

  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="section-heading">
          {locale === "ar" ? (
            <>
              عن <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">Mohamed</span>
            </>
          ) : (
            <>
              About <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">Me</span>
            </>
          )}
        </h2>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {t("bio")}
        </p>
        <motion.div
          whileHover={{ x: 4 }}
          className="inline-block"
        >
          <Link
            href={{ pathname: "/about" }}
            className="inline-flex items-center gap-2 text-brand hover:text-brand/80 font-medium transition-colors group"
          >
            {locale === "ar" ? "اقرأ المزيد" : "Read more"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
