"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Code2, CloudCog, Brain, Workflow } from "lucide-react";

interface AboutPreviewProps {
  locale: string;
}

const highlights = [
  { icon: Code2, key: "fullStackTitle" },
  { icon: CloudCog, key: "devOpsTitle" },
  { icon: Brain, key: "aiTitle" },
  { icon: Workflow, key: "automationTitle" },
];

export function AboutPreview({ locale }: AboutPreviewProps) {
  const t = useTranslations("about");

  return (
    <section className="py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="max-w-3xl mx-auto text-center"
      >
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="section-heading mb-6"
        >
          About{" "}
          <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">
            Me
          </span>
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } },
          }}
          className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8"
        >
          {t("intro")}
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
          }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {highlights.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-low border border-brand/10 text-sm text-muted-foreground"
            >
              <Icon className="w-4 h-4 text-brand" />
              {t(key)}
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
          }}
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
      </motion.div>
    </section>
  );
}
