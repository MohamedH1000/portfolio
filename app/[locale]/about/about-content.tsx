"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Code2, CloudCog, Brain, Workflow, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export function AboutContent() {
  const t = useTranslations("about");

  const stats = [
    { value: t("statsYearsValue"), label: t("statsYears") },
    { value: t("statsProjectsValue"), label: t("statsProjects") },
    { value: t("statsTechnologiesValue"), label: t("statsTechnologies") },
    { value: t("statsSatisfiedValue"), label: t("statsSatisfied") },
  ];

  const expertise = [
    {
      title: t("fullStackTitle"),
      description: t("fullStackDescription"),
      skills: t("fullStackSkills"),
      icon: Code2,
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderHover: "hover:border-blue-500/30",
      iconColor: "text-blue-400",
    },
    {
      title: t("devOpsTitle"),
      description: t("devOpsDescription"),
      skills: t("devOpsSkills"),
      icon: CloudCog,
      gradient: "from-emerald-500/20 to-teal-500/20",
      borderHover: "hover:border-emerald-500/30",
      iconColor: "text-emerald-400",
    },
    {
      title: t("aiTitle"),
      description: t("aiDescription"),
      skills: t("aiSkills"),
      icon: Brain,
      gradient: "from-purple-500/20 to-pink-500/20",
      borderHover: "hover:border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      title: t("automationTitle"),
      description: t("automationDescription"),
      skills: t("automationSkills"),
      icon: Workflow,
      gradient: "from-amber-500/20 to-orange-500/20",
      borderHover: "hover:border-amber-500/30",
      iconColor: "text-amber-400",
    },
  ];

  const journey = [
    { title: t("journey1Title"), description: t("journey1Description"), step: "01" },
    { title: t("journey2Title"), description: t("journey2Description"), step: "02" },
    { title: t("journey3Title"), description: t("journey3Description"), step: "03" },
    { title: t("journey4Title"), description: t("journey4Description"), step: "04" },
  ];

  const philosophy = [
    { title: t("philosophy1Title"), description: t("philosophy1Description") },
    { title: t("philosophy2Title"), description: t("philosophy2Description") },
    { title: t("philosophy3Title"), description: t("philosophy3Description") },
    { title: t("philosophy4Title"), description: t("philosophy4Description") },
  ];

  return (
    <PageWrapper>
      {/* ===== Intro Section ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-8"
          >
            <motion.h1 variants={fadeUp} custom={0} className="section-heading">
              About{" "}
              <span className="bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent">
                Me
              </span>
            </motion.h1>

            <motion.div variants={fadeUp} custom={1} className="flex items-start gap-4">
              <div className="hidden md:flex mt-2 shrink-0">
                <Sparkles className="w-5 h-5 text-brand" />
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg md:text-xl">
                {t("intro")}
              </p>
            </motion.div>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-muted-foreground leading-relaxed"
            >
              {t("introExtended")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ===== Stats Bar ===== */}
      <section className="py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="relative group text-center p-6 rounded-2xl bg-surface-low border border-brand/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== Expertise Cards ===== */}
      <section className="py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="section-heading mb-4">
              {t("expertiseTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("expertiseSubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {expertise.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className={`group relative rounded-2xl p-6 bg-surface-low border border-transparent ${item.borderHover} transition-all duration-500 card-hover overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-surface ${item.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-foreground transition-colors duration-300">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-brand/10">
                      <p className="text-xs text-muted-foreground font-medium">
                        {item.skills}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ===== Journey Timeline ===== */}
      <section className="py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="section-heading mb-4">
              {t("journeyTitle")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("journeySubtitle")}
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute start-6 md:start-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand/40 via-brand/20 to-transparent" />

            <div className="space-y-12">
              {journey.map((phase, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={phase.step}
                    variants={fadeUp}
                    custom={i + 1}
                    className={`relative flex items-start gap-6 md:gap-0 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute start-6 md:start-1/2 -translate-x-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-brand ring-4 ring-background z-10 mt-6" />

                    {/* Content */}
                    <div className={`ms-14 md:ms-0 md:w-1/2 ${isLeft ? "md:pe-12" : "md:ps-12"}`}>
                      <div className="group rounded-2xl p-6 bg-surface-low border border-transparent hover:border-brand/15 transition-all duration-300 card-hover space-y-3">
                        <span className="text-xs font-bold text-brand/50 tracking-widest">
                          {phase.step}
                        </span>
                        <h3 className="text-lg font-semibold group-hover:text-brand transition-colors duration-300">
                          {phase.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== Philosophy Grid ===== */}
      <section className="py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="section-heading mb-4">
              {t("philosophyTitle")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("philosophySubtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {philosophy.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i + 1}
                className="group rounded-2xl p-6 bg-surface-low border border-transparent hover:border-brand/15 transition-all duration-300 card-hover"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-bold text-brand/20 mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold group-hover:text-brand transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
