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
    } catch (err) {
      setError(t("invalidCredentials"));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
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
            className={cn(
              "w-full rounded-xl border bg-surface-low px-4 py-3 ps-10 text-sm text-foreground",
              "placeholder:text-muted-foreground/50",
              "border-brand/10 focus:border-brand/40 focus:ring-1 focus:ring-brand/20 focus:outline-none",
              "transition-colors"
            )}
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
            className={cn(
              "w-full rounded-xl border bg-surface-low px-4 py-3 ps-10 pe-10 text-sm text-foreground",
              "placeholder:text-muted-foreground/50",
              "border-brand/10 focus:border-brand/40 focus:ring-1 focus:ring-brand/20 focus:outline-none",
              "transition-colors"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl brand-gradient text-white text-sm font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 cursor-pointer"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("signIn")}
      </button>
    </form>
  );
}
