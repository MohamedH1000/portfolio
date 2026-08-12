"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { MagicButton } from "@/components/ui/magic-button";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const reduce = useReducedMotion();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClasses = "field rounded-xl px-4 py-3";

  const whileFocus = reduce ? undefined : { scale: 1.01 };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
          {t("name")}
        </label>
        <motion.input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          whileFocus={whileFocus}
          transition={{ duration: 0.15 }}
          className={inputClasses}
          placeholder={t("name")}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
          {t("email")}
        </label>
        <motion.input
          id="email"
          name="email"
          type="email"
          required
          whileFocus={whileFocus}
          transition={{ duration: 0.15 }}
          className={inputClasses}
          placeholder={t("email")}
        />
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-medium text-foreground">
          {t("subject")}
        </label>
        <motion.input
          id="subject"
          name="subject"
          type="text"
          whileFocus={whileFocus}
          transition={{ duration: 0.15 }}
          className={inputClasses}
          placeholder={t("subject")}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
          {t("message")}
        </label>
        <motion.textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          whileFocus={whileFocus}
          transition={{ duration: 0.15 }}
          className={`${inputClasses} resize-none`}
          placeholder={t("message")}
        />
      </div>

      <MagicButton
        title={status === "sending" ? t("sending") : t("submit")}
        icon={status === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        position="right"
        type="submit"
        disabled={status === "sending"}
      />

      <AnimatePresence mode="wait">
        {status === "success" && (
          <motion.p
            key="success"
            role="status"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 flex items-center gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {t("success")}
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            key="error"
            role="alert"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 flex items-center gap-2.5 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {t("error")}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
