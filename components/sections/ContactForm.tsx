"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2 } from "lucide-react";
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

  const inputClasses =
    "w-full bg-surface-low border border-brand/10 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 text-foreground placeholder:text-muted-foreground/40 focus:border-brand/40 focus:ring-1 focus:ring-brand/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          className={inputClasses}
          placeholder={t("name")}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClasses}
          placeholder={t("email")}
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
          {t("subject")}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className={inputClasses}
          placeholder={t("subject")}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
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

      {status === "success" && (
        <p className="text-green-500 text-sm mt-2">{t("success")}</p>
      )}
      {status === "error" && (
        <p className="text-destructive text-sm mt-2">{t("error")}</p>
      )}
    </form>
  );
}
