"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { handleSignUp } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { User, AtSign, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export function SignUpForm() {
  const t = useTranslations("Auth");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await handleSignUp(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Something went wrong");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">{t("signUpSuccess")}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{t("signUpSuccessDescription")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="signup-name" className="text-sm font-medium text-foreground">
          {t("name")}
        </label>
        <div className="relative">
          <User className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="signup-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Mohamed Hesham"
            className={cn("field rounded-xl px-4 py-3 ps-10")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-username" className="text-sm font-medium text-foreground">
          {t("username")}
        </label>
        <div className="relative">
          <AtSign className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="signup-username"
            name="username"
            type="text"
            required
            autoComplete="username"
            placeholder="mohamed_hesham"
            className={cn("field rounded-xl px-4 py-3 ps-10")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
          {t("email")}
        </label>
        <div className="relative">
          <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={cn("field rounded-xl px-4 py-3 ps-10")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
          {t("password")}
        </label>
        <div className="relative">
          <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className={cn("field rounded-xl px-4 py-3 pe-10 ps-10")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="focus-ring absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md text-muted-foreground transition-colors duration-200 hover:text-brand"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{t("passwordHint")}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-confirm" className="text-sm font-medium text-foreground">
          {t("confirmPassword")}
        </label>
        <div className="relative">
          <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="signup-confirm"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            className={cn("field rounded-xl px-4 py-3 ps-10")}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="focus-ring press sheen-hover flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl btn-accent px-4 py-3 text-sm font-medium disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("createAccount")}
      </button>
    </form>
  );
}
