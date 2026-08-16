"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { handleCredentialsSignIn } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export function CredentialsSignInForm() {
  const t = useTranslations("Auth");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      await handleCredentialsSignIn(formData);
    } catch {
      setError(t("invalidCredentials"));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="signin-email" className="text-sm font-medium text-foreground">
          {t("email")}
        </label>
        <div className="relative">
          <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="signin-email"
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
        <label htmlFor="signin-password" className="text-sm font-medium text-foreground">
          {t("password")}
        </label>
        <div className="relative">
          <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="signin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
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
      </div>

      <button
        type="submit"
        disabled={loading}
        className="focus-ring press sheen-hover flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl btn-accent px-4 py-3 text-sm font-medium disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("signIn")}
      </button>
    </form>
  );
}
